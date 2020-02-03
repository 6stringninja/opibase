import { OPI_COMMAND_E } from "./McuSerialParser";

import { McuBase } from "./McuBase";

 
export class McuImuVector extends McuBase {
    constructor(public data: number[] = [0, 0, 0], public timeStamp = 0,dataProviderType: OPI_COMMAND_E = OPI_COMMAND_E.OPI_COMMAND_DEVICE_IMU_ORIENTATION_EULER) {super(dataProviderType )
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
export class McuImuQuaternions extends McuImuVector {
    constructor(public data: number[] = [0, 0, 0, 0], public timeStamp = 0) {
        super(data, timeStamp,OPI_COMMAND_E.OPI_COMMAND_DEVICE_IMU_QUATERNIONS);
    }
    get W() {
        return this.data[3];
    }
}
export class McuRcData extends McuBase {
    channelMap = [0, 1, 2, 3, 4, 5, 6, 7];
    constructor(public data: number[] = [], public commands: number[] = [], public timeStamp = 0, public chans = 8) {
        super( OPI_COMMAND_E.OPI_COMMAND_DEVICE_RC_DATA)
        if (data.length === 0) {
            for (let index = 0; index < chans; index++) {
                data.push(1500);

            }
        }
    }
    get Roll() {
        return this.data[this.channelMap[0]];
    }
    get Pitch() {
        return this.data[this.channelMap[1]];
    }
    get Yaw() {
        return this.data[this.channelMap[2]];
    }
    get Throttle() {
        return this.data[this.channelMap[3]];
    }
    get Aux1() {
        return this.data[this.channelMap[3]];
    }
    get Aux2() {
        return this.data[this.channelMap[3]];
    }
    get Aux3() {
        return this.data[this.channelMap[3]];
    }
    get Aux4() {
        return this.data[this.channelMap[3]];
    }
}
