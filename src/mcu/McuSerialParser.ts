import { OpiSerial } from "../server/Opi/OpiSerial";
import { OpiUartFunction } from "../server/Opi/OpiUartFunction";

import { ConcealedSubject } from "../rx/ConcealedSubject";
import { OpiSerialPorts } from "../server/Opi/OpiSerialPorts";
import { Observable ,Subscription} from "rxjs";
import SerialPort = require("serialport");


export abstract class SerialParserBase<T>{
    abstract uartFunction: OpiUartFunction;
    protected abstract parseData(data: T);
    constructor(protected opiSerial: OpiSerial<T>) {
        this.opiSerial.data.subscribe((data) => {
            this.parseData(data);
        })
    }
}
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
export class McuCommandResult {
    constructor(public command: OPI_COMMAND_E, public errorResult: OPI_RPC_E, public length: number, public buff?: Buffer) {

    }
}
export class McuBnoEulerAxis{
    constructor(public data:number[]=[0,0,0],public timeStamp=0){

    }

    get X(){
        return this.data[0];
    }
    get Y(){
        return this.data[1];
    }
    get Z(){
        return this.data[2];
    }
}
export class McuSerialSendCommand{

}
export class McuSerialParser {
    static BUFFER_SIZE = 256;
    static OPI_START_B = 0x44;
    sub: Subscription;
    
    constructor(protected data: Observable<number[]>,private port?:SerialPort) {
    
       this.sub = data.subscribe(s=> this.parseData(s));
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
                b = new Buffer(this.buff.buffer.slice(0, this.len));
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
                        // console.log("STATUS_START error")
                    }
                    break;
                case OPI_STATUS_E.STATUS_COMMAND:
                    this.opiCommand = c;
                    if (this.opiCommand >= OPI_COMMAND_E.OPI_COMMAND_MAX_SIZE) {
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

                        //   return opi_run_command() ? OPI_PRC_COMMAND_SUCCESS : OPI_RPC_COMMAND_FAIL;
                    } else if (this.len > McuSerialParser.BUFFER_SIZE) {
                        this.resetBuffer();
                    }
                    this.status = OPI_STATUS_E.STATUS_DATA;
                    break;
                case OPI_STATUS_E.STATUS_DATA:

                    if (this.buffIndex >= McuSerialParser.BUFFER_SIZE) {
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

