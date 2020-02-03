import { DataValidationError } from "./DataValidationError";
import { DataValidatorResult } from "./DataValidatorResult";
import { FlightDataTypes } from "./flight";
import { ConcealedSubject } from "../rx/ConcealedSubject";
export const DataValidationErrorsCs = new ConcealedSubject<DataValidationError<FlightDataTypes>>();
export const DataVaidationErrors$ = DataValidationErrorsCs.observable;
export class DataValidator<T extends FlightDataTypes> {
    constructor(private name: string, private validator = (v: T, e: string): DataValidatorResult<T> => null) {
    }
    validate(newItem: T, existing: T, isvalid: boolean): T {
        let e = '';
        const rslt = this.validator(newItem, e);
        if (rslt.isValid) {
            return newItem;
        }
        else {
            DataValidationErrorsCs.next(new DataValidationError(this.name, rslt.error, newItem));
            return existing;
        }
    }
}
