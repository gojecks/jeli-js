import { inarray } from '@jeli/helpers';
import { errorBuilder } from '../utils/errorLogger';
import { CustomEventHandler } from './custom.event.handler';
import { ProxyEvent } from './event.proxy';

var customEventRegistry = new Map([
    ['window', new CustomEventHandler(window)],
    ['document', new CustomEventHandler(document)],
    ['body', new CustomEventHandler(document.body)]
]);

/**
 * 
 * @param {*} elementRef 
 * @param {*} events 
 */
export class EventHandler {
    constructor(events) {
        this._events = events;
        this.registeredEvents = new Map();
    }
    
    push(event){
        this._events.push(event);
    }

    static registerListener(element) {
        if (!element.events || !element.events._events.length) return;
        var eventInstance = element.events;
        var handler = function ($ev) {
            EventHandler.handleEvent(element, $ev);
        };

        /**
         *
         * @param {*} eventName
         * @param {*} useCapture
         */
        function _registerEvent(eventName, useCapture) {
            if (!eventInstance.registeredEvents.has(eventName)) {
                /**
                 * events that goes with a . e.g (window.message)
                 */
                if (eventName.includes('.')) {
                    var event = eventName.split('.');
                    var customRegistry = customEventRegistry.get(event.shift());
                    if (customRegistry) {
                        eventInstance.registeredEvents.set(
                            eventName, 
                            customRegistry.register(event.pop(), htmlEvent => {
                                EventHandler.handleEvent(element, htmlEvent, eventName);
                            })
                        );
                        customRegistry = null;
                    }
                } else {
                    element.nativeElement.addEventListener(eventName, handler, useCapture);
                    eventInstance.registeredEvents.set(eventName, function () {
                        element.nativeElement.removeEventListener(eventName, handler);
                    });
                }
            }
        }

        for (var event of eventInstance._events) {
            if (!event.custom) {
                event.name.split(' ').forEach(eventName => _registerEvent(eventName, !!event.target));
            }
        }
    }
    /**
     * Attach the EventEmitter to the component Instance
     * @param {*} element
     * @param {*} eventName
     * @param {*} componentInstance
     */
    static attachEventEmitter(element, eventName, componentInstance) {
        var registeredEvent = getEventsByType(element.events._events, eventName)[0];
        if (registeredEvent && registeredEvent.value) {
            var unSubscribe = componentInstance[eventName].subscribe(function (value) {
                // trigger change detector if defined
                var parentElement = element && element.parent;
                if (!parentElement) return;
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
    static attachEventDispatcher(element, eventName, componentInstance) {
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
                var unSubscribe = context[eventName].subscribe(function (value) {
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
     *
     * @param {*} element
     * @param {*} event
     * @param {*} eventName
     */
    static handleEvent(element, event, eventName) {
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

        function getClosest(target) {
            for (var query of target) {
                var ele = event.target.closest(query);
                if (ele) return ele;
            }

            return null;
        }

        /**
         *
         * @param {*} registeredEvent
         * @param {*} event
         */
        function triggerEvents(registeredEvent) {
            var _event = null;
            var context = element.context;
            if (registeredEvent.handler) {
                return registeredEvent.handler(event);
            } else if (registeredEvent.target) {
                var mainElement = getClosest(registeredEvent.target);
                if (!mainElement) return;
                context = mainElement[$elementContext];
                // overwrite the event target to return the right element
                _event = ProxyEvent(event, mainElement);
            }

            // get the component instance
            // events set from directives have to getInstance from Map<nodes>
            var componentInstance = registeredEvent.node ? element.nodes.get(registeredEvent.node) : element.hostRef.componentInstance;
            _executeEventsTriggers(
                registeredEvent.value,
                componentInstance,
                context,
                _event || event
            );

            // clean proxyEvent
            context = componentInstance = null;
            if (_event) {
                _event.target = _event.preventDefault = null;
            }
        }
    }

    destroy() {
        this.registeredEvents.forEach(cb => (cb && cb()));
        this.registeredEvents.clear();
        this._events.length = 0;
    }
}







/**
 * static APIs
 */
function getEventsByType(events, type) {
    return events.filter(function (event) {
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
            var fn = getFnFromContext(event, componentInstance, context);
            if (!fn) return errorBuilder('No context found for this event');

            // Check if Arguments is required
            var narg = generateArguments(event.args, context, componentInstance, ev);
            fn.apply(fn.context, narg);
            fn.context = null;
            fn = null;
        }
    }
}

/**
 * 
 * @param {*} eventInstance 
 * @param {*} componentInstance 
 * @param {*} context 
 * @returns 
 */
function getFnFromContext(eventInstance, componentInstance, context) {
    var instance = componentInstance;
    if (eventInstance.namespaces) {
        instance = resolveContext(eventInstance.namespaces, componentInstance, context);
    }

    var fn = instance[eventInstance.fn];
    // check FN and array instace
    if (!fn) return null;

    fn.context = ((instance instanceof Array || !componentInstance[eventInstance.fn]) ? instance : componentInstance);
    instance = null;
    return fn;
}

