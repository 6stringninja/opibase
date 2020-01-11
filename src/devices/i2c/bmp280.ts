
import { I2cBase, I2cDeviceType } from "./i2cBase";
export enum bmp280Address {
    A = 0x76,
    B = 0x77
}

export const BMP280_CHIPID = (0x58) /**< Default chip ID. */

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
    dig_T1: number /**< dig_T1 cal register. */
    dig_T2: number /**<  dig_T2 cal register. */
    dig_T3: number /**< dig_T3 cal register. */

    dig_P1: number /**< dig_P1 cal register. */
    dig_P2: number /**< dig_P2 cal register. */
    dig_P3: number /**< dig_P3 cal register. */
    dig_P4: number /**< dig_P4 cal register. */
    dig_P5: number /**< dig_P5 cal register. */
    dig_P6: number /**< dig_P6 cal register. */
    dig_P7: number /**< dig_P7 cal register. */
    dig_P8: number /**< dig_P8 cal register. */
    dig_P9: number /**< dig_P9 cal register. */

    dig_H1: number /**< dig_H1 cal register. */
    dig_H2: number /**< dig_H2 cal register. */
    dig_H3: number /**< dig_H3 cal register. */
    dig_H4: number /**< dig_H4 cal register. */
    dig_H5: number /**< dig_H5 cal register. */
    dig_H6: number /**< dig_H6 cal register. */
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

const standby_duration_value = [1,63,124,250,1000,2000,4000];
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

export class  Bmp280config {
    /** Inactive duration (standby time) in normal mode */
     t_sb :standby_duration = standby_duration.STANDBY_MS_63 ;
    /** Filter settings */
     filter : sensor_filter = sensor_filter.FILTER_OFF;
    /** Unused - don't set */
     none : number;
    /** Enables 3-wire SPI */
     spi3w_en : number;
    /** Used to retrieve the assembled config register's byte value. */
     get() { return (this.t_sb << 5) | (this.filter << 2) | this.spi3w_en; }
  };

  /** Encapsulates trhe ctrl_meas register */
  export class Bmp280ctrl_meas {
    /** Temperature oversampling. */
     osrs_t : sensor_sampling = sensor_sampling.SAMPLING_X4;
    /** Pressure oversampling. */
     osrs_p : sensor_sampling= sensor_sampling.SAMPLING_X4;
    /** Device mode */
     mode : sensor_mode = sensor_mode.MODE_NORMAL;
    /** Used to retrieve the assembled ctrl_meas register's byte value. */
     get() { return (this.osrs_t << 5) | (this.osrs_p << 2) | this.mode; }
  };
export class bmp280 extends I2cBase {
    testConnection(): boolean {
        throw new Error("Method not implemented.");
    }

    constructor(addr = bmp280Address.A) {
        super(addr, I2cDeviceType.BMP280);
    }
    private _bmp280_calib = new bm280CalibData();
   private _measReg = new Bmp280ctrl_meas();
   private _configReg = new Bmp280config();
    setSampling( mode: sensor_mode,
         tempSampling: sensor_sampling,
         pressSampling: sensor_sampling,
         filter: sensor_filter,
         duration: standby_duration) {

this._measReg.mode = mode;
this._measReg.osrs_t = tempSampling;
this._measReg.osrs_p = pressSampling;

this._configReg.filter = filter;
this._configReg.t_sb = duration;

this.writeByte(bmp280Register.BMP280_REGISTER_CONFIG, this._configReg.get());
this.writeByte(bmp280Register.BMP280_REGISTER_CONTROL, this._measReg.get());
}
readAltitude( seaLevelhPa = 1013.25) {
    let altitude:number = 0;
  
    let pressure = this.readPressure(); // in Si units for Pascal
    pressure /= 100;
  
    altitude = 44330 * (1.0 - Math.pow(pressure / seaLevelhPa, 0.1903));
  
    return altitude;
  }
    readPressure() {
        let var1:number, var2:number, p:number;
      
        // Must be done first to get the t_fine variable set up
        this.readTemperature();
      this.open();
        let adc_P = this.readUint24(bmp280Register.BMP280_REGISTER_PRESSUREDATA);
        this.close();
        adc_P >>= 4;
      
        var1 = (this.t_fine) - 128000;
        var2 = var1 * var1 * this._bmp280_calib.dig_P6;
        var2 = var2 + ((var1 * this._bmp280_calib.dig_P5) << 17);
        var2 = var2 + ((this._bmp280_calib.dig_P4) << 35);
        var1 = ((var1 * var1 * this._bmp280_calib.dig_P3) >> 8) +
               ((var1 * this._bmp280_calib.dig_P2) << 12);
        var1 =
            ((((1) << 47) + var1)) * (this._bmp280_calib.dig_P1) >> 33;
      
        if (var1 == 0) {
          return 0; // avoid exception caused by division by zero
        }
        p = 1048576 - adc_P;
        p = (((p << 31) - var2) * 3125) / var1;
        var1 = ((this._bmp280_calib.dig_P9) * (p >> 13) * (p >> 13)) >> 25;
        var2 = ((this._bmp280_calib.dig_P8) * p) >> 19;
      
        p = ((p + var1 + var2) >> 8) + ((this._bmp280_calib.dig_P7) << 4);
        return p / 256;
      }
     t_fine = 0;
    readTemperature() {
        let var1: number, var2: number;
        this.open();
        let adc_T = this.readUint24(bmp280Register.BMP280_REGISTER_TEMPDATA);
        this.close();
        adc_T >>= 4;

        var1 = ((((adc_T >> 3) - (this._bmp280_calib.dig_T1 << 1))) *
            (this._bmp280_calib.dig_T2)) >>
            11;

        var2 = (((((adc_T >> 4) - (this._bmp280_calib.dig_T1)) *
            ((adc_T >> 4) - (this._bmp280_calib.dig_T1))) >>
            12) *
            (this._bmp280_calib.dig_T3)) >>
            14;

         this.t_fine = var1 + var2;

        let T = (this.t_fine * 5 + 128) >> 8;
        return T / 100;
    }
    readCoefficients() {
        this.open();
        this._bmp280_calib.dig_T1 = this.readUint16LE(bmp280Register.BMP280_REGISTER_DIG_T1);
        this._bmp280_calib.dig_T2 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_T2);
        this._bmp280_calib.dig_T3 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_T3);

        this._bmp280_calib.dig_P1 = this.readUint16LE(bmp280Register.BMP280_REGISTER_DIG_P1);
        this._bmp280_calib.dig_P2 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P2);
        this._bmp280_calib.dig_P3 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P3);
        this._bmp280_calib.dig_P4 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P4);
        this._bmp280_calib.dig_P5 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P5);
        this._bmp280_calib.dig_P6 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P6);
        this._bmp280_calib.dig_P7 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P7);
        this._bmp280_calib.dig_P8 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P8);
        this._bmp280_calib.dig_P9 = this.readInt16LE(bmp280Register.BMP280_REGISTER_DIG_P9);
        this.close();
        return this._bmp280_calib;
    }
    getDeviceId() {
        this.open();
        const id = this.readByte(bmp280Register.BMP280_REGISTER_CHIPID);
        this.close();
        return id;
    }
    begin() {

        if (this.getDeviceId() != BMP280_CHIPID) {

            return false;
        }

        return true;
        /*
          readCoefficients();
          // write8(BMP280_REGISTER_CONTROL, 0x3F); 
          setSampling();
          delay(100);*/
        return true;
    }
}