/**
 * CustomEventHandler
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

    var registered = +new Date;
    var _eventsQueue = {};
    var _eventsObj = function() {
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
    };
    var _defaultFn = defaultFn || function() {};

    /**
     * CustomEvent Instance
     */
    function CustomEvent() {
        this[type] = function(name, fn) {
            if (!_eventsQueue[name]) {
                _eventsQueue[name] = [];
            }
            _eventsQueue[name].push(fn);
            return _eventsQueue[name].length - 1;
        };
    }

    /**
     * 
     * @param {*} name 
     */
    CustomEvent.prototype.dispatch = function(name) {
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
    CustomEvent.prototype.unlink = function(eventName, index) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            _eventsQueue[eventName].splice(1, index);
        }
    };

    /**
     * 
     * @param {*} name 
     */
    CustomEvent.prototype.destroy = function(name) {
        if (name && _eventsQueue[name]) {
            delete _eventsQueue[name];
        }
    };

    CustomEvent.prototype.one = function(eventName, idx) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            return _eventsQueue[eventName][idx];
        }
    };

    return (new CustomEvent)
}