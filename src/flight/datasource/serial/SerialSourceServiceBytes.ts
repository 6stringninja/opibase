import { ConcealedSubject } from '../../../utility/rx';
import { DataSourceServiceEvent } from '../../services/DataSourceService';
import { SerialDataSourcSettings } from "./SerialDataSourcSettings";
import { SerialSourceServiceBase, SerialDataSourceParser } from "./SerialSourceServiceBase";
export abstract class SerialSourceServiceBytes extends SerialSourceServiceBase<Buffer> {
    serialParser=SerialDataSourceParser.Bytes;
    constructor(setting: SerialDataSourcSettings, subject?: ConcealedSubject<DataSourceServiceEvent>) {
        super(setting, subject);
        
    }
}
