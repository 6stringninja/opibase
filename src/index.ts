import { ModelIdEnum } from './flight/models/ModelTypes';

import { ModelTypes } from './flight/models/ModelBase';
import { ModelService } from './flight/services/ModelService';
import { GetAllEnumVals } from './utility/Bitwise/enum-functions';
import { FlightDataService } from './flight/DataService';
import { TestDataSourceService } from './flight/datasource/TestDataSourceService';

import { Platform } from './flight/Platform';
import { GpsSerialDataSource } from './flight/datasource/serial/GpsSerialDataSource';
import { SerialDataSourcSettings } from './flight/datasource/serial/SerialDataSourcSettings';


const plt = new Platform();
plt.platformReady().subscribe(()=>{

  const fs = new FlightDataService(
    [ new GpsSerialDataSource(new SerialDataSourcSettings([ModelIdEnum.GPS],[ModelIdEnum.GPS],plt))]
  
  );
  //fs.events.subscribe(s=> console.log(s))
  fs.on(ModelIdEnum.GPS,(v)=>console.log(v))
  setTimeout(() =>{}, 60000);

})


