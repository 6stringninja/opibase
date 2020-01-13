import { ServerBase, ServerClientState } from "../ServerBase";
import { DebugDataObservable, DebugMsg, DebugSeverityType } from "./DebugSocketServer";
import { OptPlatform } from "..";
import SerialPort = require("serialport");
import { IConfigUart } from "../config/IConfig";
import Readline = require('@serialport/parser-readline');
import ByteLength from '@serialport/parser-byte-length';
import { ConcealedBehaviorSubject } from "../rx/ConcealedBehaviorSubject";
import { ConcealedSubject } from "../rx/ConcealedSubject";
import { Observable } from "rxjs";
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
export class OpiSerial {
    port?: SerialPort;
    parser?: any;
    constructor(public uartType: OpiUartFunction, public enabled: boolean, public config?: IConfigUart) {

    }
}
export class OpiServer extends ServerBase<OpiClientState, OpiServerState> {
    errors$ = new DebugDataObservable();
    ports: OpiSerial[] = [];
    mcuRawDataCs = new ConcealedSubject<number[]>();
    public get mcuRawData$(): Observable<number[]> {
        return this.mcuRawDataCs.observable;;
    }
    gpsRawDataCs = new ConcealedSubject<string>();
    public get gpsRawData$() {
       
        return this.gpsRawDataCs.observable;;
    }
    telRawDataCs = new ConcealedSubject<string>();
    public get telRawData$() {
        return this.telRawDataCs.observable;;
    }
    constructor(public optPlatform: OptPlatform) {
        super((socket: SocketIO.Socket) => {
            return this.getServerState(socket);
        }, 42220);
        this.ports = [
            new OpiSerial(OpiUartFunction.MCU, this.optPlatform.hasMcu, this.optPlatform.mcuUart),
            new OpiSerial(OpiUartFunction.GPS, this.optPlatform.hasGps, this.optPlatform.gpsUart),
            new OpiSerial(OpiUartFunction.TEL, this.optPlatform.hasTel, this.optPlatform.telsUart)
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
                                p.parser = p.port.pipe(new ByteLength());
                                p.parser.on('data',  (data)=> {
                                    var res :number[] = [];
                                    for (var x = 0; x < 8; x++) {
                                        res.push(data.readUInt8(x));
                                    }
                                    this.mcuRawDataCs.next(res);
                                });
                                this.mcuRawData$.subscribe(s=>console.log({obg:s}));
                                break;

                            default:
                                p.parser = p.port.pipe(new Readline({ delimiter: '\r\n' }));
                                if (p.uartType===OpiUartFunction.GPS){
                                   
                                    p.parser.on('data',  (data) =>{
                                        p.parser.mcuGpsCs.next(data);
                                        
                                    });
                                }
                                else if (p.uartType===OpiUartFunction.TEL) {
                                    p.parser.on('data',  (data) => {
                                        p.parser.mcuTelCs.next(data);
                                        
                                    });
                                }
                                break;
                        }
 

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


