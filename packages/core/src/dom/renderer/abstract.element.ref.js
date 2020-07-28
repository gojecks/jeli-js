/**
 * 
 * @param {*} definition 
 * @param {*} parentRef 
 */
function AbstractElementRef(definition, parentRef) {
    /**
     * extend the definition
     */
    this.nativeElement = createElementByType(definition.name, definition.text, definition.fromDOM);
    this.refId = getUID();
    this.$observers = [];
    this.children = new QueryList();
    this.parent = parentRef;
    this.type = definition.type;
    this.tagName = definition.name.toLowerCase();
    this.isc = definition.isc;
    this.providers = definition.providers;
    this.index = definition.index;
    this.attr = definition.attr;
    this.props = definition.props;
    this.nativeNode = this.nativeElement.nodeType === 8 ? this.nativeElement : null;
    this.nodes = new Map();
    this.getTemplateRef = function(templateId) {
        return new TemplateRef(definition.templates, templateId);
    };

    Object.defineProperties(this, {
        context: {
            get: function() {
                if (this.isc) {
                    return componentDebugContext.get(this.refId).context;
                }

                return this.hostRef.context;
            }
        },
        componentInstance: {
            get: function() {
                if (this.isc) {
                    return componentDebugContext.get(this.refId).componentInstance;
                }

                return this.hostRef.componentInstance;
            }
        },
        changeDetector: {
            get: function() {
                if (this.isc) {
                    return componentDebugContext.get(this.refId).changeDetector;
                }

                return this.hostRef.changeDetector;
            }
        },
        hostRef: {
            get: function() {
                if (this.isc) {
                    return this;
                }

                return this.parent.hostRef;
            }
        }
    });
}

AbstractElementRef.prototype.getAttribute = function(name) {
    if (this.prop && this.prop.hasOwnProperty(name)) {
        return this.prop[name];
    }

    return this.attr && this.attr[name];
};

/**
 * @param {*} newNode
 * @param {*} targetNode
 */
AbstractElementRef.prototype.insertAfter = function(newNode, targetNode) {
    if (!targetNode.parentNode) return;
    targetNode = targetNode || this.nativeElement;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    this.changeDetector.detectChanges();
};

AbstractElementRef.prototype.remove = function(removeFromParent) {
    if (this.nativeElement && this.nativeElement.nodeType != 11) {
        this.nativeElement.remove();
    }

    if (removeFromParent && this.parent) {
        this.parent.children.remove(this);
    }

    cleanupElementRef(this);
};

AbstractElementRef.prototype.hasAttribute = function(name) {
    return this.attr && this.attr.hasOwnProperty(name);
};

/**
 * @param {*} ele
 */
AbstractElementRef.prototype.removeChild = function(element) {
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
AbstractElementRef.prototype.observer = function(onDestroyListener) {
    if (onDestroyListener) {
        this.$observers.push(onDestroyListener)
    }
};


/**
 * 
 * @param {*} element 
 */
function cleanupElementRef(elementRef) {
    elementRef.events && elementRef.events.destroy();
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
    elementRef.providers = null;
    elementRef.nodes.clear();
};


/**
 * 
 * @param {*} tag 
 * @param {*} text 
 * @param {*} fromDOM 
 */
function createElementByType(tag, text, fromDOM) {
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