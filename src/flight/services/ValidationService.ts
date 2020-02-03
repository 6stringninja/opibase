import { ConcealedSubject } from '../../utility/rx';

import { ModelIdEnum } from '../models/ModelTypes';
import { GetAllEnumVals } from '../../utility/Bitwise/enum-functions';
import { SetEventSequence } from '../functions';
import { ServiceEvent, ServiceBase, ServiceTypesEnumId } from './ServiceBase';
import { ValidationRuleTypes, GetAllRules } from '../validation/ValidationRules';
export enum ValidationServiceEventId {
    Validate = 200
}
export class ValidationServiceEvent extends ServiceEvent<ValidationServiceEventId> { }

export type ValidationServiceTypes = ValidationServiceEvent;

export class ValidationService extends ServiceBase<ValidationServiceEventId> {
    private _rules: ValidationRuleTypes[] = [];
    protected get rules(): ValidationRuleTypes[] {
        return this._rules;
    }
    protected set rules(value: ValidationRuleTypes[]) {
        this._rules = value;
    }
    protected validModelIds: number[];

    private validateInput(value: ValidationServiceEvent): ValidationServiceEvent {
        let event = value as ValidationServiceEvent;
        if (!this.validModelIds.some(s => s === event.modelId)) {
            event = this.addErrorToServiceEvent(event, `Invalid modelId ${event.modelId}`);;
        }
        return event;
    }

    private getRule(value: ValidationServiceEvent): ValidationRuleTypes {
        return this.rules.find(f => f.modelId === value.modelId);
    }

    private validate(value: ValidationServiceEvent): ValidationServiceEvent {
        let event = this.validateInput(value);
        if (event.errors) {
            return this.processServiceEvent(value, value.modelId)
        }
        try {
            if (event.value.invalidate) {
                event = this.addErrorToServiceEvent(event, "invalidated error")
            }

            const rule = this.getRule(value).validate(event.value as any, event);
            event = this.processServiceEvent(rule, rule.modelId);
        } catch (error) {

            event = this.addErrorToServiceEvent(event, error.Message || error.message || "internal error occured");
            event = this.processServiceEvent(event, event.modelId);

        }
        SetEventSequence(event);
        this.subject.next(event);
        return event;
    }
    public send(value: ValidationServiceEvent) {
        switch (value.eventId) {
            case (ValidationServiceEventId.Validate): {

                const r = this.processServiceEvent(this.validate(value), value.modelId);
                SetEventSequence(r);
                this.subject.next(r);
                return r;
            }
            default: {
                let event = this.processServiceEvent(this.validate(value), value.modelId);
                event = this.addErrorToServiceEvent(event, "Invalid Event")
                SetEventSequence(event);
                this.subject.next(event);
                return event;
            }
        }
    }
    constructor(
         subject: ConcealedSubject<ValidationServiceEvent>
    ) {
        super(ServiceTypesEnumId.Validator,subject)
        this.rules = GetAllRules();
        this.validModelIds = GetAllEnumVals(ModelIdEnum).map(m => Number(m));
    }
}
