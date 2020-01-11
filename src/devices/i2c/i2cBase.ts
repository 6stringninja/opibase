import { I2cBus, openSync } from "i2c-bus";
import { bit_set, bit_clear } from "../../common/bitwise";


export const defaultBufferSize = 32;
export enum I2cBusNumber {
    I2C0 = 0,
    I2C1 = 1,
    I2C2 = 2
}
export const defaultI2cBus = I2cBusNumber.I2C1;

export enum I2cDeviceType {
    unknown = 0,
    MPU6050 = 1,
    BNO055 = 2,
    BMP280 = 3,
    MPL3115A2=4
}
export enum I2cDeviceStatus {
    notIntialized,
    Intialized,
    Error
}
export const defaultI2cDeviceType = I2cDeviceType.unknown;
export interface II2cBase {
    address: number;
    busNummber: I2cBusNumber;
    device: I2cDeviceType;
    status: I2cDeviceStatus;
    open(): void;
    close(): void;
    init(): boolean;
    testConnection(): boolean;
    readBytes(command: number,  len: number): Buffer;
    readByte(command: number): number;
    writeBytes(command: number,   len: number, bf: Buffer): number;
    writeByte(command: number, byte: number): void;
    isValidAddress(refresh: boolean): boolean;
}
export abstract class I2cBase implements II2cBase {
 
    abstract testConnection(): boolean;
    status = I2cDeviceStatus.notIntialized;
    init(): boolean {
        return this.testConnection();
    }
    private busAddresses: number[] = [];
    private busScanRanOnce = false;
    isValidAddress(refresh: boolean = false): boolean {
        if (refresh || !this.busScanRanOnce) {
            this.open();
            this.busAddresses = this.bus.scanSync();
            this.close();
            this.busScanRanOnce = true;
        }
        return this.busAddresses.some(s => s == this.address);

    }

    bus: I2cBus;
    busOpened: boolean;
    buff = Buffer.alloc(defaultBufferSize);
    open(): void {

        this.bus = openSync(this.busNummber);
        this.busOpened = true;
    }
    close(): void {
        if (this.bus && this.busOpened) {
            this.bus.closeSync();
            this.busOpened = false;
        }
    }
    private throwErrorOnBusClosed() {
        if (!this.busOpened) throw "Bus Not Opened";
    }
    readByte(command: number): number {
        this.throwErrorOnBusClosed();
        return this.bus.readByteSync(this.address, command);
    }
    writeByte(command: number, byte: number) {
        this.throwErrorOnBusClosed();
        return this.bus.writeByteSync(this.address, command, byte);
    }
    readBytes(command: number,   len: number): Buffer {
        this.throwErrorOnBusClosed();
        console.log({d:"sdfsdfsdf", address: this.address,command,len})
        this.bus.readI2cBlockSync(this.address, command, len, this.buff);
        return this.buff.slice(0, len);
    }
    writeBytes(command: number,   len: number, bf: Buffer): number {
        this.throwErrorOnBusClosed();
        return this.bus.writeI2cBlockSync(this.address, command, len, bf);

    }

    readBit(regAddr: number, bitNum: number): boolean {
        return !!(this.readByte(regAddr) & (1 << bitNum));
    }
    writeBit(regAddr: number, bitNum: number, data: boolean) {
        let b = this.readByte(regAddr);
      //  b = data ? bit_set(b,bitNum) : bit_clear(b,bitNum);

        b = ((data ? 1 : 0) != 0) ? (b | (1 << bitNum)) : (b & ~(1 << bitNum));
        this.writeByte(regAddr, b);
    }

    readBits(regAddr: number, bitStart: number, length: number): number {
        this.throwErrorOnBusClosed();
        let v = this.readByte(regAddr);
        if (v !== 0) {
            return (v & ((1 << length) - 1) << (bitStart - length + 1)) >> (bitStart - length + 1);
        }

        return 0;
    }


    writeBits(regAddr: number, bitStart: number, length: number, data: number) {
        this.throwErrorOnBusClosed();
        let b = this.readByte(regAddr);
        let mask = ((1 << length) - 1) << (bitStart - length + 1);
        data <<= (bitStart - length + 1); // shift data into correct position
        data &= mask; // zero all non-important bits in data
        b &= ~(mask); // zero all important bits in existing byte
        b |= data; // combine data with existing byte
        this.writeByte(regAddr, b);
    }
    delay(ms: number) {
        let start = Date.now();
        let now = start;
        while (now - start < ms) {
            now = Date.now();
        }
    }
    constructor(public address: number, public device: I2cDeviceType, public busNummber: I2cBusNumber = defaultI2cBus) {
        if (!this.isValidAddress(true)) throw `invalid address ${this.address}`;

    }
}

