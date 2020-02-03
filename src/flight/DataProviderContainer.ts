import { DataProviderBase } from "./DataProviderBase";
import { IDataproviderType } from "./IDataproviderType";
import { FlightDataProviderType, FlightDataType, FlightDataTypes } from "./flight";
import { OPI_COMMAND_E } from "../mcu/McuSerialParser";
import { McuConvertableResponsTypes } from "../mcu/McuSerialResponseProcessor";
import { SimDataImu } from "./SimDataImu";

export class DataProviderContainer<TFromEnum, TFromType extends IDataproviderType<TFromEnum>, TToEnum, TToType, TDataProviderEnum> {
    constructor( public dataProviderType: TDataProviderEnum) {
    }
    private data: DataProviderBase<TFromEnum, TFromType, TToEnum, TToEnum, TDataProviderEnum>[] = [];
    add(provider: DataProviderBase<TFromEnum, TFromType, TToEnum, TToEnum, TDataProviderEnum>) {
        if(this.dataProviderType !== provider.providerType){
            throw new Error("Wrong type of provider attmpeted to be added");
        }
        if (this.find(provider)) {
            throw new Error(`Provider already contains definition for ${JSON.stringify(provider)}`);
        }

        this.data.push(provider);
    }
    get(from: TFromEnum, to: TToEnum) {
        return this.data.find(f => f.fromType == from && f.toType == to && f.providerType == this.dataProviderType);
    }
    private find(provider: DataProviderBase<TFromEnum, TFromType, TToEnum, TToEnum, TDataProviderEnum>) {
        return this.data.find(f => f.fromType === provider.fromType && f.toType === provider.toType && f.providerType == this.dataProviderType);
    }
}
export class FlightDataProviderContainer<TFromEnum, TFromType extends IDataproviderType<TFromEnum>> extends 
DataProviderContainer<TFromEnum,TFromType,FlightDataType,FlightDataTypes,FlightDataProviderType>{
    
}
export class FlightDataProviderFromMcuContainer extends FlightDataProviderContainer<OPI_COMMAND_E,McuConvertableResponsTypes>{
    constructor(){super(FlightDataProviderType.Mcu)}
}


export class FlightDataProviderFromTestContainer extends FlightDataProviderContainer<OPI_COMMAND_E,McuConvertableResponsTypes>{
    constructor(){super(FlightDataProviderType.Test)}
}
 
