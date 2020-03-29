function SimpleEventEmitter() {
    this._listeners = [];
    this.subscribe = function(fn) {
        if ($isFunction(fn)) {
            this._listeners.push(fn);
        }
    };
}

SimpleEventEmitter.prototype.emit = function(args) {
    this._listeners.forEach(function(fn) {
        fn(args);
    });
};

SimpleEventEmitter.prototype.destroy = function() {
    this._listeners.length = 0;
};