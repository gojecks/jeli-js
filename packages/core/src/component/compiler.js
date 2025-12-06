import { errorBuilder } from '../utils/errorLogger';
import { AutoWire, wireResolvers } from '../dependency.injector';
import { LifeCycle } from './lifecycle';
/**
 * 
 * @param {*} factory 
 * @param {*} elementRef 
 * @param {*} componentInjectors 
 * @param {*} next 
 */
export class ElementCompiler {
    static compile(factory, elementRef, componentInjectors, next) {
        const ctors = factory.ctors;
        const asNative = elementRef.internal_getDefinition('asNative');
        let lifeCycle;
        /**
         * 
         * @param {*} componentInstance 
         */
        function ConnectView(componentInstance) {
            const componentRef = ComponentRef.get(elementRef.refId);
            componentRef.componentInstance = componentInstance;

            if (factory.view) {
                try {
                    // set the refID of the directive
                    const renderedElement = factory.view(elementRef);
                    const triggerAndBindCQ = () => {
                        // attach contentChild(ren)
                        AttachComponentContentQuery(elementRef);
                        lifeCycle.trigger(LifeCycle.lifeCycleConst.viewDidLoad);
                    };

                    // attach mutationObserver
                    if (!asNative) {
                        elementMutationObserver(elementRef.nativeElement, (mutationList, observer) => {
                            triggerAndBindCQ();
                            observer.disconnect();
                        });

                        elementRef.nativeElement.appendChild(renderedElement);
                    } else {
                        // attach shadow dom
                        // also append styles to shadow dom
                        if (ctors.useShadowDom) {
                            const shadow = elementRef.nativeElement.attachShadow({ mode: 'open' });
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

            // attach destroy event to lifecycle
            lifeCycle.onDestroy(() => {
                // do cleanup when component is destroyed
                componentRef.destroy();
                lifeCycle = null;
            });
            // trigger tick
            componentRef.changeDetector.detectChanges(true, true);
        }

        /**
         * 
         * @param {*} componentInstance 
         */
        function eventsRegistry(componentInstance) {
            const actions = {
                event: (name) => elementRef.events.push(Object.assign({ name }, ctors.events[name])),
                emitter: (name) => EventHandler.attachEventEmitter(elementRef, name, componentInstance),
                dispatcher: name => EventHandler.attachEventDispatcher(elementRef, name, componentInstance)
            };

            if (ctors.events) {
                for (const name in ctors.events) {
                    const eventName = ctors.events[name].type;
                    if (actions.hasOwnProperty(eventName)) {
                        actions[eventName](name);
                    }
                }

                // register eventListener to element
                if (((!factory.view && ctors.asNative) || elementRef.internal_getDefinition('fromDOM'))) {
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
            lifeCycle.trigger(LifeCycle.lifeCycleConst.viewDidLoad);
            lifeCycle.onDestroy(() => elementRef.nodes.delete(ctors.selector));
        }

        // nativeStrategyCompiler
        wireResolvers(factory.ctors.resolve, componentInjectors);
        AutoWire(factory, componentInjectors, (componentInstance) => {
            try {
                /**
                 * check for custom registry Types
                 * eventListener
                 * eventEmitter
                 */
                eventsRegistry(componentInstance);
                lifeCycle = new LifeCycle(componentInstance, elementRef, ctors.props);
                registerDirectiveInstance(componentInstance);
                next(componentInstance);
                if (elementRef.isc) ConnectView(componentInstance);
            } catch (e) {
                errorBuilder(e);
            }
        });
    }

    /**
     * 
     * @param {*} node 
     * @param {*} nextTick 
     */
    static resolve(node, nextTick) {
        /**
         * 
         * @param {*} isDetachedElement 
         */
        let inc = 0;
        const componentInjectors = new ComponentInjectors(node);

        function next() {
            const factory = node.providers && node.providers[inc];
            inc++;
            if (factory) {
                componentInjectors.set('Selector', factory.ctors.selector);
                try {
                    ElementCompiler.compile(factory, node, componentInjectors, next);
                } catch (e) {
                    errorBuilder(e);
                }
            } else {
                componentInjectors.destroy();
                nextTick(node);
            }
        }

        next(null);
    }
}