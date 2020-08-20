import { AbstractInjectorInstance } from '../dependency.injector';

/**
 * Method for generating Injectors
 * @param {*} annotations 
 */
function ComponentInjectors(elementRef) {
    AbstractInjectorInstance.call(this, elementRef);
    this.injectors.ElementRef = elementRef;
    this.currentClassAnnotations = {};
    var _this = this;
    /**
     * generate local injectors
     * Getter for Dependencies that are set in runTime
     * see example from jSwitch Directive
     * Dependencies can also be optional
     * "provider:TYPE=?Value_To_Map"
     * ? symbol represents optional Dependency
     * @param {*} idx 
     */
    Object.defineProperties(this.injectors, {
        TemplateRef: {
            get: function() {
                return this.ElementRef.getTemplateRef(_this.currentClassAnnotations.selector);
            }
        },
        changeDetector: {
            get: function() {
                return this.ElementRef.changeDetector;
            }
        },
        ViewRef: {
            get: function() {
                return new ViewRef(this.ElementRef);
            }
        },
        ParentRef: {
            get: function() {
                if (_this.currentClassAnnotations.DI.ParentRef.value) {
                    return findParentRef(this.ElementRef.parent, _this.currentClassAnnotations.DI.ParentRef.value);
                }

                return this.ElementRef.parent.componentInstance;
            }
        },
        VALIDATORS: {
            get: function() {
                var _this = this;
                return ['required', 'pattern', 'minlength', 'maxlength'].reduce(function(accum, key) {
                    if (_this.ElementRef.hasAttribute(key)) {
                        accum[key] = _this.ElementRef.getAttribute(key);
                    }
                    return accum;
                }, {});
            }
        }
    });
}
ComponentInjectors.prototype = Object.create(AbstractInjectorInstance.prototype);
ComponentInjectors.prototype.constructor = AbstractInjectorInstance;
ComponentInjectors.prototype.destroy = function() {
    this.injectors.ElementRef = null;
    this.injectors = null;
    this.currentClassAnnotations = null;
};

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