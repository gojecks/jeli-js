import { AbstractInjectorInstance } from '../dependency.injector';
export var staticInjectionToken = {
    ElementRef: 'ElementRef',
    TemplateRef: 'TemplateRef',
    changeDetector: 'changeDetector',
    ViewRef: 'ViewRef',
    ParentRef: 'ParentRef',
    VALIDATORS: 'VALIDATORS'
};

/**
 * Method for generating Injectors
 * @param {*} annotations 
 */
function ComponentInjectors(elementRef) {
    AbstractInjectorInstance.call(this, elementRef);
    this.injectors.ElementRef = elementRef;
    this.currentClassAnnotations = {};
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

ComponentInjectors.prototype.get = function(tokenName) {
    if (this.injectors.hasOwnProperty(tokenName))
        return this.injectors[tokenName];
    else if (staticInjectionToken[tokenName])
        return _ComponentInjectionToken(tokenName, this);
}

/**
 * 
 * @param {*} context 
 */
function _ComponentInjectionToken(tokenName, context) {
    /**
     * generate local injectors
     * Getter for Dependencies that are set in runTime
     * see example from jSwitch Directive
     * Dependencies can also be optional
     * "provider:TYPE=?Value_To_Map"
     * ? symbol represents optional Dependency
     * @param {*} idx 
     */
    switch (tokenName) {
        case (staticInjectionToken.TemplateRef):
            return context.injectors.ElementRef.getTemplateRef(context.currentClassAnnotations.selector);
        case (staticInjectionToken.changeDetector):
            return context.injectors.ElementRef.changeDetector;
        case (staticInjectionToken.ViewRef):
            return new ViewRef(context.injectors.ElementRef);
        case (staticInjectionToken.ParentRef):
            {
                if (context.currentClassAnnotations.DI.ParentRef.value) {
                    return findParentRef(context.injectors.ElementRef.parent, context.currentClassAnnotations.DI.ParentRef.value);
                }
                return context.injectors.ElementRef.parent.componentInstance;
            }
        case (staticInjectionToken.VALIDATORS):
            return getValidators(context.injectors.ElementRef);
    }
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
 * @param {*} refValue 
 */
function findParentRef(parentRef, refValue) {
    if (parentRef && !parentRef.nodes.has(refValue)) {
        return findParentRef(parentRef.parent, refValue);
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
    return parentRef.nodes.get(refValue);
}