import { bmp280, bmp280Address } from "../devices/i2c/bmp280";

describe(' bno055 ', function() {
    const bmp = new bmp280(bmp280Address.A)
    beforeAll(function(){
      
    });
     it(' bmp.begin(); true', async function(done) {
         const deviceId = bmp.begin();
        
       expect(deviceId).toBe(true);
       done();
     });
    });