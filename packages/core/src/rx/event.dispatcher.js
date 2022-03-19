export function EventDispatcher() {
    AbstractEventRx.call(this);
}

EventDispatcher.prototype = Object.create(AbstractEventRx.prototype);
EventDispatcher.prototype.constructor = AbstractEventRx;
EventDispatcher.prototype.dispatch = function(args) {
    _eventRxTrigger(this, args);
};