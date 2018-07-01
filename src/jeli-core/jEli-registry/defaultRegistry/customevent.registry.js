//$CustomEventHandler Function
//Create Custom events that can be reused
//anywhere within the application

/**
 * 
 * @param {*} type 
 * @param {*} defaultFn 
 */
function $CustomEventHandler(type, defaultFn) {
    if (!type) { type = 'on' };
    var handlers = ['on', 'emit'],
        _eventsQueue = {},
        _eventsObj = function() {
            return ({
                type: "",
                registered: +new Date,
                timestamp: +new Date,
                isTrusted: true,
                returnValue: true,
                target: null,
                defaultPrevented: false,
                preventDefault: function() {
                    this.defaultPrevented = true;
                }
            });
        },
        _defaultFn = defaultFn || function() {};

    this[type] = function(name, fn) {
        if (!_eventsQueue[name]) {
            _eventsQueue[name] = [];
        }
        _eventsQueue[name].push(fn);
        return _eventsQueue[name].length - 1;
    };

    /**
     * 
     * @param {*} name 
     */
    this.$broadcast = function(name) {
        var _events = _eventsObj();
        _events.type = name;
        _events.timestamp = +new Date;
        var arg = [_events].concat(Array.prototype.slice.call(arguments, 1, arguments.length));
        if (_eventsQueue[name]) {
            _eventsQueue[name].forEach(function(fn) {
                fn.apply(fn, arg);
            });
        }
        // trigger the defaultFn
        if (!_events.defaultPrevented) {
            _defaultFn.apply(_defaultFn, arg);
        }

    };

    /**
     * 
     * @param {*} eventName 
     * @param {*} index 
     */
    this.$removeOne = function(eventName, index) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            _eventsQueue[eventName].splice(1, index);
        }
    };

    /**
     * 
     * @param {*} name 
     */
    this.$destroy = function(name) {
        if (name && _eventsQueue[name]) {
            delete _eventsQueue[name];
        }
    };

    this.getOne = function(eventName, idx) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            return _eventsQueue[eventName][idx];
        }
    };
}

/**
 * register our API - $jEvents
 * to $jFactoryProvider
 */
_defaultRegistry('j-eli', '$jFactoryProvider', '$jEvents')(function() {
    return $CustomEventHandler;
});