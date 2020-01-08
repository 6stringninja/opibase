import { ConcealedSubject } from "./ConcealedSubject";
import { Observable } from "rx";

export enum DataObservableType {
    unknown = 'unknown',
    debug  = 'debug'
}
export interface IDataObservableData {
    id: number;
    ts: number;
    dataType: DataObservableType;
}
export abstract class DataObservableBase<TData extends IDataObservableData, TMapData>{
    constructor(protected dataType: DataObservableType) {
        this.onDataCs = new ConcealedSubject<TData>();
        this.observable = this.onDataCs.observable; 
    }
    private id = 0;
    private onDataCs = new ConcealedSubject<TData>();
    public observable = this.onDataCs.observable;
    public send(data: TData): void {
        if (!this.onDataCs.hasSubscribers()) return;

        data.id = (this.id++);
        data.ts = new Date().getTime();
        data.dataType = this.dataType;
        this.onDataCs.next(data);
    }

    public sendAndMap(dataToMap: TMapData): void {
        this.send(this.map(dataToMap, this.newData()))
    }
    protected abstract newData(): TData;
    protected abstract map(dataToMap: TMapData, newDate: TData): TData;

}