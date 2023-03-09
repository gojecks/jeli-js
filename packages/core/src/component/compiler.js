import { errorBuilder } from '../utils/errorLogger';
import { AutoWire, wireResolvers } from '../dependency.injector';
import './lifecycle';
import { elementInputLinker } from './linker';
import { LifeCycleConst } from './lifecycle';
/**
 * 
 * @param {*} factory 
 * @param {*} elementRef 
 * @param {*} componentInjectors 
 * @param {*} next 
 */
function ElementCompiler(factory, elementRef, componentInjectors, next) {
    var ctors = factory.ctors;
    var lifeCycle;
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
        if (factory.view) {
            try {
                // set the refID of the directive
                var renderedElement = factory.view(elementRef);
                // attach mutationObserver
                elementMutationObserver(elementRef.nativeElement, function (mutationList, observer) {
                    // attach contentChild(ren)
                    AttachComponentContentQuery(elementRef);
                    lifeCycle && lifeCycle.trigger(LifeCycleConst.viewDidLoad);
                    observer.disconnect();
                });
                
                elementRef.nativeElement.appendChild(renderedElement);
                elementRef.changeDetector.detectChanges();
            } catch (e) {
                errorBuilder(e);
            }
        }

        // Add event Watcher to the ele
        attachElementObserver(elementRef, function () {
            // do cleanup when component is destroyed
            lifeCycle.trigger(LifeCycleConst.viewDidDestroy);
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
        if (ctors.events) {
            Object.keys(ctors.events).forEach(_registry);
        }

        /**
         * 
         * @param {*} option 
         */
        function _registry(evName) {
            switch (ctors.events[evName].type) {
                case ('event'):
                    EventHandler.attachEvent(elementRef.events, evName, ctors.events[evName].value, componentInstance);
                    break;
                case ('emitter'):
                    /**
                     * attach an instance of emitter to the componentInstance
                     */
                    EventHandler.attachEventEmitter(elementRef, evName, componentInstance);
                    break;
                case ('dispatcher'):
                    EventHandler.attachEventDispatcher(elementRef, evName, componentInstance);
                    break;

            }
        }
    }


    function registerDirectiveInstance(componentInstance) {
        if (!elementRef.isc) {
            /**
             * remove the Attribute from element
             */
            elementRef.nodes.set(factory.ctors.exportAs || ctors.selector, componentInstance);
            lifeCycle && lifeCycle.trigger(LifeCycleConst.viewDidLoad);
            attachElementObserver(elementRef, function () {
                lifeCycle.trigger(LifeCycleConst.viewDidDestroy);
                elementRef.nodes.delete(ctors.selector);
            });
        }
    }

    ComponentFactoryInitializer(factory, componentInjectors,
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
            elementInputLinker(componentInstance, elementRef, lifeCycle, ctors);
            lifeCycle.trigger(LifeCycleConst.didInit);
            registerDirectiveInstance(componentInstance);
            next(componentInstance);
            CoreComponentCompiler(componentInstance);
        });
}

/**
 * 
 * @param {*} node 
 * @param {*} nextTick 
 */
ElementCompiler.resolve = function (node, nextTick) {
    /**
     * 
     * @param {*} isDetachedElement 
     */
    var inc = 0;
    var componentInjectors = new ComponentInjectors(node);

    function next() {
        var factory = node.providers[inc];
        inc++;
        if (factory) {
            componentInjectors.set('Selector', factory.ctors.selector);
            try {
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
 * @param {*} factory 
 * @param {*} locals 
 * @param {*} CB 
 */
function ComponentFactoryInitializer(factory, injectorInstance, CB) {
    wireResolvers(factory.ctors.resolve, injectorInstance);
    AutoWire(factory, injectorInstance, function (instance) {
        try {
            CB(instance);
        } catch (e) {
            errorBuilder(e);
        }
    });
};