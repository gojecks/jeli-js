function AbstractEventRx() {
    this._listeners = [];
    this._hooks = [];
    this._callback = null;
}

AbstractEventRx.prototype.when = function() {
    for (var i = 0; i < arguments.length; i++) {
        this._hooks.push(arguments[i]);
    }

    return this;
};

AbstractEventRx.prototype.subscribe = function(fn) {
    var index = this._listeners.length;
    if (typeof fn !== 'function') {
        errorBuilder('Expected a function got ' + typeof fn);
        return;
    }

    this._listeners.push(fn);
    /**
     * remove subscription
     */
    return () => {
        this._listeners.splice(index, 1);
    }
};

AbstractEventRx.prototype.destroy = function() {
    this._listeners.length = 0;
    this._hooks.length = 0;
};