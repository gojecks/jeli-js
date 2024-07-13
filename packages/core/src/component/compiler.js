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
    var asNative = elementRef.internal_getDefinition('asNative');
    var lifeCycle;
    /**
     * 
     * @param {*} componentInstance 
     */
    function ConnectView(componentInstance) {
        var componentRef = ComponentRef.get(elementRef.refId);
        componentRef.componentInstance = componentInstance;

        if (factory.view) {
            try {
                // set the refID of the directive
                var renderedElement = factory.view(elementRef);
                var triggerAndBindCQ = () => {
                    // attach contentChild(ren)
                    AttachComponentContentQuery(elementRef);
                    lifeCycle.trigger(LifeCycleConst.viewDidLoad);
                };

                // attach mutationObserver
                if (!asNative) {
                    elementMutationObserver(elementRef.nativeElement, function (mutationList, observer) {
                        triggerAndBindCQ();
                        observer.disconnect();
                    });
                    
                    elementRef.nativeElement.appendChild(renderedElement);
                } else {
                    // attach shadow dom
                    // also append styles to shadow dom
                    if(ctors.useShadowDom){
                        var shadow = elementRef.nativeElement.attachShadow({ mode: 'open' });
                        shadow.appendChild(renderedElement);
                    } else {
                        elementRef.nativeElement.appendChild(renderedElement);
                    }
                    
                    triggerAndBindCQ();
                }

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
    function eventsRegistry(componentInstance) {
        var actions = {
            event: (name) => elementRef.events._events.push(Object.assign({name}, ctors.events[name])),
            emitter: (name) =>  EventHandler.attachEventEmitter(elementRef, name, componentInstance),
            dispatcher: name => EventHandler.attachEventDispatcher(elementRef, name, componentInstance)
        };

        if (ctors.events) {
            for(var name in ctors.events) {
                if(actions[ctors.events[name].type]){
                    actions[ctors.events[name].type](name);
                }
            }

            // register eventListener to element
            if (!factory.view && ctors.asNative) {
                EventHandler.registerListener(elementRef);
            }
        }
    }


    function registerDirectiveInstance(componentInstance) {
        if (elementRef.isc) return;
        /**
         * remove the Attribute from element
         */
        elementRef.nodes.set(factory.ctors.exportAs || ctors.selector, componentInstance);
        lifeCycle.trigger(LifeCycleConst.viewDidLoad);
        attachElementObserver(elementRef, function () {
            lifeCycle.trigger(LifeCycleConst.viewDidDestroy);
            elementRef.nodes.delete(ctors.selector);
        });
    }

    // nativeStrategyCompiler
    ElementFactoryInitializer(factory, componentInjectors,
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
            eventsRegistry(componentInstance);
            lifeCycle = new LifeCycle(componentInstance);
            elementInputLinker(componentInstance, elementRef, lifeCycle, ctors);
            lifeCycle.trigger(LifeCycleConst.didInit);
            registerDirectiveInstance(componentInstance);
            next(componentInstance);
            if (elementRef.isc) ConnectView(componentInstance);
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
function ElementFactoryInitializer(factory, injectorInstance, CB) {
    wireResolvers(factory.ctors.resolve, injectorInstance);
    AutoWire(factory, injectorInstance, function (instance) {
        try {
            CB(instance);
        } catch (e) {
            errorBuilder(e);
        }
    });
};