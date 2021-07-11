export function EventDispatcher() {
    AbstractEventRx.call(this);
}

EventDispatcher.prototype = Object.create(AbstractEventRx.prototype);
EventDispatcher.prototype.constructor = AbstractEventRx;
EventDispatcher.prototype.dispatch = function(args) {
    this._listeners.forEach(function(fn) {
        fn(args);
    });
};