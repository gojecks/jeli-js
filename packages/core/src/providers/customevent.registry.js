//CustomEventHandler Function
//Create Custom events that can be reused
//anywhere within the application

/**
 * 
 * @param {*} type 
 * @param {*} defaultFn 
 */
export function CustomEventHandler(type, defaultFn, eventExtension) {
    if (!type) { type = 'on' };
    /**
     * check if eventExtension is defined or create fallback
     */
    if (typeof eventExtension !== 'function') {
        eventExtension = function(obj) {
            return obj;
        };
    }

    var registered = +new Date,
        _eventsQueue = {},
        _eventsObj = function() {
            return eventExtension({
                type: "",
                registered: registered,
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