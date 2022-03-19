/**
 * 
 * @param {*} definition 
 * @param {*} parent 
 * @param {*} _lazyCompiled
 */
export function ElementRef(definition, parent, _lazyCompiled) {
    AbstractElementRef.call(this, definition, parent);
    this.events = new EventHandler((definition.events || []).slice());
    this._lazyCompiled = _lazyCompiled;

    /**
     * check if element is custom element
     */
    if (definition.isc) {
        /**
         * create the element Observer
         */
        ComponentRef.create(this.refId, parent && parent.hostRef.refId);
    }

    /**
     * definition.attrObservers
     */
    if (definition.attr$) {
        setupAttributeObservers(this, definition.attr$);
    }
}

ElementRef.prototype = Object.create(AbstractElementRef.prototype);
ElementRef.prototype.constructor = AbstractElementRef;