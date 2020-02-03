
import { ModelTypes } from '../models/ModelBase';
import { ConcealedSubject } from '../../utility/rx';
import { SetEventSequence } from '../functions';
import { Observable, Subscription, from } from 'rxjs';
import { ModelIdEnum } from '../models/ModelTypes';
import { ServiceEvent, ServiceBase, ServiceTypesEnumId, ServiceBaseEventTypedClasses } from './ServiceBase';
import { DataSourceService, DatSourceSettings } from './DataSourceService';
import { filter } from 'rxjs/operators';

export enum RouterServiceEventEnumId {
    Request = 300,
    Response,
    Post
}
export interface IRouterServiceEvent {
    nonce?: number;
    value?: ModelTypes;
}
export class RouterServiceEvent extends ServiceEvent<RouterServiceEventEnumId> {
    nonce?: number = 0;
}
export type RouterServiceTypes = RouterServiceEvent;
export class RouterService extends ServiceBase<RouterServiceEventEnumId>  {

    protected nonceSeed = 1;
    requestObservable: Observable<ServiceBaseEventTypedClasses>;
    post(input: RouterServiceTypes): RouterServiceTypes {
        input = this.createInputEvent(input, RouterServiceEventEnumId.Post, input.modelId);
        input = this.getNonce(input);
        const result = this.createEvent(input, input.modelId);
        this.subject.next(result);
        return result;
    }
    response(input: RouterServiceTypes): RouterServiceTypes {
       
        input = this.createInputEvent(input, RouterServiceEventEnumId.Response, input.modelId)
        if (!input.nonce || input.nonce < 1) {
            input = this.addErrorToServiceEvent(input, "nonce must be greater than zero " + input.nonce.toString());
            return this.createEvent(input, input.modelId);
        }
        const rslt = this.createEvent(input, input.modelId);
        this.subject.next(rslt);
        return rslt;
    }
    request(input: RouterServiceTypes): Promise<ServiceEvent<RouterServiceEventEnumId>> {
        return new Promise<RouterServiceTypes>((resolve) => {
            let event = this.createInputEvent(input, RouterServiceEventEnumId.Request, input.modelId);
            event = this.getNonce(event);
            const nonce = event.nonce;
            let tmr: any;
            let sub: Subscription
            const timerout = new Date().getTime() + 20;

            sub = this.events.subscribe((evt) => { //sub
                if (evt && evt.nonce && evt.nonce === nonce && evt.eventId === RouterServiceEventEnumId.Response) {
                    if (tmr) {
                        clearTimeout(tmr);
                    }
                    sub.unsubscribe();
                    resolve(this.createEvent(evt, evt.modelId));
                }

            })//sub
            const fnc = () => { //fnc
                tmr = setTimeout(() => {//to
                    if (timerout < new Date().getTime()) {
                        sub.unsubscribe();
                        event = this.addErrorToServiceEvent(event, "Dataservice request timeout");
                        event.eventId = RouterServiceEventEnumId.Response;
                        resolve(this.createEvent(event, event.modelId));
                    } else {
                        fnc();
                    }

                }, 1)//to

            };//fnc
            SetEventSequence(input);

            this.subject.next(event);

            fnc();
        });

    }
    private createEvent(value: RouterServiceTypes, modelId: ModelIdEnum): RouterServiceTypes {
        let result = this.processServiceEvent(value, modelId);
        SetEventSequence(result);
        return result;
    }

    private getNonce(input: RouterServiceEvent): RouterServiceTypes {
        if (input.nonce && input.nonce >= this.nonceSeed) {
            this.nonceSeed = input.nonce + 1;
            return input;
        }
        input.nonce = this.nonceSeed++;
        return input;
    }

    constructor(subject: ConcealedSubject<RouterServiceEvent>, public dataSources: DataSourceService<DatSourceSettings>[] = []) {
        super(ServiceTypesEnumId.Router, subject)

        this.setDataSources();


    }

    private setDataSources() {
        this.dataSources.forEach(ds => {
            ds.init(this.subject);
            ds.posts.subscribe(p => {
                this.post(p);
            });
            this.subject.observable.pipe(filter(f => {
                return f.eventId === RouterServiceEventEnumId.Request;
            })).subscribe(s => {
                from(ds.request(s.modelId, s.nonce)).subscribe(() => {
                    this.response(s);
                });
            });
        });
    }
}

