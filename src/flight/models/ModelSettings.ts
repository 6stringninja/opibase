import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelSettings extends ModelBase {
    modelId = ModelIdEnum.Settings;
    constructor(public dummyval = 'temp') { super(); }
}
