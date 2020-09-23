import { isequal } from 'js-helpers/helpers';
import { AttributeAppender } from '../attribute';
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
        this._viewQuery = new Map();
    }

    this.events = new EventHandler(this, definition.events);
    Object.defineProperties(this, {
        viewQuery: {
            get: function() {
                return this._viewQuery || this.parent._viewQuery;
            }
        }
    });

    /**
     * definition.attrObservers
     */
    if (definition.attrObservers) {
        setupAttributeObservers(this, definition.attrObservers);
    }
}

ElementRef.prototype = Object.create(AbstractElementRef.prototype);
ElementRef.prototype.constructor = AbstractElementRef;
ElementRef.prototype.setProp = function(propName, propValue) {
    AttributeAppender.setProp(this.nativeElement, propName, propValue);
    return this;
};


ElementRef.prototype.setAttribute = function(name, value, attachInElement) {
    this.attr[name] = value;
    if (attachInElement && this.nativeElement) {
        AttributeAppender[name](this.nativeElement, value);
    }

    return this;
};

ElementRef.prototype.removeAttribute = function(name) {
    this.nativeElement && this.nativeElement.removeAttribute(name);
    delete this.attr[name];
};

/**
 * @param {*} element
 * @return self;
 */
ElementRef.prototype.appendChild = function(template) {
    this.nativeElement.appendChild(template);
    this.changeDetector.detectChanges();
};

ElementRef.prototype.addViewQuery = function(option, element) {
    if (!isequal(option[1], this.tagName)) {
        return this.parent && this.parent.hostRef.addViewQuery(option, element);
    }

    this._viewQuery.set(option[0], element);
}


/**
 * 
 * @param {*} element 
 * @param {*} observers 
 */
function setupAttributeObservers(element, attrObservers) {
    var observerStarted = false;
    element.observer(SubscribeObservables(element.hostRef.refId, observe));

    function observe() {
        for (var propName in attrObservers) {
            /**
             * remove the config
             */
            if (attrObservers[propName].once && observerStarted) {
                break;
            }
            attributeEvaluator(propName, attrObservers[propName]);
        }

        /**
         * 
         * @param {*} propName 
         * @param {*} template 
         */
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, element.componentInstance, function(value) {
                try {
                    if (AttributeAppender[propName])
                        AttributeAppender[propName](element.nativeElement, value, template);
                    else
                        AttributeAppender.setProp(element.nativeElement, propName, value);
                } catch (e) {
                    console.error(e);
                }
            });
        }

        observerStarted = true;
    }
}