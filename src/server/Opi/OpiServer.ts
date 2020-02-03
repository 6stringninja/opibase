import { ServerBase, ServerClientState } from "../../ServerBase";
import { DebugDataObservable, DebugMsg, DebugSeverityType } from "../DebugSocketServer";
 
import { ConcealedBehaviorSubject } from "../../rx/ConcealedBehaviorSubject";
import { OptPlatform } from "./OptPlatform";
import { OpiSerialPorts } from "./OpiSerialPorts";
import { McuSerialParser, OPI_COMMAND_E } from "../../mcu/McuSerialParser";
import { McuSerialRequestProcessor } from "../../mcu/McuSerialRequestProcessor";
import { configApp } from "../..";
import os from "os";
import { OpiUartFunction } from "./OpiUartFunction";
import { IConfigHost } from "../../config/IConfig";
import { interval } from "rxjs";
import SerialPort from "serialport";
import { McuSerialResponseProcessor } from "../../mcu/McuSerialResponseProcessor";
import { Subscription } from "rxjs";
export class OpiClientState {
    msgs: DebugMsg[] = [];
}
export class OpiServerState extends ServerClientState<OpiClientState>{

    constructor(public socket: SocketIO.Socket) {
        super(socket, () => new OpiClientState());
    }
}
export class OpiWebSocketServe extends ServerBase<OpiClientState, OpiServerState>  {
    optPlatform: OptPlatform;
    configHost: IConfigHost;
    gcInterval: any;
    opiSerialPorts: OpiSerialPorts;
    mcuPort: import("c:/Users/Douglas.Reuter/Documents/GitHub/opibase/src/server/Opi/OpiSerial").OpiSerial<any>;
    mcuSerialParser: McuSerialParser;
    mcuResp: McuSerialResponseProcessor;
    init(): void {
        this.optPlatform = new OptPlatform();
        const hostName = os.hostname();
        const platform = os.platform();
        this.optPlatform.hostname = hostName;
        this.optPlatform.platform = platform;
        this.configHost = configApp.hosts.find(f => f.platform.toLowerCase() === platform.toLowerCase());
        if (! this.configHost) {
            this.configHost = configApp.hosts.find(f => f.platform === "Linux");
        }
        this.optPlatform.mcuUart =  this.configHost.uarts.find(s => s.portFunction === OpiUartFunction.MCU.toString() && s.enabled);
        this.optPlatform.gpsUart =  this.configHost.uarts.find(s => s.portFunction === OpiUartFunction.GPS.toString() && s.enabled);
        this.optPlatform.telsUart =  this.configHost.uarts.find(s => s.portFunction === OpiUartFunction.TEL.toString() && s.enabled);
        this.optPlatform.dbgUart =  this.configHost.uarts.find(s => s.portFunction === OpiUartFunction.DBG.toString() && s.enabled);
        this.gcInterval = interval(1000);
        //output: 0,1,2,3,4,5....
         this.gcInterval.subscribe(val => {   
          global.gc();
        });
        SerialPort.list().then((port) => {
            console.log({}); 
            console.log("Port: ", port);
            console.log({ platform, hostName });
            this.optPlatform.ports = port;
            console.log({ mcu: this.optPlatform.hasMcu, gps: this.optPlatform.hasGps, tel: this.optPlatform.hasTel,dbug:this.optPlatform.hasDbg });
       
            this.opiSerialPorts = new OpiSerialPorts(this.optPlatform);
            this.mcuPort = this.opiSerialPorts.ports.find(f=> f.uartType===OpiUartFunction.MCU && f.enabled);
            const debugPort = this.opiSerialPorts.ports.find(f=> f.uartType===OpiUartFunction.DBG && f.enabled);
        
            this.mcuSerialParser = new McuSerialParser(this.mcuPort? this.mcuPort.port : null);
           
            this.mcuResp = new McuSerialResponseProcessor(this.mcuSerialParser.rawCommands$);
       
        });
    }    
    connect(state: OpiServerState): Promise<void> {
        this.mcuResp.crbs.arry.forEach(f=>{
            
            const sub =     f.observable.subscribe(s=>{
                if(!!s){
                    state.socket.emit(`chan${OPI_COMMAND_E[f.enumVal]}`,s);
                }
                    
                 })
                 this.subs.push(sub);
             })
     return;
    }
    subs:Subscription[]=[];
    initClientMessages(state: OpiServerState): Promise<void> {
     
        return;
       
    }
    disconnect(state: OpiServerState): Promise<void> {
        this.subs.forEach(s=>s.unsubscribe());
    return;
    }


}
export class OpiServer extends ServerBase<OpiClientState, OpiServerState> {
    errors$ = new DebugDataObservable();
    opiSerialPorts: OpiSerialPorts;
    McuSerialRequestProcessor: McuSerialRequestProcessor;
  
    constructor(public optPlatform: OptPlatform) {
        super((socket: SocketIO.Socket) => {
            return this.getServerState(socket);
        }, 42220);
       this.opiSerialPorts = new OpiSerialPorts(optPlatform);
      // const mcup = new McuSerialParser()
     // this.McuSerialRequestProcessor = new McuSerialRequestProcessor(this.opiSerialPorts);
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


