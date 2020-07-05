import { isfunction, isarray, isequal } from 'js-helpers/helpers';
import { errorBuilder } from '../utils/errorLogger';
import { Inject, AutoWire } from '../dependency.injector';

/**
 * 
 * @param {*} ctrl 
 * @param {*} elementRef 
 * @param {*} localInjectors 
 * @param {*} next 
 */
function ElementCompiler(ctrl, elementRef, localInjectors, next) {
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
        var componentRef = componentDebugContext.get(elementRef.refId);
        /**
         * add two way binding between components 
         */

        componentRef.componentInstance = componentInstance;
        if (hasTwoWayBinding) {
            // componentRef.parent = elementRef.context;
            // elementRef.context.child.push(componentRef);
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
    function compileEventsRegistry(componentInstance) {
        if (definition.events) {
            Object.keys(definition.events).forEach(_registry);
        }

        /**
         * 
         * @param {*} option 
         */
        function _registry(evName) {
            switch (definition.events[evName].type) {
                case ('event'):
                    ComponentEventHandler(evName, componentInstance)
                    break;
                case ('emitter'):
                    /**
                     * attach an instance of emitter to the componentInstance
                     */
                    AttachEventEmitter(evName, componentInstance);
                    break;
                case ('dispatcher'):
                    AttachEventDispatcher(evName, componentInstance);
                    break;

            }
        }
    }

    /**
     * 
     * @param {*} handler 
     * @param {*} componentInstance 
     */
    function ComponentEventHandler(eventName, componentInstance) {
        elementRef.events.add({
            name: eventName,
            handler: function(event) {
                return EventHandler._executeEventsTriggers(definition.events[eventName].value, componentInstance, null, event);
            }
        });
    }


    /**
     * 
     * @param {*} options 
     * @param {*} componentInstance 
     */
    function AttachEventDispatcher(eventName, componentInstance) {
        var options = definition.events[eventName];
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

    /**
     * Attach the EventEmitter to the component Instance
     * @param {*} eventName
     */
    function AttachEventEmitter(eventName, componentInstance) {
        var registeredEvent = elementRef.events.getEvent(eventName);
        if (registeredEvent && registeredEvent.value) {
            componentInstance[eventName].subscribe(eventHandler);

            /**
             * destroy the subbscription
             */
            elementRef.observer(function() {
                componentInstance[eventName].destroy();
            });
        }

        function eventHandler(value) {
            EventHandler._executeEventsTriggers(
                registeredEvent.value,
                elementRef.parent.componentInstance,
                null,
                value
            );
            elementRef.parent.changeDetector.detectChanges();
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
        if (definition.props) {
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
            for (var prop in definition.props) {
                var item = definition.props[prop];
                var name = item.value || prop;
                if (elementRef.props && elementRef.props.hasOwnProperty(name)) {
                    hasBinding = true;
                    if (item.ignoreChanges) {
                        return;
                    }
                    /**
                     * inject the requiredTypes
                     */
                    switch (item.type) {
                        case ('TemplateRef'):
                            componentInstance[prop] = elementRef.getTemplateRef(name);
                            break;
                        default:
                            var value = evaluateExpression(elementRef.props[name], elementRef.context);
                            componentInstance[prop] = value;
                            break;
                    }
                } else {
                    /**
                     * requires jModel Instance
                     * only include if the element has directive of jModel
                     */
                    if (isequal(item.value, 'jModel')) {
                        componentInstance[prop] = elementRef.nodes.get('model');
                    } else {
                        componentInstance[prop] = elementRef.getAttribute(name);
                    }
                }
            }

            lifeCycle.trigger('willObserve');
            return hasBinding;
        }
    }

    ComponentFactoryInitializer(ctrl, localInjectors,
        /**
         * 
         * @param {*} componentInstance 
         */
        function triggerInstance(componentInstance) {
            /**
             * register the instance
             */
            if (definition.registerAs) {
                definition.registerAs.register(componentInstance);
            }
            /**
             * check for custom registry Types
             * eventListener
             * eventEmitter
             */
            compileEventsRegistry(componentInstance);
            lifeCycle = new ElementCompiler.LifeCycle(componentInstance);
            Linker(componentInstance);
            registerDirectiveInstance(componentInstance);
            lifeCycle.trigger('didInit');
            next(componentInstance);
            CoreComponentCompiler(componentInstance);
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
    var inc = 0;

    function next() {
        var factory = node.providers[inc];
        var localInjectors = generatePublicInjectors(node);

        inc++;
        if (factory) {
            try {
                localInjectors.setAnnotations(factory.annotations);
                ElementCompiler(factory, node, localInjectors, next);
            } catch (e) {
                errorBuilder(e);
            }
        } else {
            localInjectors.destroy();
            nextTick(node);
        }
    }

    next();
};

/**
 * 
 * @param {*} ctrl 
 * @param {*} locals 
 * @param {*} CB 
 */
function ComponentFactoryInitializer(ctrl, injectorInstance, CB) {
    if (ctrl.annotations.resolvers) {
        for (var i = 0; i < ctrl.annotations.resolvers.length; i++) {
            var value = Inject(ctrl.annotations.resolvers[i], injectorInstance.getProviders());
        }
    }

    AutoWire(ctrl, injectorInstance.getProviders(), function(instance) {
        try {
            CB(instance);
        } catch (e) {
            errorBuilder(e);
        }
    });
};