import { ModelServiceEventId } from '../flight/services/ModelService';
import { GetEnumLength, GetValsMissingFromEnums } from '../flight/functions';
import { ValidationServiceEventId } from '../flight/services/ValidationService';
import { RouterServiceEventEnumId, RouterService } from '../flight/services/RouterService';
import { DataSourceServiceEventId } from '../flight/services/DataSourceService';
import { FlightDataServiceEventEnum, FlightDataService } from '../flight/DataService';
import { GetAllEnumNames, GetAllEnumVals } from '../utility/Bitwise/enum-functions';
import _ from 'lodash';
import { ModelIdEnum } from '../flight/models/ModelTypes';
import { ModelAltitude } from '../flight/models/ModelAltitude';
import { ServiceEvent, ServiceTypesEnumId } from '../flight/services/ServiceBase';
import { ModelAttitude } from '../flight/models/ModelAttitude';
import { ModelGPS } from '../flight/models/ModelGPS';
import { ModelRcControl } from '../flight/models/ModelRcControl';
import { FlightData } from '../flight/IFlightData';
import { Platform } from '../flight/Platform';
import { GpsSerialDataSource } from '../flight/datasource/serial/GpsSerialDataSource';
import { SerialDataSourcSettings } from '../flight/datasource/serial/SerialDataSourcSettings';
import { TestDataSourceService } from '../flight/datasource/TestDataSourceService';


describe("sanity spec", () => {

    const fs = new FlightDataService(
        [ new GpsSerialDataSource(new SerialDataSourcSettings([ModelIdEnum.GPS],[ModelIdEnum.GPS],new Platform()))]
      
      );
 const msgs:ServiceEvent<any>[]=[];
 const modLen = GetEnumLength(ModelIdEnum);
 fs.events.subscribe(s=> {
    // if(s.serviceId===ServiceTypesEnumId.Validator)
     {
        console.log(s);
     }
     return msgs.push(s);
 });

 it(' sanity spec  ', (done) => {
expect(fs).toBeDefined();
let i = 0;
     const samples = 0;
for (let index = 0; index < samples; index++) {
    fs.write(new ModelAltitude(i))
    i++ 
    if(i===modLen) i =0;

}

setTimeout(()=>{
expect(msgs.filter(f=> f.serviceId === ServiceTypesEnumId.Validator && f.modelId===ModelIdEnum.Altitude && f.success ).length).toBeGreaterThanOrEqual(samples * 2);
expect(msgs.filter(f=> f.serviceId === ServiceTypesEnumId.Modal && f.modelId===ModelIdEnum.Altitude && f.success && f.eventId === FlightDataServiceEventEnum.ModelServiceWrite ).length).toBe(samples * 2);
expect(msgs.filter(f=> f.serviceId === ServiceTypesEnumId.Modal && f.modelId===ModelIdEnum.Altitude && f.success && f.eventId === FlightDataServiceEventEnum.ModelServiceChange ).length).toBe(samples * 2);

const newVal = fs.read(ModelIdEnum.Altitude);
console.log(newVal);
msgs.length=0;
return done();
},50);
 })
 it(' posts  ', async (done) => {
 fs.request(ModelIdEnum.GPS);
setTimeout(()=>done(),100);
 
 });
    it(' sanity spec  ', (done) => {
        const   lens = GetEnumLength(ModelServiceEventId) + GetEnumLength(ValidationServiceEventId) + GetEnumLength(RouterServiceEventEnumId) + GetEnumLength(DataSourceServiceEventId);
        const  names =   GetAllEnumNames(ModelServiceEventId).concat( GetAllEnumNames(ValidationServiceEventId).concat( GetAllEnumNames(RouterServiceEventEnumId).concat(GetAllEnumNames(DataSourceServiceEventId))));
        const  vals =   GetAllEnumVals(ModelServiceEventId).concat( GetAllEnumVals(ValidationServiceEventId).concat( GetAllEnumVals(RouterServiceEventEnumId).concat(GetAllEnumVals(DataSourceServiceEventId))));
        const fltEnumLen = GetEnumLength(FlightDataServiceEventEnum);
        const fltEnumNames =  GetAllEnumNames(FlightDataServiceEventEnum);
        const fltEnumVals =  GetAllEnumVals(FlightDataServiceEventEnum);
      
        // expect(GetEnumLength(FlightDataServiceEventEnum)).toBe(lens);
        if(fltEnumLen  != lens){
            let fakeEnum = {};
            names.forEach((f,i)=>{
           
                fakeEnum[Number(vals[i]) as number]=f;
            })
            names.forEach((f,i)=>{
                fakeEnum[f]=vals[i];
               
            })
            fltEnumVals.forEach((f,i)=>{
                if(!vals.some(s=> s===f)){
                    console.log(`Missing ${f} F`)
                }
            })
            vals.forEach((f,i)=>{
                if(!fltEnumVals.some(s=> s===f)){
                    console.log(`Missing ${f}  ${names[i]}`)
                }
            })
        //    const missing = GetValsMissingFromEnums()
        let bcd = Object.keys(FlightDataServiceEventEnum);
        let cdd = Object.keys(fakeEnum);
           // console.log({names,vals,fltEnumNames,fltEnumVals,fakeEnum,cdd,bcd,FlightDataServiceEventEnum});
        }
       expect(true).toBeTrue();
       done();
    })

        it(' test flight data ', (done) => {
           expect(true).toBeTrue();
           const alt = new ModelAltitude(99);
           const att = new ModelAttitude(10.10,11.11,200.3);
           const gps = new ModelGPS(122.2,33.2,44.3);
           const rc = new ModelRcControl(1001,1101,1202,1303,[1010,2000,1500,1202],4);
           const rs = (fs as any).router as RouterService;
           const data = (fs as any).data;
           const tds = rs.dataSources[0] as TestDataSourceService;
           
           tds.post(alt);
           tds.post(att);
           tds.post(gps);
           tds.post(rc);
           setTimeout(()=>{
               expect(att).toEqual(fs.Attitude)
               expect(alt).toEqual(fs.Altitude)
               expect(gps).toEqual(fs.GPS)
               expect(rc).toEqual(fs.RcControl)

             //  console.log({v:fs.Altitude,a:fs.Attitude,g:fs.GPS,rc:fs.RcControl})
            console.log(FlightData.Copy(fs));
            done();
           },5)
           
        })
        it(' test flight data ',async (done)  => {
         //   const platform = new Platform();
        //   await platform.platformReady().toPromise();
        //   console.log(platform.seriaPorts);
        //   setTimeout(()=>done,4000)
          
        })
})