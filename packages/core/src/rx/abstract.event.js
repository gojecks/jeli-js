function AbstractEventRx() {
    this._listeners = [];
}

AbstractEventRx.prototype.subscribe = function(fn) {
    var index = this._listeners.length;
    var _this = this;
    if (typeof fn !== 'function') {
        errorBuilder('Expected a function got ' + typeof fn);
        return;
    }

    this._listeners.push(fn);
    /**
     * remove subscription
     */
    return function() {
        _this._listeners.slice(index, 1);
    }
};

AbstractEventRx.prototype.destroy = function() {
    this._listeners.length = 0;
};