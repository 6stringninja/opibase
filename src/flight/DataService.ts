import { ModelIdEnum, ModelIdEnumReturnTypes } from './models/ModelTypes';
import { ModelTypes } from './models/ModelBase';
import { ModelService, ModelServiceEventId } from './services/ModelService';
import { ServiceEvent, ServiceTypesEnumId, ServiceBase } from "./services/ServiceBase";
import { ValidationService, ValidationServiceEventId, ValidationServiceEvent } from './services/ValidationService';
import { GetModels } from './functions';

import _ from 'lodash';
import { RouterServiceEventEnumId, RouterServiceEvent, RouterService } from './services/RouterService';
import { ConcealedSubject } from '../utility/rx';
import { Observable, Subscription } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators'
import { DataSourceServiceEventId, DataSourceService, DatSourceSettings } from './services/DataSourceService';
import { IFlightData } from './IFlightData';
import { ModelAttitude } from './models/ModelAttitude';
import { ModelRcControl } from './models/ModelRcControl';
import { ModelGPS } from './models/ModelGPS';
import { ModelSettings } from './models/ModelSettings';
import { ModelMotors } from './models/ModelMotors';
import { ModelServos } from './models/ModelServos';


export enum FlightDataServiceEventEnum {
    ModelServiceRead = ModelServiceEventId.Read,
    ModelServiceWrite = ModelServiceEventId.Write,
    ModelServiceChange = ModelServiceEventId.Change,
    ValidationService = ValidationServiceEventId.Validate,
    RouterServiceRequest = RouterServiceEventEnumId.Request,
    RouterServiceResponse = RouterServiceEventEnumId.Response,
    RouterServicePost = RouterServiceEventEnumId.Post,
    DatSourceServiceRequest = DataSourceServiceEventId.Request,
    DatSourceServiceReesponse = DataSourceServiceEventId.Response,
    DatSourceServicePost = DataSourceServiceEventId.Post
}



export abstract class FlightDataServiceBase extends ServiceBase<FlightDataServiceEventEnum> {

    private data: ModelTypes[];
    private models: ModelService;
    private validation: ValidationService;
    private router: RouterService;
    events: Observable<ServiceEvent<FlightDataServiceEventEnum>>;

    protected dataChange: Observable<ModelTypes>;
    protected errorLog: Observable<string>;
    protected validatedModels: Observable<ModelTypes>;

    write(v: ModelTypes) {
        const input = this.createInputEvent(new ValidationServiceEvent(), FlightDataServiceEventEnum.ValidationService, v.modelId);
        input.value = v;
        this.validation.send(input);
    }
    read<K extends ModelIdEnum>(value: K): ModelIdEnumReturnTypes[K] {
        return _.cloneDeep( this.data[value] as ModelIdEnumReturnTypes[K]);
    }
    request<K extends ModelIdEnum>(value: K) {
        const req = new RouterServiceEvent();
        req.eventId = FlightDataServiceEventEnum.RouterServiceRequest as any;
        req.modelId = value;
        this.router.request(req).then();
    }
    private dataChangeSubscriptions: Subscription[] = [];
    on(modelId: ModelIdEnum, cb = (v:ModelTypes) => { return }) {
        this.dataChangeSubscriptions.push(this.dataChange.pipe(filter(f => f.modelId === modelId)).subscribe(cb));
    }
    constructor(
        dataSources: DataSourceService<DatSourceSettings>[] = []
    ) {
        super(ServiceTypesEnumId.Base, new ConcealedSubject<ServiceEvent<FlightDataServiceEventEnum>>());

        this.models = new ModelService(this.subject);
        this.validation = new ValidationService(this.subject);
        this.router = new RouterService(this.subject, dataSources);


        //assign defaults
        this.data = GetModels();
        this.setDataChangeObservable();
        this.setErrorMessagesObservable();
        this.setValidatedModelsObservable();
        this.callModelWritesOnValidatedModels();
        this.setDataToModelChangeValues();
        this.router.localEvents.pipe(filter(f => {
            return f.eventId === FlightDataServiceEventEnum.RouterServicePost
        })).subscribe(v => {
            v = this.createInputEvent(v, FlightDataServiceEventEnum.ValidationService, v.modelId);
            v = this.processServiceEvent(v, v.modelId);
            this.validation.send(v);
        })

        // set local to model changes

    };


    private setDataToModelChangeValues() {
        this.models.localEvents.pipe(filter(f => f.eventId === FlightDataServiceEventEnum.ModelServiceChange)).subscribe(s => this.data[s.modelId] = s.value);
    }

    private callModelWritesOnValidatedModels() {
        this.validatedModels.subscribe(s => {
            this.models.write(s as any);
        });
    }

    private setValidatedModelsObservable() {
        this.validatedModels = this.validation.localEvents
            .pipe(filter(f => f.eventId === ValidationServiceEventId.Validate),
                map(m => m.value));
    }

    private setErrorMessagesObservable() {
        this.errorLog = this.events.pipe(filter(f => {
            return !f.success && f.errors && f.errors.length > 0;
        }), mergeMap(m => m.errors.map(() => `serviceId${m.serviceId}${m.serviceId === ServiceTypesEnumId.Data ? ' dataSourceTypeId'.concat(m.dataSourceTypeId.toString()) : ''}  eventId${m.eventId}  modelId ${m.modelId} `)));
    }

    private setDataChangeObservable() {
        this.dataChange = this.events.pipe(filter(f => {
            return f.serviceId === ServiceTypesEnumId.Modal && f.eventId === FlightDataServiceEventEnum.ModelServiceChange;
        }), map(m => m.value));
    }
}

export class FlightDataService extends FlightDataServiceBase implements IFlightData {
   get Altitude(){
      return  this.read(ModelIdEnum.Altitude);
   }
    public get Attitude(): ModelAttitude {
        return this.read(ModelIdEnum.Attitude);
    }
     
    public get RcControl(): ModelRcControl {
        return this.read(ModelIdEnum.RcControl);
    }
   
    public get GPS(): ModelGPS {
        return this.read(ModelIdEnum.GPS);
    }

    public get Settings(): ModelSettings {
        return this.read(ModelIdEnum.Settings);
    }
    public set Settings(value: ModelSettings) {
        this.write(value);
    }
    public get Motors(): ModelMotors {
        return this.read(ModelIdEnum.Motors);
    }
    public set Motors(value: ModelMotors) {
        this.write(value);
    }
    public get Servos(): ModelServos {
        return  this.read(ModelIdEnum.Servos);
    }
    public set Servos(value: ModelServos) {
        this.write(value);
    }
}

