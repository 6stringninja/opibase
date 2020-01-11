import { bmp280, bmp280Address, BMP280_CHIPID } from "../devices/i2c/bmp280";

describe(' bno055 ', function() {
    const bmp = new bmp280(bmp280Address.A)
    beforeAll(function(){
      
    });
     it(' bmp.getDeviceId(); true', async function(done) {
         const deviceId = bmp.getDeviceId();
        console.log({m:"bmp280",deviceId})
       expect(deviceId).toBe(BMP280_CHIPID);
       done();
     });
     it(' bmp.readCoefficients(); true', async function(done) {
        const coefs = bmp.readCoefficients();
       console.log({m:"bmp280",coefs})
      expect(coefs).toBeDefined();
      done();
    });
    });