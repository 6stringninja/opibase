import { BehaviorSubject, Observable, Subject, from } from "rxjs";
import { OPI_COMMAND_E } from "../mcu/McuSerialParser";
import { McuResponseType } from "../mcu/McuSerialResponseProcessor";
import { McuImuVector } from "../mcu/McuImuVector";

export interface IDataProviderToEnum<T> {
    providerTo: T;
}
export interface IDataProviderFromEnum<T> {
    providerFrom: T;
}
export interface IDataProviderToFlightType extends IDataProviderToEnum<FlightDataType> { }
export interface IDataProviderFromMcuFlightType extends IDataProviderFromEnum<OPI_COMMAND_E> { }
export interface IDataProvider
    <
    TDataProviderEnum,
    TFromEnum,
    TFromTypes extends IDataProviderFromEnum<TFromEnum>,
    TToEnum,
    TToTypes extends IDataProviderToEnum<TToEnum>
    > {
    dataProvider: TDataProviderEnum;
    behavior: BehaviorSubject<TToTypes>;
    observable: Observable<TToTypes>;
    subject: Subject<TToTypes>;
    fromEnum: TFromEnum;
    toEnum: TToEnum;
    lastUpdate: TToTypes;
    update(newItem: TFromTypes): TToTypes;
    validate(newItem: TFromTypes): boolean;
}
export abstract class DataProv<
    TDataProviderEnum,
    TFromEnum,
    TFromTypes extends IDataProviderFromEnum<TFromEnum>,
    TToEnum,
    TToTypes extends IDataProviderToEnum<TToEnum>
    >
    implements IDataProvider
    <
    TDataProviderEnum,
    TFromEnum,
    TFromTypes,
    TToEnum,
    TToTypes
    >{

    abstract behavior: BehaviorSubject<TToTypes>;
    abstract observable: Observable<TToTypes>;
    abstract subject: Subject<TToTypes>;

    abstract lastUpdate: TToTypes;
    abstract update(newItem: TFromTypes): TToTypes
    abstract validate(newItem: TFromTypes): boolean;
    constructor(
        public readonly dataProvider: TDataProviderEnum,
        public readonly fromEnum: TFromEnum,
        public readonly toEnum: TToEnum
    ) { }
}
export enum FlightDataProviderType {
    Test,
    Mcu,
    Sim
}
export abstract class FlightDataProv<TFrom extends FlightDataTypesFilteredFrom, TTo extends FlightDataTypesFilteredTo>

    extends DataProv
    <
    FlightDataProviderType,
    OPI_COMMAND_E,
    FlightDataTypesFilteredFrom,
    FlightDataType,
    FlightDataTypesFilteredTo
    >
{

    behavior: BehaviorSubject<TTo>;
    observable: Observable<TTo>;
    subject: Subject<TTo>;

    lastUpdate: TTo;

    constructor(

        fromEnum: OPI_COMMAND_E,
        toEnum: FlightDataType,
        dataProvider: FlightDataProviderType,
    ) {
        super(dataProvider, fromEnum, toEnum)
    }

}
export enum FlightDataType {
    Attitude,
    Altitude,
    Controls
}

export interface IFlightBase extends IDataProviderToFlightType {
    timestamp: number;

}
export abstract class FlightDataBase implements IFlightBase {
    constructor(public providerTo: FlightDataType) { }
    timestamp = 0;

}
export class FlightDataAttitude extends FlightDataBase {

    constructor(
        public roll = 0,
        public pitch = 0,
        public yaw = 0,
    ) {
        super(FlightDataType.Attitude);
    }
}
export class FlightDataAltitude extends FlightDataBase {

    groundAltitudeInMeter = 0;
    get meters() {
        return this.rawAltitudeInMeters - this.groundAltitudeInMeter;
    }
    constructor(
        public rawAltitudeInMeters = 0
    ) {
        super(FlightDataType.Altitude);
    }
}
export class FlightDataControls extends FlightDataBase {

    constructor(
        public throttle = 970,
        public rudder = 1500,
        public elevator = 1500,
        public ailerons = 1500
    ) {
        super(FlightDataType.Controls);
    }
}
export type FlightDataTypes = FlightDataAltitude | FlightDataAttitude | FlightDataControls
export type FlightDataTypeFilterTo<T> = T extends IDataProviderToFlightType ? T : never;
export type FlightDataTypeFilterFrom<T> = T extends IDataProviderFromMcuFlightType ? T : never;
export type FlightDataTypesFilteredTo = FlightDataTypeFilterTo<FlightDataTypes>;
export type FlightDataTypesFilteredFrom = FlightDataTypeFilterFrom<McuResponseType>;

export abstract class FlightDataProviderMcu<TFrom extends FlightDataTypesFilteredFrom, TTo extends FlightDataTypesFilteredTo>
    extends FlightDataProv<TFrom, TTo>
{
    constructor(f: OPI_COMMAND_E, o: FlightDataType) {
        super(f, o, FlightDataProviderType.Mcu)
    }
    abstract update(newItem: TFrom): TTo;
    abstract validate(newItem: TFrom): boolean;
    protected ts() {
        return new Date().getTime();
    }
}
export class FlightDataMcuAlttitude extends FlightDataProviderMcu<McuImuVector, FlightDataAttitude>{
    validate(newItem: McuImuVector): boolean {
        throw new Error("Method not implemented.");
    }

    update(newItem: McuImuVector): FlightDataAttitude {
        const item = new FlightDataAttitude(newItem.X, newItem.Y, newItem.Z);
        item.timestamp = this.ts();
        return item;
    }
    constructor() { super(OPI_COMMAND_E.OPI_COMMAND_DEVICE_IMU_ORIENTATION_EULER_FROM_QUATERNIONS, FlightDataType.Attitude) }
}
const fdfd = new FlightDataMcuAlttitude()

type DataProvType<TDataProviderEnum, TFromEnum, TFromTypes extends IDataProviderFromEnum<TFromEnum>, TToEnum, TToTypes extends IDataProviderToEnum<TToEnum>> = IDataProvider<TDataProviderEnum, TFromEnum, TFromTypes, TToEnum, TToTypes>;

export class DataProvCont<

    TFromEnum,
    TFromTypes extends IDataProviderFromEnum<TFromEnum>,

    > {
    items: DataProvType<FlightDataProviderType, TFromEnum, TFromTypes, FlightDataType, FlightDataTypesFilteredTo>[]
}
const csdfsd = new DataProvCont();
