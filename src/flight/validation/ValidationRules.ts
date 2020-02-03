import { ModelIdEnum, ModelIdEnumReturnTypes } from '../models/ModelTypes';
import { ModelGPS } from '../models/ModelGPS';
import { ValidationRuleBase } from "./ValidationRuleBase";
import { ModelAttitude } from '../models/ModelAttitude';
import { ModelMotors } from '../models/ModelMotors';
import { ModelRcControl } from '../models/ModelRcControl';
import { ModelServos } from '../models/ModelServos';
import { ModelSettings } from '../models/ModelSettings';
import { ModelTypes } from '../models/ModelBase';
import { GetAllEnumVals, GetAllEnumNames } from '../../utility/Bitwise/enum-functions';
import { ModelAltitude } from '../models/ModelAltitude';
import { ValidationServiceEvent } from '../services/ValidationService';

export class ValidationRuleGPS extends ValidationRuleBase<ModelIdEnum.GPS> {
    validate(value: ModelGPS, event: ValidationServiceEvent): ValidationServiceEvent {
        return event;
    }


    constructor() {
        super(ModelIdEnum.GPS);
    }
}
export class ValidationRuleAltitude extends ValidationRuleBase<ModelIdEnum.Altitude> {
    validate(value: ModelAltitude, event: ValidationServiceEvent): ValidationServiceEvent {
        if (value.meters < -100) {
            this.addError(event, 'Meters is less than -100');
        }
        return event;
    }
    constructor() {
        super(ModelIdEnum.Altitude);
    }
}

export class ValidationRuleAttitude extends ValidationRuleBase<ModelIdEnum.Attitude> {
    validate(value: ModelAttitude, event: ValidationServiceEvent): ValidationServiceEvent {
        return event;
    }

    constructor() {
        super(ModelIdEnum.Attitude);
    }
}
export class ValidationRuleMotors extends ValidationRuleBase<ModelIdEnum.Motors> {
    validate(value: ModelMotors, event: ValidationServiceEvent): ValidationServiceEvent {
        return event;
    }

    constructor() {
        super(ModelIdEnum.Motors);
    }
}
export class ValidationRuleRcControl extends ValidationRuleBase<ModelIdEnum.RcControl> {
    validate(value: ModelRcControl, event: ValidationServiceEvent): ValidationServiceEvent {
        return event;
    }


    constructor() {
        super(ModelIdEnum.RcControl);
    }
}
export class ValidationRuleServos extends ValidationRuleBase<ModelIdEnum.Servos> {
    validate(value: ModelServos, event: ValidationServiceEvent): ValidationServiceEvent {
        return event;
    }


    constructor() {
        super(ModelIdEnum.Servos);
    }
}
export class ValidationRuleSettings extends ValidationRuleBase<ModelIdEnum.Settings> {
    validate(value: ModelSettings, event: ValidationServiceEvent): ValidationServiceEvent {
        return event;
    }


    constructor() {
        super(ModelIdEnum.Settings);
    }
}
export function GetAllRules() {
    const ValidationRules: ValidationRuleTypes[] = [
        new ValidationRuleAltitude(),
        new ValidationRuleAttitude(),
        new ValidationRuleGPS(),
        new ValidationRuleMotors(),
        new ValidationRuleRcControl(),
        new ValidationRuleServos(),
        new ValidationRuleSettings()
    ];
    GetAllEnumVals(ModelIdEnum).forEach(e => {
        if (!ValidationRules.find(f => f.modelId === e)) {
            throw new Error(`Missing ${GetAllEnumNames(ModelIdEnum).find(ff => e)} in getAllRules -> ValidationRules`)
        }
    })
    return ValidationRules
}
export type ValidationRuleTypes = ValidationRuleAltitude | ValidationRuleAttitude | ValidationRuleGPS | ValidationRuleMotors | ValidationRuleRcControl | ValidationRuleServos | ValidationRuleSettings
export const ValidationRulesDefaults = GetAllRules();