import { isfunction } from 'js-helpers/helpers';
export function EventEmitter() {
    this._listeners = [];
    this.subscribe = function(fn) {
        if (isfunction(fn)) {
            this._listeners.push(fn);
        }
    };
}

EventEmitter.prototype.emit = function(args) {
    this._listeners.forEach(function(fn) {
        fn(args);
    });
};

EventEmitter.prototype.destroy = function() {
    this._listeners.length = 0;
};