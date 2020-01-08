export interface IConfigWebSockets{
    enabled:boolean
}
export interface IConfigHttp{
    port:number;
}
export interface IConfig{
    appName:string,
    webSockets:IConfigWebSockets
    http:IConfigHttp
}