
import { I2cBase, I2cDeviceType } from "./i2cBase";
export enum mpl3115a2Address {
    A = 0x60
}
export enum mpl3115a2Register {
   
  
}
export class mpl3115a2 extends I2cBase {
    testConnection(): boolean {
        throw new Error("Method not implemented.");
    }
  
    constructor(addr = mpl3115a2Address.A) {
        super(addr, I2cDeviceType.MPL3115A2);
    }
}