import { ConcealedSubject } from '../../../utility/rx';
import { DataSourceServiceEvent } from '../../services/DataSourceService';
import { SerialDataSourcSettings } from "./SerialDataSourcSettings";
import { SerialSourceServiceBase, SerialDataSourceParser } from "./SerialSourceServiceBase";
export abstract class SerialSourceServiceReadline extends SerialSourceServiceBase<string> {
    serialParser=SerialDataSourceParser.Readline;
    constructor(setting: SerialDataSourcSettings, subject?: ConcealedSubject<DataSourceServiceEvent>) {
        super(setting, subject);
         ;
    }
}
