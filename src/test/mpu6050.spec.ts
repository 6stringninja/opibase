import { mpu6050, mpu6050Address, mpu6050Register, mpu6050ClockSource, mpu6050AccRange, mpu6050GyroRange } from "../devices/i2c/mpu6050";

describe(' mpu6050 ', function() {
   const mpu = new mpu6050(mpu6050Address.A)
   beforeAll(function(){
     
   });
    it('getDeviceId should be 0x68', async function(done) {
        const deviceId = mpu.getDeviceId();
        const expectedId = 0x68;
        console.log({deviceId,expectedId})
      expect(deviceId).toBe(expectedId);
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
      mpu.clockSource = mpu6050ClockSource.PLLwithXGyroReference;
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
      mpu.sleepEnabled = false;
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
      mpu.i2CMasterModeEnabled = false;
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
      mpu.i2CBypassEnabled = true;
      done();
    });


    it('set acc gyro rates', async function(done) {
        const acc = mpu.accRange;
        const gyro = mpu.gyroRange;
        const nacc = acc === mpu6050AccRange.A16G ? mpu6050AccRange.A2G : mpu6050AccRange.A16G ;
        const ngyro = gyro === mpu6050GyroRange.G2000 ? mpu6050GyroRange.G250 : mpu6050GyroRange.G2000;
        mpu.accRange = nacc;
        mpu.gyroRange = ngyro;
        const sacc = mpu.accRange;
        const sgyro = mpu.gyroRange;
        console.log({ acc,nacc,sacc,gyro,ngyro,sgyro});
        expect(sacc).toBe(nacc);
        expect(sgyro).toBe(ngyro);
    done();
});
it('getRotation', async function(done) {
 
   // mpu.clockSource = mpu6050ClockSource.PLLwithXGyroReference;
    mpu.gyroRange = mpu6050GyroRange.G250;
  //  mpu.sleepEnabled = false;
    mpu.delay(10);
    const v = mpu.getRotation();
    console.log({rotation:v});
  expect(v.length).toBe(3);
  done();
});
it('getAcceleration', async function(done) {
    
//    mpu.clockSource = mpu6050ClockSource.PLLwithXGyroReference;
    mpu.accRange = mpu6050AccRange.A2G;
 //   mpu.sleepEnabled = false;
    mpu.delay(10);
    const v = mpu.getAcceleration();
    console.log({acc:v});
  expect(v.length).toBe(3);
  done();
});
it('getRotationScaled', async function(done) {
 
    // mpu.clockSource = mpu6050ClockSource.PLLwithXGyroReference;
     mpu.gyroRange = mpu6050GyroRange.G250;
   //  mpu.sleepEnabled = false;
     mpu.delay(10);
     const v = mpu.getRotationScaled();
     console.log({rotation:v});
   expect(v.length).toBe(3);
   done();
 });
 it('getAccelerationScaled', async function(done) {
     
 //    mpu.clockSource = mpu6050ClockSource.PLLwithXGyroReference;
     mpu.accRange = mpu6050AccRange.A2G;
  //   mpu.sleepEnabled = false;
     mpu.delay(10);
     const v = mpu.getAccelerationScaled();
     console.log({acc:v});
     const accelerationX = v[0]
     const accelerationY = v[1];
     const accelerationZ = v[2];
     const pitch = 180 * Math.atan (accelerationX/Math.sqrt(accelerationY*accelerationY + accelerationZ*accelerationZ))/3.14159265358979323846264338327950288;
 const roll = 180 * Math.atan (accelerationY/Math.sqrt(accelerationX*accelerationX + accelerationZ*accelerationZ))/3.14159265358979323846264338327950288;
  console.log({roll,pitch})
 expect(v.length).toBe(3);
   done();
 });
  });