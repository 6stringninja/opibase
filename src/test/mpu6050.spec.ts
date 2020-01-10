import { mpu6050, mpu6050Address, mpu6050Register, mpu6050ClockSource } from "../devices/i2c/mpu6050";

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
        const test = 255;
      
        const intialSleepEnabled = mpu.sleepEnabled
        const oppositeSleeEnabled = !intialSleepEnabled;
        mpu.sleepEnabled = oppositeSleeEnabled;
        const newSleepEnabled = mpu.sleepEnabled;

        console.log({ intialSleepEnabled,oppositeSleeEnabled,newSleepEnabled})
      expect(newSleepEnabled).toBe(oppositeSleeEnabled);
      done();
    });
    it('i2CMasterModeEnabled test', async function(done) {
        const test = 255;
      
        const intiali2CMasterModeEnabled = mpu.i2CMasterModeEnabled
        const oppositei2CMasterModeEnabled = !intiali2CMasterModeEnabled;
        mpu.i2CMasterModeEnabled = oppositei2CMasterModeEnabled;
        const newintiali2CMasterModeEnabled = mpu.i2CMasterModeEnabled;

        console.log({ intiali2CMasterModeEnabled,oppositei2CMasterModeEnabled,newintiali2CMasterModeEnabled})
      expect(newintiali2CMasterModeEnabled).toBe(oppositei2CMasterModeEnabled);
      done();
    });
    it('i2CBypassEnabled test', async function(done) {
        const test = 255;
      
        const intiali2CBypassEnabled = mpu.i2CBypassEnabled
        const oppositei2CBypassEnabled = !intiali2CBypassEnabled;
        mpu.i2CBypassEnabled = oppositei2CBypassEnabled;
        const newintiali2CBypassEnabled = mpu.i2CBypassEnabled
        console.log({ intiali2CBypassEnabled,oppositei2CBypassEnabled,newintiali2CBypassEnabled})
      expect(newintiali2CBypassEnabled).toBe(oppositei2CBypassEnabled);
      done();
    });

    it('_clockSource test', async function(done) {
        const test = 255;
      
        const intial = mpu.clockSource;
        const opposite = intial=== mpu6050ClockSource.PLLwithZGyroReference ? mpu6050ClockSource.PLLwithXGyroReference : mpu6050ClockSource.PLLwithZGyroReference;
        mpu.clockSource = opposite;
        const newv = mpu.clockSource
        console.log({ intial,opposite,newv})
      expect(newv).toBe(opposite);
      done();
    });
  });