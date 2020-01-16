import { ConcealedSubject } from "../rx/ConcealedSubject";
import { Subscription } from "rxjs";
import { McuSerialParser, OPI_COMMAND_E } from "./McuSerialParser";
import { McuCommandStreamSettings } from "./McuCommandResult";
export class McuSerialRequestProcessor {
    private buffOut = Buffer.alloc(McuSerialParser.BUFFER_SIZE);
    private buffOutIndex = 3;
    private mcuSerialParser: McuSerialParser;
    sub: Subscription;
    private sendCommandCs = new ConcealedSubject<Buffer>();
    get sendCommand$() {
        return this.sendCommandCs.observable;
    }
    requestDeviceId(): void {
        this.resetOutBuffer();
        this.sendCommand(OPI_COMMAND_E.OPI_COMMAND_DEVICE_ID);
    }
    requestBnoEulerAxis(): void {
        this.resetOutBuffer();
        this.sendCommand(OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER);
    }
    requestStreamSettings(settings = new McuCommandStreamSettings()): void {
        this.resetOutBuffer();
        this.writeOutUint8(settings.data);
        this.sendCommand(OPI_COMMAND_E.OPI_COMMAND_STREAM_SETTINGS);
        console.log({settings})
    }
    public resetOutBuffer() {
        this.buffOut.writeUInt8(McuSerialParser.OPI_START_B, 0);
        this.buffOut.writeUInt8(0, 1);
        this.buffOut.writeUInt8(0, 2);
        this.buffOutIndex = 3;
    }
    public sendCommand(command: OPI_COMMAND_E) {
        //const prom = new Promise<number>((r,e)=>{
        this.buffOut.writeUInt8(command, 1); 
        this.buffOut.writeUInt8(this.buffOutIndex-3, 2);
        /*for (let index = 3; index < this.buffOutIndex; index++) {
         this.buffOut.writeUInt8(data[0],this.buffOutIndex )
            
        }*/
        const copyBuffer = Buffer.alloc(this.buffOutIndex);
        this.buffOut.copy(copyBuffer, 0, 0, this.buffOutIndex);
        // // console.log({cpy: copyBuffer})
        this.sendCommandCs.next(copyBuffer);
 
    }
    public writeOutUint8(data: number) {
        this.buffOut.writeUInt8(data, this.buffOutIndex);
        this.buffOutIndex += 1;
    }
    public writeOutInt8(data: number) {
        this.buffOut.writeInt8(data, this.buffOutIndex);
        this.buffOutIndex += 1;
    }
    public writeOutUint16(data: number) {
        this.buffOut.writeUInt16LE(data, this.buffOutIndex);
        this.buffOutIndex += 2;
    }
    public writeOutInt16(data: number) {
        this.buffOut.writeInt16LE(data, this.buffOutIndex);
        this.buffOutIndex += 2;
    }
    public writeOutUint32(data: number) {
        this.buffOut.writeUInt32LE(data, this.buffOutIndex);
        this.buffOutIndex += 4;
    }
    public writeOutInt32(data: number) {
        this.buffOut.writeInt32LE(data, this.buffOutIndex);
        this.buffOutIndex += 4;
    }
    public writeOutUint64(data: bigint) {
        this.buffOut.writeBigUInt64LE(data, this.buffOutIndex);
        this.buffOutIndex += 8;
    }
    public writeOutInt64(data: bigint) {
        this.buffOut.writeBigInt64LE(data, this.buffOutIndex);
        this.buffOutIndex += 8;
    }
    public writeOutBool(data: boolean) {
        this.buffOut.writeUInt8(data ? 1 : 0, this.buffOutIndex);
        this.buffOutIndex += 1;
    }
}
