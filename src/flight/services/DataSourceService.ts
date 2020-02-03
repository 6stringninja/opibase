import { ModelIdEnum } from '../models/ModelTypes';
import { ConcealedSubject } from '../../utility/rx';
import { ModelTypes } from '../models/ModelBase';
import { SetEventSequence } from '../functions';
import { isNullOrUndefined } from 'util';
import { ServiceEvent, ServiceBase, ServiceTypesEnumId } from './ServiceBase';
import { FlightDataServiceEventEnum } from '../DataService';
export enum DataSourceTypeEnum {
    Unknown,
    Testing,
    Base,
    Serial
}
export enum DataSourceServiceEventId {
    Request = 400,
    Response,
    Post
}
export interface IDatSourceSettings{
    dataSourceTypeId: DataSourceTypeEnum;
     requestable: ModelIdEnum[];
      postable: ModelIdEnum[];
}
export class DatSourceSettings implements IDatSourceSettings{
    constructor(
   public dataSourceTypeId: DataSourceTypeEnum,
    public requestable: ModelIdEnum[],
     public postable: ModelIdEnum[]
     ){
        
    }
}
export class DataSourceServiceEvent extends ServiceEvent<DataSourceServiceEventId> { }
export type DataSourceServiceTypes = DataSourceServiceEvent;
export abstract class DataSourceService<TSettings extends IDatSourceSettings> extends ServiceBase<DataSourceServiceEventId>{
    init(subject: ConcealedSubject<ServiceEvent<FlightDataServiceEventEnum>>) {
        super.setSubject(subject);
    }
   
    protected eventSubject = new ConcealedSubject<DataSourceServiceTypes>();
    protected responseSubject = new ConcealedSubject<DataSourceServiceTypes>();
    responses = this.responseSubject.observable;
    protected postsSubject = new ConcealedSubject<DataSourceServiceTypes>();
    posts = this.postsSubject.observable;
    protected createEvent(dt: DataSourceServiceTypes, e?: DataSourceServiceEventId) {
        dt.dataSourceTypeId = e;
        let event = this.processServiceEvent(dt, dt.modelId)
        SetEventSequence(event);
        return event;
    }
    // from service requesting data from source
    request(id: ModelIdEnum, nonce?: number): Promise<DataSourceServiceTypes> {
        const input = this.createInputEvent(new DataSourceServiceEvent(), DataSourceServiceEventId.Request, id);
        if (!isNullOrUndefined(nonce)) {
            input.nonce = nonce;
        }
        if (this.setting.requestable.some(s => s === id)) {
            return this.requestInternal(input);
        } else {
            return new Promise<DataSourceServiceTypes>(
                (r) => {
                    r(
                        this.addErrorToServiceEvent(input, "invalid requestable"));
                }
            )
        }

    }
    // source posts unsolicted to service
    post(v: ModelTypes) {
       
        let event = new DataSourceServiceEvent();
        event.value = v;
        event = this.createEvent(event , DataSourceServiceEventId.Post);
        event.modelId = (event.value).modelId;
        const res = this.postInternal(event);
        if (this.setting.postable.some(s => s === res.modelId)) {
          
            this.postsSubject.next(res);
        }
    }
    protected abstract requestInternal(input: DataSourceServiceTypes): Promise<DataSourceServiceTypes>;
    protected abstract postInternal(input: DataSourceServiceTypes): DataSourceServiceTypes;
    constructor(public setting:TSettings, subject: ConcealedSubject<DataSourceServiceEvent>) {
        super(ServiceTypesEnumId.Data, subject)
    }
}

