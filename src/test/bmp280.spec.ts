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
    it(' bmp.readTemperature(); true', async function(done) {
         bmp.readCoefficients();
        const tmp = bmp.readTemperature();
       console.log({m:"bmp280 tmp",tmp})
      expect(tmp).toBeDefined();
      
      done();
    });
    it(' bmp.readPressure(); true', async function(done) {
        bmp.setSampling();

        bmp.delay(200);
        bmp.readCoefficients();
       const prs = bmp.readPressure();
       bmp.delay(100);
       for (let index = 0; index < 10; index++) {
        const alt = bmp.readAltitude(prs);
        console.log({m:"bmp280 pressure",prs,alt,mes: bmp.readMeas(), conf: bmp.readConf()});
        bmp.delay(bmp.getDuration());
           
       }
   
     
     expect(prs).toBeDefined();
     
     done();
   });
   it(' bmp.readAltitude(); true', async function(done) {
    bmp.readCoefficients();
   const alt = bmp.readAltitude();
  console.log({m:"bmp280 altitude",alt})
 expect(alt).toBeDefined();
 
 done();
});
    });