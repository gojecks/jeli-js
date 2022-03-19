import { Subscription } from './subscription';
import { AbstractObserver } from './observable';
export function Subject() {
    this._observer = new AbstractObserver();
}

Subject.prototype.subscribe = function(success, error, completed) {
    var subscription = new Subscription(false);
    subscription.add(success, error, completed);
    this._observer.add(subscription);
    return subscription;
};

Subject.prototype.destroy = function() {
    this._observer.destroy();
};

Subject.prototype.hasObservers = function() {
    return this._observer.hasObservers();
};

Subject.prototype.next = function(value) {
    this._observer.next(value);
};

Subject.prototype.error = function(error) {
    this._observer.error(error);
};

Subject.prototype.completed = function() {
    this._observer.completed();
};