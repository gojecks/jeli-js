/**
 * 
 * @param {*} ele 
 * @param {*} componentRef 
 */
function TextNodeRef(ele, componentRef) {
    this.nativeNode = ele;
    this.bindings = {
        addListener: false,
        templates: [],
        nodeValue: null,
        attrNode: null
    };
    this.bindingsCount = 0;
    this.context = componentRef;
    this.isChild = false;
    this.type = 'text';
    this.unsubscribe = null;
    this.lastCompiled;
    this.parent = null;
};

TextNodeRef.prototype.clone = function(context, parent) {
    var clone = new TextNodeRef(this.nativeNode && this.nativeNode.cloneNode(true), context);
    clone.bindingsCount = this.bindingsCount;
    clone.bindings = copy(this.bindings, true);
    clone.parent = parent;
    return clone;
};

TextNodeRef.prototype.observe = function() {
    if (this.bindings.addListener) {
        this.unsubscribe = this
            .context
            .observables
            .subscribe(compileTemplate);
    }

    var self = this;

    function compileTemplate() {
        if (!self.bindings) {
            return;
        }

        var value = self.bindings.nodeValue;
        self.bindings.templates.forEach(function(options) {
            value = value.replace(options.replacer, getValue(options));
        });

        if (!$isEqual(self.lastCompiled, value)) {
            if (self.bindings.attrNode) {
                self.parent.setAttribute(self.bindings.attrNode, value, true);
            } else {
                self.nativeNode.nodeValue = value;
            }

            self.lastCompiled = value;
        }
    }

    /**
     * 
     * @param {*} opt 
     */
    function getValue(opt) {
        var newValue = getTemplateValue(opt.templateModel, self.context.context);
        /**
         * first check
         */
        if (!opt.hasOwnProperty('value')) {
            opt.value = newValue;
            return newValue;
        }

        if (opt.$$observe) {
            if (newValue !== opt.value) {
                opt.value = newValue;
            }
        }

        return opt.value;
    }

    compileTemplate();
};

TextNodeRef.prototype.cleanup = function() {
    this.unsubscribe && this.unsubscribe();
    this.nativeNode = null;
    this.context = null;
    this.parent = null;
    this.bindings = null;
};

TextNodeRef.prototype.remove = function() {
    this.nativeNode.remove();
    this.cleanup();
};

/**
 * @param {*} ele
 * @param {*} attrNode
 */
TextNodeRef.compile = function(ele, attrNode) {
    var textNodeInstance = new TextNodeRef(ele);
    /**
     * 
     * @param {*} nodeValue 
     */
    var _match = ele.nodeValue.match(_defaultTemplateExp);
    if (_match) {
        textNodeInstance.bindings.nodeValue = ele.nodeValue;
        TextNodeRef.removeBinding(_match, textNodeInstance.bindings);
        textNodeInstance.bindingsCount = _match.length;
        if (attrNode) {
            textNodeInstance.bindings.attrNode = attrNode;
            textNodeInstance.nativeNode = null;
        }
    }

    return textNodeInstance;
};

/**
 * @param {*} nodeValue
 * @param {*} textNodeInstance
 */
TextNodeRef.removeBinding = function(_match, textNodeInstance) {
    textNodeInstance.templates = _match.map(function(key) {
        var tmpl = new RegExp(_defaultTemplateExp).exec(key),
            observe = !$isEqual(tmpl[1].charAt(0), ":");
        if (observe) {
            textNodeInstance.addListener = true;
        }

        return ({
            replacer: key,
            templateModel: removeFilters(tmpl[1]),
            key: tmpl[1],
            $$observe: observe
        });
    });
};

TextNodeRef.copy = function(attrObserver, parent) {
    return attrObserver.map(function(attr) {
        return attr.clone(attr.context, parent);
    });
};