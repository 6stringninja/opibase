import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelAttitude extends ModelBase {
    modelId = ModelIdEnum.Attitude;
    constructor(public roll = 0, public pitch = 0, public yaw = 0, public typ = "hi") { super(); }
}
