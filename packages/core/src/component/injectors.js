import { isobject } from "js-helpers/helpers";

/**
 * Method for generating Injectors
 * @param {*} annotations 
 */
function generatePublicInjectors(elementRef) {
    var injectors = {};
    var currentClassAnnotations = {};

    /**
     * generate local injectors
     */
    Object.defineProperties(injectors, {
        ElementRef: {
            get: function() {
                return elementRef
            }
        },
        TemplateRef: {
            get: function() {
                return this.ElementRef.getTemplateRef(currentClassAnnotations.selector);
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
        /**
         * Getter for Dependencies that are set in runTime
         * see example from jSwitch Directive
         * Dependencies can also be optional
         * "provider:TYPE=?Value_To_Map"
         * ? symbol represents optional Dependency
         * @param {*} idx 
         */
        ParentRef: {
            get: function() {
                return (
                    this.ElementRef.parent.nodes.get(currentClassAnnotations.DI.ParentRef.value) ||
                    this.ElementRef.parent.componentInstance
                );
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


    return {
        setAnnotations: function(annotations) {
            currentClassAnnotations = annotations;
        },
        getProviders: function() {
            return injectors;
        },
        destroy: function() {
            injectors = null;
            currentClassAnnotations = null;
            elementRef = null
        },
        extend: function(token, value) {
            console.log(token, value);
        }
    };
}