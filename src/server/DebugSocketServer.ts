import { ServerClientState, ServerBase } from "../ServerBase";
import io from 'socket.io-client';
import { AppConfig } from "../config";
import { DataObservableBase, IDataObservableData, DataObservableType } from "../rx/DataObservableBase";

export enum DebugStateType{
    unknown = 0,
    message = 1
}
export enum DebugSeverityType{
    info,
    warn,
    error
}
export interface IDebugMsg{
    id:number;
    code?:string;
    severity:DebugSeverityType,
    message:string;
    extra?:any;
}
export class DebugMsg implements IDebugMsg,IDataObservableData{
    ts: number;
    dataType:  DataObservableType;
    public  id: number=0;
    constructor(
  public  message: string='',
 
   
  public  code?: string,
  public  severity: DebugSeverityType = DebugSeverityType.info,
  public  extra?: any){}



}
export class DebugState {
    msgs:DebugMsg[] = [];
}
export class DebugDataObservable extends DataObservableBase<DebugMsg,any>{
    constructor(){
        super(DataObservableType.debug)
    }
    protected newData(): DebugMsg {
        return new DebugMsg();
    }    
    protected map(dataToMap: any, newDate: DebugMsg): DebugMsg {
        const d = dataToMap as IDebugMsg;
        const ks = Object.keys(d);
        ks.forEach((f)=>{
            newDate[f] = d[f];
        })
        return newDate;
    }


}
export class DebugServerState extends ServerClientState<DebugState>{

    constructor(public socket: SocketIO.Socket){
        super(socket,()=> new DebugState());
    }
}
export class DebugServer extends ServerBase<DebugState,DebugServerState>{
    errors$ = new DebugDataObservable();
    constructor(){
        super((socket: SocketIO.Socket)=>{
            return this.getDebugServerState(socket);
        },42220)
    }
    private getDebugServerState(socket) {
        const prm = new Promise<DebugServerState>((r) => {
            r(new DebugServerState(socket));
        });
        return prm;
    }
   
  
    init(): void {
       // throw new Error("Method not implemented.");
    }    
    connect(state: DebugServerState): Promise<void> {
        this.errors$.observable.subscribe(s=> {
            state.state.msgs.push(s);
              state.socket.emit("debugmsgout", s);
        });
        //throw new Error("Method not implemented.");
        return;
    }
    initClientMessages(state: DebugServerState): Promise<void> {
       

        state.socket.on("debugmsgin", (m)=>{
            this.errors$.sendAndMap(m);

        })
        return;
    }
    disconnect(state: DebugServerState): Promise<void> {
        throw new Error("Method not implemented.");
    }



 
}

 
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
},1000)

const ts = new DebugServer();

setTimeout(()=>{
    ts.errors$.send(new DebugMsg("sent 2000"));
},2000)