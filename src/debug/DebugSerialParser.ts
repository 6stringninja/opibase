import SerialPort = require("serialport");
import Readline = require('@serialport/parser-readline');
export class DebugSerialParser {
    parseData(data: any) {
        console.log({debug:data})
    }
    sendData(data:string){
        this.port.write(`${data}\r\n`)
    }
    parser: any;
    constructor (private port?:SerialPort) {
        if(port){
            this.parser = port.pipe(new Readline({ delimiter: '\r\n' }));
            console.log("debug port connected");
            this.parser.on('data', (data) => {
                this.parseData(data)
              this.sendData(data);
            });
           
        }
    }
}