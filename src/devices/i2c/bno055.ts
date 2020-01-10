
import { I2cBase, I2cDeviceType } from "./i2cBase";
export enum bno055Address {
    A = 0x28,
    B = 0x29
}
export enum bno055Register {
   
  
}
export class bno055 extends I2cBase {
    testConnection(): boolean {
        throw new Error("Method not implemented.");
    }
  
    constructor(addr = bno055Address.A) {
        super(addr, I2cDeviceType.BNO055);
    }
}