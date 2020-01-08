import { IDataObservableData, DataObservableType, DataObservableBase } from "../rx/DataObservableBase";

export class TestData  implements IDataObservableData{
   
    id: number;   
     ts: number;
     dataType = DataObservableType.unknown;
   constructor(public  extra:string = ""){

   }
}
export class TestDataObservable extends DataObservableBase<TestData,any>{
 
    constructor(){
        super(DataObservableType.unknown)
    }
    protected newData(): TestData {
        return new TestData();
    }    
    protected map(dataToMap: any, newDate: TestData): TestData {
        if(dataToMap.extra)   {
            newDate.extra = dataToMap.extra;
        }
        return newDate;
    }



}
const ts = new TestDataObservable();
 ts.observable.subscribe(s=> console.log(s));
 
 ts.send(new TestData("send-extra"));
 ts.sendAndMap({extra:"sendandmap"});
