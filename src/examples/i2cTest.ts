 
import { open, I2cBus, openSync    } from "i2c-bus";
import { mpu6050, mpu6050GyroRange, mpu6050AccRange, mpu6050ClockSource } from "../devices/i2c/mpu6050";


 /*
const MCP9808_ADDR = 0x18;
const TEMP_REG = 0x05;
 
const toCelsius = rawData => {
  let celsius = (rawData & 0x0fff) / 16;
  if (rawData & 0x1000) {
    celsius -= 256;
  }
  return celsius;
};
 
const wbuf = Buffer.from([TEMP_REG]);
const rbuf = Buffer.alloc(2);
 
 try {
     
    open(1,(error: any) => {
        if(error){
            console.log(error);
            
        }
    }).scan( (error: any, result: number[]) =>{
        if(error){
            console.log(error);
    
        }
        console.log(result);
        
    } )
     
 } catch (error) {
     console.log("error i2c");
 } 
 function I2cBus1():Promise<I2cBus>{
     return new Promise<I2cBus>(  (r,e)=>{
       try {
        r(openSync(1));
       } catch (error) {
           e(error);
       }
      

     });

   
 }

(async ()=>{
 const   bus = await I2cBus1();
 bus.scan((error: any, result: number[]) =>{
     console.log(result);
     console.log("update");
 })
})();*/
function delay(ms:number) {
    let start = Date.now();
      let  now = start;
    while (now - start < ms) {
      now = Date.now();
    }
}
const mpu = new mpu6050();
mpu.clockSource = mpu6050ClockSource.PLLwithZGyroReference;
mpu.gyroRange = mpu6050GyroRange.G2000;
mpu.accRange = mpu6050AccRange.A2G;
mpu.sleepEnabled = false;
mpu.i2CMasterModeEnabled = false;
mpu.i2CBypassEnabled = true;

const prm = new Promise<void>(r=>{

    const i2c1 =  openSync(1);

    const  MPU6050_ADDRESS = 0x68;

     i2c1.writeByteSync(MPU6050_ADDRESS, 0x6B, 0x80);             //PWR_MGMT_1    -- DEVICE_RESET 1
     
    delay(50);
        i2c1.writeByteSync(MPU6050_ADDRESS, 0x6B, 0x03);             //PWR_MGMT_1    -- SLEEP 0; CYCLE 0; TEMP_DIS 0; CLKSEL 3 (PLL with Z Gyro reference)
        i2c1.writeByteSync(MPU6050_ADDRESS, 0x1A, 0);    //CONFIG        -- EXT_SYNC_SET 0 (disable input pin for data sync) ; default DLPF_CFG = 0 => ACC bandwidth = 260Hz  GYRO bandwidth = 256Hz)
        i2c1.writeByteSync(MPU6050_ADDRESS, 0x1B, 0x18);             //GYRO_CONFIG   -- FS_SEL = 3: Full scale set to 2000 deg/sec
 

    // enable I2C bypass for AUX I2C
   
       i2c1.writeByteSync(MPU6050_ADDRESS, 0x37, 0x02);           //INT_PIN_CFG   -- INT_LEVEL=0 ; INT_OPEN=0 ; LATCH_INT_EN=0 ; INT_RD_CLEAR=0 ; FSYNC_INT_LEVEL=0 ; FSYNC_INT_EN=0 ; I2C_BYPASS_EN=1 ; CLKOUT_EN=0
     delay(50);
 for (let index = 0; index < 100; index++) {
     
     

     const buff = Buffer.alloc(6);
   i2c1.readI2cBlockSync(MPU6050_ADDRESS,0x43,6,buff)
  const raw = [ buff.readInt16BE(0),
   buff.readInt16BE(2),
   buff.readInt16BE(4)];

  console.log({r:raw, c: raw.map(m=> m/16.4)});
  delay(50);
}
  delay(100);
  console.log(i2c1.scanSync());
      i2c1.closeSync();
    r();
});

 
(async ()=>{
    await prm;
   })() 

/*
then(i2c1 => i2c1.i2cWrite(MCP9808_ADDR, wbuf.length, wbuf).
  then(_ => i2c1.i2cRead(MCP9808_ADDR, rbuf.length, rbuf)).
  then(data => console.log(toCelsius(data.buffer.readUInt16BE()))).
  then(_ => i2c1.close())
).catch(console.log);
*/