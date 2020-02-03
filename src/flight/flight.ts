import { Observable, range } from "rxjs";
import { BehaviorSubject } from "rx";
import { ConcealedSubject } from "../rx/ConcealedSubject";
import { McuResponseType, McuConvertableResponsTypes } from "../mcu/McuSerialResponseProcessor";
import { McuImuVector, McuRcData } from "../mcu/McuImuVector";
import { OPI_COMMAND_E } from "../mcu/McuSerialParser";
import { DataValidationError } from "./DataValidationError";
import { DataValidatorResult } from "./DataValidatorResult";
import { DataValidator } from "./DataValidator";

import { DataProviderBase } from "./DataProviderBase";
import { IDataproviderType } from "./IDataproviderType";
import { IDataProviderToEnum, FlightDataType, IFlightBase, FlightDataTypes, FlightDataAttitude, FlightDataControls, FlightDataAltitude } from "./DataProvider";
 


export class FlightDataGroupBase {
    private dataArrivalCs = new ConcealedSubject<FlightDataType>();
    get dataArrival$() {
        return this.dataArrivalCs.observable;
    }

    protected setInternal(i: IFlightBase) {
        i.timestamp = i.timestamp || new Date().getTime();
        this.dataArrivalCs.next(i.dataType);
    }
}

export abstract class FlightDataProviderBase<TFromEnum, TFromType extends IDataproviderType<TFromEnum>> 
extends DataProviderBase<TFromEnum,TFromType, FlightDataType, FlightDataTypes,FlightDataProviderType> {

}
export abstract class FlightDataProviderMcuBase
    <TFlightDataType extends FlightDataTypes, TMcuResponseDataType extends McuConvertableResponsTypes>
    extends FlightDataProviderBase<OPI_COMMAND_E, TMcuResponseDataType>{

    constructor(toType: FlightDataType, fromType: OPI_COMMAND_E) {
        super(FlightDataProviderType.Mcu, toType, fromType);
    }

}
export class FlightDataProviderMcuAttitudeEulerFromQuaternionsToFlightDataAttitude extends FlightDataProviderMcuBase<FlightDataAttitude, McuImuVector> {
    convert(i: McuImuVector): FlightDataAttitude {
        return new FlightDataAttitude(i.X, i.Y, i.Z);
    }
    constructor() {
        super(FlightDataType.Attitude, OPI_COMMAND_E.OPI_COMMAND_DEVICE_IMU_ORIENTATION_EULER_FROM_QUATERNIONS);
    }
}
export class FlightDataProviderMcuRcDataToFlightDataControls extends FlightDataProviderMcuBase<FlightDataControls, McuRcData> {
    convert(i: McuRcData): FlightDataControls {
        return new FlightDataControls(i.Throttle, i.Yaw, i.Pitch, i.Roll);
    }

    constructor() {
        super(FlightDataType.Controls, OPI_COMMAND_E.OPI_COMMAND_DEVICE_RC_DATA);
    }
}

export function between(x: number, min: number, max: number) {
    return x >= min && x <= max;
}
export class FlightData extends FlightDataGroupBase {
    atitude: FlightDataAttitude;
    altitude: FlightDataAltitude;
    controls: FlightDataControls;
    constructor(
        public updateAttitude$ = new Observable<FlightDataAttitude>(),
        public updateAltitude$ = new Observable<FlightDataAltitude>(),
        public updateControls$ = new Observable<FlightDataControls>(),
    ) {
        super();
        const dv = new DataValidator<FlightDataAttitude>(FlightDataType[FlightDataType.Attitude], (v, e) => {
            let er = '';
            if (Math.abs(v.pitch) > 180.0) {
                er += `Pitch ${v.pitch} out of bounds`
            }
            if (Math.abs(v.roll) > 180.0) {
                er += `Roll ${v.roll} out of bounds`
            }
            if (Math.abs(v.yaw) > 360.0) {
                er += `yaw ${v.yaw} out of bounds`
            }

            return new DataValidatorResult(v, !er, er);
        })
        updateAttitude$.subscribe(f => {
            let test = false;
            this.atitude = dv.validate(f, this.atitude, test);
            if (test) {
                this.setInternal(f);
            }

        })
        const dvAlt = new DataValidator<FlightDataAltitude>(FlightDataType[FlightDataType.Altitude], (v, e) => {
            let er = '';
            if (!between(v.meters, -5000, 50000)) {
                er += `throttle ${v.meters} out of bounds`
            }

            return new DataValidatorResult(v, !er, er);
        })
        updateAltitude$.subscribe(f => {

            let test = false;
            this.altitude = dvAlt.validate(f, this.altitude, test);
            if (test) {
                this.setInternal(f);
            }
        })
        const dvControls = new DataValidator<FlightDataControls>(FlightDataType[FlightDataType.Controls], (v, e) => {
            console.log
            let er = '';
            if (!between(v.throttle, 980, 2020)) {
                er += `throttle ${v.throttle} out of bounds`
            }
            if (!between(v.elevator, 980, 2020)) {
                er += ` elevator ${v.elevator} out of bounds`
            }
            if (!between(v.rudder, 980, 2020)) {
                er += ` rudder ${v.rudder} out of bounds`
            }
            if (!between(v.ailerons, 980, 2020)) {
                er += ` ailerons ${v.ailerons} out of bounds`
            }
            return new DataValidatorResult(v, !er, er);
        })

        updateControls$.subscribe(f => {

            let test = false;
            this.controls = dvControls.validate(f, this.controls, test);
            if (test) {
                this.setInternal(f);
            }
        })
    }

}
export class Flight {
    constructor(
        public data = new FlightData()
    ) {

    }
}