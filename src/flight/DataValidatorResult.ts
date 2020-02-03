import { FlightDataTypes } from "./flight";
export class DataValidatorResult<T extends FlightDataTypes> {
    constructor(public result: T, public isValid: boolean, public error = '') {
    }
}
