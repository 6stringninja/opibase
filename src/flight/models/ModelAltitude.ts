import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelAltitude extends ModelBase {
    modelId = ModelIdEnum.Altitude;
    constructor(public meters = 0) { super(); }
}
