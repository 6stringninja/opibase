import { IConfigUart, IConfig, IConfigHost } from '../../config/IConfig';
import SerialPort from 'serialport';
import { OpiUartFunction } from './OpiUartFunction';
export class OptPlatform {
  ports: SerialPort.PortInfo[] = [];
  mcuUart?: IConfigUart;
  gpsUart?: IConfigUart;
  telsUart?: IConfigUart;
  public get hasMcu() {
    return !!this.mcuUart && this.ports.some(s => s.comName  === this.mcuUart.portName);
  }
  public get hasGps() {
    return !!this.gpsUart && this.ports.some(s => s.comName  === this.gpsUart.portName);
  }
  public get hasTel() {
    return !!this.telsUart && this.ports.some(s => s.comName  === this.telsUart.portName);
  }
  platform = "";
  hostname = "";
}

export class OpPlatform {
  hostConfig: IConfigHost;
  constructor(public platform:string, public ports: SerialPort.PortInfo[] = [],public hostConfigs:IConfigHost[]){
   this.hostConfig = this.hostConfigs.find(f=>f.platform===platform);
   if(this.hostConfig ){
    this.mcuUart = this.hostConfig.uarts.find(s=> s.portFunction === OpiUartFunction.MCU);
    this.gpsUart = this.hostConfig.uarts.find(s=> s.portFunction === OpiUartFunction.GPS);
    this.telsUart = this.hostConfig.uarts.find(s=> s.portFunction === OpiUartFunction.TEL);
   }
  }
  mcuUart?: IConfigUart;
  gpsUart?: IConfigUart;
  telsUart?: IConfigUart;
  public get hasMcu() {
    return !!this.mcuUart && this.ports.some(s => s.comName  === this.mcuUart.portName);
  }
  public get hasGps() {
    return !!this.gpsUart && this.ports.some(s => s.comName  === this.gpsUart.portName);
  }
  public get hasTel() {
    return !!this.telsUart && this.ports.some(s => s.comName  === this.telsUart.portName);
  }
 
  hostname = "";
}