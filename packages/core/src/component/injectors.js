import { AbstractInjectorInstance } from '../dependency.injector';
export var staticInjectionToken = {
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
    ContentHostRef: 'ContentHostRef'
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
var staticInjectionTokenHandlers = {
    TemplateRef: (context) => TemplateRef.factory(context.injectors.ElementRef, context.get({ tokenName: 'Selector' })),
    changeDetector: (context) => context.injectors.ElementRef.changeDetector,
    ViewRef: (context) => new ViewRef(context.injectors.ElementRef),
    ParentRef: (context, dep) => {
        if (dep.value) {
            return findParentRef(context.injectors.ElementRef.parent, dep);
        }
        return context.injectors.ElementRef.parent.componentInstance;
    },
    VALIDATORS: (context) => getValidators(context.injectors.ElementRef),
    ContentHostRef: (context) => {
        var componentRef = ComponentRef.get(context.injectors.ElementRef.contentHostRefId);
       return componentRef.componentInstance
    }
};

/**
 * Method for generating Injectors
 * @param {*} annotations 
 * @param {*} selector) 
 */
function ComponentInjectors(elementRef, selector) {
    AbstractInjectorInstance.call(this, elementRef);
    this.injectors.ElementRef = elementRef;
    this.injectors.Selector = selector;
    this.has = function(tokenName) {
        return this.injectors.hasOwnProperty(tokenName) || staticInjectionToken.hasOwnProperty(tokenName);
    };
}
ComponentInjectors.prototype = Object.create(AbstractInjectorInstance.prototype);
ComponentInjectors.prototype.constructor = AbstractInjectorInstance;
ComponentInjectors.prototype.destroy = function() {
    this.injectors.ElementRef = null;
    this.injectors = null;
    this.currentClassAnnotations = null;
};

ComponentInjectors.prototype.get = function(dep) {
    if (this.injectors.hasOwnProperty(dep.tokenName))
        return this.injectors[dep.tokenName];
    else if (staticInjectionToken[dep.tokenName])
        return staticInjectionTokenHandlers[dep.tokenName](this, dep);
}

/**
 * 
 * @param {*} elementRef 
 */
function getValidators(elementRef) {
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
function findParentRef(parentRef, refInstance) {
    var selector = (refInstance.value + (refInstance.type ? ':' + refInstance.type : ''));
    if (parentRef && (!parentRef.nodes || !parentRef.nodes.has(selector))) {
        return findParentRef(parentRef.parent, refInstance);
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