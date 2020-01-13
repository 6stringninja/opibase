import { IConfigUart } from '../../config/IConfig';
import SerialPort from 'serialport';
export class OptPlatform {
  ports: SerialPort.PortInfo[] = [];
  mcuUart?: IConfigUart;
  gpsUart?: IConfigUart;
  telsUart?: IConfigUart;
  public get hasMcu() {
    return !!this.mcuUart && this.ports.some(s => s.comName === this.mcuUart.portName);
  }
  public get hasGps() {
    return !!this.gpsUart && this.ports.some(s => s.comName === this.gpsUart.portName);
  }
  public get hasTel() {
    return !!this.telsUart && this.ports.some(s => s.comName === this.telsUart.portName);
  }
  platform = "";
  hostname = "";
}
