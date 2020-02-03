

import { IUseModelId } from "../Interfaces";
import { ModelAltitude } from "./ModelAltitude";
import { ModelAttitude } from "./ModelAttitude";
import { ModelRcControl } from "./ModelRcControl";
import { ModelServos } from "./ModelServos";
import { ModelSettings } from "./ModelSettings";
import { ModelGPS } from "./ModelGPS";
import { ModelIdEnum } from './ModelTypes';

export interface IModelBase extends IUseModelId {

}
export abstract class ModelBase implements IUseModelId {
  modelId: ModelIdEnum;
  constructor() { }
  invalidate?: number = 0;
}
export type ModelTypes = ModelAltitude | ModelAttitude | ModelRcControl | ModelServos | ModelSettings | ModelGPS | ModelBase