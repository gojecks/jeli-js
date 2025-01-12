/**
 * Jeli event manager
 * @param {*} element 
 */
/**
 * Jeli event manager
 * @param {*} element
 */
export class CustomEventHandler {
    constructor(element) {
        var trigger = (event) => { this.trigger(event); };
        this.element = element;
        this.registeredEvents = {};
        this.register = function (type, callback) {
            var index = -1;
            if (element && `on${type}` in element) {
                if (!this.registeredEvents.hasOwnProperty(type)) {
                    this.registeredEvents[type] = [];
                    this.element.addEventListener(type, trigger, false);
                }
                index = this.registeredEvents[type].push(callback);
                // unregister
                return () => this.registeredEvents[type].splice(index - 1, 1);
            }
        };
    }
    trigger(event) {
        var listeners = this.registeredEvents[event.type] || [];
        for (var i = 0; i < listeners.length; i++) {
            listeners[i](event);
        }
    }

    destroy() {
        for (var type in this.registeredEvents) {
            this.registeredEvents[type].length = 0;
            delete this.registeredEvents[type];
            this.element.removeEventListener(type, trigger, false);
        }
        this.element = null;
        this.registeredEvents = null;
    }
}