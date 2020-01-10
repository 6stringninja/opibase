import { mpu6050, mpu6050Address } from "../devices/i2c/mpu6050";

describe(' mpu6050 ', function() {
   const mpu = new mpu6050(mpu6050Address.A)
 
    it('getDeviceId should be 0x68', async function(done) {
        const deviceId = mpu.getDeviceId();
        const expectedId = 0x68;
        console.log({deviceId,expectedId})
      expect(deviceId).toBe(expectedId);
      done();
    });
    it('sleepEnabled test', async function(done) {
        const intialSleepEnabled = mpu.sleepEnabled
        const oppositeSleeEnabled = !intialSleepEnabled;
        const newSleepEnabled = mpu.sleepEnabled;

        console.log({intialSleepEnabled,oppositeSleeEnabled,newSleepEnabled})
      expect(newSleepEnabled).toBe(oppositeSleeEnabled);
      done();
    });
  });