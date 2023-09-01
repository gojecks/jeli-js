/**
 * Jeli event manager
 * @param {*} element 
 */
export function CustomEventHandler(element) {
    var trigger = (event) => { this.trigger(event); };
    this.element = element;
    this.registeredEvents = {};
    this.register = function(type, callback) {
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
            return ()  => this.registeredEvents[type].splice(index - 1, 1);
        }
    };
}

CustomEventHandler.prototype.trigger = function(event) {
    var listeners = this.registeredEvents[event.type] || [];
    for(var i=0; i<listeners.length; i++){
        listeners[i](event);
    }
};

CustomEventHandler.prototype.destroy = function() {
    for (var type in this.registeredEvents) {
        this.registeredEvents[type].length = 0;
        delete this.registeredEvents[type];
        this.element.removeEventListener(type, trigger, false);
    }
    this.element = null;
    this.registeredEvents = null;
};