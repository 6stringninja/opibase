import { mpu6050, mpu6050Address } from "../devices/i2c/mpu6050";

describe(' mpu6050 ', function() {
   const mpu = new mpu6050(mpu6050Address.A)
    console.log('hi');
    it('getDeviceId should be 0x68', async function(done) {
        const r = mpu.getDeviceId();

      expect(r).toBe(0x68);
      done();
    });
  });