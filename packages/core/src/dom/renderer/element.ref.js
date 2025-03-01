/**
 * holds the number of elements created by application
 * textNodes are ignored
 */
var $eUID = 1;
var $elementContext = '__jContext__';

/**
 * Abstract element ref for generating components
 * @param {*} definition 
 * @param {*} parentRef 
 */
class AbstractElementRef {
    constructor(definition, parentRef) {
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
                get: function () {
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
            }
        });

        if (11 !== this.nativeElement.nodeType) {
            Object.defineProperty(this.nativeElement, $elementContext, {
                get: () => this.context
            });
        }

        this.internal_getDefinition = function (prop) {
            return definition[prop];
        };
    }

    get componentInstance() {
        var hostElement = ComponentRef.get(this.refId, this.hostRefId);
        return hostElement.componentInstance;
    }

    get changeDetector() {
        var hostElement = ComponentRef.get(this.refId, this.hostRefId);
        return hostElement.changeDetector;
    }

    get hostRef() {
        if (this.isc)
            return this;

        return this.parent && this.parent.hostRef;
    }

    get nativeNode() {
        return this.type === 8 ? this.nativeElement : null;
    }

    hasAttribute(name) {
        return this.attr && this.attr.hasOwnProperty(name);
    }
    
    getAttribute(name) {
        return (this.hasAttribute(name)) ? this.attr[name] : this.nativeElement.getAttribute(name);
    }

    getProps(prop) {
        return this.nativeElement[prop];
    }
}

/**
 *
 * @param {*} definition
 * @param {*} parent
 * @param {*} lcmp
 */
export class ElementRef extends AbstractElementRef{
    constructor(definition, parent, lcmp) {
        super(definition, parent);
        this.events = new EventHandler((definition.events || []).slice());
        // holds value for lazyCompiled element
        this._lcmp = lcmp;
        // check if element is custom element
        if (definition.isc) {
            // create the element Observer
            ComponentRef.create(this.refId, definition.fromDOM ? 1 : parent && parent.hostRef.refId);
        }

        // definition.attrObservers
        if (definition.attr$) {
            setupAttributeObservers(this, definition.attr$);
        }
    }
}