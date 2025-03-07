import { scheduler } from "../../utils/scheduler";
import { ElementRef } from "./element.ref";
import { TemplateRef } from "./templateref";
import { createLocalVariables } from "./utils";
export class ViewParser {
    static $elementContextContainer =  new Map();
    static $(e, t) {
        return t && t.type ? t : e ? t ? Object.assign(t, e) : "object" == typeof e ? e : e() : null;
    }

    static jit(elementRef, transpiledHTML, vt) {
        var fragment = document.createDocumentFragment();
        var pushView = (compiled, isNativeMode) => {
            if (!isNativeMode) {
                compiled.parent && compiled.parent.children.add(compiled);
                fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
                transverse(compiled);
            } else {
                // nativeElement
                fragment.appendChild(compiled);
            }
        };


        for (var i = 0; i < transpiledHTML.length; i++) {
            var compiled = jitBuilder.compile(transpiledHTML[i], elementRef, pushView);
            if (compiled) {
                pushView(compiled);
            }
        }

        var componentInstance = elementRef.componentInstance;
        for (var name in vt) {
            componentInstance[name] = TemplateRef.reflect(elementRef, vt[name], newRef => {
                transverse(newRef);
                return newRef.nativeElement;
            });
        }

        return fragment;
    }
}

class jitBuilder {
    /**
     * 
     * @param {*} definition 
     * @param {*} parent 
     * @param {*} viewContainer 
     * @param {*} context 
     * @returns 
     */
    static $1(definition, parent, viewContainer, context) {
        var elementRef = new ElementRef(definition, parent);
        if (definition.attr) {
            AttributeAppender.set(elementRef.nativeElement, definition.attr);
        }

        if (definition.children) {
            for (var i = 0; i < definition.children.length; i++) {
                var childDefinition = (typeof definition.children[i] === 'function' ? definition.children[i]() : definition.children[i]);
                if (!childDefinition) continue;
                // conditional template checker
                var child =  this.compile(childDefinition, elementRef, viewContainer, context, true);
                if (child) {
                    this.pushToParent(child, elementRef, i);
                }
            }
        }

        if (definition.vc) {
            addViewQuery(elementRef.hostRef, definition.vc, elementRef);
        }

        return elementRef;
    }

    /**
     * push Child element to parent
     * @param {*} child 
     * @param {*} parent 
     * @param {*} index 
     * @param {*} isNativeMode 
     */
    static pushToParent(child, parent, index, isNativeMode) {
        if (!isNativeMode) {
            parent.children.add(child, index);
            parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
        } else {
            parent.nativeElement.appendChild(child);
        }
    }

    /**
     * 
     * @param {*} definition 
     * @param {*} parent 
     * @returns 
     */
    static $8(definition, parent) {
        return new AbstractElementRef(definition, parent);
    }

    /**
     * 
     * @param {*} definition 
     * @param {*} parent 
     */
    static $3(definition, parent) {
        return new TextNodeRef(definition, parent);
    }

    /**
     * <j-place selector=refId|attr|tag|*></j-template>
     * render light dom in shadow dom
     * equivalemt to <slot></slot>
     * @param {*} definition
     * @param {*} parent
     * @param {*} viewContainer
     * @param {*} context
     * @param {*} appendToParent
     */
    static $11(definition, parent, viewContainer, context, appendToParent) {
        var hostRef = parent.hostRef;
        var isNativeMode = hostRef.internal_getDefinition('asNative');
        var haveLocalVairables = false;
        var createPlaceElement = !(viewContainer || appendToParent);
        var template = TemplateRef.factory(hostRef, 'place', true);
        var placeElement = (createPlaceElement) ? new AbstractElementRef({
            name: "#",
            type: 11
        }, hostRef) : null;

        if (!isNativeMode) {
            haveLocalVairables = (definition.$ctx && ('object' == typeof definition.$ctx));
            // create the context if jPlace have context object
            if (haveLocalVairables)
                context = createLocalVariables(definition.$ctx, parent.context, context);
        }

        /**
         * 
         * @param {*} element 
         */
        function createAndAppend(element) {
            if (!isNativeMode) {
                var child = jitBuilder.compile(element, (definition.$ctx == true ? parent : hostRef.parent), viewContainer, context);
                // set the localVairables
                if (haveLocalVairables)
                    child.context = context;

                // Attach the child element to the origin, used for getting the right componentRef
                // actual hostRefId where content is appended
                // ContentHostRef? should reolve the component instance
                child.contentHostRefId = hostRef.refId;
            }

            if (createPlaceElement || appendToParent) {
                jitBuilder.pushToParent(child || element, placeElement || parent, null, isNativeMode);
            } else {
                viewContainer(child || element, isNativeMode);
            }

            /**
             * check if VC property is defined in placeTemplate
             * register the child to the hostRef viewQuery
             */
            if (definition.vc && ([element.refId, child.tagName].includes(definition.vc[0].value))) {
                addViewQuery(hostRef, definition.vc, child);
            }
        }

        if (template) {
            template.forEach(definition.refId, createAndAppend);
        }

        return placeElement;
    }

    /**
     * <j-fragment {template}="binding" />
     * parse binding and get the required template to be rendered
     * observe for changes to template binding and render template if needed
     * @internal
     * @param {*} def 
     * @param {*} parent 
     * @param {*} viewContainer 
     * @param {*} context 
     * @returns ElementRef | null
     */
    static $13(def, parent, viewContainer, context) {
        var currentValue = null;
        var element = null;
        var unsubscribeScheduler = noop();
        var fallbackNode = createElementByType('##', 'outlet')
        var fallbackNodes = Object.defineProperties({}, {
            nativeElement: {
                get: () => fallbackNode
            },
            parent: {
                get: () => parent
            }
        });

        function checkAndCompileTemplate(fromObserver) {
            var templateId = getFilteredTemplateValue(def.$templateId, context || parent.context, parent.componentInstance);
            if (currentValue != templateId) {
                unsubscribeScheduler();
                currentValue = templateId;
                var template = def._GT && def._GT(templateId);
                if (template) {
                    var oldElement = element;
                    element = jitBuilder.compile(template, parent, viewContainer, context);
                    /**
                     * return element if element is null or compilation comes from observer
                     */
                    if (!fromObserver || !element)
                        return element;
                    // process  and replace
                    unsubscribeScheduler = scheduler.schedule(function () {
                        if (element) {
                            transverse(element);
                            replaceElement(oldElement || fallbackNodes, element);
                        }
                        oldElement = null;
                    });
                } else {
                    // previously compiled but document is not missing
                    if (element) {
                        replaceElement(element, fallbackNodes);
                        // set element to null
                        element = null;
                    } else if (!fromObserver) {
                        return fallbackNodes;
                    }
                }
            }
        }

        if (def.$templateId) {
            /**
             * definitions with context will be managed and destroyed by parent Observer
             * *jForOf directive
             */
            if (!def.context) {
                ObserveUntilDestroyed(parent, {
                    next: function () {
                        checkAndCompileTemplate(true);
                    },
                    done: function () {
                        element = null;
                    }
                });
            }

            return checkAndCompileTemplate();
        }

        return null;
    }

    /**
     * 
     * @param {*} def 
     * @param {*} elementRef 
     * @param {*} pushView 
     * @param {*} context 
     * @param {*} appendToParent 
     * @returns 
     */
    static compile(def, elementRef, pushView, context, appendToParent){
        return this[`$${def.type}`](def, elementRef, pushView, context, appendToParent);
    }
}

/**
 * transverse Template Compiler
 * @param {*} node
 */
function transverse(node) {
    if (node._lcmp) return;
    if (node instanceof AbstractElementRef) {
        if (node.providers && node.providers.length) {
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else if (node instanceof TextNodeRef && node.hasBinding) {
        textNodeCompiler(node);
    }

    /**
     * 
     * @param {*} node 
     */
    function proceedWithCompilation(node) {
        if (isequal(node.type, 8)) {
            return;
        };

        // Bind Listeners to the Element
        EventHandler.registerListener(node);
        //proceed with the compilation
        //checking child elements
        node.children.forEach(transverse);
    }
}

/**
 * 
 * @param {*} hostElement 
 * @param {*} option 
 * @param {*} childEelement 
 * @returns 
 */
function addViewQuery(hostElement, option, childElement) {
    if (!isequal(option[1], hostElement.tagName) && !hostElement.internal_getDefinition('asNative')) {
        return hostElement.parent && addViewQuery(hostElement.parent.hostRef, option, childElement);
    }

    var name = option[0].name;
    var type = option[0].type;
    switch (type) {
        case (staticInjectionToken.QueryList):
            if (!hostElement.componentInstance.hasOwnProperty(name)) {
                hostElement.componentInstance[name] = new QueryList();
            }
            hostElement.componentInstance[name].add(childElement);
            break;
        case (staticInjectionToken.ElementRef):
            hostElement.componentInstance[name] = childElement;
            break;
        case (staticInjectionToken.HTMLElement):
            hostElement.componentInstance[name] = childElement.nativeElement;
            break;
        default:
            Object.defineProperty(hostElement.componentInstance, name, {
                configurable: true,
                enumerable: true,
                get: function () {
                    return (childElement.nodes.has(type) ? childElement.nodes.get(type) : childElement.context);
                }
            });
            break;
    }
}