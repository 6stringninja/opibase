import { Observable, Subject } from 'rxjs';
export interface IConcealedSubject<T>{
    observable: Observable<T>;
    hasSubscribers(): boolean ;
    next(value?: T): void;
}
export class ConcealedSubject<T> {
    private subject: Subject<T>;
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
