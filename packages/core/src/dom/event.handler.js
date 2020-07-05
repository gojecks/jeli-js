import { inarray, isequal } from 'js-helpers/helpers';
import { errorBuilder } from '../utils/errorLogger';


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
    this.registeredEvents = new Map();

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
                if (!_this.registeredEvents.has(eventName)) {
                    _this.node.nativeElement.addEventListener(eventName, jEventHandler, false);
                    _this.registeredEvents.set(eventName, function() {
                        _this.node.nativeElement.removeEventListener(eventName, jEventHandler);
                    });
                }
            });
        }
    }
};


EventHandler.prototype.destroy = function() {
    this.registeredEvents.forEach(function(removeListenerFn) {
        removeListenerFn();
    });
    this.registeredEvents.clear();
    this._events.length = [];
};

EventHandler.getEventsByType = function(events, type) {
    return events.filter(function(event) {
        return isequal(event.name, type);
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
            parseObjectExpression(event, context || componentInstance, ev);
        } else if (event.fn) {
            // set nameSpaces
            var fn = EventHandler.getFnFromContext(event, componentInstance);
            // Check if Arguments is required
            var narg = generateArguments(event.args, context || componentInstance, ev);
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