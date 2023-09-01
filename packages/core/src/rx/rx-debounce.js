import { debounce } from "./rx.utils";

export function EventDebounce(timer, immediate) {
    AbstractEventRx.call(this);
    this._callback = debounce(value => {
        _eventRxTrigger(this, value);
    }, timer, immediate);
}

EventDebounce.prototype = Object.create(AbstractEventRx.prototype);
EventDebounce.prototype.constructor = AbstractEventRx;
EventDebounce.prototype.next = function(args) {
    this._callback(args);
};