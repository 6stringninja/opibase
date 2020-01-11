
import { I2cBase, I2cDeviceType } from "./i2cBase";
export enum bmp280Address {
    A = 0x76,
    B = 0x77
}
 
const BMP280_CHIPID  =(0x58) /**< Default chip ID. */

/*!
 * Registers available on the sensor.
 */
export enum bmp280Register {
  BMP280_REGISTER_DIG_T1 = 0x88,
  BMP280_REGISTER_DIG_T2 = 0x8A,
  BMP280_REGISTER_DIG_T3 = 0x8C,
  BMP280_REGISTER_DIG_P1 = 0x8E,
  BMP280_REGISTER_DIG_P2 = 0x90,
  BMP280_REGISTER_DIG_P3 = 0x92,
  BMP280_REGISTER_DIG_P4 = 0x94,
  BMP280_REGISTER_DIG_P5 = 0x96,
  BMP280_REGISTER_DIG_P6 = 0x98,
  BMP280_REGISTER_DIG_P7 = 0x9A,
  BMP280_REGISTER_DIG_P8 = 0x9C,
  BMP280_REGISTER_DIG_P9 = 0x9E,
  BMP280_REGISTER_CHIPID = 0xD0,
  BMP280_REGISTER_VERSION = 0xD1,
  BMP280_REGISTER_SOFTRESET = 0xE0,
  BMP280_REGISTER_CAL26 = 0xE1, /**< R calibration = 0xE1-0xF0 */
  BMP280_REGISTER_CONTROL = 0xF4,
  BMP280_REGISTER_CONFIG = 0xF5,
  BMP280_REGISTER_PRESSUREDATA = 0xF7,
  BMP280_REGISTER_TEMPDATA = 0xFA,
};

/*!
 *  Struct to hold calibration data.
 */
export class bm280CalibData {
  dig_T1:number /**< dig_T1 cal register. */
   dig_T2:number /**<  dig_T2 cal register. */
   dig_T3:number /**< dig_T3 cal register. */

  dig_P1:number /**< dig_P1 cal register. */
   dig_P2:number /**< dig_P2 cal register. */
   dig_P3:number /**< dig_P3 cal register. */
   dig_P4:number /**< dig_P4 cal register. */
   dig_P5:number /**< dig_P5 cal register. */
   dig_P6:number /**< dig_P6 cal register. */
   dig_P7:number /**< dig_P7 cal register. */
   dig_P8:number /**< dig_P8 cal register. */
   dig_P9:number /**< dig_P9 cal register. */

   dig_H1:number /**< dig_H1 cal register. */
   dig_H2:number /**< dig_H2 cal register. */
   dig_H3:number /**< dig_H3 cal register. */
   dig_H4:number /**< dig_H4 cal register. */
   dig_H5:number /**< dig_H5 cal register. */
   dig_H6:number /**< dig_H6 cal register. */
} 

/**
 * Driver for the Adafruit BMP280 barometric pressure sensor.
 */
  /** Oversampling rate for the sensor. */
  enum sensor_sampling {
    /** No over-sampling. */
    SAMPLING_NONE = 0x00,
    /** 1x over-sampling. */
    SAMPLING_X1 = 0x01,
    /** 2x over-sampling. */
    SAMPLING_X2 = 0x02,
    /** 4x over-sampling. */
    SAMPLING_X4 = 0x03,
    /** 8x over-sampling. */
    SAMPLING_X8 = 0x04,
    /** 16x over-sampling. */
    SAMPLING_X16 = 0x05
  };

  /** Operating mode for the sensor. */
  enum sensor_mode {
    /** Sleep mode. */
    MODE_SLEEP = 0x00,
    /** Forced mode. */
    MODE_FORCED = 0x01,
    /** Normal mode. */
    MODE_NORMAL = 0x03,
    /** Software reset. */
    MODE_SOFT_RESET_CODE = 0xB6
  };

  /** Filtering level for sensor data. */
  enum sensor_filter {
    /** No filtering. */
    FILTER_OFF = 0x00,
    /** 2x filtering. */
    FILTER_X2 = 0x01,
    /** 4x filtering. */
    FILTER_X4 = 0x02,
    /** 8x filtering. */
    FILTER_X8 = 0x03,
    /** 16x filtering. */
    FILTER_X16 = 0x04
  };

  /** Standby duration in ms */
  enum standby_duration {
    /** 1 ms standby. */
    STANDBY_MS_1 = 0x00,
    /** 63 ms standby. */
    STANDBY_MS_63 = 0x01,
    /** 125 ms standby. */
    STANDBY_MS_125 = 0x02,
    /** 250 ms standby. */
    STANDBY_MS_250 = 0x03,
    /** 500 ms standby. */
    STANDBY_MS_500 = 0x04,
    /** 1000 ms standby. */
    STANDBY_MS_1000 = 0x05,
    /** 2000 ms standby. */
    STANDBY_MS_2000 = 0x06,
    /** 4000 ms standby. */
    STANDBY_MS_4000 = 0x07
  };
export class bmp280 extends I2cBase {
    testConnection(): boolean {
        throw new Error("Method not implemented.");
    }
  
    constructor(addr = bmp280Address.A) {
        super(addr, I2cDeviceType.BMP280);
    }
    begin(){
        this.open();
        if (this.readByte( bmp280Register.BMP280_REGISTER_CHIPID) != BMP280_CHIPID){
            this.close();
            return false;
        }
        this.close();
        return true;
    /*
      readCoefficients();
      // write8(BMP280_REGISTER_CONTROL, 0x3F); 
      setSampling();
      delay(100);*/
      return true;
    }
}