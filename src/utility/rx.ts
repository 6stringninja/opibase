import { Observable, BehaviorSubject,Subject } from 'rxjs';

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


export interface IConcealedSubject<T>{
    observable: Observable<T>;
    hasSubscribers(): boolean ;
    next(value?: T): void;
}
export class ConcealedSubject<T> {
   private  subject: Subject<T>;
    observable: Observable<T>;
    constructor() {
        this.subject = new Subject<T>();
        this.observable = this.subject.asObservable();
    }
    next(value?: T): void {
        this.subject.next(value);
    }
    hasSubscribers(): boolean {
        return this.subject.observers.length > 0;
    }
}
