/**
 * Pass a function that is called when observable instance is created
 * @param {*} callback 
 */
export function Observable(callback) {
    var _observer = AbstractObserver();
    callback(_observer);
    this.subscribe = function(success, error, completed) {
        var subscription = new Subscription();
        subscription.add(success, error, completed);
        _observer.add(subscription);
        return subscription;
    };
}

export function AbstractObserver() {
    var subscriptions = [];
    this.add = function(subscription) {
        if (!(subscription instanceof Subscription)) {
            throw new Error('Expected instance of subscriptions but got ' + typeof subscription);
        }
        subscriptions.push(subscription);
    };

    this._forEach = function(callback) {
        var length = subscriptions.length;
        var _subscriptions = subscriptions.slice();
        for (var i = 0; i < length; i++) {
            if (callback(_subscriptions[i])) {
                subscriptions.splice(i, i);
            }
        }
        _subscriptions.length = 0;
    };

    this.hasObservers = function() {
        return subscriptions.length > 0;
    };
}

AbstractObserver.prototype.next = function(value) {
    this._forEach(function(subscription) {
        subscription.notify('onSuccess', value);
    });
};

AbstractObserver.prototype.error = function(errorObject) {
    this._forEach(function(subscription) {
        subscription.notify('onError', errorObject);
    });
};

AbstractObserver.prototype.completed = function() {
    this._forEach(function(subscription) {
        subscription.notify('onCompleted');
    });
};

AbstractObserver.prototype.destroy = function() {
    this._forEach(function(subscription) {
        subscription.destroy();
        return true;
    });
};