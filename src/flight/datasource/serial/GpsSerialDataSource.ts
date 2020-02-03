import { SerialSourceServiceBytes } from "./SerialSourceServiceBytes";
import { DataSourceServiceEvent } from '../../services/DataSourceService';
import { SerialSourceServiceReadline } from './SerialSourceServiceReadline';
import { ConfigUartFunctionEnum } from '../../../config/IConfig';
import GPS from 'gps';
import { ModelGPS } from '../../models/ModelGPS';

export class GpsSerialDataSource extends SerialSourceServiceReadline {
    
    protected portFunction = ConfigUartFunctionEnum.GPS;
    protected gps = new GPS;
    ong: GPS;
    protected onConnect() {
        // add GPS config
        console.log("gps connect")
        this.setGpsOnData();
    }

    private setGpsOnData() {
      
    }

    protected onDataArrival(data: string) {
        if(!this.ong){

      
      this.ong =  this.gps.on('data', (data) => {
          
            //  console.log(data);
            if (data.type === 'GGA') {
                //   console.log(gps.state)
                this.post(new ModelGPS(data.lat, data.lon, data.alt, data.satellites, data.valid, data.time, this.gps.state.fix, this.gps.state.speed));
            }
        });
    }
        this.gps.update(data);
    }
    protected requestInternal(input: DataSourceServiceEvent): Promise<DataSourceServiceEvent> {
        //  throw new Error('Method not implemented.');
        return new Promise<DataSourceServiceEvent>(r => {
            r(input);
        });
    }
    protected postInternal(input: DataSourceServiceEvent): DataSourceServiceEvent {
        //  throw new Error('Method not implemented.');
        return input;
    }




}
