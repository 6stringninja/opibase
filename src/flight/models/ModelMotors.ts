import { MODEL_MOTOR_DEFAULT_PWM } from "../consts";
import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelMotors extends ModelBase {
    modelId = ModelIdEnum.Motors;
    constructor(public pwm = [MODEL_MOTOR_DEFAULT_PWM,MODEL_MOTOR_DEFAULT_PWM,MODEL_MOTOR_DEFAULT_PWM,MODEL_MOTOR_DEFAULT_PWM]) { super(); }
}
