/**
 * Jeli event manager
 * @param {*} element
 */
export class CustomEventHandler {
    static trigger(context){
        return event => {
            if (!context.registeredEvents.has(event.type)) return;
            context.registeredEvents.get(event.type).forEach(listener => listener(event));
        }
    };

    constructor(element) {
        this.element = element;
        this.callback = CustomEventHandler.trigger(this);
        this.registeredEvents = new Map();
    }

    register(type, callback) {
        let index = -1;
        if (this.element) {
            if (!this.registeredEvents.has(type)) {
                this.registeredEvents.set(type, []);
                this.element.addEventListener(type, this.callback, false);
            }

            index = this.registeredEvents.get(type).push(callback);
            // unregister
            return () => this.registeredEvents.get(type).splice(index - 1, 1);
        }
    }

    destroy() {
        this.registeredEvents.keys().forEach(type => {
            this.registeredEvents.delete(type);
            this.element.removeEventListener(type, this.callback, false);
        });
        this.element = null;
        this.registeredEvents.clear();
    }
}