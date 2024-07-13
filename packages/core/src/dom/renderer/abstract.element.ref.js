/**
 * holds the number of elements created by application
 * textNodes are ignored
 */
var $eUID = 1;
var $elementContext = '__jContext__';
// holds a set of elements based of their refs
var $elementContainer = new Map();


/**
 * Abstract element ref for generating components
 * @param {*} definition 
 * @param {*} parentRef 
 */
function AbstractElementRef(definition, parentRef) {
    var localVariables = null;
    this.nativeElement = createElementByType(definition.name, definition.text, definition.fromDOM);
    // all registered observers goes in here
    this.$observers = [];
    // Element referenceId
    this.refId = $eUID++;
    // Hold list of Element children, this can also be queried
    this.children = new QueryList();
    // element ParentRef
    this.parent = parentRef;
    // holds id to parentRefContext
    // holds the referenceId to a parentRef
    this.hostRefId = (parentRef ? (parentRef.isc ? parentRef.refId : (parentRef.hostRefId || this.refId)) : this.refId);
    // hold the refId for actuall element where this content will be injected
    // this is only set by content injection using <j-place/>
    this.contentHostRefId = parentRef ? parentRef.contentHostRefId : null; 
    this.tagName = (!definition.fromDOM ? definition.name : this.nativeElement.localName).toLowerCase();
    this.hasContext = (!!definition.context || (!definition.isc && parentRef && parentRef.hasContext));
    this.type = definition.type;
    this.attr = definition.attr;
    this.isc = definition.isc;
   
    if (definition.providers) {
        this.providers = definition.providers;
        this.nodes = new Map();
    }

    /**
     * compile local vairables if defined
     * <j-template />
     */
    if (definition.ctx$)
        localVariables = createLocalVariables(definition.ctx$, parentRef.context, parentRef.componentInstance);

    Object.defineProperties(this, {
        context: {
            get: function() {
                // template context
                if (localVariables) return localVariables;
                // component context or custom context
                if (ComponentRef.has(this.refId)) 
                    return ComponentRef.get(this.refId).context;
                // parent context
                return this.parent && this.parent.context;
            },
            set: context => {
                if (!definition.ctx$) localVariables = context;
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
                if (this.isc)
                    return this;

                return this.parent && this.parent.hostRef;
            }
        },
        nativeNode: {
            get: function() {
                return this.type === 8 ? this.nativeElement : null;
            }
        }
    });

    if (11 !== this.nativeElement.nodeType) {
        Object.defineProperty(this.nativeElement, $elementContext, {
            get: () => this.context
        });
    }

    this.internal_getDefinition = function(prop) {
        return definition[prop];
    };
};

AbstractElementRef.prototype.hasAttribute = function(name) {
    return this.attr && this.attr.hasOwnProperty(name);
};

AbstractElementRef.prototype.getAttribute = function(name) {
    return (this.hasAttribute(name)) ? this.attr[name] : this.nativeElement.getAttribute(name);
};

AbstractElementRef.prototype.getProps = function(prop) {
    return this.nativeElement[prop];
}