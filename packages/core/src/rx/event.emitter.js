export function EventEmitter() {
    AbstractEventRx.call(this);
}

EventEmitter.prototype = Object.create(AbstractEventRx.prototype);
EventEmitter.prototype.constructor = AbstractEventRx;
EventEmitter.prototype.emit = function(args) {
    this._listeners.forEach(function(fn) {
        fn(args);
    });
};