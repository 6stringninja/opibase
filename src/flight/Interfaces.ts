
import { ModelIdEnum } from './models/ModelTypes';
 

export interface IIdTimeStamp{
    id:number;
 
    timestamp:number;
}

export interface IUseTimestamp{
    timestamp:number;
}
export interface IUseModelId {
    modelId:ModelIdEnum;
    invalidate?:number;
    
}
export interface IUseEvent{
    eventId:any;
    sequence?:number;
  }