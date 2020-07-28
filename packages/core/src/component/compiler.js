import { errorBuilder } from '../utils/errorLogger';
import { Inject, AutoWire, ProviderToken } from '../dependency.injector';
import './linker';
import './lifecycle';
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
                    elementRef.events.attachEventHandler(evName, definition.events[evName].value, componentInstance);
                    break;
                case ('emitter'):
                    /**
                     * attach an instance of emitter to the componentInstance
                     */
                    elementRef.events.attachEventEmitter(evName, componentInstance);
                    break;
                case ('dispatcher'):
                    elementRef.events.attachEventDispatcher(evName, componentInstance);
                    break;

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
                unsubscribe();
            });
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
            if (definition.registerAs && definition.registerAs instanceof ProviderToken) {
                definition.registerAs.register(componentInstance);
            }
            /**
             * check for custom registry Types
             * eventListener
             * eventEmitter
             */
            compileEventsRegistry(componentInstance);
            lifeCycle = new LifeCycle(componentInstance);
            Linker(componentInstance, elementRef, lifeCycle, definition);
            registerDirectiveInstance(componentInstance);
            lifeCycle.trigger('didInit');
            next(componentInstance);
            CoreComponentCompiler(componentInstance);
        });
}

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

/**
 * 
 * @param {*} refId 
 * @param {*} fn 
 * @param {*} attachDestroy 
 */
function SubscribeObservables(refId, fn, attachDestroy) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
        if (attachDestroy) {
            componentRef.observables.on('$destroy', unsubscribe);
        }

    }

    return unsubscribe;
}