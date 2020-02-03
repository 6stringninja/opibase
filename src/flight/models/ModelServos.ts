import { MODEL_SERVO_DEFAULT_PWM } from "../consts";
import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelServos extends ModelBase {
    modelId = ModelIdEnum.Servos;
    constructor(public pwm = [MODEL_SERVO_DEFAULT_PWM]) { super(); }
}
