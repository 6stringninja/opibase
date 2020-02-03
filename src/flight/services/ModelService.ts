import { GetModels } from '../functions';
import { ModelTypes } from '../models/ModelBase';
import { GetAllEnumNames } from '../../utility/Bitwise/enum-functions';
import { ModelIdEnum, ModelIdEnumReturnTypes } from '../models/ModelTypes';
import _ from 'lodash';
import { ConcealedSubject, ConcealedBehaviorSubject } from '../../utility/rx';
import { ServiceEvent, ServiceBase, ServiceTypesEnumId, ServiceBaseEventIdTypes } from './ServiceBase';

export enum ModelServiceEventId {
    Read = 100,
    Write,
    Change
}
export class ModelServiceEvent extends ServiceEvent<ModelServiceEventId>{ }
export class ModelService extends ServiceBase<ModelServiceEventId> {

    protected models: ModelTypes[];
    protected names: string[];
    protected values: ModelTypes[];
    protected nameOf(m: ModelTypes) {
        return this.names[Number(m.modelId)];
    }
    protected copyModel(v: ModelTypes): ModelTypes {
        return _.cloneDeep(v);
    }

    constructor(
        subject?: ConcealedSubject<ServiceEvent<ServiceBaseEventIdTypes>>
    ) {
        super(ServiceTypesEnumId.Modal, subject as any);

        this.models = GetModels();
        this.values = this.models.map(m => this.copyModel(m));
        this.names = GetAllEnumNames(ModelIdEnum);
    }

    read<K extends ModelIdEnum>(modelId: K): ModelIdEnumReturnTypes[K] {
        let event = this.createInputEvent(undefined, ModelServiceEventId.Read, modelId);
        event.value as ModelIdEnumReturnTypes[K];
        this.readValue(event);
        event = this.processServiceEvent(event, modelId);
        this.subject.next(event);
        return
    }
    protected readValue(result: ModelServiceEvent): ModelServiceEvent {

        try {
            result.value = this.copyModel(this.values.find(f => f.modelId === result.modelId));
            if (!!result.value) {
                result.success = true;
            }
            result.success = true;

        } catch (error) {
            result.success = false;

        }
        return result;

    }
    write<K extends ModelIdEnum>(input: ModelIdEnumReturnTypes[K]): boolean {
        let result = this.createInputEvent(new ModelServiceEvent(), ModelServiceEventId.Write, input.modelId);
        try {
            if (!!input.invalidate) {
                throw new Error('invalidated model type')
            }
            result.value = _.cloneDeep(input);
            return this.writeValue(result).success

        } catch (error) {

            return false;
        }
    }
    protected writeValue(event: ModelServiceEvent): ModelServiceEvent {

        try {
            let result = this.values.findIndex(f => f.modelId === event.modelId);
            if (result < 0) {
                throw new Error("model not found")
            }

            this.values[result] = this.copyModel(event.value);

            event = this.processServiceEvent(event, event.value.modelId);


        } catch (error) {
            console.log(error)
            event = this.addErrorToServiceEvent(event, JSON.stringify(error));
            event.success = false;
        }

        this.subject.next(event);
        if (event.success) {
            let dataChangeEvent = _.cloneDeep(event);
            dataChangeEvent = this.processServiceEvent(
                this.createInputEvent(dataChangeEvent, ModelServiceEventId.Change, dataChangeEvent.modelId),
                dataChangeEvent.modelId);
            this.subject.next(dataChangeEvent);
        }
        return _.cloneDeep(event);
    }
}


