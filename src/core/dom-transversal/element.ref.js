/**
 * 
 * @param {*} ele 
 * @param {*} context 
 */
function ElementRef(ele, context) {
    this.refId = getUID();
    this.events = [];
    this.directives = [];
    this.data = [];
    this.attr = new Map();
    this.attrObservers = [];
    this.$observers = [];
    this.props = new Map();
    this.children = [];
    this.nativeElement = ele;
    this.context = context;
    this.type = 'element';
    this.tagName = ele.tagName.toLowerCase();
    this.customElements = [];

    /**
     * to hold content defined using jTemplate component
     */
    this.templates = new Map();
    this.parent = null;

    this.getDirective = function(name) {
        return this.directives.filter(function(dir) {
            return dir.name === name;
        })[0]
    };

    this.getEvent = function(eventName) {
        return this.events.filter(function(event) {
            return event.name === eventName;
        })[0]
    };
}

ElementRef.prototype.transplace = function(transplace, transplaceText) {
    /**
     * replace : 'element'
     * remove the element from the DOM
     */
    if ($isEqual(transplace, 'element')) {
        this.nativeNode = document.createComment(transplaceText || '');
        this.nativeElement.replaceWith(this.nativeNode);
        if (this.replaceElement) {
            this.nativeElement = this.replaceElement;
            this.replaceElement = null;
        }
        this.isDetachedElem = true;
    } else {
        this.nativeElement.innerHTML = "";
    }
};

ElementRef.prototype.setProp = function(propName, propValue) {
    this.nativeElement[propName] = propValue;
    this.attr.set(propName, propValue);
    return this;
};

ElementRef.prototype.hasAttribute = function(name) {
    return this.attr.has(name)
};

ElementRef.prototype.getAttribute = function(name) {
    if (this.attr.has(name)) {
        return this.attr.get(name);
    }

    return (this.getDirective(name) || {}).checker;
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
    this.attr.set(name, value);
    if (attachInElement) {
        this.nativeElement.setAttribute(name, value);
    }

    return this;
};

ElementRef.prototype.removeAttribute = function(name) {
    this.nativeElement.removeAttribute(name);
    this.attr.delete(name);
};

/**
 * @param {*} element
 * @return self;
 */
ElementRef.prototype.appendChild = function(element) {
    if ($isString(element)) {
        var child = HtmlParser(element, this);
        this.children.forEach(HtmlParser.transverse);
        this.nativeElement.appendChild(child);
    } else {
        HtmlParser.transverse(element);
        this.nativeElement.appendChild(element.nativeElement);
    }
    this.context.tick();
};

/**
 * @param {*} node
 */
ElementRef.prototype.replaceWith = function(node) {
    this.nativeElement.replaceWith(node);
    this.nativeElement = node;
};

/**
 * @param {*} newNode
 * @param {*} targetNode
 * @param {*} transverse
 */
ElementRef.prototype.insertAfter = function(newNode, targetNode, transverse) {
    if (transverse) {
        HtmlParser.transverse(newNode);
        newNode.context.tick();
        newNode = newNode.nativeElement;

    }

    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
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
 * @param {*} content
 */
ElementRef.prototype.html = function(content) {
    if (content instanceof ElementRef) {
        HtmlParser.transverse(content);
        content = content.nativeElement;
    } else if ($isString(content)) {
        content = HtmlParser.parseFromString(content);
    }

    this.nativeElement.innerHTML = '';
    this.nativeElement.appendChild(content);
};

/**
 * @param {*} text
 */
ElementRef.prototype.text = function(text) {
    if (!text) {
        return this.nativeElement.innerText;
    }
    this.nativeElement.innerText = text;
};

ElementRef.prototype.remove = function(keepParent) {
    this.nativeElement.remove();
    if (!this.parent) {
        return this.cleanup();
    }
    this.parent.removeChild(this);
};

/**
 * @param {*} ele
 */
ElementRef.prototype.removeChild = function(element) {
    if (this.children.length) {
        this.children = this.children.filter(function(elementRef) {
            return elementRef.nativeElement !== element.nativeElement;
        });
    }

    element.cleanup();
};


/**
 * cloneNode with all reference
 * @param {*} context
 */
ElementRef.prototype.clone = function(context, addParent) {
    var element = document.createElement(this.tagName);
    this.attr.forEach(function(value, key) {
        element.setAttribute(key, value);
    });

    var clone = new ElementRef(element, (context || this.context));
    /**
     * create a copy of the object
     */
    clone.data = copy(this.data, true);
    clone.attrObservers = copy(this.attrObservers, true);
    clone.events = copy(this.events, true);
    clone.attr = new Map(this.attr);
    clone.directives = this.directives.slice();
    clone.customElements = this.customElements.slice();
    if (addParent) {
        clone.parent = this.parent;
    }

    this.children.forEach(function(child) {
        var _child = child.clone(context || child.context);
        _child.parent = clone;
        element.appendChild(_child.nativeElement || _child.nativeNode);
        clone.children.push(_child);
    });

    return clone;
};


/**
 * 
 * @param {*} event 
 */
ElementRef.prototype.addEventListener = function(event) {
    /**
     * j-change requires j-model
     * check if j-model is defined when this event is used
     */
    if ($isEqual('change', event.name) && !event.handler) {
        if (this.getDirective(':model')) {
            return;
        }
        errorBuilder('jChange requires jModel to function');
    }

    event.handler = event.handler || jEventHandler;
    /**
     * @method jEventHandler
     * @param {*} ev 
     */
    var node = this;

    function jEventHandler(ev) {
        // prevent the default only when its a submit event
        if (expect(['submit', 'touchstart', 'touchend', 'touchmove']).contains(ev.type)) {
            ev.preventDefault();
        }

        try {
            triggerArrayFnWithParams(event.value, [null, node, ev]);
        } catch (e) {
            errorBuilder(e);
        } finally {
            node.context.tick();
        }
    }

    //Store a reference to the element event
    this.nativeElement.addEventListener(event.name, event.handler, false);
};

ElementRef.prototype.cleanup = function() {
    var self = this;
    this.events.forEach(function(event) {
        self.nativeElement.removeEventListener(event.name, event.handler);
    });

    /**
     * trigger registered listeners
     */
    while (this.$observers.length) {
        var observer = this.$observers.pop();
        observer();
    }

    /**
     * remove children
     */
    while (this.children.length) {
        var child = this.children.pop();
        child.remove();
    }

    this.context = null;
    this.attr = null;
    this.templates = null;
    this.nativeElement = null;
    this.events.length = 0;
    this.parent = null;
};