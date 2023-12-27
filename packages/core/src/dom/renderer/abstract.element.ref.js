/**
 * holds the number of elements created by application
 * textNodes are ignored
 */
var $eUID = 1;
var $elementContext = '__jContext__';
// holds a set of elements based of their refs
var $elementContainer = new Map();

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
        case ('##'):
            return document.createComment(text);
        case ('#'):
            return document.createDocumentFragment();
        default:
            return document.createElement(tag);
    }
}

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
    this.type = definition.type;
    this.tagName = definition.name.toLowerCase();
    this.index = definition.index;
    this.attr = definition.attr;
    this.props = definition.props;
    this.isc = definition.isc;
    this.hasContext = (!!definition.context || (!definition.isc && parentRef && parentRef.hasContext));
    if (definition.providers) {
        this.providers = definition.providers;
        this.nodes = new Map();
    }

    /**
     * compile local vairables if defined
     * <j-template />
     */
    if (definition.ctx$) {
        localVariables = createLocalVariables(definition.ctx$, parentRef.context, parentRef.componentInstance);
    }

    Object.defineProperties(this, {
        context: {
            get: function() {
                // template context
                if (localVariables) return localVariables;
                // component context or custom context
                if (componentDebugContext.has(this.refId)) 
                    return componentDebugContext.get(this.refId).context;
                // parent context
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
        "[[tmpl]]": {
            get: function() {
                return definition.templates;
            }
        },
        nativeNode: {
            get: function() {
                return this.type === 8 ? this.nativeElement : null;
            }
        },
        data: {
            get: function() {
                return definition.data;
            }
        },
        cq: {
            get: function(){
                return definition.cq;
            }
        }
    });

    if (11 !== this.nativeElement.nodeType) {
        Object.defineProperty(this.nativeElement, $elementContext, {
            get: () => this.context
        });
    }
};

AbstractElementRef.prototype.hasAttribute = function(name) {
    return this.attr && this.attr.hasOwnProperty(name);
};

AbstractElementRef.prototype.getAttribute = function(name) {
    return (this.attr && name in this.attr) ? this.attr[name] : this.nativeElement.getAttribute(name);
};