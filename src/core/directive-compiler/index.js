/**
 * structure require Model 
 * Useful in Directive Compiler
 * @param {*} element 
 * @param {*} props 
 */
function structureModel(componentInstance, element, props) {
    if ($isArray(props) && props.length) {
        props.forEach(processAttributeBinding);
        /**
         * 
         * @param {*} item 
         */
        function processAttributeBinding(item) {
            var cmpBinding = element.props.get(item.name);
            if (cmpBinding) {
                if (/\((.*?)\)/.test(cmpBinding)) {
                    var fn = generateFnFromString(cmpBinding, element.context.context);
                    componentInstance[item.name] = function(props) {
                        return fn.apply(fn.context, arguments);
                    };
                } else {
                    componentInstance[item.name] = element.context.evaluate(cmpBinding);
                }
            } else {
                var value = element.getAttribute(item.value);
                /**
                 * requires jModel Instance
                 * only include if the element has directive of jModel
                 */
                if (item.value === 'jModel') {
                    componentInstance[item.name] = element.context.jModelInstance.get(element.getAttribute(':model'));
                } else {
                    componentInstance[item.name] = jSonParser(value);
                }
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
        hasTwoWayBinding = (elementRef.props.size && definition.props),
        lifeCycle;
    /**
     * Initialize Component
     */
    function _componentCompiler() {
        if (definition.template) {
            //set the refID of the directive
            elementRef.appendChild(definition.template);
            attachComponentStyles(definition.style, elementRef.nativeElement);
            lifeCycle.viewDidLoad();
        }
        //Add event Watcher to the ele
        elementRef.observer(function() {
            if (lifeCycle.viewDidDestroy) {
                lifeCycle.viewDidDestroy.call(elementRef.context.componentInstance);
            }
            elementRef.context.destroy();
        });

        _mutationObserver(elementRef.nativeNode || elementRef.nativeElement, function() {
            if (elementRef.nativeElement) {
                elementRef.remove();
            }
        });
    }

    /**
     * Resolve Component Template
     */
    function componentTemplateBuilder() {
        if (definition.templateUrl && !definition.template) {
            //get resource from server
            $http({
                url: definition.templateUrl,
                headers: {
                    'Content-Type': 'text/html'
                },
                callback: function(response) {
                    if (response.success) {
                        definition.template = HtmlParser.sce().trustAsHTML(response.data);
                        _componentCompiler();
                    }
                }
            });
        } else {
            _componentCompiler();
        }
    }

    /**
     * 
     * @param {*} componentInstance 
     */
    function triggerInstance(componentInstance) {
        lifeCycle = new ElementCompiler.LifeCycle(componentInstance);
        structureModel(componentInstance, elementRef, definition.props);
        /**
         * remove transplaced element if defined
         */
        if (definition.transplace) {
            elementRef.transplace(definition.transplace, componentInstance.binding || definition.selector);
        }

        if (definition.registry) {
            definition.registry.forEach(function(option) {
                if ($isEqual(option.type, 'event')) {
                    elementRef.events.push({
                        name: option.name,
                        handler: maskedEval(option.handler, componentInstance)
                    });
                }
            });
        }

        lifeCycle.didInit();
        next(componentInstance);
        if (definition.$isComponent) {
            var componentRef = new ComponentRef(componentInstance);
            /**
             * add two way binding between components 
             */
            if (hasTwoWayBinding) {
                componentRef.parent = elementRef.context;
                elementRef.context.child.push(componentRef);
                componentRef.parent.enableTwoWayDataBinding(elementRef.props, definition.props, componentInstance);
            }
            elementRef.context = componentRef;
            componentTemplateBuilder();
        } else {
            /**
             * remove the Attribute from element
             */
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
            var unsubscribe = elementRef.context.observables.subscribe(function() {
                lifeCycle.willObserve.call(componentInstance);
            });
            /**
             * register unsubscription
             */
            elementRef.observer(unsubscribe);
        }
    }

    ControllerInitializer(ctrl, null, {
        ElementRef: elementRef,
        Observables: (elementRef.context || {}).observables
    }, triggerInstance);
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
    function next() {
        if (!node.isDetachedElem) {
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