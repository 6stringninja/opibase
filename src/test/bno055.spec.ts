import { bno055, BNO055_ID } from "../devices/i2c/bno055";
import { bno055Address } from "../devices/i2c/bno055_types";

describe(' bno055 ', function() {
    const mpu = new bno055(bno055Address.A)
    beforeAll(function(){
      
    });
     it('getDeviceId should be 160', async function(done) {
         const deviceId = mpu.getDeviceId();
         const expectedId = BNO055_ID;
         console.log({deviceId,expectedId})
       expect(deviceId).toBe(expectedId);
       done();
     });
 

    it('begin() should be true', async function(done) {
        const result = mpu.begin();
   
        console.log("bno.begin");
      expect(result).toBeTrue();
      done();
    });

   }
);