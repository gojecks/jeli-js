import { isfunction } from 'js-helpers/helpers';
export function EventEmitter() {
    this._listeners = [];
}

EventEmitter.prototype.subscribe = function(fn) {
    var index = this._listeners.length;
    var _this = this;
    if (isfunction(fn)) {
        this._listeners.push(fn);
    }

    /**
     * remove subscription
     */
    return function() {
        _this._listeners.slice(index, 1);
    }
};

EventEmitter.prototype.emit = function(args) {
    this._listeners.forEach(function(fn) {
        fn(args);
    });
};

EventEmitter.prototype.destroy = function() {
    this._listeners.length = 0;
};