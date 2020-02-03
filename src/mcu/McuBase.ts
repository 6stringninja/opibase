import { OPI_COMMAND_E } from "./McuSerialParser";
;
import { IDataProviderToEnum, IDataProviderFromEnum } from "../flight/DataProvider";
export abstract class McuBase implements IDataProviderFromEnum<OPI_COMMAND_E> {
    constructor(public   providerFrom: OPI_COMMAND_E){}
}
