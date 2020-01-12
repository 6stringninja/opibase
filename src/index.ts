import { Socket } from 'socket.io';

import configData from './config/config.json'
import { IConfig, IConfigUart } from './config/IConfig';
export const configApp = (configData as unknown) as IConfig;

console.log({configApp})
const Readline = require('@serialport/parser-readline')
import SerialPort from 'serialport';
import { OpiServer, OpiUartFunction } from './server/OpiServer.js';
import os from "os";

export class OptPlatform{
  ports: SerialPort.PortInfo[]=[];
  mcuUart?:IConfigUart;
  gpsUart?:IConfigUart;
  telsUart?:IConfigUart;
  public get hasMcu() {
    return !!this.mcuUart && this.ports.some(s=> s.path === this.mcuUart.portName);
  }
  public get hasGps() {
    return !!this.gpsUart && this.ports.some(s=> s.comName === this.gpsUart.portName);
  }
  public get hasTel() {
    return !!this.telsUart  && this.ports.some(s=> s.comName === this.telsUart.portName);
  }
  platform="";
  hostname="";
}
const optPlatform = new OptPlatform();
const hostName = os.hostname();
const platform = os.platform();
optPlatform.hostname = hostName;
optPlatform.platform = platform;
let configHost = configApp.hosts.find(f=> f.platform.toLowerCase()===platform.toLowerCase());
if(!configHost){
  configHost = configApp.hosts.find(f=> f.platform==="Linux");

}
optPlatform.mcuUart = configHost.uarts.find(s=> s.portFunction ===OpiUartFunction.MCU.toString() && s.enabled);
optPlatform.gpsUart = configHost.uarts.find(s=> s.portFunction ===OpiUartFunction.GPS.toString() && s.enabled) ;
optPlatform.telsUart = configHost.uarts.find(s=> s.portFunction ===OpiUartFunction.TEL.toString() && s.enabled);
console.log("it worked");
console.log({hostName,platform})
 SerialPort.list().then((port) => {
   console.log({})
  console.log("Port: ", port);
   console.log({platform,hostName}) 
   optPlatform.ports = port;
   
   console.log({mcu:optPlatform.hasMcu, gps:optPlatform.hasGps, tel:optPlatform.hasTel })
   const ts = new OpiServer(optPlatform);
   
 });
 

export class SerialServer {
   
    init() {
      
/*

        this.serialPort.open(  (err) => {
         
            if (err) {
              return console.log('Error opening port: ', err.message)
            } 
          console.log("connected");
            // Because there's no callback to write, write errors will be emitted on the port:
            this.serialConnection.next(true);
          })
          this.serialPort.close(  (err) => {
         
            if (err) {
              return console.log('Error opening port: ', err.message)
            } 
          
            // Because there's no callback to write, write errors will be emitted on the port:
            this.serialConnection.next(true);
          });

          const parser = this.serialPort.pipe(new Readline({ delimiter: '\r\n' }))
          parser.on('data', (data)=>{
            //  console.log(data);
              
          try {
              let json = JSON.parse(data); 
              if(json){
                  this.serialMsgs.next(json);
                //console.log(json);
              }
          } catch (error) {
             console.log("error");
          
          }
          
          
          
          });
        */
    }
    connect(socket:  Socket): Promise<void> {
        console.log("connected");
    
        return;

        

    } disconnect(socket:  Socket): Promise<void> {
        console.log("disconnect");  
        return;
    }
    serialDataSend(socket:  Socket, param: any): Promise<void> {
       
        return;
    }


}

//const server = new SerialServer();