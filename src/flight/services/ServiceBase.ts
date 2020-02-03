import { ModelTypes } from '../models/ModelBase';
import { ModelIdEnum } from '../models/ModelTypes';
import { IUseEvent } from '../Interfaces';
import { ModelServiceEventId, ModelServiceEvent } from './ModelService';
import { ValidationServiceEventId, ValidationServiceEvent } from './ValidationService';
import { RouterServiceEventEnumId, IRouterServiceEvent, RouterServiceEvent } from './RouterService';
import { DataSourceServiceEventId, DataSourceServiceEvent } from './DataSourceService';
import { SetEventSequence,  GetIdForService } from '../functions';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { Observable, of } from 'rxjs';
import { ConcealedSubject } from '../../utility/rx';
import { FlightDataServiceEventEnum } from '../DataService';
import { filter } from 'rxjs/operators';
export enum ServiceTypesEnumId {
    Modal = 1,
    Validator,
    Router,
    Data,
    Base
}
export interface IModelServiceEvent {
   
}
export interface IServiceEvent <TServiceEnum extends ServiceBaseEventIdTypes> extends IModelServiceEvent, IRouterServiceEvent {
    serviceId: ServiceTypesEnumId;
    timestamp?: number;
    nonce?: number;
    value?: ModelTypes;
    eventId: ServiceBaseEventIdTypes;
    modelId?: ModelIdEnum;
    success?: boolean;
    errors?: string[];
    sequence?: number;
    eventNum?: number;
    serviceEventNum?: number;
    dataSourceTypeId?: number;
}

export class ServiceEvent <TServiceEnum extends ServiceBaseEventIdTypes> implements IServiceEvent<TServiceEnum> {
    serviceId: ServiceTypesEnumId;
    timestamp?: number;
    nonce?: number;
    value?: ModelTypes;
    eventId: ServiceBaseEventIdTypes;
    modelId?: ModelIdEnum;
    success?: boolean;
    errors?: string[];
    sequence?: number;
    eventNum?: number;
    serviceEventNum?: number;
    dataSourceTypeId?: number;
}
export type ServiceBaseFilter<T extends IServiceEvent<ServiceBaseEventIdTypes>> = T
export type ServiceBaseEventIdTypes = ModelServiceEventId | ValidationServiceEventId | RouterServiceEventEnumId | DataSourceServiceEventId | FlightDataServiceEventEnum
export type ServiceBaseEventTypedClasses = ModelServiceEvent | ValidationServiceEvent | RouterServiceEvent | DataSourceServiceEvent 
export type ServiceBaseEventType = ServiceBaseFilter<ServiceBaseEventTypedClasses>;

export abstract class ServiceBase <TServiceEnum extends ServiceBaseEventIdTypes> {
    localEvents: Observable<ServiceBaseEventTypedClasses>;
    localErrors: Observable<ServiceBaseEventTypedClasses>;


    public get events(): Observable<ServiceBaseEventType> {
        return this.subject.observable;
    }



    protected processServiceEvent(value: ServiceBaseEventType, modelId: ModelIdEnum): ServiceBaseEventType {
        value = this.CreateServiceEvent(value,value.eventId as any, modelId);
        value.eventNum = GetIdForService(null);
        value.serviceEventNum = GetIdForService(this.serviceId);
        value.success = true;
        if (!!value.errors && value.errors.length) {
            value.success = false;
        }
        return _.cloneDeep(value);
    }
    protected createInputEvent(value: ServiceBaseEventType,eventId:TServiceEnum,  modelId: ModelIdEnum): ServiceBaseEventType {
        const input = this.CreateServiceEvent(value,eventId,modelId);
        return _.cloneDeep(input);
    }
    protected addErrorToServiceEvent(value: ServiceBaseEventType, msg: string): ServiceBaseEventType {
        return _.cloneDeep(this.AddServiceEventError(value, msg));
    }
    private CreateServiceEvent(event: ServiceBaseEventType, eventid:TServiceEnum, modelId: ModelIdEnum): ServiceBaseEventType {
        const result = _.cloneDeep(event) as ServiceBaseEventType
        result.modelId = modelId;
        result.eventId = eventid as any;
        result.success = undefined;
        result.serviceId = this.serviceId;
        return _.cloneDeep(result) ;
    }
    private AddServiceEventError(value: ServiceBaseEventType, msg: string): ServiceBaseEventType {
        if (!value.errors) {
            value.errors = [msg];
        }
        else {
            value.errors.push(msg);
        }
        return value;
    }
    constructor(public serviceId: ServiceTypesEnumId, public subject: ConcealedSubject<ServiceBaseEventType>) {
      if(subject) this.setLocalEvents();
    }
    protected setSubject(eventsSubject?: ConcealedSubject<ServiceBaseEventType>) {
        this.subject = this.subject || eventsSubject;
        this.setLocalEvents();
    }

    private setLocalEvents() {
        this.localEvents = this.subject.observable.pipe(filter(f => f.serviceId === this.serviceId && !!f.success));
        this.localErrors = this.subject.observable.pipe(filter(f => f.serviceId === this.serviceId && !f.success));
    }
}