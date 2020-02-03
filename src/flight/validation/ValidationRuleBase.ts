import { ModelIdEnum, ModelIdEnumReturnTypes } from '../models/ModelTypes';
import { ValidationServiceEvent, ValidationService } from '../services/ValidationService';

export abstract class ValidationRuleBase<T extends ModelIdEnum> {
   constructor(public modelId: ModelIdEnum) {
   }
   addError(value: ValidationServiceEvent | ValidationServiceEvent, msg: string): ValidationServiceEvent {
     
      if (!value.errors) {
         value.errors = [msg];
     }
     else {
         value.errors.push(msg);
     }
     return value;
   }
   abstract validate(value: ModelIdEnumReturnTypes[T], event: ValidationServiceEvent): ValidationServiceEvent;


}
