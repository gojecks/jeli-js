import { Subscription } from './subscription';
import { AbstractObserver } from './observable';
export class Subject {
    constructor() {
        this._observer = new AbstractObserver();
    }
    subscribe(success, error, completed) {
        var subscription = new Subscription(false);
        subscription.add(success, error, completed);
        this._observer.add(subscription);
        return subscription;
    }
    destroy() {
        this._observer.destroy();
    }
    hasObservers() {
        return this._observer.hasObservers();
    }
    next(value) {
        this._observer.next(value);
    }
    error(error) {
        this._observer.error(error);
    }
    completed() {
        this._observer.completed();
    }
}