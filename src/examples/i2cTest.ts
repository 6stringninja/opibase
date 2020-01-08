 
import { open, I2cBus, openSync } from "i2c-bus";
 
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
/*
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
 }*/
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
})();
/*
then(i2c1 => i2c1.i2cWrite(MCP9808_ADDR, wbuf.length, wbuf).
  then(_ => i2c1.i2cRead(MCP9808_ADDR, rbuf.length, rbuf)).
  then(data => console.log(toCelsius(data.buffer.readUInt16BE()))).
  then(_ => i2c1.close())
).catch(console.log);
*/