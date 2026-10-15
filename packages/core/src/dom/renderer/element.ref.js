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
    constructor(definition, parentRef, context) {
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
        // nearest ancestor (or self) that is a real component - checks THIS element's own
        // isc first (definition.isc, since this.isc isn't assigned until below), matching
        // the original getter's `if (this.isc) return this;` before falling back to the parent
        this.hostRef = definition.isc ? this : (parentRef ? parentRef.hostRef : this);
        // the component this element's projected content actually originated from (<j-place/>)
        this.contentHostRef = parentRef ? parentRef.contentHostRef : null;
        // set below by ElementRef's constructor when definition.isc
        this.componentRef = null;
        this.tagName = (!definition.fromDOM ? definition.name : this.nativeElement.localName).toLowerCase();
        this.hasContext = (!!definition.context || (!definition.isc && parentRef && parentRef.hasContext));
        this.type = definition.type;
        this.attr = definition.attr;
        this.isc = definition.isc;
        // SSR hydration (Phase 3) - see custom.dom.js's CompileNativeElement
        // and dom/renderer/index.js's createOrAdoptElement, the two places
        // that set this on a definition
        if (definition.hydrate) this._hydrate = true;

        if (definition.providers) {
            this.providers = definition.providers;
            this.nodes = new Map();
        }

        /**
         * compile local vairables if defined
         * <j-template />
         */
        if (definition.ctx$)
            localVariables = createLocalVariables(definition.ctx$, context || parentRef.context, parentRef.componentInstance);

        Object.defineProperties(this, {
            context: {
                get: function () {
                    // template context
                    if (localVariables) return localVariables;
                    // component context or custom context
                    if (this.componentRef)
                        return this.componentRef.context;
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

        this.internal_getDefinition = prop => definition[prop];
    }

    get componentInstance() {
        const componentRef = this.componentRef || (this.hostRef && this.hostRef.componentRef);
        return componentRef && componentRef.componentInstance;
    }

    get changeDetector() {
        const componentRef = this.componentRef || (this.hostRef && this.hostRef.componentRef);
        return componentRef && componentRef.changeDetector;
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
            this.componentRef = new ComponentRef();
            // nearest ancestor component, if any, for the change-detection cascade
            const parentComponentRef = parent && parent.hostRef && parent.hostRef.componentRef;
            if (parentComponentRef) {
                this.componentRef.linkParent(parentComponentRef);
            }
        }

        // definition.attrObservers
        if (definition.attr$) {
            setupAttributeObservers(this, definition.attr$);
        }
    }
}