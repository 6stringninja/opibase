import { SerialSourceServiceBytes } from "./SerialSourceServiceBytes";
import { DataSourceServiceEvent } from '../../services/DataSourceService';
import { ConfigUartFunctionEnum } from '../../../config/IConfig';
export class McuSerialDataSource extends SerialSourceServiceBytes {
    protected portFunction: ConfigUartFunctionEnum.MCU;
  
   
    protected onDataArrival(data: Buffer) {
        throw new Error('Method not implemented.');
    }   
     protected requestInternal
    (input: DataSourceServiceEvent): Promise<DataSourceServiceEvent> {
        throw new Error('Method not implemented.');
    }
    protected postInternal(input: DataSourceServiceEvent): DataSourceServiceEvent {
        throw new Error('Method not implemented.');
    }

   
}
