import { inarray, isequal } from '@jeli/helpers';
import { errorBuilder } from '../utils/errorLogger';
import { CustomEventHandler } from './custom.event.handler';
import { ProxyEvent } from './event.proxy';

const customEventRegistry = new Map([
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
        const eventInstance = element.events;
        const handler = function ($ev) {
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
                    const event = eventName.split('.');
                    const customRegistry = customEventRegistry.get(event.shift());
                    const _customRegistryHandler = evName => {
                        evName = evName.replace(/[_]/gi, '-');
                        eventInstance.registeredEvents.set(
                            eventName, 
                            customRegistry.register(evName, htmlEvent => {
                                EventHandler.handleEvent(element, htmlEvent, eventName);
                            })
                        );
                    };

                    if (customRegistry) {
                        event.pop().split(',').forEach(_customRegistryHandler);                        
                    }
                } else {
                    element.nativeElement.addEventListener(eventName, handler, useCapture);
                    eventInstance.registeredEvents.set(eventName, function () {
                        element.nativeElement.removeEventListener(eventName, handler);
                    });
                }
            }
        }

        for (const event of eventInstance._events) {
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
        const registeredEvent = getEventsByType(element.events._events, eventName)[0];
        if (registeredEvent && (registeredEvent.value || registeredEvent.compiledFn)) {
            const unSubscribe = componentInstance[eventName].subscribe((value) => {
                // trigger change detector if defined
                var parentElement = element && element.parent;
                if (!parentElement) return;
                parentElement = (parentElement.isc ? parentElement : parentElement.hostRef);
                const dispatchContext = element.hasContext ? element.context : element.parent.hasContext ? element.parent.context : parentElement.context;
                if (typeof registeredEvent.compiledFn === 'function') {
                    registeredEvent.compiledFn(dispatchContext, parentElement.componentInstance, value);
                } else {
                    _executeEventsTriggers(
                        registeredEvent.value,
                        parentElement.componentInstance,
                        dispatchContext,
                        value
                    );
                }

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
        const registeredEvent = getEventsByType(element.events._events, eventName)[0];
        let context = null;
        if (registeredEvent && (registeredEvent.value || registeredEvent.compiledFn)) {
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
                const unSubscribe = context[eventName].subscribe(function (value) {
                    if (typeof registeredEvent.compiledFn === 'function') {
                        registeredEvent.compiledFn(element.context, componentInstance, value);
                    } else {
                        _executeEventsTriggers(
                            registeredEvent.value,
                            componentInstance,
                            element.context,
                            value
                        );
                    }
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
            for (const query of target) {
                const ele = event.target.closest(query);
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
            let _event = null;
            let context = element.context;
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
            const componentInstance = registeredEvent.node ? element.nodes.get(registeredEvent.node) : element.hostRef.componentInstance;
            // use the compiler-produced fn if present, see catalogue [[jeli-js]] "Compiled event bindings"
            if (typeof registeredEvent.compiledFn === 'function') {
                registeredEvent.compiledFn(context, componentInstance, _event || event);
            } else {
                _executeEventsTriggers(
                    registeredEvent.value,
                    componentInstance,
                    context,
                    _event || event
                );
            }

            // clean proxyEvent
            context = null;
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
        // check if operation is to set value
        if (event.left) {
            parseObjectExpression(event, context, componentInstance, ev);
        } else if (event.fn) {
            let instance = componentInstance;
            if (event.namespaces) {
                // $event as the call-target root (e.g. $event.stopPropagation(),
                // $event.target.closest(...)) resolves against the real DOM
                // event, not componentInstance/context
                instance = isequal(event.namespaces[0], '$event')
                    ? resolveContext(event.namespaces.slice(1), ev, componentInstance, true)
                    : resolveContext(event.namespaces, componentInstance, context);
            }

            // check FN and array instance
            if (!instance[event.fn] && !context[event.fn]) return errorBuilder('No context found for this event');
            // Check if Arguments is required
            const narg = generateArguments(event.args, context, componentInstance, ev);
            if(instance[event.fn]) instance[event.fn](...narg);
            else context[event.fn](...narg);
        }
    }
}

