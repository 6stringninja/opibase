import { ServerBase, ServerClientState } from "../ServerBase";
import { DebugDataObservable, DebugMsg, DebugSeverityType } from "./DebugSocketServer";
 
import SerialPort = require("serialport");
import { IConfigUart } from "../config/IConfig";
import Readline = require('@serialport/parser-readline');
import ByteLength from '@serialport/parser-byte-length';
import { ConcealedBehaviorSubject } from "../rx/ConcealedBehaviorSubject";
import { ConcealedSubject, IConcealedSubject } from "../rx/ConcealedSubject";
import { Observable } from "rxjs";
import { OptPlatform } from "../OptPlatform";
export enum OpiUartFunction {
    MCU = "MCU",
    GPS = "GPS",
    TEL = "TEL"
}
export class OpiClientState {
    msgs: DebugMsg[] = [];
}
export class OpiServerState extends ServerClientState<OpiClientState>{

    constructor(public socket: SocketIO.Socket) {
        super(socket, () => new OpiClientState());
    }
}
export class OpiSerial<T> {
    port?: SerialPort;
    parser?: any;
    private _rawDataCs: IConcealedSubject<T>;
    public get rawDataCs(): IConcealedSubject<T> {
        return this._rawDataCs;
    }
    public set rawDataCs(value: IConcealedSubject<T>) {
        this._rawDataCs = value;
        this.data = this.rawDataCs.observable;
    }
    data?: Observable<T>;
    constructor(public uartType: OpiUartFunction, public enabled: boolean, public config?: IConfigUart) {

    }
}
export class OpiServer extends ServerBase<OpiClientState, OpiServerState> {
    errors$ = new DebugDataObservable();
    ports: OpiSerial<any>[] = [];
 
    constructor(public optPlatform: OptPlatform) {
        super((socket: SocketIO.Socket) => {
            return this.getServerState(socket);
        }, 42220);
        this.ports = [
            new OpiSerial<number[]>(OpiUartFunction.MCU, this.optPlatform.hasMcu, this.optPlatform.mcuUart),
            new OpiSerial<string>(OpiUartFunction.GPS, this.optPlatform.hasGps, this.optPlatform.gpsUart),
            new OpiSerial<string>(OpiUartFunction.TEL, this.optPlatform.hasTel, this.optPlatform.telsUart)
        ];
        this.initSerial();

    }
    private getPort(opif: OpiUartFunction) {
        return this.ports.find(f => f.uartType === opif).port;
    }
    private initSerial() {
        this.ports.forEach(p => {
            if (p.enabled) {

                p.port = new SerialPort(p.config.portName, { baudRate: p.config.portBaud, autoOpen: true },
                     (err) => {
                        if (err) {
                            return console.log('Error: ', err.message)
                        }
                        var arz: any
                        switch (p.uartType) {
                            case OpiUartFunction.MCU:
                             //   this.mcuRawDataCs =  new ConcealedSubject<number[]>();
                                p.rawDataCs = new ConcealedSubject<number[]>();
                               
                                p.parser = p.port.pipe(new ByteLength({length:8}));
                                p.parser.on('data',  (data)=> {
                                   
                                    
                                    var res :number[] = [];
                                    for (var x = 0; x < 8; x++) {
                                        res.push(data.readUInt8(x));
                                    }
                                     p.rawDataCs.next(res);
                                });
                                p.data.subscribe(s=>console.log({obg:s}));
                                break;

                            default:
                                p.parser = p.port.pipe(new Readline({ delimiter: '\r\n' }));
                                p.rawDataCs = new ConcealedSubject<string>();
                                if (p.uartType===OpiUartFunction.GPS){
                                   
                                    p.parser.on('data',  (data) =>{
                                   //     p.parser.mcuGpsCs.next(data);
                                        p.rawDataCs.next(data);
                                    });
                                }
                                else if (p.uartType===OpiUartFunction.TEL) {
                                    p.parser.on('data',  (data) => {
                                    //    p.parser.mcuTelCs.next(data);
                                    p.rawDataCs.next(data);
                                    });
                                }
                                break;
                        }
 
// DEBUG
                        p.parser.on('data', function (data) {

                            if (p.uartType !== OpiUartFunction.GPS) {
                              
                            } else {
                                arz = data;
                            }

                            console.log({ portname: p.config.portName, baud: p.config.portBaud, data: arz })
                        })
                        console.log("connected connected")
                        //   p.parser = p.port.pipe(new Readline({ delimiter: '\r\n' })) ;
                    });




            }
        });

    }
    private getServerState(socket) {
        const prm = new Promise<OpiServerState>((r) => {
            r(new OpiServerState(socket));
        });
        return prm;
    }
    init(): void {
        // throw new Error("Method not implemented.");
    }
    connect(state: OpiServerState): Promise<void> {
        this.errors$.observable.subscribe(s => {
            state.state.msgs.push(s);
            state.socket.emit("debugmsgout", s);
        });
        //throw new Error("Method not implemented.");
        return;
    }
    initClientMessages(state: OpiServerState): Promise<void> {
        state.socket.on("debugmsgin", (m) => {
            this.errors$.sendAndMap(m);
        });
        return;
    }
    disconnect(state: OpiServerState): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

/*
setTimeout(()=>{
    console.log("here")
    const socket = io(`http://localhost:${42220}`);
    socket.on('error', (error) => {
        console.log(error);
      });
socket.on('connect',  ()=>{ console.log("con");
 socket.emit("debugmsgin",new DebugMsg("message1"));
 for (let index = 0; index <  5; index++) {

     socket.emit("debugmsgin",new DebugMsg("message1",`${index}`,DebugSeverityType.error,{bullshit:"bs"}));
 }

console.log("connect")});
socket.on('debugmsgout', (d)=>{console.log({m:"debugmsgout",d})});
socket.on('event', function(data){console.log("data")});
socket.on('disconnect', function(){});
},1000)*/


