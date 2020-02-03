export class DataValidationError<T> {
    constructor(public key = '', public error = '', public data: T) {
    }
}
