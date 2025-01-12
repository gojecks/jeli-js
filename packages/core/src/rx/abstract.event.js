var rxEventStatus = ['pending', 'inprogress', 'complete'];
class AbstractEventRx {
    constructor() {
        this._listeners = [];
        this._hooks = [];
        this._callback = null;
        this._status = 0;
    }
    when() {
        for (var i = 0; i < arguments.length; i++) {
            this._hooks.push(arguments[i]);
        }

        return this;
    }
    subscribe(fn) {
        var index = this._listeners.length;
        if (typeof fn !== 'function') {
            errorBuilder('Expected a function got ' + typeof fn);
            return;
        }

        this._listeners.push(fn);
        /**
         * remove subscription
         */
        return () => this.destroy(index);
    }
    destroy(index) {
        if (this._status == 1 && this._listeners.length) {
            this._status = 2;
            return;
        }

        if (index == this._listeners.length) {
            this._listeners.length = 0;
            this._hooks.length = 0;
        } else {
            this._listeners.splice(index, 1);
        }
    }
}



