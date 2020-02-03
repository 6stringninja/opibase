import { FlightData, Flight, FlightDataAltitude, FlightDataControls, FlightDataAttitude, FlightDataProviderMcuAttitudeEulerFromQuaternionsToFlightDataAttitude, FlightDataProviderMcuRcDataToFlightDataControls } from "../flight/flight"
import { ConcealedBehaviorSubject } from "../rx/ConcealedBehaviorSubject"
import { McuImuVector, McuRcData } from "../mcu/McuImuVector";
import { DataVaidationErrors$ } from "../flight/DataValidator";

describe(' McuSerialRequestProcessor ', () => {

    let flightAtt = new ConcealedBehaviorSubject<FlightDataAttitude>(new FlightDataAttitude(1,2,3));
     
    let flightAlt = new ConcealedBehaviorSubject<FlightDataAltitude>(new FlightDataAltitude(4));
    
    const flightDataMcuAttProvider = new FlightDataProviderMcuAttitudeEulerFromQuaternionsToFlightDataAttitude();
    const fdrc = new FlightDataProviderMcuRcDataToFlightDataControls();
    let flightData = new FlightData(flightDataMcuAttProvider.observable,flightAlt.observable,fdrc.observable)
    let flight = new Flight(flightData);
    it('sendCommand should requestDeviceId', (done) => {
        let count = 0;
       const sub =  DataVaidationErrors$.subscribe(e=>(count++))
       DataVaidationErrors$.subscribe(e=>console.log(e.error))
       flightDataMcuAttProvider.send(new McuImuVector([2,3,4]))
       flightDataMcuAttProvider.send(new McuImuVector([2,3,361]))
       // flightAtt.next(new FlightDataAttitude(1,2,361));
        flightAlt.next(new FlightDataAltitude(4));
        const fd = new McuRcData();
        fd.data[0]=20;
        const test = new FlightMcuFlightDataProvider();
 
 test.add(new FlightDataProviderMcuRcDataToFlightDataControls());
 test.add(new FlightDataProviderMcuAttitudeEulerFromQuaternionsToFlightDataAttitude());
 const b = test.
 
        fdrc.send(fd);
        flightAlt.next(new FlightDataAltitude(500000));
        setTimeout(()=>{
            console.log(flight.data.controls);
            sub.unsubscribe();
           expect(  flight.data.atitude.roll).toBe(2);
           expect(  flightData.atitude.pitch).toBe(3);
           expect(  flightData.atitude.yaw).toBe(4);
           expect(  flightData.altitude.meters).toBe(4);
           expect(count).toBe(3);
           done();
        },100)
    })
})