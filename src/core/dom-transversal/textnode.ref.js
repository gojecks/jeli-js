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
        nodeValue: ele.nodeValue
    };
    this.bindingsCount = 0;
    this.context = componentRef;
    this.isChild = false;
    this.type = 'text';
    this.unsubscribe = null;
};

TextNodeRef.prototype.clone = function(context) {
    var clone = new TextNodeRef(this.nativeNode.cloneNode());
    clone.context = context;
    clone.bindingsCount = this.bindingsCount;
    clone.bindings = copy(this.bindings, true);
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
        var value = self.bindings.nodeValue;
        self.bindings.templates.forEach(function(options) {
            value = value.replace(options.replacer, getValue(options));
        });
        self.nativeNode.nodeValue = value;
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
    this.binding = null;
};

TextNodeRef.compile = function(ele) {
    var textNodeInstance = new TextNodeRef(ele);
    /**
     * 
     * @param {*} nodeValue 
     */
    var _match = ele.nodeValue.match(_defaultTemplateExp);
    if (_match) {
        textNodeInstance.bindings.templates = _match.map(function(key) {
            var tmpl = new RegExp(_defaultTemplateExp).exec(key),
                observe = !$isEqual(tmpl[1].charAt(0), ":");
            if (observe) {
                textNodeInstance.bindings.addListener = true;
            }

            return ({
                replacer: key,
                templateModel: removeFilters(tmpl[1]),
                key: tmpl[1],
                $$observe: observe
            });
        });

        textNodeInstance.bindingsCount = _match.length;
    }

    return textNodeInstance;
};