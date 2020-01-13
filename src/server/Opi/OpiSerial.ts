import SerialPort = require("serialport");
import { IConfigUart } from "../../config/IConfig";
import { IConcealedSubject } from "../../rx/ConcealedSubject";
import { Observable } from "rxjs";
import { OpiUartFunction } from "./OpiUartFunction";
export class OpiSerial<T> {
    port?: SerialPort;
    parser?: any;
    private _rawDataCs: IConcealedSubject<T>;
    public get rawDataCs(): IConcealedSubject<T> {
        return this._rawDataCs;
    }
    public set rawDataCs(value: IConcealedSubject<T>) {
        this._rawDataCs = value;
    }
    public get data(): Observable<T> {
        return this.rawDataCs.observable;
    }
    constructor(public uartType: OpiUartFunction, public enabled: boolean, public config?: IConfigUart) {
    }
}
