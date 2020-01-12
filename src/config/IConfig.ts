import { OpiUartFunction } from "../server/OpiServer";

export interface IConfigWebSockets{
    enabled:boolean
}
export interface IConfigHttp{
    port:number;
}
export interface IConfigUart{
    portFunction:OpiUartFunction;
    portName:string;
    portBaud:number;
    enabled:boolean;
}
export interface IConfigHost{
    platform:string;
    hostName:string;
    uarts:IConfigUart[];
}
export interface IConfig{
    appName:string,
    webSockets:IConfigWebSockets;
    http:IConfigHttp;
    hosts:IConfigHost[];
}