/**
 * @class Subject
 */
function Subject() {
    this.$notifyInProgress = 0;
    this.retry = false;
    this['[[entries]]'] = [];
    var events = {};
    this.get = function(key) {
        return this['[[entries]]'].filter(function(instance) {
            return instance.binding === key;
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

Subject.prototype.unsubscribe = function(bindingIdx) {
    this['[[entries]]'] = this['[[entries]]'].filter(function(instance) {
        return instance.binding !== bindingIdx;
    });

    if (this.$notifyInProgress) {
        this.$notifyInProgress--;
    }
};

Subject.prototype.subscribe = function(key, fn, core) {
    var self = this,
        bindingIdx = (fn ? key : 'core_' + +new Date);
    this['[[entries]]'].push({
        watchKey: fn ? key : undefined,
        handler: fn || key,
        state: false,
        core: core,
        binding: bindingIdx
    });

    return function() {
        self.unsubscribe(bindingIdx);
    };
};

Subject.prototype.observeForKey = function(key, fn, core) {
    var keyObserver = this.get(key),
        index = 0,
        unsubscribe = null;
    if (!keyObserver) {
        unsubscribe = this.subscribe(key, [fn], core);
    } else {
        index = keyObserver.length;
        keyObserver.handler.push(fn);
    }

    return function() {
        if (!index) {
            unsubscribe();
        } else {
            keyObserver.handler.splice(index, 1);
        }
    };
};

Subject.prototype.observeForCollection = function(key, fn) {
    var keyObserver = this.get(key),
        index = 0,
        unsubscribe;
    if (!keyObserver) {
        var snapshot = new SnapShotHashing(),
            handler = function() {
                var value = snapshot.getProfiling();
                handler.watches.forEach(function(_callback) {
                    _callback(value);
                });
            };
        handler.watches = [fn];
        unsubscribe = this.subscribe(key, handler, function(collection) {
            return snapshot.compare(collection);
        });
    } else {
        index = keyObserver.handler.watches.length;
        keyObserver.handler.watches.push(fn);
    }

    return function() {
        if (!keyObserver) {
            // make sure subjects re removed successfully
            unsubscribe();
        } else {
            keyObserver.handler.watches.splice(index, 1);
        }
    }
};

Subject.prototype.notifyAllObservers = function(model) {
    if (this.$notifyInProgress) {
        this.retry = true;
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
            if (_self.retry) {
                // trigger notification again
                _self.retry = false;
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