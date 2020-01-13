import { OpiSerial } from "../server/Opi/OpiSerial";
import { OpiUartFunction } from "../server/Opi/OpiUartFunction";
import { HistoricalScheduler } from "rx";
import { ConcealedSubject } from "../rx/ConcealedSubject";
import { OpiSerialPorts } from "../server/Opi/OpiSerialPorts";
import { ConcealedBehaviorSubject } from "../rx/ConcealedBehaviorSubject";


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
    OPI_COMMAND_MAX_SIZE
};
export class McuCommandResult {
    constructor(public command: OPI_COMMAND_E, public errorResult: OPI_RPC_E, public length: number, public buff?: Buffer) {

    }
}

export class McuSerialParser extends SerialParserBase<number[]>{
    static BUFFER_SIZE = 256;
    static OPI_START_B = 0x44;
    constructor(protected opiSerialPorts: OpiSerialPorts) {
        super(opiSerialPorts.ports.find(f => f.uartType === this.uartFunction))
        
    }
    private rawCommandsCs = new ConcealedSubject<McuCommandResult>();

    public get rawCommands$() {
        return this.rawCommandsCs.observable;
    }

    uartFunction = OpiUartFunction.MCU;
    private buff = Buffer.alloc(McuSerialParser.BUFFER_SIZE);
    private buffOut = Buffer.alloc(McuSerialParser.BUFFER_SIZE);
    private buffIndex = 0;
    private status: OPI_STATUS_E;
    private opiCommand: number;
    private len: number;
    private errorResult: number;
    private buffOutIndex = 3;
    public resetOutBuffer(){
        this.buffOut.writeUInt32BE(McuSerialParser.OPI_START_B,0);
        this.buffOut.writeUInt8(0,McuSerialParser.OPI_START_B);
        this.buffIndex = 3;
        
    }
    public sendCommand(command:OPI_COMMAND_E){
        this.buffOut.writeUInt8( command,1);
        this.buffOut.writeUInt8( this.buffOutIndex-3,2);
        if(    this.opiSerial.port &&     this.opiSerial.port.isOpen){
            this.opiSerial.port.write(this.buffOut.slice(0,this.buffOutIndex),(e,bw)=>{
                if(!e){
                    console.log({McuBytesWritten:bw})
                }
                else{
                    console.log({McuSendCommandError:e})
                }
            });
        }
        
    }
 
    public writeOutUint8( data:number){
        this.buff.writeUInt8(data,this.buffOutIndex );
        this.buffOutIndex+=1;
    }
    public writeOutInt8( data:number){
        this.buff.writeInt8(data,this.buffOutIndex );
        this.buffOutIndex+=1;
    }
    public writeOutUint16( data:number){
        this.buff.writeUInt16LE(data,this.buffOutIndex );
        this.buffOutIndex+=2;
    }
    public writeOutInt16( data:number){
        this.buff.writeInt16LE(data,this.buffOutIndex );
        this.buffOutIndex+=2;
    }
    public writeOutUint32( data:number){
        this.buff.writeUInt32LE(data,this.buffOutIndex );
        this.buffOutIndex+=4;
    }
    public writeOutInt32( data:number){
        this.buff.writeInt32LE(data,this.buffOutIndex );
        this.buffOutIndex+=4;
    }
    public writeOutUint64( data:bigint){
        this.buff.writeBigUInt64LE(data,this.buffOutIndex );
        this.buffOutIndex+=8;
    }
    public writeOutInt64( data:bigint){
        this.buff.writeBigInt64LE(data,this.buffOutIndex );
        this.buffOutIndex+=8;
    }
    public writeOutBool( data:boolean){
        this.buff.writeUInt8(data ? 1 : 0,this.buffOutIndex );
        this.buffOutIndex+=1;
    }

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
export class McuCommandProcessor {
    private mcuSerialParser: McuSerialParser;

    private DeviceIdCs = new ConcealedBehaviorSubject<number>(0);
    get DeviceId$() {
        return this.DeviceIdCs.observable;
    }
    private CommandErrorCs = new ConcealedSubject<McuCommandResult>();
    get CommandError$() {
        return this.CommandErrorCs.observable;
    }
    private proccessCommandError(c: McuCommandResult) {
        console.log({ commandErr: c });
    }
    private proccessCommand(c: McuCommandResult) {
        if (c.errorResult !== OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS) {
            this.proccessCommandError(c);
        }
        switch (c.command) {
            case OPI_COMMAND_E.OPI_COMMAND_DEVICE_ID:
                this.DeviceIdCs.next(c.buff.readUInt8(0));

                break;

            default:
                break;
        }
    }
    requestDeviceId():void{
        this.mcuSerialParser.resetOutBuffer();
        this.mcuSerialParser.sendCommand(OPI_COMMAND_E.OPI_COMMAND_DEVICE_ID);
    }
    constructor(private opiSerialPorts: OpiSerialPorts) {
        if (this.opiSerialPorts.optPlatform.hasMcu) {
            this.mcuSerialParser = new McuSerialParser(opiSerialPorts)
            this.mcuSerialParser.rawCommands$.subscribe(this.proccessCommand);
            
        }
    }
}