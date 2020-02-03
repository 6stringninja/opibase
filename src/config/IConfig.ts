export enum ConfigUartFunctionEnum {
    MCU = "MCU",
    GPS = "GPS",
    TEL = "TEL" 
}
export interface IConfigWebSockets{
    enabled:boolean
}
export interface IConfigHttp{
    port:number;
}
export interface IConfigUart{
    portFunction:ConfigUartFunctionEnum;
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