import { FlightDataProviderType, FlightDataProviderBase, FlightDataTypes } from "./flight";
import { SimDataEnum } from "./SimDataEnum";
import { FlightDataProviderContainer } from "./DataProviderContainer";
import { SimDataImu } from "./SimDataImu";
import { DataProviderBase } from "./DataProviderBase";
export type SimDataTypes = SimDataImu;
export class FlightDataProviderFromSimContainer extends FlightDataProviderContainer<SimDataEnum, SimDataTypes> {
    constructor() { super(FlightDataProviderType.Sim); }
}

const g = new  FlightDataProviderFromSimContainer();

export class DataProviderSimBase extends FlightDataProviderBase<SimDataEnum,SimDataTypes> {
    convert(i: SimDataImu): FlightDataTypes {
        throw new Error("Method not implemented.");
    }
    constructor(){
        super(FlightDataProviderType.Sim,this.toType,fromType);
    }
}