import { McuBase } from "./McuBase";
import { OPI_COMMAND_E } from "./McuSerialParser";

 

export class McuBaroAltitude extends McuBase {
    constructor(public altitude = 0, public measuredPressure = 0, public tempature = 0, public timeStamp = 0) {
        super(OPI_COMMAND_E.OPI_COMMAND_DEVICE_BARO);
    }
}
