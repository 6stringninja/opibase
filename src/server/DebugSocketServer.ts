import { ServerClientState } from "../ServerBase";
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

