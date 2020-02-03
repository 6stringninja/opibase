import { ModelAltitude } from './ModelAltitude';
import { ModelAttitude } from './ModelAttitude';
import { ModelRcControl } from './ModelRcControl';
import { ModelMotors } from './ModelMotors';
import { ModelServos } from './ModelServos';
import { ModelSettings } from './ModelSettings';
import { ModelGPS } from './ModelGPS';


export enum ModelIdEnum {
    Attitude,
    Altitude,
    RcControl,
    Motors,
    Servos,
    Settings,
    GPS
}

export type ModelIdEnumReturnTypes = {
    [ModelIdEnum.Attitude]: ModelAttitude,
    [ModelIdEnum.Altitude]: ModelAltitude,
    [ModelIdEnum.RcControl]: ModelRcControl,
    [ModelIdEnum.Motors]: ModelMotors,
    [ModelIdEnum.Servos]: ModelServos,
    [ModelIdEnum.Settings]: ModelSettings,
    [ModelIdEnum.GPS]: ModelGPS
}

export type ModelIdEnumReturnTypesVals = {
    [ModelIdEnum.Attitude]: ModelIdEnum.Attitude,
    [ModelIdEnum.Altitude]: ModelIdEnum.Altitude,
    [ModelIdEnum.RcControl]: ModelIdEnum.RcControl,
    [ModelIdEnum.Motors]: ModelIdEnum.Motors,
    [ModelIdEnum.Servos]: ModelIdEnum.Servos,
    [ModelIdEnum.Settings]: ModelIdEnum.Settings,
    [ModelIdEnum.GPS]: ModelIdEnum.GPS
}

export type NewModelType<T extends ModelIdEnumReturnTypes[ModelIdEnum]> = () => T;
export const ModelDefaults: NewModelType<ModelIdEnumReturnTypes[ModelIdEnum]>[] = [
    () => new ModelAttitude(),
    () => new ModelAltitude(),
    () => new ModelRcControl(),
    () => new ModelMotors(),
    () => new ModelServos(),
    () => new ModelSettings(),
    () => new ModelGPS()

]

