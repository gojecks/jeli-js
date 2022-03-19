/**
 * 
 * @param {*} defaultCallback 
 * @param {*} eventExtensionMethod 
 */
export function EventManager(defaultCallback, eventExtensionMethod) {
    var _events = {};
    this.defaultCallback = defaultCallback || function() {};
    this.eventExtensionMethod = typeof eventExtensionMethod === 'function' ? eventExtensionMethod : function(obj) { return obj; };
    /**
     * 
     * @param {*} eventName 
     * @param {*} callback 
     * @returns 
     */
    this.add = function(eventName, callback) {
        if (!_events.hasOwnProperty(eventName)) {
            _events[eventName] = [];
        }
        _events[eventName].push(callback);
        return _events[eventName].length - 1;
    };

    this.get = function(eventName) {
        return _events[eventName] || [];
    };
}

/**
 * 
 * @param {*} type 
 * @returns 
 */
EventManager.prototype._eventsObj = function(type) {
    return this.eventExtensionMethod({
        type: type,
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

/**
 * 
 * @param {*} eventName 
 */
EventManager.prototype.dispatch = function(eventName) {
    var eventObj = this._eventsObj(eventName);
    var arg = [eventObj].concat(Array.prototype.slice.call(arguments, 1, arguments.length));
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        eventListeners.forEach(function(fn) {
            fn.apply(fn, arg);
        });
    }

    // trigger callback
    // trigger the defaultFn
    if (!eventObj.defaultPrevented) {
        this.defaultCallback.apply(this.defaultCallback, arg);
    }
}

/**
 * 
 * @param {*} eventName 
 * @param {*} index 
 */
EventManager.prototype.unlink = function(eventName, index) {
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        eventListeners.splice(1, index);
    }
};

/**
 * 
 * @param {*} eventName
 */
EventManager.prototype.destroy = function(eventName) {
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        eventListeners.length = 0;
    }
};

/**
 * 
 * @param {*} eventName 
 * @param {*} idx 
 * @returns 
 */
EventManager.prototype.one = function(eventName, idx) {
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        return eventListeners[idx];
    }
};