/**
 * structure require Model 
 * Useful in Directive Compiler
 * @param {*} element 
 * @param {*} props 
 */
function structureModel(componentInstance, element, props) {
    if ($isArray(props) && props.length) {
        var replacerModel = (element.context || {}).context;
        props.forEach(processAttributeBinding);
        /**
         * 
         * @param {*} item 
         */
        function processAttributeBinding(item) {
            var cmpBinding = element.props.get(item.name);
            if (cmpBinding) {
                if (/\((.*?)\)/.test(cmpBinding)) {
                    var fn = generateFnFromString(cmpBinding, replacerModel);
                    componentInstance[item.name] = function(props) {
                        var arg = generateArguments(fn.arg, props);
                        return fn.apply(fn.context, arg);
                    };
                } else {
                    componentInstance[item.name] = replacerModel.evaluate(cmpBinding);
                }
            } else {
                var value = element.getAttribute(item.value);
                /**
                 * requires jModel Instance
                 * only include if the element has directive of jModel
                 */
                if (item.value === 'jModel') {
                    value = element.context.jModelInstance.get(element.getAttribute(':model'));
                }
                componentInstance[item.name] = value;
            }

        }
    }
}

/**
 * 
 * @param {*} style 
 * @param {*} ele 
 */
function attachComponentStyles(style, ele) {
    if (style && ele) {
        if ($isString(style)) {
            customStyleSheetAppender(style, ele[0]);
        } else {
            var externalLoader = new loadExternalScript(ele[0]);
            externalLoader.css(style);
        }
    }
}

/**
 * @param {*} fn
 * @param {*} elementRef
 * @param {*} next 
 */
function ElementCompiler(ctrl, elementRef, next) {
    var definition = ctrl.annotations,
        ele = elementRef.nativeElement,
        lifeCycle;
    /**
     * Initialize Component
     */
    function _componentCompiler() {
        lifeCycle.viewDidLoad();
        //set the refID of the directive
        ele['$object:id'] = getUID();
        elementRef.appendChild(definition.template);
        attachComponentStyles(definition.style, ele);
        //Add event Watcher to the ele
        elementRef.observer(function() {
            elementRef.context.destroy();
            if (lifeCycle.viewDidDestroy) {
                lifeCycle.viewDidDestroy.call(elementRef.context.componentInstance);
            }
        });
    }

    /**
     * Resolve Component Template
     */
    function componentTemplateBuilder() {
        if (definition.template) {
            //resolve our template
            _componentCompiler();
        } else if (definition.templateUrl) {
            //get resource from server
            $http({
                    url: definition.templateUrl,
                    headers: {
                        'Content-Type': 'text/html'
                    }
                })
                .then(function(template) {
                    definition.template = HtmlParser.sce().trustAsHTML(template);
                    _componentCompiler();
                });
        } else {
            //element is having children
            _componentCompiler();
        }
    }

    ControllerInitializer(ctrl, null, {
            ElementRef: elementRef,
            Observables: (elementRef.context || {}).observables
        })
        .done(function(componentInstance) {
            lifeCycle = new ElementCompiler.LifeCycle(componentInstance);
            structureModel(componentInstance, elementRef, definition.props);
            /**
             * remove transplaced element if defined
             */
            if (definition.transplace) {
                elementRef.transplace(definition.transplace, componentInstance.binding);
            }

            lifeCycle.didInit();
            if (definition.$isComponent) {
                var componentRef = new ComponentRef(componentInstance);
                elementRef.context = componentRef;
                next(definition.isDetachedElem);
                componentTemplateBuilder();
            } else {
                /**
                 * remove the Attribute from element
                 */
                next(elementRef.isDetachedElem);
                if (lifeCycle.viewDidDestroy) {
                    elementRef.observer(function() {
                        lifeCycle.viewDidDestroy.call(componentInstance);
                    });
                }
            }
            /**
             * register lifeCycle observers
             */
            if (lifeCycle.willObserve) {
                elementRef.context.observables.subscribe(function() {
                    lifeCycle.willObserve.call(componentInstance);
                });
            }
        });
}

ElementCompiler.LifeCycle = function(componentInstance) {
    this.didInit = (componentInstance.didInit || noop).bind(componentInstance);
    this.viewDidLoad = (componentInstance.viewDidLoad || noop).bind(componentInstance);
    this.viewDidDestroy = componentInstance.viewDidDestroy;
    this.willObserve = componentInstance.willObserve;
    this.didChanged = (componentInstance.didChanged || noop).bind(componentInstance);
};

/**
 * 
 * @param {*} node 
 * @param {*} nextTick 
 */
ElementCompiler.resolve = function(node, nextTick) {
    /**
     * 
     * @param {*} isDetachedElement 
     */
    function next(isDetachedElement) {
        if (!isDetachedElement) {
            var customElement = node.customElements.shift();
            if (customElement) {
                ElementCompiler(customElement, node, next);
            } else {
                nextTick(node);
            }
        }
    }

    next();
}