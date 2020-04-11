import { inarray, isnull } from 'js.helpers/helpers';
/**
 * 
 * @param {*} elementRef 
 * @param {*} events 
 */
function EventHandler(elementRef, events) {
    this._events = events || [];
    this.add = function(_event) {
        this._events.push(_event);
    };
    this.registeredEvents = [];

    Object.defineProperty(this, 'node', {
        get: function() {
            return elementRef;
        }
    });
}

EventHandler.prototype.getEvent = function(eventName) {
    return EventHandler.getEventsByType(this._events, eventName)[0];
};


EventHandler.prototype.registerListener = function() {
    if (!this._events.length) {
        return;
    }

    var _this = this;
    /**
     * @method jEventHandler
     * @param {*} ev 
     */
    function jEventHandler(ev) {
        // prevent the default only when its a submit event
        if (inarray(ev.type, ['submit', 'touchstart', 'touchend', 'touchmove'])) {
            ev.preventDefault();
        }

        try {
            EventHandler.getEventsByType(_this._events, ev.type)
                .forEach(function(event) {
                    triggerEvents(event, ev);
                });
        } catch (e) {
            errorBuilder(e);
        } finally {
            _this.node.changeDetector.detectChanges();
        }
    }

    /**
     * 
     * @param {*} registeredEvent 
     * @param {*} mouseEvent 
     */
    function triggerEvents(registeredEvent, mouseEvent) {
        if (registeredEvent.handler) {
            registeredEvent.handler(mouseEvent);
        } else {
            EventHandler._executeEventsTriggers(
                registeredEvent.value,
                _this.node.hostRef.componentInstance,
                _this.node.context,
                mouseEvent
            );
        }
    }



    for (var i = 0; i < this._events.length; i++) {
        var event = this._events[i];
        if (!event.custom) {
            event.name.split(' ').forEach(function(eventName) {
                /**
                 * j-change requires j-model
                 * check if j-model is defined when this event is used
                 */
                if (inarray('change', eventName) && !event.handler) {
                    if (!_this.node.getDirective('model')) {
                        errorBuilder('ChangeEventListener requires jModel Directive to perform');
                    }
                }

                if (isnull(_this.node.nativeElement['on' + eventName])) {
                    _this.registeredEvents.push(eventName);
                    _this.node.nativeElement['on' + eventName] = jEventHandler;
                }
            });
        }
    }
};


EventHandler.prototype.destroy = function() {
    while (this.registeredEvents.length) {
        var event = this.registeredEvents.pop();
        this.node.nativeElement['on' + event] = null;
    }
    this._events.length = [];
};

EventHandler.getEventsByType = function(events, type) {
    return events.filter(function(event) {
        return inarray(event.name, type);
    });
};

/**
 * 
 * @param {*} eventTriggers 
 * @param {*} componentInstance 
 * @param {*} context 
 * @param {*} ev 
 */
EventHandler._executeEventsTriggers = function(eventTriggers, componentInstance, context, ev) {
    eventTriggers.forEach(_dispatch);
    /**
     * 
     * @param {*} event 
     */
    function _dispatch(event) {
        // check if Operation is set value
        if (event.key) {
            var value = resolveValueFromContext(event.value, context || componentInstance);
            setModelValue(event.key, context || componentInstance, value);
        } else if (event.fn) {
            // set nameSpaces
            var fn = EventHandler.getFnFromContext(event, componentInstance);
            // Check if Arguments is required
            var narg = generateArguments(event.arg, context || componentInstance, ev);
            var ret = fn.apply(fn.context, narg);
            fn.context = null;
            fn = null;

            return ret;
        }
    }
}

/**
 * @param {*} componentInstance
 * @param {*} eventInstance 
 */
EventHandler.getFnFromContext = function(eventInstance, componentInstance) {
    var instance = componentInstance;
    if (eventInstance.namespaces.length > 0) {
        instance = resolveContext(eventInstance.namespaces, componentInstance);
    }

    var fn = instance[eventInstance.fn];
    /**
     * Array instance
     */
    if ((instance instanceof Array) || !componentInstance[eventInstance.fn]) {
        fn.context = instance;
    } else {
        fn.context = componentInstance;
    }

    instance = null;

    return fn;
};

EventHandler.types = {
    change: ['checkbox', 'radio', 'select-one', 'select-multiple', 'select'],
    input: ['text', 'password', 'textarea', 'email', 'url', 'week', 'time', 'search', 'tel', 'range', 'number', 'month', 'datetime-local', 'date', 'color']
};

EventHandler.getEventType = function(el) {
    var type = "input";
    if (inarray(el.type, EventHandler.types.input)) {
        type = 'input';
    } else if (inarray(el.type, EventHandler.types.change)) {
        type = 'change';
    }

    return type;
}