/**
 * 
 * @param {*} ele 
 * @param {*} parent 
 * @param {*} definition 
 */
export function ElementRef(definition, parent) {
    AbstractElementRef.call(this, definition, parent);
    /**
     * check if element is custom element
     */
    if (definition.isc) {
        /**
         * create the element Observer
         */
        ComponentRef.create(this.refId, parent && parent.hostRef.refId);
    }

    this.events = new EventHandler((definition.events || []).slice());
    Object.defineProperties(this, {
        viewQuery: {
            get: function() {
                return this._viewQuery || this.parent && this.parent._viewQuery;
            }
        }
    });

    /**
     * definition.attrObservers
     */
    if (definition.attr$) {
        setupAttributeObservers(this, definition.attr$);
    }

    // set the parentRefId
    if (CoreBootstrapContext.enableDebugger) {
        AttributeAppender(this.nativeElement, {
            "jeli-ref": this.hostRef.refId
        });
    }
}

ElementRef.prototype = Object.create(AbstractElementRef.prototype);
ElementRef.prototype.constructor = AbstractElementRef;