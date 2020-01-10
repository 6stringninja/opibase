import { I2cBase, I2cDeviceType } from "./i2cBase";
export enum mpu6050Address {
    A = 0x68,
    B = 0x69
}
export enum mpu6050Register {
    MPU6050_RA_WHO_AM_I = 0x75,
    MPU6050_RA_PWR_MGMT_1 = 0x6B,
    MPU6050_RA_CONFIG = 0x1A,
    MPU6050_RA_GYRO_CONFIG = 0x1B,
    MPU6050_RA_ACCEL_CONFIG = 0x1C,
    MPU6050_RA_INT_PIN_CFG = 0x37,
    MPU6050_RA_USER_CTRL   =     0x6A,
    MPU6050_RA_ACCEL_XOUT_H  =   0x3B,
    MPU6050_RA_GYRO_XOUT_H   =   0x43
  
}
export enum mpu6050GyroRange {
    G250,
    G500,
    G1000,
    G2000
}
export const mpu6050GyroRangeScale = [131.0,65.5,32.8,16.4];
export enum mpu6050AccRange {
    A2G,
    A4G,
    A86,
    A16G
}
export const mpu6050AccRangeScale = [8192.0 , 4096.0,2048.0,1024.0];
export enum mpu6050ClockSource {
    InternalOsc,
    PLLwithXGyroReference,
    PLLwithYGyroReference,
    PLLwithZGyroReference,
    PLLwithExternal32_768kHzReference,
    PLLwithExternal19_2mHzReference,
    Reserved,
    stopstheclock
}
export enum mpu6050DigitalLowPassFilter{
    A260hz_G256hz,
 A184hz_G188hz,
 A94hz_G98Hz,
 A44hz_G42hz,
 A21hz_G20hz,
 A10hz_G10hz,
 A5hz_G5hz
}
const  MPU6050_CFG_DLPF_CFG_BIT   = 2;
const  MPU6050_CFG_DLPF_CFG_LENGTH = 3;

const mpu6050deviceId = 0x68;
const MPU6050_PWR1_SLEEP_BIT      =    6
const MPU6050_PWR1_CLKSEL_BIT     =    2;
const MPU6050_PWR1_CLKSEL_LENGTH   =   3;
const MPU6050_INTCFG_I2C_BYPASS_EN_BIT  =  1;
const  MPU6050_USERCTRL_I2C_MST_EN_BIT      =   5;

export class mpu6050 extends I2cBase {
    testConnection(): boolean {
        return this.getDeviceId() === mpu6050deviceId;
    }
    constructor(addr = mpu6050Address.A) {
        super(addr, I2cDeviceType.MPU6050);
    }
    reset() {
        this.open();
        this.writeByte(mpu6050Register.MPU6050_RA_PWR_MGMT_1, 0x80); // RESET
        this.delay(50);
     //   this.writeByte(mpu6050Register.MPU6050_RA_PWR_MGMT_1, 0x03);             //PWR_MGMT_1    -- SLEEP 0; CYCLE 0; TEMP_DIS 0; CLKSEL 3 (PLL with Z Gyro reference)
      //  this.writeByte(mpu6050Register.MPU6050_RA_CONFIG, 0);    //CONFIG        -- EXT_SYNC_SET 0 (disable input pin for data sync) ; default DLPF_CFG = 0 => ACC bandwidth = 260Hz  GYRO bandwidth = 256Hz)

        this.close();

    }

    getDeviceId() {
        this.open();
        const r = this.readByte(mpu6050Register.MPU6050_RA_WHO_AM_I);
        this.close();
        return r;
    }

    // i2CMasterModeEnabled
    private _i2CMasterModeEnabled = false;
    public get i2CMasterModeEnabled() {
        this.open();
        this._i2CMasterModeEnabled = this.readBit(mpu6050Register.MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_I2C_MST_EN_BIT );
        this.close();
        return this._i2CMasterModeEnabled;
    }
    public set i2CMasterModeEnabled(value) {
        this.open();
        this.writeBit(mpu6050Register.MPU6050_RA_USER_CTRL, MPU6050_USERCTRL_I2C_MST_EN_BIT, value);
        this.close();
        this._i2CMasterModeEnabled = value;
    }

    //i2CBypassEnabled
    private _i2CBypassEnabled = false;
    public get i2CBypassEnabled() {
        this.open();
        this._i2CBypassEnabled = this.readBit(mpu6050Register.MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_I2C_BYPASS_EN_BIT );
        this.close();
        return this._i2CBypassEnabled;
    }
    public set i2CBypassEnabled(value) {
        this.open();
        this.writeBit(mpu6050Register.MPU6050_RA_INT_PIN_CFG, MPU6050_INTCFG_I2C_BYPASS_EN_BIT, value);
        this.close();
        this._i2CBypassEnabled = value;
    }

    //sleepEnabled
    private _sleepEnabled = false;
    public get sleepEnabled() {
        this.open();
        this._sleepEnabled = this.readBit(mpu6050Register.MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_SLEEP_BIT );
        this.close();
        return this._sleepEnabled;
    }
    public set sleepEnabled(value) {
        this.open();
        this.writeBit(mpu6050Register.MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_SLEEP_BIT, value);
        this.close();
        this._sleepEnabled = value;
    }

    //clockSource
    private _clockSource = mpu6050ClockSource.InternalOsc;
    public get clockSource() {
        this.open();
        this._clockSource = this.readBits(mpu6050Register.MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CLKSEL_BIT, MPU6050_PWR1_CLKSEL_LENGTH);
        this.close();
        return this._clockSource;
    }
    public set clockSource(value) {
        this.open();
        this.writeBits(mpu6050Register.MPU6050_RA_PWR_MGMT_1, MPU6050_PWR1_CLKSEL_BIT, MPU6050_PWR1_CLKSEL_LENGTH, value);
        this.close();
        this._clockSource = value;
    }

    //gyroRange
    private _mpu6050GyroRange = mpu6050GyroRange.G250;
    public get gyroRange(): mpu6050GyroRange {
        this.open();
        this._mpu6050GyroRange = this.readBits(mpu6050Register.MPU6050_RA_GYRO_CONFIG, 3, 2);
        this.close();
        return this._mpu6050GyroRange;
    }
    public set gyroRange(value: mpu6050GyroRange) {
        this.open();
        const r = this.writeBits(mpu6050Register.MPU6050_RA_GYRO_CONFIG, 3, 2, value);
        this._mpu6050GyroRange = value;
        this.close();
    }

    //accRange
    private _mpu6050AccRange = mpu6050AccRange.A2G;
    public get accRange(): mpu6050AccRange {
        this.open();
        this._mpu6050AccRange = this.readBits(mpu6050Register.MPU6050_RA_ACCEL_CONFIG, 3, 2);
        this.close();
        return this._mpu6050AccRange;
    }
    public set accRange(value: mpu6050AccRange) {
        this.open();
        this.writeBits(mpu6050Register.MPU6050_RA_ACCEL_CONFIG, 3, 2, value);
        this._mpu6050AccRange = value;
        this.close();
    }
    /** Get digital low-pass filter configuration.
 * The DLPF_CFG parameter sets the digital low pass filter configuration. It
 * also determines the internal sampling rate used by the device as shown in
 * the table below.
 *
 * Note: The accelerometer output rate is 1kHz. This means that for a Sample
 * Rate greater than 1kHz, the same accelerometer sample may be output to the
 * FIFO, DMP, and sensor registers more than once.
 *

 *          |   ACCELEROMETER    |           GYROSCOPE
 * DLPF_CFG | Bandwidth | Delay  | Bandwidth | Delay  | Sample Rate
 * ---------+-----------+--------+-----------+--------+-------------
 * 0        | 260Hz     | 0ms    | 256Hz     | 0.98ms | 8kHz
 * 1        | 184Hz     | 2.0ms  | 188Hz     | 1.9ms  | 1kHz
 * 2        | 94Hz      | 3.0ms  | 98Hz      | 2.8ms  | 1kHz
 * 3        | 44Hz      | 4.9ms  | 42Hz      | 4.8ms  | 1kHz
 * 4        | 21Hz      | 8.5ms  | 20Hz      | 8.3ms  | 1kHz
 * 5        | 10Hz      | 13.8ms | 10Hz      | 13.4ms | 1kHz
 * 6        | 5Hz       | 19.0ms | 5Hz       | 18.6ms | 1kHz
 * 7        |   -- Reserved --   |   -- Reserved --   | Reserved

 */
    private _DLPFMode = mpu6050DigitalLowPassFilter.A260hz_G256hz;
    public get DLPFMode() {
        this.open();
        this._DLPFMode = this.readBits(mpu6050Register.MPU6050_RA_CONFIG ,MPU6050_CFG_DLPF_CFG_BIT, MPU6050_CFG_DLPF_CFG_LENGTH);
        this.close();
        return this._DLPFMode;
    }
    public set DLPFMode(value) {
     
        this.open();
        this.writeBits(mpu6050Register.MPU6050_RA_CONFIG, MPU6050_CFG_DLPF_CFG_BIT, MPU6050_CFG_DLPF_CFG_LENGTH, value);
        this._DLPFMode = value;
        this.close();
    }

    private Buff6_RawToInt16_3(b:Buffer){
        return[b.readInt16BE(0), b.readInt16BE(2),b.readInt16BE(4)  ];
    }
    public getAcceleration(){
        this.open();
       const res =  this.Buff6_RawToInt16_3( this.readBytes(mpu6050Register.MPU6050_RA_ACCEL_XOUT_H,6));
        this.close();
        return res;
    }
    public getAccelerationScaled(){
        
 
      return  this.getAcceleration().map(m=> m !=0 ? m / mpu6050AccRangeScale[this._mpu6050AccRange]:0);

  
    }
    public getRotation(){
        this.open();
       const res =  this.Buff6_RawToInt16_3( this.readBytes(mpu6050Register.MPU6050_RA_GYRO_XOUT_H,6));
        this.close();
        return res;
    }
    public getRotationScaled(){
      return  this.getRotation().map(m=> m !=0 ? m / mpu6050GyroRangeScale[this._mpu6050GyroRange]:0);
    }
    
}
