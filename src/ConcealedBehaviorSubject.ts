import { Observable, BehaviorSubject } from 'rxjs';
export class ConcealedBehaviorSubject<T> {
    bh: BehaviorSubject<T>;
    observable: Observable<T>;
    constructor(v: T) {
        this.bh = new BehaviorSubject<T>(v);
        this.observable = this.bh.asObservable();
    }
    next(value?: T): void {
        this.bh.next(value);
    }
    hasSubscribers(): boolean {
        return this.bh.observers.length && this.bh.observers.length > 0;
    }
}
