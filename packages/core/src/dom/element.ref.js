import { isobject, isarray, isequal, isfunction } from 'js.helpers/helpers';
/**
 * 
 * @param {*} ele 
 * @param {*} parent 
 * @param {*} definition 
 */
function ElementRef(definition, parent) {
    var viewQuery = null;
    var _this = this;
    /**
     * extend the definition
     */
    definition.events = definition.events || [];
    definition.attr = definition.attr || {};

    this.nativeElement = ElementRef.createElementByType(definition.name, definition.text, definition.fromDOM);
    this.refId = getUID();
    this.customElements = [];
    this.$observers = [];
    this.children = new QueryList();
    this._canSetValue = isequal('input', EventHandler.getEventType(this.nativeElement));
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

    this.getDirective = function(name) {
        return definition.directives && definition.directives.filter(function(dir) {
            return dir.name === name;
        })[0]
    };

    Object.defineProperties(this, {
        index: {
            get: function() {
                return definition.index;
            }
        },
        value: {
            get: function() {
                return ElementRefGetValue(this);
            },
            set: function(value) {
                ElementRefSetValue(this, value);
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
        }
    });

    this.getTemplateRef = function(templateId) {
        return getTemplateRef(definition.templates, templateId);
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
    this.nativeElement[propName] = propValue;
    this.setAttribute.apply(this, arguments);
    return this;
};

ElementRef.prototype.hasAttribute = function(name) {
    return this.attr.hasOwnProperty(name)
};

ElementRef.prototype.getAttribute = function(name) {
    var dir = this.getDirective(name);
    if (dir) {
        return generateArrayKeyType(dir.checker, this.context);
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
    var child;
    if (isfunction(template)) {
        child = template(this);
    } else if (template instanceof ElementRef) {
        HtmlParser.transverse(template);
        child = template.nativeElement;
    } else if (template instanceof HTMLElement || template instanceof DocumentFragment) {
        child = template;
    }

    this.nativeElement.appendChild(child);
    child = null;
};


/**
 * @param {*} newNode
 * @param {*} targetNode
 * @param {*} transverse
 */
ElementRef.prototype.insertAfter = function(newNode, targetNode) {
    if (!targetNode.parentNode) {
        return;
    }

    targetNode = targetNode || this.nativeElement;
    if (newNode instanceof ElementRef) {
        this.children.add(newNode);
        HtmlParser.transverse(newNode);
        newNode.changeDetector.detectChanges();
        newNode = newNode.nativeElement;
    } else {
        this.changeDetector.detectChanges();
    }
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
};

/**
 * @param {*} content
 */
ElementRef.prototype.html = function(content) {
    if (content instanceof ElementRef) {
        HtmlParser.transverse(content);
        content = content.nativeElement;
    } else if (isstring(content)) {
        content = HtmlParser.parseFromString(content);
    }

    this.nativeElement.innerHTML = '';
    this.nativeElement.appendChild(content);
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
 * Attach listners to element
 */
ElementRef.prototype.listen = function(listeners) {
    var ele = this.nativeElement;
    Object.keys(listeners).forEach(_listen);

    function _listen(event) {
        if (event in ele) {
            ele[event] = function(ev) {
                listeners[event](ev);
            };
        }
    }
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
 * @param {*} observers 
 */
function setupAttributeObservers(element, attrObservers) {
    element.observer(SubscribeObservables(element.hostRef.refId, observe));

    function observe() {
        for (var propName in attrObservers) {
            attributeEvaluator(propName, attrObservers[propName]);
        }

        /**
         * 
         * @param {*} propName 
         * @param {*} template 
         */
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, function(value) {
                if (AttributeAppender[propName]) {
                    AttributeAppender[propName](element.nativeElement, value, template);
                } else {
                    element.setProp(propName, value, true);
                }

                /**
                 * remove the config
                 */
                if (template.once) {
                    delete attrObservers[propName];
                }
            });
        }
    }
}

/**
 * 
 * @param {*} value 
 * @param {*} oldVal 
 * 
 * Method is triggered each time 
 * there is an update in model or DOM element
 */
function ElementRefSetValue(element, value, force) {
    if (!isequal(element.value, value) || force) {
        switch (element.tagName.toLowerCase()) {
            case ('select'):
                setSelectOptionsType();
                break;
            case ('input'):
                if (element._canSetValue) {
                    //set the new value
                    element.setProp('value', value);
                } else {
                    var isChecked = (element.value == value);
                    if (isequal(element.nativeElement.type.toLowerCase(), 'checkbox')) {
                        isChecked = value;
                    }
                    AttributeAppender.checked(element.nativeElement, isChecked, element.value);
                }
                break;
            default:
                element.setProp('innerHTML', value);
                break;
        }
    }



    function setSelectOptionsType() {
        var isObject = isobject(value);
        element.children.forEach(setOptionsValue);
        /**
         * 
         * @param {*} options 
         */
        function setOptionsValue(options) {
            var optionValue = options.getAttribute('value'),
                isSelected;
            /**
             * logic to set current selected
             */
            if (isObject) {
                isSelected = isequal(JSON.stringify(optionValue).toLowerCase(), value);
            } else {
                isSelected = isequal(optionValue, value);
            }

            if (isSelected) {
                options.setProp('selected', true);
            }

            return false;
        }
    };
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