function SimpleSubject() {
    var _subscribers = [];

    function subject() {
        this.subscribe = function(callback) {
            _subscribers.push(callback);
        };
    }

    subject.prototype.next = function(value) {
        _subscribers.forEach(function(callback) {
            callback(value);
        });
    };

    subject.prototype.unsubscribe = function(fn) {
        _subscribers = _subscribers.filter(function(callback) {
            return callback !== fn;
        });
    };

    subject.prototype.destroy = function() {
        _subscribers.length = 0;
    };

    return new subject;
}