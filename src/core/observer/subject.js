/**
 * @class Subject
 */
function Subject() {
    this.$notifyInProgress = 0;
    this.notifyStack = 0;
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
    if (this.$notifyInProgress) {
        this.$notifyInProgress--;
    }
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

Subject.prototype.observeForKey = function(key, fn, core) {
    var keyObserver = this.get(key),
        index = 0;
    if (!keyObserver) {
        this.subscribe(key, [fn], core);
    } else {
        index = keyObserver.length;
        keyObserver.handler.push(fn);
    }

    return function() {
        keyObserver.handler.splice(index, 1);
    };
};

Subject.prototype.observeForCollection = function(key, fn) {
    var keyObserver = this.get(key);
    if (!keyObserver) {
        var snapshot = new SnapShotHashing(),
            handler = function() {
                var value = snapshot.getProfiling();
                handler.watches.forEach(function(_callback) {
                    _callback(value);
                });
            };
        handler.watches = [fn];
        this.subscribe(key, handler, function(collection) {
            return snapshot.compare(collection);
        });
    } else {
        keyObserver.handler.watches.push(fn);
    }
};

Subject.prototype.notifyAllObservers = function(model) {
    if (this.$notifyInProgress) {
        this.notifyStack++;
        return;
    }

    var _self = this;
    /**
     * 
     * @param {*} observer 
     */

    function _consume(observer, idx) {
        if (observer.watchKey) {
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

        } else {
            observer.handler();
        }

        /**
         * change status
         */

        if ((idx === _self.$notifyInProgress)) {
            _self.$notifyInProgress = 0;
            if (_self.notifyStack) {
                // trigger notification again
                _self.notifyStack = 0;
                _self.notifyAllObservers(model);
            }
        }
    }
    /**
     * 
     * @param {*} handlers 
     * @param {*} value 
     */
    function _trigger(handlers, value) {
        if (typeof handlers === 'object') {
            handlers.forEach(function(cb) {
                cb(value);
            });
        } else {
            handlers(value);
        }
    }

    this.$notifyInProgress = this['[[entries]]'].length - 1;
    this['[[entries]]'].forEach(_consume);
};

Subject.prototype.destroy = function(value) {
    this.emit('$destroy', value);
    this['[[entries]]'].length = 0;
};