import { ModelAltitude } from './models/ModelAltitude';
import { ModelAttitude } from './models/ModelAttitude';
import { ModelRcControl } from './models/ModelRcControl';
import { ModelGPS } from './models/ModelGPS';
import { ModelSettings } from './models/ModelSettings';
import { ModelMotors } from './models/ModelMotors';
import { ModelServos } from './models/ModelServos';
import _ from 'lodash';
export interface IFlightData {
    Altitude: ModelAltitude;
    Attitude: ModelAttitude;
    RcControl: ModelRcControl;
    GPS: ModelGPS;
    Settings: ModelSettings;
    Motors: ModelMotors;
    Servos: ModelServos;
}
export class FlightData implements IFlightData{
    Altitude: ModelAltitude;   
     Attitude: ModelAttitude;
    RcControl: ModelRcControl;
    GPS: ModelGPS;
    Settings: ModelSettings;
    Motors: ModelMotors;
    Servos: ModelServos;
static Copy(fd:IFlightData):FlightData{
    let newfd = new FlightData();
  newfd.Altitude = fd.Altitude;
  newfd.Attitude = fd.Attitude;
  newfd.GPS = fd.GPS;
  newfd.RcControl = fd.RcControl;
  newfd.Motors = fd.Motors;
  newfd.Servos = fd.Servos;
  newfd.Settings = fd.Settings;
    return newfd;
}

}