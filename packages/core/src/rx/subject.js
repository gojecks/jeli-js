export function Subject() {
    this._subscribers = [];

    this.next = function(value) {
        this._subscribers.forEach(function(callback) {
            callback(value);
        });
    };
}

Subject.prototype.subscribe = function(callback) {
    this._subscribers.push(callback);
};

Subject.prototype.unsubscribe = function(fn) {
    this._subscribers = this._subscribers.filter(function(callback) {
        return callback !== fn;
    });
};

Subject.prototype.destroy = function() {
    this._subscribers.length = 0;
};