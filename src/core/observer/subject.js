/**
 * @class Subject
 */
function Subject() {
    this['[[entries]]'] = [];
    var events = {};
    this.get = function(key) {
        return this['[[entries]]'].filter(function(reg) {
            return reg.watchKey === key;
        })[0];
    };

    /**
     * @param {*} eventName
     * @param {*} listener
     */
    this.on = function(eventName, listener) {
        if (!events.hasOwnProperty(eventName)) {
            events[eventName] = [];
        }
        /**
         * push the listener
         */
        events[eventName].push(listener);
        return this;
    };

    /**
     * @param {*} eventName
     * @param {*} listener
     */
    this.emit = function(eventName) {
        if (events.hasOwnProperty(eventName)) {
            var arg = [].splice.call(arguments);
            arg.shift();
            events[eventName].forEach(function(fn) {
                fn.apply(fn, arg);
            });
        }
    };
}

Subject.prototype.unsubscribe = function(idx) {
    this['[[entries]]'].splice(idx, 1);
};

Subject.prototype.subscribe = function(key, fn, core) {
    var index = this['[[entries]]'].length,
        self = this;

    this['[[entries]]'].push({
        watchKey: fn ? key : undefined,
        handler: fn || key,
        state: false,
        core: core
    });

    return function() {
        self.unsubscribe(index);
    };
};

Subject.prototype.observeForKey = function(key, fn) {
    var keyObserver = this.get(key),
        index = 0;
    if (!keyObserver) {
        this.subscribe(key, [fn]);
    } else {
        index = keyObserver.length;
        keyObserver.handler.push(fn);
    }

    return function() {
        keyObserver.handler.splice(index, 1);
    };
};

Subject.prototype.observeForCollection = function(key, fn) {
    var snapshot = new SnapShotHashing();
    this.subscribe(key, [function() {
        fn(snapshot.getProfiling());
    }], function(collection) {
        return snapshot.compare(collection);
    });
};

Subject.prototype.notifyAllObservers = function(model) {
    this['[[entries]]'].forEach(function(observer) {
        if (observer.watchKey) {
            if (!observer.state) {
                observer.state = true;
                if (model) {
                    var value;
                    if (typeof observer.watchKey === 'function') {
                        value = observer.watchKey(model);
                    } else {
                        value = maskedEval(observer.watchKey, model);
                    }

                    if (observer.core && typeof observer.core === 'function') {
                        if (observer.core(value)) {
                            _trigger(observer.handler, value);
                        }
                    } else if (!observer.hasOwnProperty('lastValue') || (value !== observer.lastValue)) {
                        _trigger(observer.handler, value);
                        observer.lastValue = value;
                    }
                }
            }
            observer.state = false;
        } else {
            observer.handler();
        }
    });
    /**
     * 
     * @param {*} handlers 
     * @param {*} value 
     */
    function _trigger(handlers, value) {
        handlers.forEach(function(cb) {
            cb(value);
        });
    }
};

Subject.prototype.destroy = function(value) {
    this.emit('$destroy', value);
    this['[[entries]]'].length = 0;
};