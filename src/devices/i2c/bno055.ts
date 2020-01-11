
import { I2cBase, I2cDeviceType } from "./i2cBase";
import { bno055Address, BNO055Regs, BNO055Opmode, BNO055PowerMode, BNO055Vector } from "./bno055_types";

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
    private _mode:BNO055Opmode;
    setMode( mode:BNO055Opmode)
{
	this._mode = BNO055Opmode.OPERATION_MODE_NDOF;
	this.writeByte(BNO055Regs.BNO055_OPR_MODE_ADDR, this._mode);
	this.delay(30);
}
    begin(mode = BNO055Opmode.OPERATION_MODE_NDOF) {
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
        this.setMode(BNO055Opmode.OPERATION_MODE_CONFIG)

        	/* Reset */
    this.writeByte(BNO055Regs.BNO055_SYS_TRIGGER_ADDR, 0x20);
    
	while (this.readByte(BNO055Regs.BNO055_CHIP_ID_ADDR) != BNO055_ID)
	{
		this.delay(10);
	}
	this.delay(50);

	/* Set to normal power mode */
	this.writeByte(BNO055Regs.BNO055_PWR_MODE_ADDR, BNO055PowerMode.POWER_MODE_NORMAL);
	this.delay(10);

    this.writeByte(BNO055Regs.BNO055_PAGE_ID_ADDR, 0);
    

	this.writeByte(BNO055Regs.BNO055_SYS_TRIGGER_ADDR, 0x0);
	this.delay(10);
	/* Set the requested operating mode (see section 3.3) */
	this.setMode(mode);
    this.delay(20);
    
        this.close();
        return true;
    }
    getVector( vector_type:BNO055Vector = BNO055Vector.VECTOR_EULER)
{
	//imumath::Vector<3> xyz;
	//uint8_t buffer[6];
	//memset(buffer, 0, 6);

	let  x:number, y:number, z:number;
    x = y = z = 0;
    this.open();
    const array:number[]=[];
    for (let index = 0; index < 6; index++) {
         array[index] = this.readByte(vector_type+index);
        
    }
    this.close();
    return array;
   const buff =  this.readBytes(vector_type,6)
	/* Read vector data (6 bytes) */
//	readLen((Imu_BNO055_reg_t)vector_type, buffer, 6);
    x = buff.readInt16BE(0);
    y = buff.readInt16BE(2);
    z = buff.readInt16BE(4);
	//x = ((int16_t)buffer[0]) | (((int16_t)buffer[1]) << 8);
//	y = ((int16_t)buffer[2]) | (((int16_t)buffer[3]) << 8);
//	z = ((int16_t)buffer[4]) | (((int16_t)buffer[5]) << 8);

	/*!
	 * Convert the value to an appropriate range (section 3.6.4)
	 * and assign the value to the Vector type
	 */
   let xyz = [0,0,0];
	switch (vector_type)
	{
	case BNO055Vector.VECTOR_MAGNETOMETER:
		/* 1uT = 16 LSB */
		xyz[0] = (x) / 16.0;
		xyz[1] = (y) / 16.0;
		xyz[2] = (z) / 16.0;
		break;
	case BNO055Vector.VECTOR_GYROSCOPE:
		/* 1dps = 16 LSB */
		xyz[0] = (x) / 16.0;
		xyz[1] = (y) / 16.0;
		xyz[2] = (z) / 16.0;
		break;
	case BNO055Vector.VECTOR_EULER:
		/* 1 degree = 16 LSB */
		xyz[0] = (x) / 16.0;
		xyz[1] = (y) / 16.0;
		xyz[2] = (z) / 16.0;
		break;
	case BNO055Vector.VECTOR_ACCELEROMETER:
		/* 1m/s^2 = 100 LSB */
		xyz[0] = (x) / 100.0;
		xyz[1] = (y) / 100.0;
		xyz[2] = (z) / 100.0;
		break;
	case BNO055Vector.VECTOR_LINEARACCEL:
		/* 1m/s^2 = 100 LSB */
		xyz[0] = (x) / 100.0;
		xyz[1] = (y) / 100.0;
		xyz[2] = (z) / 100.0;
		break;
	case BNO055Vector.VECTOR_GRAVITY:
		/* 1m/s^2 = 100 LSB */
		xyz[0] = (x) / 100.0;
		xyz[1] = (y) / 100.0;
		xyz[2] = (z) / 100.0;
		break;
	}
    this.close();
	return xyz;
}
    constructor(addr = bno055Address.B) {
        super(addr, I2cDeviceType.BNO055);
    }
}
