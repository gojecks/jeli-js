import { hashcode } from 'js-helpers/utils';
import { isobject, isfunction, isequal } from 'js-helpers/helpers';
/**
 * @class Observer
 */
export function Observer() {
    this.$notifyInProgress = 0;
    this.bindingIdx = 0;
    this.retry = false;
    this._entries = [];
    this._events = {};
    this.get = function(key) {
        return this._entries.filter(function(instance) {
            return instance.binding === key;
        })[0];
    };

    /**
     * @param {*} eventName
     * @param {*} listener
     */
    this.on = function(eventName, listener) {
        if (!this._events.hasOwnProperty(eventName)) {
            this._events[eventName] = [];
        }
        /**
         * push the listener
         */
        this._events[eventName].push(listener);
        return this;
    };

    /**
     * @param {*} eventName
     * @param {*} listener
     */
    this.emit = function(eventName) {
        if (this._events.hasOwnProperty(eventName)) {
            var events = this._events[eventName];
            var arg = [].splice.call(arguments);
            arg.shift();
            while (events.length) {
                var fn = this._events[eventName].pop();
                fn.apply(fn, arg);
            }
        }
    };
}

Observer.prototype.unsubscribe = function(bindingIdx) {
    this._entries = this._entries.filter(function(instance) {
        return instance.binding !== bindingIdx;
    });
    if (this.$notifyInProgress) {
        this.$notifyInProgress--;
    }
};

Observer.prototype.subscribe = function(key, fn, core) {
    var self = this,
        bindingIdx = (fn ? key : 'core_' + ++this.bindingIdx);

    this.retry = true;
    this._entries.push({
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

Observer.prototype.observeForKey = function(key, fn, core) {
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

/**
 * @param {*} model
 * @param {*} ignoreCheck
 */
Observer.prototype.notifyAllObservers = function(model, ignoreCheck) {
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
        /**
         * check if observer is destroyed
         */
        if (!_self.$notifyInProgress) {
            return;
        }

        if (observer.watchKey) {
            if (model) {
                var value;
                if (isfunction(observer.watchKey)) {
                    value = observer.watchKey(model);
                } else {
                    value = resolveValueFromContext(observer.watchKey, model);
                }

                if (observer.core && isfunction(observer.core)) {
                    if (observer.core(value)) {
                        _trigger(observer.handler, value);
                    }
                } else if (ignoreCheck || _comparison(value, observer)) {
                    _trigger(observer.handler, value);
                }
            }

        } else {
            observer.handler(model);
        }

        /**
         * change status
         */

        if (isequal((idx + 1), _self.$notifyInProgress)) {
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
        if (isobject(handlers)) {
            handlers.forEach(function(cb) {
                cb(value);
            });
        } else {
            handlers(value);
        }
    }

    function _comparison(value, Observer) {
        if (isobject(value)) {
            value = hashcode(JSON.stringify(value));
        }
        var noChanges = !isequal(value, Observer.lastValue);
        Observer.lastValue = value;
        return noChanges;
    }

    this.$notifyInProgress = this._entries.length;
    for (var i = 0; i < this.$notifyInProgress; i++) {
        _consume(this._entries[i], i);
    }
};

Observer.prototype.destroy = function(value) {
    this._entries.length = 0;
    this.emit('$destroy', value);
    this.notifyAllObservers = 0;
    this.retry = false;
    this._events = null;
};