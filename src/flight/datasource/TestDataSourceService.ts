import { ModelIdEnum } from '../models/ModelTypes';
import { ConcealedSubject } from '../../utility/rx';
import { ModelTypes } from '../models/ModelBase';
import { GetAllEnumVals } from '../../utility/Bitwise/enum-functions';
import { GetModels } from '../functions';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';
import { interval, Subscription } from 'rxjs';
import { DataSourceService, DataSourceServiceTypes, DataSourceServiceEventId, DataSourceServiceEvent, DataSourceTypeEnum, DatSourceSettings } from '../services/DataSourceService';


export class TestDataSourceService extends DataSourceService<DatSourceSettings> {
    protected requestInternal(input: DataSourceServiceTypes): Promise<DataSourceServiceTypes> {
        let prom = new Promise<DataSourceServiceTypes>((resolve) => {
            let nonce = input.nonce;
            let event = _.cloneDeep(input);
            event.eventId = DataSourceServiceEventId.Response;
            event = this.createEvent(event);
            event.value = _.cloneDeep(this.testData[event.modelId]);
            event = this.createEvent(event);
            event.nonce = nonce;
            this.responseSubject.next(event);
            resolve(event);
        });
        return prom;
    }
    protected postInternal(input: DataSourceServiceTypes): DataSourceServiceTypes {
        return this.createEvent(input, DataSourceServiceEventId.Post);
    }
    fakePostInterval: Subscription;
    fakePostIndex = 0;
    fakePosts(enabled = false) {
        if (enabled && isNullOrUndefined(this.fakePostInterval) && this.fakePostIndex!=7) {
            this.fakePostInterval = interval(100).subscribe(() => {
                this.post(_.cloneDeep(this.testData[this.fakePostIndex++]) as any);
                // if (this.fakePostIndex === this.testData.length) {
                //     this.fakePostIndex = 0;
                // }
            });
        }
        else {
            this.fakePostInterval.unsubscribe();
            this.fakePostInterval = undefined;
        }
    }
    testData: ModelTypes[];
    constructor(subject?: ConcealedSubject<DataSourceServiceEvent>) {
        super(new DatSourceSettings(DataSourceTypeEnum.Testing, GetAllEnumVals(ModelIdEnum), GetAllEnumVals(ModelIdEnum)), subject);
        this.testData = GetModels();
      //  this.fakePosts(true);
    }
}
const GPS = require('gps');
export var gps = new GPS;

