import { OpiSerial } from "../server/Opi/OpiSerial";
import { OpiUartFunction } from "../server/Opi/OpiUartFunction";
export abstract class SerialParserBase<T> {
    abstract uartFunction: OpiUartFunction;
    protected abstract parseData(data: T);
    constructor(protected opiSerial: OpiSerial<T>) {
        this.opiSerial.data.subscribe((data) => {
            this.parseData(data);
        });
    }
}
