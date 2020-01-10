
import { I2cBase, I2cDeviceType } from "./i2cBase";
export enum bmp280Address {
    A = 0x76,
    B = 0x77
}
export enum bmp280Register {
   
  
}
export class bmp280 extends I2cBase {
    testConnection(): boolean {
        throw new Error("Method not implemented.");
    }
  
    constructor(addr = bmp280Address.A) {
        super(addr, I2cDeviceType.BMP280);
    }
}