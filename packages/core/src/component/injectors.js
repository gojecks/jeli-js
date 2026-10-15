import { AbstractInjectorInstance } from '../dependency.injector';
export const staticInjectionToken = {
    ElementRef: 'ElementRef',
    TemplateRef: 'TemplateRef',
    ContentData: 'ContentData',
    changeDetector: 'changeDetector',
    ViewRef: 'ViewRef',
    ParentRef: 'ParentRef',
    VALIDATORS: 'VALIDATORS',
    QueryList: 'QueryList',
    Function: 'Function',
    HostRef: 'HostRef',
    HTMLElement: 'HTMLElement',
    ContentHostRef: 'ContentHostRef',
    HostElement: 'HostElement'
};

/**
 * generate local injectors
 * Getter for Dependencies that are set in runTime
 * see example from jSwitch Directive
 * Dependencies can also be optional
 * "provider:TYPE=?Value_To_Map"
 * ? symbol represents optional Dependency
 * @param {*} idx 
 */
class staticInjectionTokenHandlers{
    static TemplateRef(context){
        return TemplateRef.factory(context.injectors.ElementRef, context.get({ tokenName: 'Selector' }))
    }
    
    static changeDetector(context){
        return context.injectors.ElementRef.changeDetector;
    }
    
    static ViewRef(context){
        return new ViewRef(context.injectors.ElementRef);
    }

    static ParentRef(context, dep){
        if (dep.value) {
            return this.findParentRef(context.injectors.ElementRef.parent, dep);
        }
        return context.injectors.ElementRef.parent.componentInstance;
    }

    static VALIDATORS(context){
        return this.getValidators(context.injectors.ElementRef);
    }

    static ContentHostRef(context){
        const componentRef = context.injectors.ElementRef.contentHostRef;
        return componentRef && componentRef.componentInstance;
    }
    /**
     * Used  to retrieve host dom nativeElement, for Element and Directives
     * @param {*} context 
     * @returns 
     */
    static HostElement(context){
        const nativeElement = context.injectors.ElementRef.nativeElement;
        const hRefId = 'jl-' + context.injectors.ElementRef.refId;
        nativeElement.setAttribute(hRefId, '');
        return Object.defineProperty({}, 'nativeElement', {
            get: () =>  {
                const ele = document.querySelector('['+hRefId+']');
                if (ele && nativeElement) nativeElement == null;
                return ele || nativeElement; 
            }
        });
    }

    /**
     * 
     * @param {*} elementRef 
     */
    static getValidators(elementRef) {
        return ['required', 'pattern', 'minlength', 'maxlength'].reduce(function(accum, key) {
            if (elementRef.hasAttribute(key)) {
                accum[key] = elementRef.getAttribute(key);
            }
            return accum;
        }, {});
    }

    /**
     * 
     * @param {*} parentRef 
     * @param {*} refInsttance 
     */
    static findParentRef(parentRef, refInstance) {
        const selector = (refInstance.value + (refInstance.type ? ':' + refInstance.type : ''));
        if (parentRef && (!parentRef.nodes || !parentRef.nodes.has(selector))) {
            return this.findParentRef(parentRef.parent, refInstance);
        }
        /**
         * return null if no parentRef value
         */
        if (!parentRef) {
            return null;
        }

        /**
         * return the parentRef instance
         */
        return parentRef.nodes.get(selector);
    }
};

/**
 * Method for generating Injectors
 * @param {*} annotations 
 * @param {*} selector) 
 */
export class ComponentInjectors extends AbstractInjectorInstance {
    constructor(elementRef, selector) {
        super(elementRef);
        this.injectors.ElementRef = elementRef;
        this.injectors.Selector = selector;
    }

    has(tokenName) {
        return this.injectors.hasOwnProperty(tokenName) || staticInjectionToken.hasOwnProperty(tokenName);
    }

    destroy() {
        this.injectors.ElementRef = null;
        this.injectors = null;
        this.currentClassAnnotations = null;
    }
    
    get(dep) {
        if (this.injectors.hasOwnProperty(dep.tokenName))
            return this.injectors[dep.tokenName];
        else if (staticInjectionToken[dep.tokenName])
            return staticInjectionTokenHandlers[dep.tokenName](this, dep);
    }
}