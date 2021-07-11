/**
 * holds the number of elements created by application
 * textNodes are ignored
 */
var $eUID = 1;
/**
 * Abstract element ref for generating components
 * @param {*} definition 
 * @param {*} parentRef 
 */
function AbstractElementRef(definition, parentRef) {
    /**
     * extend the definition
     */
    this.nativeElement = createElementByType(definition.name, definition.text, definition.fromDOM);
    this.refId = 'jeli:' + +new Date + ":" + $eUID++;
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
    this._viewQuery = null;

    Object.defineProperties(this, {
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

                return this.hostRef && this.hostRef.componentInstance;
            }
        },
        changeDetector: {
            get: function() {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).changeDetector;
                }

                return this.hostRef && this.hostRef.changeDetector;
            }
        },
        hostRef: {
            get: function() {
                if (this.isc) {
                    return this;
                }

                return this.parent && this.parent.hostRef;
            }
        },
        "[[TEMPLATES]]": {
            get: function() {
                return definition.templates;
            }
        }
    });
};

AbstractElementRef.prototype.hasAttribute = function(name) {
    return this.attr && this.attr.hasOwnProperty(name);
};

AbstractElementRef.prototype.getAttribute = function(name) {
    return (this.attr && name in this.attr) ? this.attr[name] : this.nativeElement.getAttribute(name);
};

AbstractElementRef.prototype.getTemplateRef = function(templateId, silent) {
    var templates = this["[[TEMPLATES]]"];
    if (!templates || !templates.hasOwnProperty(templateId)) {
        if (!silent) errorBuilder('No templates Defined #' + templateId);
        return null;
    }
    return new TemplateRef(templates[templateId]);
};