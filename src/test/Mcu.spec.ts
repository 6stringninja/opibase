import SerialPort = require("serialport");
import { ConcealedSubject } from "../rx/ConcealedSubject";
import { McuSerialParser, OPI_COMMAND_E, OPI_RPC_E, McuBnoEulerAxis } from "../mcu/McuSerialParser";
import { McuSerialResponseProcessor } from "../mcu/McuSerialResponseProcessor";
import { McuSerialRequestProcessor } from "../mcu/McuSerialRequestProcessor";
import { doesNotReject } from "assert";

 
const fakePorts: SerialPort.PortInfo[] = [
    {
   
      manufacturer: 'Silicon Labs',
      serialNumber: '0001',
      pnpId: 'USB\\VID_10C4&PID_EA60\\0001',
      locationId: 'Port_#0002.Hub_#0002',
      vendorId: '10C4',
      productId: 'EA60',
      comName: 'COM7',
	 
    },
    {
     
      manufacturer: 'Arduino LLC (www.arduino.cc)',
      serialNumber: '7&332f71c5&0&1',
      pnpId: 'USB\\VID_2341&PID_8036&MI_00\\8&2AB79A32&0&0000',
      locationId: '0000.0014.0000.001.003.001.000.000.000',
      vendorId: '2341',
      productId: '8036',
      comName: 'COM47'
    },
    {
      
      manufacturer: 'Pyramid Innovation Ltd',
      serialNumber: '7&332f71c5&0&3',
      pnpId: 'USB\\VID_0525&PID_A4A7\\7&332F71C5&0&3',
      locationId: 'Port_#0003.Hub_#0002',
      vendorId: '0525',
      productId: 'A4A7',
      comName: 'COM48'
    }
  ];
  function bufftoNumber(b:Buffer){
    const rslt:number[]=[];
    for (let index = 0; index < b.length; index++) {
      rslt.push(b.readUInt8(index));
      
    }
    return rslt;

  }
  describe(' McuSerialResponseProcessor ', () =>{
    let cs = new ConcealedSubject<number[]>();
let mcus = new McuSerialParser(cs.observable);
let rspProc = new McuSerialResponseProcessor(mcus.rawCommands$);
    it('DeviceId should be 99', (done) => {
      let testId = 0;
      rspProc.DeviceId$.subscribe((id) => {

        //
        testId = id;

        //     console.log({id})

      });
      cs.next([McuSerialParser.OPI_START_B, OPI_COMMAND_E.OPI_COMMAND_DEVICE_ID, OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS, 1, 99]);
      setTimeout(() => {
        expect(testId).toEqual(99);
        done();

      },10);
    })

    it('BnoEulerEnableAxisStream should be true', (done) => {
      let testResult = false;
      rspProc.BnoEulerEnableAxisStream$.subscribe((id) => {

        //
        testResult = id;

        //     console.log({id})

      });
      cs.next([McuSerialParser.OPI_START_B, OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER_ENABLE_STREAM, OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS, 1, 1]);
      setTimeout(() => {
        expect(testResult).toBeTruthy();
        done();

      },10);
    })
    it('BnoEulerEnableAxisStream should be false', (done) => {
      let testResult = true;
      rspProc.BnoEulerEnableAxisStream$.subscribe((id) => {

        //
        testResult = id;

        //     console.log({id})

      });
      cs.next([McuSerialParser.OPI_START_B, OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER_ENABLE_STREAM, OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS, 1, 0]);
      setTimeout(() => {
        expect(testResult).toBeFalsy();
        done();

      },10);
    })

    it('BnoEulerEnableAxisStream should be false', (done) => {
      let testResult = new McuBnoEulerAxis();
      rspProc.BnoEulerAxis$.subscribe((id) => {

        //
        testResult = id;

      //   console.log({id})

      });
      const bf  = Buffer.alloc(16);
      bf.writeFloatLE(1.1,0);
      bf.writeFloatLE(2.1,4);
      bf.writeFloatLE(3.1,8);
      bf.writeInt32LE(999999,12);
      const ar = [McuSerialParser.OPI_START_B, OPI_COMMAND_E.OPI_COMMAND_DEVICE_BNO_EULER, OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS, bf.length];
    
      for (let index = 0; index < bf.length; index++) {
        ar.push(bf.readUInt8(index))
        
      }
      // cconsole.log({ar})
      cs.next(ar);
      setTimeout(() => {
        const exp = [1.100000023841858, 2.0999999046325684, 3.0999999046325684];
         expect(testResult.data).toEqual( exp);
         expect(testResult.timeStamp).toEqual(999999)
         expect(testResult.X).toEqual(exp[0]);
         expect(testResult.Y).toEqual(exp[1]);
         expect(testResult.Z).toEqual(exp[2]);
        done();

      },10);
    })
  });

  describe(' McuSerialRequestProcessor ', () =>{

let md = new McuSerialRequestProcessor();
  
    it('sendCommand should requestDeviceId',  (done) => {
      let testBuffer:Buffer;
      let result:number;
     let s = md.sendCommand$.subscribe((b)=>{
       result = bufftoNumber(b).length;
        // console.log({result});
      })
      md.requestDeviceId();
      setTimeout(() => {
        expect(result).toBeTruthy();
        s.unsubscribe();
        done();
       
      },10);  
    })
     

    it('sendCommand should requestBnoEulerEnableAxisStream true',  (done) => {
      
      let result:number;
      let s = md.sendCommand$.subscribe((b)=>{
       result = bufftoNumber(b)[3];
        // console.log({result});
      })
md.requestBnoEulerEnableAxisStream(true);
      setTimeout(() => {
        expect(result).toBeTruthy();
        s.unsubscribe();
        done();
       
      },10);  
    })
    it('sendCommand should requestBnoEulerEnableAxisStream false',  (done) => {
      let testBuffer:Buffer;
      let result:number;
     let s =  md.sendCommand$.subscribe((b)=>{
       result = bufftoNumber(b)[3];
        // console.log({result});
      })
      md.requestBnoEulerEnableAxisStream(false);
      setTimeout(() => {
        expect(result).toBeFalsy();
        s.unsubscribe();
        done();
       
      },10);  
    })
  })
  /*

   
    const tm = new Promise<void>((e)=>setTimeout(() => {
        return;
    }, 1000))

     it('getDeviceId should be 0x68', async function {
   
     
      md.DeviceId$.subscribe( (id)=>{
        // console.log({id:id});
        const nmb:number = id as number;
        // console.log(nmb);
        
        expect(nmb).toBe(99);
        done();
      })

  
  cs.next([McuSerialParser.OPI_START_B,OPI_COMMAND_E.OPI_COMMAND_DEVICE_ID,OPI_RPC_E.OPI_PRC_COMMAND_SUCCESS,1,99])
     
     //expect(optPlatform.hasMcu).toBeTruthy();
      
     });
    });
    */