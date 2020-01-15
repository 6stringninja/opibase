import { OpiUartFunction } from "../server/Opi/OpiUartFunction";
import { ConcealedSubject } from "../rx/ConcealedSubject";
import { Observable ,Subscription} from "rxjs";
import SerialPort = require("serialport");
import ByteLength from '@serialport/parser-byte-length';
import { McuCommandResult } from "./McuCommandResult";

export enum OPI_STATUS_E {

    STATUS_START = 0,
    STATUS_COMMAND = 1,
    STATUS_LEN = 2,
    STATUS_DATA = 3,
    STATUS_ERROR = 4,
    STATUS_RESULT = 5
};

export enum OPI_COMMAND_RSLT_E {
    OPI_COMMAND_RSLT_FAIL,
    OPI_COMMAND_RSLT_SUCCESS,
    OPI_COMMAND_RSLT_ERROR
};
export enum OPI_RPC_E {
    OPI_PRC_PROCESSING,
    OPI_PRC_COMMAND_SUCCESS,
    OPI_RPC_COMMAND_FAIL = -1,
    OPI_RPC_INTERNAL_ERROR_EXPECTING_START_BYTE = 100,
    OPI_RPC_INTERNAL_ERROR_INVALID_COMMAND,
    OPI_RPC_INTERNAL_ERROR_INVALID_LENGTH,
    OPI_RPC_INTERNAL_ERROR_BUFFER_OVERRUN,
    OPI_RPC_INVALID_INTERNAL_STATUS

};
export enum OPI_COMMAND_E {
    OPI_COMMAND_DEVICE_ID,
    OPI_COMMAND_DEVICE_BNO_EULER,
    OPI_COMMAND_DEVICE_BNO_EULER_ENABLE_STREAM,
    OPI_COMMAND_MAX_SIZE
};
export class McuSerialParserError{
    constructor(
  public  error: OPI_RPC_E,
  public  data:number[]
    ){}
}
export class McuSerialParser {
    static BUFFER_SIZE = 256;
    static OPI_START_B = 0x44;
    sub: Subscription;
    data: Observable<number[]>;
    private errorCs = new ConcealedSubject<McuSerialParserError>();
    private parser: any;
    get error$(){
        return this.errorCs.observable;
    }
    private parseBufferCs = new ConcealedSubject<number[]>();

    constructor (private port?:SerialPort) {
        this.parseBufferCs.observable.subscribe(s=> this.parseData(s));
        if(port){
            this.parser = port.pipe(new ByteLength({ length: 8 }));
            console.log("port connected");
            this.parser.on('data', (data) => {
                this.parseBuffer(data)
                console.log(data);
            });
            this.testPort();
        }
     }
     testPort(){
         this.port.write("testing");
         setTimeout(()=>this.testPort(),2000);
     }
     private parseError(e:OPI_RPC_E){
         const r:number[]=[];
         for (let index = 0; index < this.buffIndex; index++) {
             r.push(this.buff.readUInt8(index));
             
         }
         this.errorCs.next(new McuSerialParserError(e,r));
     }
    private bufferToNumberArray(b:Buffer){
        const r:number[]=[];
        for (let index = 0; index < b.length; index++) {
            r.push(b.readUInt8(index));     
        }
        return r;
    }

    parseBuffer(b:Buffer){
        this.parseBufferCs.next(this.bufferToNumberArray(b));
    }

    private rawCommandsCs = new ConcealedSubject<McuCommandResult>();

    public get rawCommands$() {
        return this.rawCommandsCs.observable;
    }

    uartFunction = OpiUartFunction.MCU;
    private buff = Buffer.alloc(McuSerialParser.BUFFER_SIZE);
  
    private buffIndex = 0;
    private status = OPI_STATUS_E.STATUS_START;
    private opiCommand: number;
    private len: number;
    private errorResult: number;

    private resetBuffer() {
        this.buffIndex = 0;
        this.status = OPI_STATUS_E.STATUS_START;
        this.opiCommand = 0;
        this.len = 0;
        this.errorResult = 0;
    }
    private processCommand() {

        let b: undefined | Buffer = undefined;
        if ([OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS as number, OPI_RPC_E.OPI_RPC_COMMAND_FAIL as number].some(s => s === this.errorResult)) {
            if (this.len > 0) {
                b = Buffer.alloc(this.len);
                this.buff.copy(b,0,0,this.len);             
            }
            this.rawCommandsCs.next(new McuCommandResult(this.opiCommand, this.errorResult, this.len, b))
        }
        this.resetBuffer();
    }
    protected parseData(data: number[]) {

        data.forEach(c => {
            // console.log({c,s:this.status})
            if (this.buffIndex >= McuSerialParser.BUFFER_SIZE) {
                this.resetBuffer();
            }
            switch (this.status) {
                case OPI_STATUS_E.STATUS_START:
                    if (c == McuSerialParser.OPI_START_B) {
                        this.status = OPI_STATUS_E.STATUS_COMMAND;
                    }
                    else {
                        this.resetBuffer();
                        this.parseError(OPI_RPC_E.OPI_RPC_INTERNAL_ERROR_EXPECTING_START_BYTE);
                        // console.log("STATUS_START error")
                    }
                    break;
                case OPI_STATUS_E.STATUS_COMMAND:
                    this.opiCommand = c;
                    if (this.opiCommand >= OPI_COMMAND_E.OPI_COMMAND_MAX_SIZE) {
                        this.parseError(OPI_RPC_E.OPI_RPC_INTERNAL_ERROR_INVALID_COMMAND);
                        this.resetBuffer();
                    } else {
                        this.status = OPI_STATUS_E.STATUS_ERROR;
                      
                    }
                    break;
                case OPI_STATUS_E.STATUS_ERROR:
                    this.errorResult = c;
                    this.status = OPI_STATUS_E.STATUS_LEN;
                    break;
                case OPI_STATUS_E.STATUS_LEN:
                    this.len = c;
                    if (this.len === 0) {
                        this.processCommand();
                    } else if (this.len > McuSerialParser.BUFFER_SIZE) {
                        this.parseError(OPI_RPC_E.OPI_RPC_INTERNAL_ERROR_INVALID_LENGTH);
                        this.resetBuffer();
                    }
                    this.status = OPI_STATUS_E.STATUS_DATA;
                    break;
                case OPI_STATUS_E.STATUS_DATA:

                    if (this.buffIndex >= McuSerialParser.BUFFER_SIZE) {
                        this.parseError(OPI_RPC_E.OPI_RPC_INTERNAL_ERROR_BUFFER_OVERRUN);
                        this.resetBuffer();
                    }
                    this.buff.writeUInt8(c, this.buffIndex++);

                    if (this.buffIndex == this.len) {
                        this.processCommand();
                    }
                    break;
                default:
                    this.resetBuffer();
                    break;
            }
        });
    };
}

