import SerialPort = require("serialport");
import Readline = require('@serialport/parser-readline');
import ByteLength from '@serialport/parser-byte-length';
import { ConcealedSubject } from "../../rx/ConcealedSubject";
import { OptPlatform } from "./OptPlatform";
import { OpiUartFunction } from "./OpiUartFunction";
import { OpiSerial } from "./OpiSerial";
export class OpiSerialPorts {
    ports: (OpiSerial<any>)[];
    constructor(public optPlatform: OptPlatform) {
        this.ports = [
            new OpiSerial<number[]>(OpiUartFunction.MCU, this.optPlatform.hasMcu, this.optPlatform.mcuUart),
            new OpiSerial<string>(OpiUartFunction.GPS, this.optPlatform.hasGps, this.optPlatform.gpsUart),
            new OpiSerial<string>(OpiUartFunction.TEL, this.optPlatform.hasTel, this.optPlatform.telsUart)
        ];
        this.initSerial();
    }
    public dataObservable(t: OpiUartFunction) {
        this.ports.find(f => f.uartType === t).data;
    }
    private initSerial() {
        this.ports.forEach(p => {
            if (p.enabled) {
                p.port = new SerialPort(p.config.portName, { baudRate: p.config.portBaud, autoOpen: true }, (err) => {
                    if (err) {
                        return console.log('Error: ', err.message);
                    }
                    var arz: any;
                    switch (p.uartType) {
                        case OpiUartFunction.MCU:
                            p.rawDataCs = new ConcealedSubject<number[]>();
                            p.parser = p.port.pipe(new ByteLength({ length: 8 }));
                            p.parser.on('data', (data) => {
                                var res: number[] = [];
                                for (var x = 0; x < 8; x++) {
                                    res.push(data.readUInt8(x));
                                }
                                p.rawDataCs.next(res);
                            });
                            p.data.subscribe(s => console.log({ obg: s }));
                            break;
                        default:
                            p.parser = p.port.pipe(new Readline({ delimiter: '\r\n' }));
                            p.rawDataCs = new ConcealedSubject<string>();
                            if (p.uartType === OpiUartFunction.GPS) {
                                p.parser.on('data', (data) => {
                                    //     p.parser.mcuGpsCs.next(data);
                                    p.rawDataCs.next(data);
                                });
                            }
                            else if (p.uartType === OpiUartFunction.TEL) {
                                p.parser.on('data', (data) => {
                                    //    p.parser.mcuTelCs.next(data);
                                    p.rawDataCs.next(data);
                                });
                            }
                            break;
                    }
                    // DEBUG
                    p.parser.on('data', function (data) {
                        if (p.uartType !== OpiUartFunction.GPS) {
                        }
                        else {
                            arz = data;
                        }
                        console.log({ portname: p.config.portName, baud: p.config.portBaud, data: arz });
                    });
                    console.log("connected connected");
                    //   p.parser = p.port.pipe(new Readline({ delimiter: '\r\n' })) ;
                });
            }
        });
    }
}
