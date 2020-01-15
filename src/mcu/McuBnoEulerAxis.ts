export class McuBnoEulerAxis {
    constructor(public data: number[] = [0, 0, 0], public timeStamp = 0) {
    }
    get X() {
        return this.data[0];
    }
    get Y() {
        return this.data[1];
    }
    get Z() {
        return this.data[2];
    }
}
