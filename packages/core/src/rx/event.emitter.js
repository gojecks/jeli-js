export function EventEmitter() {
    AbstractEventRx.call(this);
}

EventEmitter.prototype = Object.create(AbstractEventRx.prototype);
EventEmitter.prototype.constructor = AbstractEventRx;
EventEmitter.prototype.emit = function(args) {
    _eventRxTrigger(this, args);
};