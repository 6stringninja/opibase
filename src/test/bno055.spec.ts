import { bno055, BNO055_ID } from "../devices/i2c/bno055";
import { bno055Address, BNO055Vector } from "../devices/i2c/bno055_types";

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
        mpu.delay(500);
        const result = mpu.begin();
   
        console.log("bno.begin");
      expect(result).toBeTruthy();
      done();
    });
    it(' mpu.getVector(BNO055Vector.VECTOR_EULER)', async function(done) {
        mpu.delay(10);
        const result = mpu.getVector(BNO055Vector.VECTOR_EULER);
   
        console.log({l:"getVector()",result});
      expect(result.length).toBe(3);
      done();
    });
   }
);