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
    var viewQuery = null;
    var _this = this;
    /**
     * check if element is custom element
     */
    if (definition.isc) {
        /**
         * create the element Observer
         */
        ComponentRef.create(this.refId, parent && parent.hostRef.refId);
        viewQuery = Object.create({
            ϕelements: [],
            add: function(option, element) {
                if (!isequal(option[1], _this.tagName)) {
                    return _this.parent && _this.parent.hostRef.viewQuery.add(option, element);
                }

                this.ϕelements.push({
                    key: option[0],
                    value: element
                });
            },
            render: function(callback) {
                while (this.ϕelements.length) {
                    callback(this.ϕelements.pop());
                }
                this.ϕelements.length = 0;
            }
        });
    }

    this.events = new EventHandler(this, definition.events);
    Object.defineProperties(this, {
        viewQuery: {
            get: function() {
                return viewQuery || this.parent.viewQuery;
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

ElementRef.prototype.nextSibling = function() {
    return this.parent && this.parent.children.findByIndex(this.index + 1);
};

ElementRef.prototype.prevSibling = function() {
    return this.parent && this.parent.children.findByIndex(this.index - 1);
};

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
    if (template instanceof ElementRef) {
        template = template.nativeElement;
    } else if (template instanceof HTMLElement || template instanceof DocumentFragment) {
        template = template;
    }

    this.nativeElement.appendChild(template);
    this.changeDetector.detectChanges();
};

/**
 * @param {*} newContent
 */
ElementRef.prototype.html = function(newContent) {
    if (newContent instanceof ElementRef) {
        newContent = newContent.nativeElement;
    } else if (isstring(newContent)) {
        newContent = document.createRange().createContextualFragment(newContent);
    }

    this.nativeElement.innerHTML = '';
    this.nativeElement.appendChild(newContent);
};