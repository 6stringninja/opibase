import { ConcealedSubject } from "../rx/ConcealedSubject";
import { IDataproviderType } from "./IDataproviderType";
export abstract class DataProviderBase<TFromEnum, TFromType extends IDataproviderType<TFromEnum>, TToEnum, TToType, TDataProviderEnum> {
    protected cs = new ConcealedSubject<TToType>();
    public observable = this.cs.observable;
    constructor(public readonly providerType: TDataProviderEnum, public readonly toType: TToEnum, public readonly fromType: TFromEnum) {
    }
    abstract convert(i: TFromType): TToType;
    send(i: TFromType) {
        if (this.cs.hasSubscribers()) {
            this.cs.next(this.convert(i));
        }
    }
}
