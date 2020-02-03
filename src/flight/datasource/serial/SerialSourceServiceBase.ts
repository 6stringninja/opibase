import { ConcealedSubject } from '../../../utility/rx';
import { DataSourceService, DataSourceServiceEvent } from '../../services/DataSourceService';
import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import ByteLength from '@serialport/parser-byte-length';

import { SerialDataSourcSettings } from "./SerialDataSourcSettings";
import { settings } from 'cluster';
import { ConfigUartFunctionEnum, IConfigUart } from '../../../config/IConfig';
export enum SerialDataSourceParser {
    Readline,
    Bytes
}
export type SerialParserReturnTypes = Buffer | string;

export abstract class SerialSourceServiceBase<T extends SerialParserReturnTypes> extends DataSourceService<SerialDataSourcSettings> {
    port: SerialPort;
    parser: any;
    config?: IConfigUart;
    abstract serialParser: SerialDataSourceParser;
    constructor(setting: SerialDataSourcSettings, subject?: ConcealedSubject<DataSourceServiceEvent>) {
        super(setting, subject);
        this.initSerial(setting);
    }
    private initSerial(setting: SerialDataSourcSettings) {
        return new Promise<void>((r, rj) => {
            setting.platform.platformReady().subscribe(() => {
                const p = setting.platform;
                
                this.config = p.hostConfig.uarts.find(f => f.portFunction === this.portFunction);
               
                if (this.config && this.config.enabled && p.seriaPorts.some(s => s.comName.toLowerCase() === this.config.portName.toLowerCase())) {
                    console.log({dddddddddddd:this.config,pf:this.portFunction})
                    this.setSerialPort();

                    r();
                } else {
                    let errs: string[] = [];

                    errs.push(`config error for ${p.hostName} ${p.arch} ${this.config?.portName} ${ConfigUartFunctionEnum[this.portFunction]}`)
                    if (!this.config) {
                        errs.push("Config Not Found");
                    }
                    if (this.config && !this.config.enabled) {
                        errs.push("port not enabled");
                    }
                    if (this.config && this.config.enabled) {
                        errs.push("comName not found");
                    }
                    rj(errs.join(" "));
                }
            });
        })

    }

    private setSerialPort() {
        this.port = new SerialPort(this.config.portName, { baudRate: this.config.portBaud, autoOpen: true }, (err) => {
            if (err) {
                return console.log('Error: ', err.message);
            }
            else
                console.log("connected");
            this.setParser();
            this.setEvents();
        });
    }

    private setEvents() {
        this.parser.on('data', (data) => this.onDataArrival(data));
        this.port.on('open', () => this.onConnect());
        this.port.on('close', () => this.onClose());
        this.port.on('error', (err) => this.onError(err));
    }

    private setParser() {
        if (this.serialParser === SerialDataSourceParser.Readline) {
           
            this.parser = this.port.pipe(new Readline({ delimiter: '\r\n' }));
        }
        else {
            this.parser = this.port.pipe(new ByteLength({ length: 8 }));
        }
    }

    protected onConnect() {
        throw new Error('Method not implemented.');
    }
    protected onClose() {
        throw new Error('Method not implemented.');
    }
    protected onError(e: any) {
        throw new Error('Method not implemented.');
    }
    protected abstract onDataArrival(data: T);
    protected abstract requestInternal(input: DataSourceServiceEvent): Promise<DataSourceServiceEvent>;
    protected abstract postInternal(input: DataSourceServiceEvent): DataSourceServiceEvent;
    protected abstract portFunction: ConfigUartFunctionEnum;
}
