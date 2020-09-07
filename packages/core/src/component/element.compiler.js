import { errorBuilder } from '../utils/errorLogger';
import { AutoWire, wireResolvers } from '../dependency.injector';
import './lifecycle';
import { ϕjeliLinker } from './linker';
/**
 * 
 * @param {*} ctrl 
 * @param {*} elementRef 
 * @param {*} componentInjectors 
 * @param {*} next 
 */
function ElementCompiler(ctrl, elementRef, componentInjectors, next) {
    var definition = ctrl.annotations,
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
            try {
                // set the refID of the directive
                var template = ctrl.view.getView(elementRef);
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
        /**
         * trigger tick
         */
        componentRef.changeDetector.detectChanges(true, true);
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
            elementRef.nodes.set(ctrl.annotations.exportAs || definition.selector, componentInstance);
            elementRef.observer(function() {
                lifeCycle.trigger('viewDidDestroy');
                elementRef.nodes.delete(definition.selector);
            });
        }
    }

    ComponentFactoryInitializer(ctrl, componentInjectors,
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
            compileEventsRegistry(componentInstance);
            lifeCycle = new LifeCycle(componentInstance);
            ϕjeliLinker(componentInstance, elementRef, lifeCycle, definition);
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
        var componentInjectors = new ComponentInjectors(node);

        inc++;
        if (factory) {
            try {
                componentInjectors.currentClassAnnotations = factory.annotations;
                ElementCompiler(factory, node, componentInjectors, next);
            } catch (e) {
                errorBuilder(e);
            }
        } else {
            componentInjectors.destroy();
            nextTick(node);
        }
    }

    next(null);
};

/**
 * 
 * @param {*} ctrl 
 * @param {*} locals 
 * @param {*} CB 
 */
function ComponentFactoryInitializer(ctrl, injectorInstance, CB) {
    wireResolvers(ctrl.annotations.resolve, injectorInstance);
    AutoWire(ctrl, injectorInstance, function(instance) {
        try {
            CB(instance);
        } catch (e) {
            errorBuilder(e);
        }
    });
};