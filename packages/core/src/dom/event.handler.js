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

/**
 * this property holds registry for custom events
 */
EventHandler.customRegistry = {
    window: new CustomEventHandler(window),
    document: new CustomEventHandler(document)
};


EventHandler.registerListener = function(element) {
    if (!element.events || !element.events._events.length) return;
    var eventInstance = element.events;
    var handler = function($ev) { handleEvent(element, $ev); };

    /**
     * 
     * @param {*} eventName 
     */
    function _registerEvent(eventName) {
        if (!eventInstance.registeredEvents.has(eventName)) {
            /**
             * events that goes with a . e.g (window.message)
             */
            if (eventName.includes('.')) {
                var event = eventName.split('.');
                if (EventHandler.customRegistry[event[0]]) {
                    var unsubscribe = EventHandler.customRegistry[event[0]].register(event[1], function(htmlEvent) {
                        handleEvent(element, htmlEvent, eventName);
                    });
                    eventInstance.registeredEvents.set(eventName, unsubscribe);
                }
            } else {
                element.nativeElement.addEventListener(eventName, handler, false);
                eventInstance.registeredEvents.set(eventName, function() {
                    element.nativeElement.removeEventListener(eventName, handler);
                });
            }
        }
    }
    var totalEvents = eventInstance._events.length;
    while (totalEvents--) {
        var event = eventInstance._events[totalEvents];
        if (!event.custom) {
            event.name.split(' ').forEach(_registerEvent);
        }
    }
};


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
            return _executeEventsTriggers(eventValue, componentInstance, null, $event);
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
    var registeredEvent = getEventsByType(element.events._events, eventName)[0];
    if (registeredEvent && registeredEvent.value) {
        var unSubscribe = componentInstance[eventName].subscribe(function(value) {
            // trigger change detector if defined
            var parentElement = element && element.parent;
            parentElement = (parentElement.isc ? parentElement : parentElement.hostRef);
            _executeEventsTriggers(
                registeredEvent.value,
                parentElement.componentInstance,
                element.hasContext ? element.context : element.parent.hasContext ? element.parent.context : parentElement.context,
                value
            );

            parentElement && parentElement.changeDetector && parentElement.changeDetector.detectChanges();
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
EventHandler.attachEventDispatcher = function(element, eventName, componentInstance) {
    var registeredEvent = getEventsByType(element.events._events, eventName)[0];
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
                _executeEventsTriggers(
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
function getEventsByType(events, type) {
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
function _executeEventsTriggers(eventTriggers, componentInstance, context, ev) {
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
            var fn = getFnFromContext(event, componentInstance);
            if (fn) {
                // Check if Arguments is required
                var narg = generateArguments(event.args, context || componentInstance, null, ev);
                fn.apply(fn.context, narg);
                fn.context = null;
                fn = null;
            }
        }
    }
}

/**
 * @param {*} componentInstance
 * @param {*} eventInstance 
 */
function getFnFromContext(eventInstance, componentInstance) {
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

/**
 * 
 * @param {*} element 
 * @param {*} event 
 * @param {*} eventName 
 */
function handleEvent(element, event, eventName) {
    eventName = eventName || event.type;
    // prevent the default only when its any of these events
    if (inarray(eventName, ['touchstart', 'touchend', 'touchmove', 'submit'])) {
        event.preventDefault();
    }

    try {
        getEventsByType(element.events._events, eventName).forEach(triggerEvents);
    } catch (e) {
        errorBuilder(e);
    } finally {
        element && element.changeDetector && element.changeDetector.detectChanges();
    }

    function isClosest(target) {
        return target.some(query => event.target.closest(query));
    }

    /**
     * 
     * @param {*} registeredEvent 
     * @param {*} event 
     */
    function triggerEvents(registeredEvent) {
        if (registeredEvent.handler) {
            return registeredEvent.handler(event);
        } else {
            var selectedElem = element;
            if (registeredEvent.target) {
                if (!isClosest(registeredEvent.target)) return;
                selectedElem = event.target[$elementContext];
            }

            _executeEventsTriggers(
                registeredEvent.value,
                element.hostRef.componentInstance,
                selectedElem.context,
                event
            );

            selectedElem = null;
        }
    }
}

/**
 * Jeli event manager
 * @param {*} element 
 */
export function CustomEventHandler(element) {
    var _this = this;
    var trigger = function(event) { _this.trigger(event); };
    this.element = element;
    this.registeredEvents = {};
    this.register = function(type, callback) {
        var _this = this;
        var index = -1;
        if (this.element && this.registeredEvents) {
            if (!this.registeredEvents.hasOwnProperty(type)) {
                this.registeredEvents[type] = [];
                this.element.addEventListener(type, trigger, false);
            }
            index = this.registeredEvents[type].push(callback);
            /**
             * unregister
             */
            return function() {
                _this.registeredEvents[type].splice(index - 1, 1);
            }
        }
    };

    this.trigger = function(event) {
        var listeners = this.registeredEvents[event.type];
        if (listeners && listeners.length) {
            listeners.forEach(function(listener) {
                listener(event);
            })
        }
    };

    this.destroy = function() {
        for (var type in this.registeredEvents) {
            this.registeredEvents[type].length = 0;
            delete this.registeredEvents[type];
            this.element.removeEventListener(type, trigger, false);
        }
        this.element = null;
        this.registeredEvents = null;
    };
}