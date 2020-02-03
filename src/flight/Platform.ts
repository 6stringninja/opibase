import os from "os";
import { IConfig, IConfigHost } from "../config/IConfig";
import configData from '../config/config.json'
import SerialPort from "serialport";
import { from } from "rxjs";
export const configApp = (configData as unknown) as IConfig;
export class Platform {
    hostConfig: IConfigHost;
    seriaPorts: SerialPort.PortInfo[];
    constructor(
        public platform = os.platform(),
        public hostName = os.hostname(),
        public arch = os.arch(),

    ) {
        this.hostConfig = configApp.hosts.find(f => f.platform.toLowerCase() === platform.toLowerCase());
        if (!this.hostConfig) {
            this.hostConfig = configApp.hosts.find(f => f.platform === "Linux");
        }
    }
    platformReady(){
        return from(this.platformReadyPromise());
    }
    listSerialPorts(){
        return from(SerialPort.list());
    }
    private platformReadyPromise(){
        return new Promise<void>(r=>{
            this.listSerialPorts().subscribe(p=>{
                this.seriaPorts = p;
                r();
            })
           
        });
    }
}
