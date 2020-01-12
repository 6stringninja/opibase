import { Socket } from 'socket.io';

import configData from './config/config.json'
import { IConfig } from './config/IConfig';
export const configApp = configData as IConfig;

console.log({configApp})
const Readline = require('@serialport/parser-readline')
import SerialPort from 'serialport';
import { OpiServer } from './server/OpiServer.js';


console.log("it worked");
  
 SerialPort.list().then((port) => {
   console.log("Port: ", port);
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
const ts = new OpiServer();
//const server = new SerialServer();