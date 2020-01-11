
import { I2cBase, I2cDeviceType } from "./i2cBase";
import { bno055Address, BNO055Regs } from "./bno055_types";

/** BNO055 ID **/
export const BNO055_ID = (0xA0)

/** Offsets registers **/
const NUM_BNO055_OFFSET_REGISTERS = (22)
export class bno055 extends I2cBase {
    testConnection(): boolean {

        return this.getDeviceId() === BNO055_ID;

    }
    getDeviceId() {
        this.open();
        const bnoId = this.readByte(BNO055Regs.BNO055_CHIP_ID_ADDR);
        this.close();
        return bnoId;
    }
    begin() {
        this.open();
        let id = this.readByte(BNO055Regs.BNO055_CHIP_ID_ADDR);
        if (id != BNO055_ID) {
            this.delay(1000); // hold on for boot
            id = this.readByte(BNO055Regs.BNO055_CHIP_ID_ADDR);
            if (id != BNO055_ID) {
                this.close();
                return false; // still not? ok bail
            }
        }
        this.close();
        return true;
    }
    constructor(addr = bno055Address.A) {
        super(addr, I2cDeviceType.BNO055);
    }
}
