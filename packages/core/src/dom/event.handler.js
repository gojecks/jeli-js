import { inarray, isequal } from 'js-helpers/helpers';
import { errorBuilder } from '../utils/errorLogger';


/**
 * 
 * @param {*} elementRef 
 * @param {*} events 
 */
function EventHandler(elementRef, events) {
    this._events = (events || []).slice();
    this.add = function(_event) {
        this._events.push(_event);
    };
    this.registeredEvents = new Map();
    this.element = elementRef;
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
        // prevent the default only when its any of these events
        if (inarray(ev.type, ['touchstart', 'touchend', 'touchmove'])) {
            ev.preventDefault();
        }

        try {
            EventHandler
                .getEventsByType(_this._events, ev.type)
                .forEach(function(event) {
                    triggerEvents(event, ev);
                });
        } catch (e) {
            errorBuilder(e);
        } finally {
            _this.element && _this.element.changeDetector.detectChanges();
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
                _this.element.hostRef.componentInstance,
                _this.element.context,
                mouseEvent
            );
        }
    }

    /**
     * 
     * @param {*} eventName 
     */
    function registerEvent(eventName) {
        if (!_this.registeredEvents.has(eventName)) {
            _this.element.nativeElement.addEventListener(eventName, jEventHandler, false);
            _this.registeredEvents.set(eventName, function() {
                _this.element.nativeElement.removeEventListener(eventName, jEventHandler);
            });
        }
    }



    for (var i = 0; i < this._events.length; i++) {
        var event = this._events[i];
        if (!event.custom) {
            event.name.split(' ').forEach(registerEvent);
        }
    }
};

/**
 * 
 * @param {*} eventName 
 * @param {*} eventValue 
 * @param {*} componentInstance 
 */
EventHandler.prototype.attachEventHandler = function(eventName, eventValue, componentInstance) {
    /**
     * 
     * @param {*} handler 
     * @param {*} componentInstance 
     */
    this.add({
        name: eventName,
        handler: function($event) {
            return EventHandler._executeEventsTriggers(eventValue, componentInstance, null, $event);
        }
    });
}

/**
 * Attach the EventEmitter to the component Instance
 * @param {*} eventName
 */
EventHandler.prototype.attachEventEmitter = function(eventName, componentInstance) {
    var _this = this;
    var registeredEvent = this.getEvent(eventName);
    if (registeredEvent && registeredEvent.value) {
        var unSubscribe = componentInstance[eventName].subscribe(function(value) {
            EventHandler._executeEventsTriggers(
                registeredEvent.value,
                _this.element.parent.componentInstance,
                _this.element.context,
                value
            );
            _this.element.parent.changeDetector.detectChanges();
        });
        /**
         * destroy the subscription
         */
        this.registeredEvents.set(eventName, unSubscribe);
    }
}

/**
 * 
 * @param {*} options 
 * @param {*} componentInstance 
 */
EventHandler.prototype.attachEventDispatcher = function(eventName, componentInstance) {
    var registeredEvent = this.getEvent(eventName);
    var context = null;
    if (registeredEvent && registeredEvent.value.length) {
        context = this.element.context;
        if (this.element.isc) {
            context = this.element.parent.context;
        }

        /**
         * get the method Name
         * and default handlers
         * replace the default handler with dispatcher event handler
         */
        // context[registeredEvent.value[0].fn] =
        //     /**
        //      * 
        //      * @param {*} value 
        //      */
        //     function eventHandler(value) {
        //         /**
        //          * dispatch the event to the child view
        //          */
        //         EventHandler._executeEventsTriggers(options.value, componentInstance, null, value);
        //         elementRef.parent.changeDetector.detectChanges();
        //     };

    }
}

EventHandler.prototype.destroy = function() {
    this.registeredEvents.forEach(function(removeListenerFn) {
        removeListenerFn();
    });
    this.registeredEvents.clear();
    this._events = [];
    this.element = null;
};


/**
 * static APIs
 */
EventHandler.getEventsByType = function(events, type) {
    return events.filter(function(event) {
        return event.name.split(/\s/g).includes(type);
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
        if (event.left) {
            parseObjectExpression(event, context, componentInstance, ev);
        } else if (event.fn) {
            // set nameSpaces
            var fn = EventHandler.getFnFromContext(event, componentInstance);
            // Check if Arguments is required
            var narg = generateArguments(event.args, context || componentInstance, null, ev);
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
    if (eventInstance.namespaces) {
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