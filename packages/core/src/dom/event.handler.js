import { inarray, isequal } from 'js-helpers/helpers';
import { errorBuilder } from '../utils/errorLogger';


/**
 * 
 * @param {*} elementRef 
 * @param {*} events 
 */
function EventHandler(events) {
    this._events = events;
    this.registeredEvents = new Map();
}

EventHandler.prototype.destroy = function() {
    this.registeredEvents.forEach(function(removeListenerFn) {
        removeListenerFn();
    });
    this.registeredEvents.clear();
    this._events.length = 0;
};


EventHandler.registerListener = function(element) {
    if (!element.events._events.length) {
        return;
    }

    var eventInstance = element.events;

    function handler($ev) { EventHandler.HandleEvent(element, $ev); };

    /**
     * 
     * @param {*} eventName 
     */
    function _registerEvent(eventName) {
        if (!eventInstance.registeredEvents.has(eventName)) {
            element.nativeElement.addEventListener(eventName, handler, false);
            eventInstance.registeredEvents.set(eventName, function() {
                element.nativeElement.removeEventListener(eventName, handler);
            });
        }
    }

    for (var i = 0; i < eventInstance._events.length; i++) {
        var event = eventInstance._events[i];
        if (!event.custom) {
            event.name.split(' ').forEach(_registerEvent);
        }
    }
};

/**
 * 
 * @param {*} element 
 * @param {*} event 
 */
EventHandler.HandleEvent = function(element, event) {
    // prevent the default only when its any of these events
    if (inarray(event.type, ['touchstart', 'touchend', 'touchmove'])) {
        event.preventDefault();
    }

    try {
        EventHandler
            .getEventsByType(element.events._events, event.type)
            .forEach(triggerEvents);
    } catch (e) {
        errorBuilder(e);
    } finally {
        element && element.changeDetector.detectChanges();
    }

    /**
     * 
     * @param {*} registeredEvent 
     * @param {*} event 
     */
    function triggerEvents(registeredEvent) {
        if (registeredEvent.handler) {
            registeredEvent.handler(event);
        } else {
            EventHandler._executeEventsTriggers(
                registeredEvent.value,
                element.hostRef.componentInstance,
                element.context,
                event
            );
        }
    }
}


/**
 * 
 * @param {*} eventInstance 
 * @param {*} eventName 
 * @param {*} eventValue 
 * @param {*} componentInstance 
 */
EventHandler.attachEvent = function(eventInstance, eventName, eventValue, componentInstance) {
    eventInstance._events.push({
        name: eventName,
        handler: function($event) {
            return EventHandler._executeEventsTriggers(eventValue, componentInstance, null, $event);
        }
    });
};

/**
 * Attach the EventEmitter to the component Instance
 * @param {*} element 
 * @param {*} eventName 
 * @param {*} componentInstance 
 */
EventHandler.attachEventEmitter = function(element, eventName, componentInstance) {
    var registeredEvent = EventHandler.getEventsByType(element.events._events, eventName)[0];
    if (registeredEvent && registeredEvent.value) {
        var unSubscribe = componentInstance[eventName].subscribe(function(value) {
            EventHandler._executeEventsTriggers(
                registeredEvent.value,
                element.parent.componentInstance,
                element.context,
                value
            );
            element && element.parent.changeDetector.detectChanges();
        });
        /**
         * destroy the subscription
         */
        element.events.registeredEvents.set(eventName, unSubscribe);
    }
}

/**
 * 
 * @param {*} element 
 * @param {*} eventName 
 * @param {*} componentInstance 
 */
EventHandler.prototype.attachEventDispatcher = function(element, eventName, componentInstance) {
    var registeredEvent = EventHandler.getEventsByType(element.events._events, eventName)[0];
    var context = null;
    if (registeredEvent && registeredEvent.value) {
        context = element.context;
        if (element.isc) {
            context = element.parent.context;
        }

        /**
         * get the method Name
         * and default handlers
         * replace the default handler with dispatcher event handler
         */
        if (context.hasOwnProperty(eventName)) {
            var unSubscribe = context[eventName].subscribe(function(value) {
                EventHandler._executeEventsTriggers(
                    registeredEvent.value,
                    componentInstance,
                    element.context,
                    value
                );
                element && element.changeDetector.detectChanges();
            });

            /**
             * destroy the subscription
             */
            element.events.registeredEvents.set(eventName, unSubscribe);
        }
    }
}


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