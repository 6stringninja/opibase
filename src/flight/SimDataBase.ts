import { IDataproviderType } from "./IDataproviderType";
import { SimDataEnum } from "./SimDataEnum";
export class SimDataBase implements IDataproviderType<SimDataEnum> {
    dataProviderType: SimDataEnum;
}
