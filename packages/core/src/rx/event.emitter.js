export class EventEmitter extends AbstractEventRx {
    emit(args) {
        this._status = 1;
        _eventRxTrigger(this, args);
    }
}