import { isfunction } from 'js.helpers/helpers';
export function SimpleEventEmitter() {
    this._listeners = [];
    this.subscribe = function(fn) {
        if (isfunction(fn)) {
            this._listeners.push(fn);
        }
    };
}

SimpleEventEmitter.prototype.emit = function(args) {
    this._listeners.forEach(function(fn) {
        fn(args);
    });
};

SimpleEventEmitter.prototype.destroy = function() {
    this._listeners.length = 0;
};