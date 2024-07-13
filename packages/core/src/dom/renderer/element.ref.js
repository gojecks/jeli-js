/**
 * 
 * @param {*} definition 
 * @param {*} parent 
 * @param {*} lcmp
 */
export function ElementRef(definition, parent, lcmp) {
    AbstractElementRef.call(this, definition, parent);
    this.events = new EventHandler((definition.events || []).slice());
    // holds value for lazyCompiled element
    this._lcmp = lcmp;
    // check if element is custom element
    if (definition.isc) {
        // create the element Observer
        ComponentRef.create(this.refId, definition.fromDOM ? 1 : parent && parent.hostRef.refId);
    }

    // definition.attrObservers
    if (definition.attr$) {
        setupAttributeObservers(this, definition.attr$);
    }
}

ElementRef.prototype = Object.create(AbstractElementRef.prototype);
ElementRef.prototype.constructor = AbstractElementRef;