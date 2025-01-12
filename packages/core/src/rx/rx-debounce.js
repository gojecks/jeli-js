import { debounce } from "./rx.utils";

export class EventDebounce extends AbstractEventRx {
    constructor(timer, immediate){
        super();
        this._callback = debounce(value => {
            this._status = 1;
            _eventRxTrigger(this, value);
        }, timer, immediate);
    }

    next (args) {
        this._callback(args);
    }
}
