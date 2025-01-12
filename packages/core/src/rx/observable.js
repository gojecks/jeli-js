import { Subscription, SubscriptionStates } from "./subscription";

/**
 * Pass a function that is called when observable instance is created
 * @param {*} callback 
 */
/**
 * Pass a function that is called when observable instance is created
 * @param {*} callback
 */
export class Observable {
    constructor(callback) {
        var _observer = AbstractObserver();
        callback(_observer);
        this.subscribe = function (success, error, completed) {
            var subscription = new Subscription();
            subscription.add(success, error, completed);
            _observer.add(subscription);
            return subscription;
        };
    }
}

export class AbstractObserver {
    constructor() {
        var subscriptions = [];
        this.add = function (subscription) {
            if (!(subscription instanceof Subscription)) {
                throw new Error('Expected instance of subscriptions but got ' + typeof subscription);
            }
            subscriptions.push(subscription);
        };

        this._forEach = function (callback) {
            var length = subscriptions.length;
            var _subscriptions = subscriptions.slice();
            for (var i = 0; i < length; i++) {
                if (callback(_subscriptions[i])) {
                    subscriptions.splice(i, i);
                }
            }
            _subscriptions.length = 0;
        };

        this.hasObservers = function () {
            return subscriptions.length > 0;
        };
    }
    next(value) {
        this._forEach(function (subscription) {
            subscription.notify(SubscriptionStates.onCompleted, value);
        });
    }
    error(errorObject) {
        this._forEach(function (subscription) {
            subscription.notify(SubscriptionStates.onError, errorObject);
        });
    }
    completed() {
        this._forEach(function (subscription) {
            subscription.notify(SubscriptionStates.onCompleted);
        });
    }
    destroy() {
        this._forEach(function (subscription) {
            subscription.destroy();
            return true;
        });
    }
}




