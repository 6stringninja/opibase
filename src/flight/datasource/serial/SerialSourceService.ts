// import { ModelIdEnum } from '../../models/ModelTypes';
// import { ConcealedSubject } from '../../../utility/rx';
// import { DataSourceService, DataSourceServiceEvent, DataSourceTypeEnum, DatSourceSettings } from '../../services/DataSourceService';
// import { Platform } from '../../Platform';
// import SerialPort from 'serialport';
// import Readline from '@serialport/parser-readline';
// import { ModelGPS } from '../../models/ModelGPS';
// import { gps } from '../TestDataSourceService';
// export class SerialSourceService extends DataSourceService<DatSourceSettings> {
//     portInfo: SerialPort.PortInfo;
//     port: SerialPort;
//     parser: any;
//     protected requestInternal(input: DataSourceServiceEvent): Promise<DataSourceServiceEvent> {
//         //  throw new Error('Method not implemented.');
//         return new Promise<DataSourceServiceEvent>(r => {
//             r(input);
//         });
//     }
//     protected postInternal(input: DataSourceServiceEvent): DataSourceServiceEvent {
//         //  throw new Error('Method not implemented.');
//         return input;
//     }
//     constructor(subject?: ConcealedSubject<DataSourceServiceEvent>, platform?: Platform) {
//         super(new DatSourceSettings(DataSourceTypeEnum.Unknown, [ModelIdEnum.GPS], [ModelIdEnum.GPS]), subject);
//         if (platform) {
//             platform.platformReady().subscribe(sss => {
//                 platform.listSerialPorts().subscribe((ports) => {
//                     if (ports) {
//                         this.portInfo = ports[0];
//                         this.port = new SerialPort(this.portInfo.comName, { baudRate: 9600, autoOpen: true }, (err) => {
//                             if (err) {
//                                 return console.log('Error: ', err.message);
//                             }
//                             console.log("connected");
//                             this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
//                             this.parser.on('data', (data) => {
//                                 //    console.log(data);
//                                 //     p.parser.mcuGpsCs.next(data);
//                                 gps.update(data);
//                                 // console.log(data);
//                             });
//                             gps.on('data', (data) => {
//                                 //  console.log(data);
//                                 if (data.type === 'GGA') {
//                                     //   console.log(gps.state)
//                                     this.post(new ModelGPS(data.lat, data.lon, data.alt, data.satellites, data.valid, data.time, gps.state.fix, gps.state.speed));
//                                 }
//                                 //     console.log(data, gps.state);
//                             });
//                         });
//                     }
//                 });
//             });
//         }
//     }
// }



