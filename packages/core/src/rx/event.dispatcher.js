export class EventDispatcher extends  AbstractEventRx {
    dispatch(args) {
        this._status = 1;
        _eventRxTrigger(this, args);
    }
}