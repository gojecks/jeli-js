import { isfunction, isarray, isequal } from 'js.helpers/helpers';
/**
 * 
 * @param {*} ctrl 
 * @param {*} elementRef 
 * @param {*} next 
 */
function ElementCompiler(ctrl, elementRef, next) {
    var definition = ctrl.annotations,
        hasTwoWayBinding = (elementRef.props && definition.props),
        lifeCycle;
    /**
     * 
     * @param {*} componentInstance 
     */
    function CoreComponentCompiler(componentInstance) {
        if (!elementRef.isc) {
            return;
        }

        var style = null;
        var componentRef = componentDebugContext.get(elementRef.refId);
        /**
         * add two way binding between components 
         */

        componentRef.componentInstance = componentInstance;
        if (hasTwoWayBinding) {
            // componentRef.parent = elementRef.context;
            // elementRef.context.child.push(componentRef);
        }

        if (ctrl.style) {
            style = AttachComponentStyles(ctrl.style, elementRef.nativeElement);
        }

        if (ctrl.view) {
            // set the refID of the directive
            var template = ctrl.view.getView(elementRef);
            try {
                elementRef.appendChild(template);
            } catch (e) {
                errorBuilder(e);
            } finally {
                buildViewChild(componentInstance, elementRef, definition.viewChild);
                lifeCycle.trigger('viewDidLoad');
            }
        }

        // Add event Watcher to the ele
        elementRef.observer(function() {
            lifeCycle.trigger('viewDidDestroy');
            /**
             * remove the styles
             */
            if (style) {
                style.parentNode.removeChild(style);
            }
            componentRef.destroy();
            lifeCycle = null;
            componentRef = null;
        });

        _MutationObserver(elementRef.nativeNode || elementRef.nativeElement, function() {
            if (elementRef.nativeElement) {
                elementRef.remove();
            }
        });

        /**
         * trigger tick
         */
        componentRef.changeDetector.detectChanges();
    }

    /**
     * 
     * @param {*} componentInstance 
     */
    function compileRegistry(componentInstance) {
        if (definition.registry) {
            definition.registry.forEach(_registry);
        }

        /**
         * 
         * @param {*} option 
         */
        function _registry(option) {
            switch (option.type) {
                case ('event'):
                    var evName = option.name;
                    if (isequal('default', evName)) {
                        evName = EventHandler.getEventType(elementRef.nativeElement);
                    }

                    elementRef.events.add({
                        name: evName,
                        handler: ComponentEventHandler(option.value)
                    });
                    break;
                case ('emitter'):
                    /**
                     * attach an instance of emitter to the componentInstance
                     */
                    AttachEventEmitter(option.name);
                    break;
                case ('dispatcher'):
                    AttachEventDispatcher(option);
                    break;

            }
        }

        /**
         * 
         * @param {*} handler 
         */
        function ComponentEventHandler(handler) {
            return function(event) {
                return EventHandler._executeEventsTriggers(handler, componentInstance, null, event);
            };
        }

        /**
         * Attach the EventEmitter to the component Instance
         * @param {*} eventName
         */
        function AttachEventEmitter(eventName) {
            var registeredEvent = elementRef.events.getEvent(eventName.toLowerCase());
            if (registeredEvent && registeredEvent.value) {

                componentInstance[eventName].subscribe(function(value) {
                    EventHandler._executeEventsTriggers(
                        registeredEvent.value,
                        elementRef.parent.componentInstance,
                        null,
                        value
                    );
                    elementRef.parent.changeDetector.detectChanges();
                });

                /**
                 * destroy the subbscription
                 */
                elementRef.observer(function() {
                    componentInstance[eventName].destroy();
                });
            }
        }

        /**
         * 
         * @param {*} options 
         */
        function AttachEventDispatcher(options) {
            var registeredEvent = elementRef.getEvent(options.name.toLowerCase());
            var context = null;
            if (registeredEvent && registeredEvent.value.length) {
                context = elementRef.context;
                if (elementRef.isc) {
                    context = elementRef.parent.context;
                }

                /**
                 * get the method Name
                 * and default handlers
                 */
                var methodName = registeredEvent.value[0].fn;
                /**
                 * replace the default handler with dispatcher event handler
                 */
                context[methodName] =
                    /**
                     * 
                     * @param {*} value 
                     */
                    function eventHandler(value) {
                        /**
                         * dispatch the event to the child view
                         */
                        EventHandler._executeEventsTriggers(options.value, componentInstance, null, value);
                        elementRef.parent.changeDetector.detectChanges();
                    };

            }
        }
    }

    function registerDirectiveInstance(componentInstance) {
        if (!elementRef.isc) {
            /**
             * remove the Attribute from element
             */
            elementRef.nodes.set(definition.selector, componentInstance[ctrl.annotations.exportAs] || componentInstance);
            var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, function() {
                lifeCycle.trigger('willObserve');
            });
            elementRef.observer(function() {
                lifeCycle.trigger('viewDidDestroy');
                elementRef.nodes.delete(definition.selector);
                lifeCycle = null;
                unsubscribe();
            });
        }
    }

    /**
     * structure require Model 
     * Useful in Directive Compiler
     * @param {*} componentInstance 
     */
    function Linker(componentInstance) {
        var always = false;
        if (isarray(definition.props) && definition.props.length) {
            always = _updateViewBinding();
            if (always) {
                elementRef.observer(SubscribeObservables(elementRef.parent.refId, _updateViewBinding));
            }
        }

        /**
         * 
         * @param {*} isBinding 
         */
        function _updateViewBinding() {
            var hasBinding = false;
            for (var i = 0; i < definition.props.length; i++) {
                var item = definition.props[i];
                if (elementRef.props && elementRef.props.hasOwnProperty(item.value)) {
                    hasBinding = true;
                    if (item.ignoreChanges) {
                        return;
                    }
                    /**
                     * inject the requiredTypes
                     */
                    switch (item.type) {
                        case ('TemplateRef'):
                            item.ignoreChanges = true;
                            componentInstance[item.name] = elementRef.getTemplateRef(item.value);
                            break;
                        default:
                            var value = evaluateExpression(elementRef.props[item.value], elementRef.context);
                            componentInstance[item.name] = value;
                            break;
                    }
                } else {
                    /**
                     * requires jModel Instance
                     * only include if the element has directive of jModel
                     */
                    if (isequal(item.value, 'jModel')) {
                        componentInstance[item.name] = elementRef.nodes.get('model');
                    } else {
                        componentInstance[item.name] = elementRef.getAttribute(item.value);
                    }
                }
            }

            lifeCycle.trigger('willObserve');
            return hasBinding;
        }
    }

    var locals = generatePublicInjectors(ctrl.annotations, elementRef);
    ControllerInitializer(ctrl, locals,
        /**
         * 
         * @param {*} componentInstance 
         */
        function triggerInstance(componentInstance) {
            /**
             * check for custom registry Types
             * eventListener
             * eventEmitter
             */
            compileRegistry(componentInstance);
            lifeCycle = new ElementCompiler.LifeCycle(componentInstance);
            Linker(componentInstance);
            registerDirectiveInstance(componentInstance);
            lifeCycle.trigger('didInit');
            next(componentInstance);
            CoreComponentCompiler(componentInstance);
            locals.elementRef = null;
            locals = null;
        });

}

/**
 * Jeli Component lifeCycle
 * didInit()
 * viewDidLoad()
 * viewDidMount()
 * viewDidDestroy()
 * willObserve()
 * didChanged()
 */
ElementCompiler.LifeCycle = function(componentInstance) {
    var _cycleState = {
        didInit: !!componentInstance.didInit,
        viewDidLoad: !!componentInstance.viewDidLoad,
        viewDidMount: !!componentInstance.viewDidMount,
        viewDidDestroy: !!componentInstance.viewDidDestroy,
        willObserve: !!componentInstance.willObserve,
        didChanged: !!componentInstance.didChanged
    };

    this.trigger = function(cycle) {
        if (this.has(cycle)) {
            componentInstance[cycle]();
        }
    };

    this.has = function(cycle) {
        return _cycleState[cycle] && isfunction(componentInstance[cycle]);
    };
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
                try {
                    ElementCompiler(customElement, node, next);
                } catch (e) {
                    errorBuilder(e);
                }

            } else {
                nextTick(node);
            }
        }
    }

    next();
};