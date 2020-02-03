import { ModelBase } from "./ModelBase";
import { ModelIdEnum } from './ModelTypes';
export class ModelGPS extends ModelBase {
    modelId = ModelIdEnum.GPS;
    constructor(public lat = 0,
        public lon = 0,
        public alt = 0, public sats = 0, public valid = false, public time = new Date(), public fix = '', public speed = 0) { super(); }
}
