import { ModelIdEnum } from '../../models/ModelTypes';
import { DataSourceTypeEnum, DatSourceSettings } from '../../services/DataSourceService';

import { Platform } from '../../Platform';
import { SerialDataSourceParser } from './SerialSourceServiceBase';
export class SerialDataSourcSettings extends DatSourceSettings {

    constructor(
        requestable: ModelIdEnum[],
        postable: ModelIdEnum[],
       
        public platform?: Platform) {
        super(DataSourceTypeEnum.Serial, requestable, postable);
    }
}
