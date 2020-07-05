import { isobject, isequal, isfunction } from 'js-helpers/helpers';
/**
 * 
 * @param {*} ele 
 * @param {*} parent 
 * @param {*} definition 
 */
export function ElementRef(definition, parent) {
    var viewQuery = null;
    var _this = this;
    /**
     * extend the definition
     */
    definition.events = definition.events || [];
    definition.attr = definition.attr || {};

    this.nativeElement = ElementRef.createElementByType(definition.name, definition.text, definition.fromDOM);
    this.refId = getUID();
    this.$observers = [];
    this.children = new QueryList();
    this.parent = parent;
    /**
     * check if element is custom element
     */
    if (definition.isc) {
        /**
         * create the element Observer
         */
        ComponentRef.create(this.refId, parent && parent.refId);
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

    this.nodes = new Map();
    this.events = new EventHandler(this, definition.events);
    Object.defineProperties(this, {
        index: {
            get: function() {
                return definition.index;
            }
        },
        value: {
            get: function() {
                return ElementRefGetValue(this);
            }
        },
        nativeNode: {
            get: function() {
                return isequal(this.nativeElement.nodeType, 8) ? ele : null;
            }
        },
        type: {
            get: function() {
                return definition.type
            }
        },
        tagName: {
            get: function() {
                return definition.name.toLowerCase();
            }
        },
        attr: {
            get: function() {
                return definition.attr;
            }
        },
        props: {
            get: function() {
                return definition.props;
            }
        },
        context: {
            get: function() {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).context;
                }

                return this.parent && this.parent.context;
            }
        },
        componentInstance: {
            get: function() {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).componentInstance;
                }

                return this.parent && this.parent.componentInstance;
            }
        },
        hostRef: {
            get: function() {
                if (definition.isc) {
                    return this;
                }

                return this.parent.hostRef;
            }
        },
        viewQuery: {
            get: function() {
                return viewQuery || this.parent.viewQuery;
            }
        },
        isc: {
            get: function() {
                return definition.isc;
            }
        },
        changeDetector: {
            get: function() {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).changeDetector;
                }

                return this.parent && this.parent.changeDetector;
            }
        },
        providers: {
            get: function() {
                return definition.providers;
            }
        }
    });

    this.getTemplateRef = function(templateId) {
        return new TemplateRef(definition.templates, templateId);
    };

    /**
     * definition.attrObservers
     */
    if (definition.attrObservers) {
        setupAttributeObservers(this, definition.attrObservers);
    }
}



ElementRef.prototype.getChildByRef = function(refId) {
    return this.children.find(function(element) {
        return isequal(element.refId, refId);
    });
};

ElementRef.prototype.nextSibling = function() {
    return this.parent && this.parent.children.findByIndex(this.index + 1);
};

ElementRef.prototype.prevSibling = function() {
    return this.parent && this.parent.children.findByIndex(this.index - 1);
};

ElementRef.prototype.setProp = function(propName, propValue) {
    if (propValue === undefined) return;
    this.nativeElement[propName] = propValue;
    this.setAttribute.apply(this, arguments);
    return this;
};

ElementRef.prototype.hasAttribute = function(name) {
    return this.attr.hasOwnProperty(name)
};

ElementRef.prototype.getAttribute = function(name) {
    if (this.prop && this.prop.hasOwnProperty(name)) {
        return this.prop[name];
    }

    return this.attr && this.attr[name];
};

/**
 * 
 * @param {*} list 
 * @param {*} force 
 */
ElementRef.prototype.hasAnyAttribute = function(list, force) {
    var found = 0,
        self = this;
    list.forEach(function(attr) {
        if (self.hasAttribute(attr)) {
            found = simpleArgumentParser(self.getAttribute(attr) || force || true);
        }
    });

    return found;
};

ElementRef.prototype.setAttribute = function(name, value, attachInElement) {
    this.attr[name] = value;
    if (attachInElement && this.nativeElement) {
        this.nativeElement.setAttribute(name, value);
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
 * @param {*} newNode
 * @param {*} targetNode
 */
ElementRef.prototype.insertAfter = function(newNode, targetNode) {
    targetNode = targetNode || this.nativeElement;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
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

ElementRef.prototype.remove = function(removeFromParent) {
    if (this.nativeElement && this.nativeElement.nodeType != 11) {
        this.nativeElement.remove();
    }

    if (removeFromParent && this.parent) {
        this.children.remove(this);
    }

    cleanupElementRef(this);
};

/**
 * @param {*} ele
 */
ElementRef.prototype.removeChild = function(element) {
    this.children.remove(element);
    cleanupElementRef(element);
};

/**
 * Observe when an element is removed
 * from the DOM
 * remove all watchList
 * Destroy Model observer if any
 * 
 * @param {*} onDestroyListener
 */
ElementRef.prototype.observer = function(onDestroyListener) {
    if (onDestroyListener) {
        this.$observers.push(onDestroyListener)
    }

    return this;
};


/**
 * 
 * @param {*} element 
 */
function cleanupElementRef(elementRef) {
    elementRef.events.destroy();
    /**
     * trigger registered listeners
     */
    while (elementRef.$observers.length) {
        elementRef.$observers.pop()();
    }

    /**
     * remove children
     */
    elementRef.children.destroy();
    elementRef.nativeElement = null;
    elementRef.parent = null;
    elementRef.nodes.clear();
};

/**
 * 
 * @param {*} element 
 */
function ElementRefGetValue(element) {
    if (isequal(element.nativeElement.type, "checkbox")) {
        return element.nativeElement.checked;
    } else if (isequal(element.nativeElement.localName, 'select')) {
        if (!element.children.length || element.nativeElement.options.length > element.children.length) {
            return element.nativeElement.value;
        }

        if (element.hasAttribute('multiple')) {
            var optionsValue = [];
            for (var i = 0; i < element.nativeElement.selectedOptions.length; i++) {
                var option = element.nativeElement.selectedOptions[i];
                var value = element.children.findByIndex(option.index).getAttribute('value');
                optionsValue.push(value);
            }

            return optionsValue;
        }

        return element.children.findByIndex(element.nativeElement.selectedIndex).getAttribute('value');
    } else if (element.nativeElement.type) {
        return simpleArgumentParser(element.nativeElement.value);
    }
};

/**
 * 
 * @param {*} tag 
 * @param {*} text 
 * @param {*} fromDOM 
 */
ElementRef.createElementByType = function(tag, text, fromDOM) {
    if (fromDOM) {
        return document.querySelector(tag);
    }

    switch (tag) {
        case ('#comment'):
            return document.createComment(text);
        case ('#fragment'):
            return document.createDocumentFragment();
        default:
            return document.createElement(tag);
    }
};