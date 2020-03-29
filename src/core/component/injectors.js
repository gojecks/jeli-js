/**
 * Method for generating Injectors
 * @param {*} elementRef 
 * @param {*} annotations 
 */
function generatePublicInjectors(annotations, elementRef) {
    var injectors = {
        ElementRef: elementRef
    };

    if (annotations.dynamicInjectors) {
        for (var i = 0; i < annotations.DI.length; i++) {
            if (annotations.DI[i].value) {
                _defineProp(i);
            }
        }
    }

    /**
     * generate local injectors
     */
    Object.defineProperties(injectors, {
        TemplateRef: {
            get: function() {
                return this.ElementRef.getTemplateRef(annotations.selector);
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
        EventBinder: {
            get: function() {
                if (annotations.EventBinders && annotations.EventBinders.length) {
                    var binder = getEventBinder(annotations.EventBinders, this.ElementRef);
                    if (binder) {
                        factory = binder.factory;
                    }
                }
                return DependencyInjectorService.get(factory, this);
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

    /**
     * Getter for Dependencies that are set in runTime
     * see example from jSwitch Directive
     * Dependencies can also be optional
     * "provider:TYPE=?Value_To_Map"
     * ? symbol represents optional Dependency
     * @param {*} idx 
     */
    function _defineProp(idx) {
        Object.defineProperty(injectors, annotations.DI[idx].name, {
            get: function() {
                if (annotations.DI[idx].isdir) {
                    return this.ElementRef.parent.nodes.get(annotations.DI[idx].value);
                } else {
                    return this.ElementRef.parent.componentInstance;
                }
            }
        });
    }

    return injectors;
}