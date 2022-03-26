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
    this.$observers = [];
    this.refId = '__eid_' + $eUID++;
    this.children = new QueryList();
    this.parent = parentRef;
    this.hostRefId = (parentRef) ? parentRef.isc ? parentRef.refId : parentRef.hostRefId || this.refId : this.refId;
    this.type = definition.type;
    this.tagName = definition.name.toLowerCase();
    this.index = definition.index;
    this.attr = definition.attr;
    this.props = definition.props;
    this.isc = definition.isc;
    if (definition.providers) {
        this.providers = definition.providers;
        this.nodes = new Map();
    }

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
                var hostElement = ComponentRef.get(this.refId, this.hostRefId);
                return hostElement.componentInstance;
            }
        },
        changeDetector: {
            get: function() {
                var hostElement = ComponentRef.get(this.refId, this.hostRefId);
                return hostElement.changeDetector;
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
        },
        nativeNode: {
            get: function() {
                return this.nativeElement.nodeType === 8 ? this.nativeElement : null;
            }
        },
        data: {
            get: function() {
                return definition.data;
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