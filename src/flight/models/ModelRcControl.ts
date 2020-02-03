import { MODEL_CONTROL_AUX_DEFAULT, MODEL_CONTROLTHROTTLE_DEFAULT, MODEL_CONTROL_PLANES_DEFAULT } from "../consts";
import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelRcControl extends ModelBase {
    modelId = ModelIdEnum.RcControl;
    constructor(public throttle = MODEL_CONTROLTHROTTLE_DEFAULT, public ailerons = MODEL_CONTROL_PLANES_DEFAULT, public elvator = MODEL_CONTROL_PLANES_DEFAULT, public rudder = MODEL_CONTROL_PLANES_DEFAULT, public aux = [MODEL_CONTROL_AUX_DEFAULT, MODEL_CONTROL_AUX_DEFAULT, MODEL_CONTROL_AUX_DEFAULT, MODEL_CONTROL_AUX_DEFAULT], public auxChannelCount = 4) { super(); }
}
