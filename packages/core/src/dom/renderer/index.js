import { scheduler } from "../../utils/scheduler";
import { ElementRef } from "./element.ref";
import { TemplateRef } from "./templateref";
import { createLocalVariables } from "./utils";

/**
 *
 * Deliberately scoped: without jeli-cli emitting delimiter markers around
 * `*if`/`*for`/`{:switch}`-produced regions (a separate, cross-repo compiler
 * change - not attempted here), there is no reliable way to know how many
 * DOM nodes a structural directive's server-rendered output occupied, which
 * means there is no safe way to resume alignment for whatever comes AFTER
 * it once the adoption walk reaches one. So: a component's template is
 * hydrated (real node-by-node adoption, no re-creation) only when it
 * contains zero structural directives anywhere in its own top-level markup.
 * If it contains any, this bails *before* attempting any adoption - clears
 * the stale server-rendered content for that component and falls through
 * to the existing, unchanged create-path, exactly as if there were no
 * server-rendered markup at all. Never partially adopts and never
 * misaligns - the fallback is coarse (whole component, not per-node) by
 * design, in exchange for that guarantee.
 * @param {*} astNodes
 * @returns {boolean}
 */
function containsStructuralDirective(astNodes) {
    if (!astNodes) return false;
    for (var i = 0; i < astNodes.length; i++) {
        var node = astNodes[i];
        if (!node) continue;
        if (node.type === 8 || node.type === 13) return true;
        if (node.children && containsStructuralDirective(node.children)) return true;
    }
    return false;
}

function clearChildNodes(nativeElement) {
    while (nativeElement.firstChild) {
        nativeElement.removeChild(nativeElement.firstChild);
    }
}

/**
 * Removes every DOM node from `parent`'s hydration cursor onward and stops
 * further adoption attempts at this level - called the moment a mismatch is
 * found, so whatever gets freshly created next doesn't end up duplicated
 * alongside the abandoned stale nodes.
 * @param {*} parent
 */
function discardRemainingHydrationSiblings(parent) {
    if (!parent || parent._hydrateCursor === undefined) return;
    var node = parent._hydrateCursor;
    while (node) {
        var next = node.nextSibling;
        if (node.parentNode) node.parentNode.removeChild(node);
        node = next;
    }
    parent._hydrateCursor = undefined;
}

function reportHydrationMismatch(parent, definition, foundNode) {
    var expected = definition.type === 3 ? 'a text node' : ('<' + definition.name + '>');
    var found = !foundNode ? 'nothing (ran out of server-rendered nodes)'
        : (foundNode.nodeType === 3 ? 'a text node ("' + foundNode.textContent.slice(0, 30) + '")' : '<' + foundNode.nodeName.toLowerCase() + '>');
    console.warn('[hydration mismatch] expected ' + expected + ' but found ' + found + ' - falling back to a full remount for the remaining siblings at this position.');
}

export class ViewParser {
    static $elementContextContainer =  new Map();
    static $(e, t) {
        return t && t.type ? t : e ? t ? Object.assign(t, e) : "object" == typeof e ? e : e() : null;
    }

    static jit(elementRef, transpiledHTML, vt) {
        if (elementRef._hydrate) {
            if (containsStructuralDirective(transpiledHTML)) {
                // can't safely adopt - discard the stale server-rendered
                // content up front and render fresh, same as a normal
                // client-side (non-SSR) mount
                clearChildNodes(elementRef.nativeElement);
            } else {
                elementRef._hydrateCursor = elementRef.nativeElement.firstChild;
            }
        }

        const fragment = document.createDocumentFragment();
        const pushView = (compiled, isNativeMode) => {
            if (!isNativeMode) {
                compiled.parent && compiled.parent.children.add(compiled);
                // adopted nodes are already correctly positioned in the live
                // DOM - appendChild on an already-attached node just moves it
                // to be last among its current siblings, which (processing
                // children strictly in order) converges to the correct final
                // order by the time every child has been processed. A little
                // redundant DOM churn for the adopted case, not incorrect.
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
                return newRef.nativeElement || newRef.nativeNode;
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
        const elementRef = createOrAdoptElement(definition, parent);
        if (definition.attr) {
            AttributeAppender.set(elementRef.nativeElement, definition.attr);
        }
        // the compiler moves static aria-*/data-* attributes out of `attr` into their own maps (base.parser attributeParser)
        if (definition.aria) {
            AttributeAppender.singleOrMultipeUpdate(elementRef.nativeElement, 'aria-', definition.aria);
        }
        if (definition.data) {
            AttributeAppender.singleOrMultipeUpdate(elementRef.nativeElement, 'data-', definition.data);
        }

        if (definition.children) {
            // an adopted element's own children are hydration candidates
            // too - a nested component adopted here also gets `_hydrate`
            // propagated (see createOrAdoptElement), so its own later
            // factory.view(elementRef) call attempts hydration in turn
            if (elementRef._adopted) {
                elementRef._hydrateCursor = elementRef.nativeElement.firstChild;
            }
            for (let i = 0; i < definition.children.length; i++) {
                const childDefinition = (typeof definition.children[i] === 'function' ? definition.children[i]() : definition.children[i]);
                if (!childDefinition) continue;
                // conditional template checker
                const child =  this.compile(childDefinition, elementRef, viewContainer, context, true);
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
     * @param {*} pushView 
     * @param {*} context 
     * @returns AbstractElementRef instance
     */
    static $8(definition, parent, pushView, context,) {
        return new AbstractElementRef(definition, parent, context);
    }

    /**
     * 
     * @param {*} definition 
     * @param {*} parent 
     */
    static $3(definition, parent) {
        return createOrAdoptTextNode(definition, parent);
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
        const hostRef = parent.hostRef;
         const template = TemplateRef.factory(hostRef, 'place', true);
        // fail fast if no template and no fallback to render in its place
        if (!template && !definition.fallback) return null;

        const isNativeMode = hostRef.internal_getDefinition('asNative');
        let haveLocalVairables = false;
        const createPlaceElement = !(viewContainer || appendToParent);
        const placeElement = (createPlaceElement || parent.isc) ? new AbstractElementRef({
            name: "#",
            type: 11
        }, hostRef) : null;

        if (!isNativeMode) {
            haveLocalVairables = (definition.$ctx && ('object' == typeof definition.$ctx));
            // create the context if jPlace have context object
            if (haveLocalVairables)
                context = createLocalVariables(definition.$ctx, parent.context, context);
        }

        let placedCount = 0;

        /**
         *
         * @param {*} element
         */
        // host's *for/*if context, with members still resolved on the consumer
        const useHostLoopContext = !definition.$ctx && hostRef.hasContext;
        let loopContextParent = null;
        if (useHostLoopContext && !isNativeMode) {
            loopContextParent = new AbstractElementRef({ name: '#', type: 11 }, hostRef.parent);
            loopContextParent.context = hostRef.context;
            loopContextParent.hasContext = true;
        }

        function createAndAppend(element) {
            placedCount++;
            let child = element;
            if (!isNativeMode) {
                child = jitBuilder.compile(element, (definition.$ctx == true ? parent : (loopContextParent || hostRef.parent)), viewContainer, useHostLoopContext ? hostRef.context : context);
                // set the localVairables
                if (haveLocalVairables)
                    child.context = context;

                // Attach the child element to the origin, used for getting the right componentRef -
                // the actual host component where this content is appended
                // ContentHostRef? should reolve the component instance
                child.contentHostRef = hostRef.componentRef;
            }

            if (parent.isc || createPlaceElement || appendToParent) {
                jitBuilder.pushToParent(child, placeElement || parent, null, isNativeMode);
            } else {
                viewContainer(child, isNativeMode);
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

        // nothing was projected for this place - render the <j-template
        // #fallback> registered for this view instead, resolved the same
        // way <j-fragment {template}="..."> resolves a dynamic template.
        // Compiled against `parent` (this component's own local context),
        // not `hostRef.parent` - unlike projected content, the fallback
        // markup is authored inside this component's own view, not the
        // consumer's.
        if (!placedCount && definition.fallback && definition._GT && !isNativeMode) {
            const fallbackTemplate = definition._GT(definition.fallback);
            if (fallbackTemplate) {
                const child = jitBuilder.compile(fallbackTemplate, parent, viewContainer, context);
                if (parent.isc || createPlaceElement || appendToParent) {
                    jitBuilder.pushToParent(child, placeElement || parent, null, isNativeMode);
                } else {
                    viewContainer(child, isNativeMode);
                }
            }
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
            var ctxArg = context || parent.context;
            var templateId = typeof def.$templateId.compiledFn === 'function' ?
                def.$templateId.compiledFn(ctxArg, parent.componentInstance) :
                getFilteredTemplateValue(def.$templateId, ctxArg, parent.componentInstance);
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
 * SSR hydration (Phase 3): adopts the next real DOM element at `parent`'s
 * hydration cursor instead of creating a new one, when the cursor is active
 * and the node there matches this definition's tag. Falls back to normal
 * creation - for both non-hydrating renders (`parent._hydrateCursor` is
 * `undefined`, the overwhelmingly common case) and the specific node where
 * a mismatch was just found - so this always returns a real, usable
 * `ElementRef` either way; only `._adopted` distinguishes which path was
 * taken.
 * @param {*} definition
 * @param {*} parent
 * @returns {ElementRef}
 */
function createOrAdoptElement(definition, parent) {
    if (parent && parent._hydrateCursor !== undefined) {
        const node = parent._hydrateCursor;
        if (node && node.nodeType === 1 && node.tagName.toLowerCase() === String(definition.name).toLowerCase()) {
            parent._hydrateCursor = node.nextSibling;
            const elementRef = new ElementRef(Object.assign({}, definition, { fromDOM: true, name: node }), parent);
            elementRef._adopted = true;
            // propagate to nested components so their own later
            // factory.view(elementRef) call also attempts hydration
            if (definition.isc) elementRef._hydrate = true;
            return elementRef;
        }
        reportHydrationMismatch(parent, definition, node);
        discardRemainingHydrationSiblings(parent);
    }
    return new ElementRef(definition, parent);
}

/**
 * Same idea as createOrAdoptElement, for text nodes.
 * @param {*} definition
 * @param {*} parent
 * @returns {TextNodeRef}
 */
function createOrAdoptTextNode(definition, parent) {
    if (parent && parent._hydrateCursor !== undefined) {
        const node = parent._hydrateCursor;
        if (node && node.nodeType === 3) {
            parent._hydrateCursor = node.nextSibling;
            return new TextNodeRef(Object.assign({}, definition, { adoptedNode: node }), parent);
        }
        reportHydrationMismatch(parent, definition, node);
        discardRemainingHydrationSiblings(parent);
    }
    return new TextNodeRef(definition, parent);
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
        // first evaluation of this node's attr$ bindings (setupAttributeObservers) - deferred to here since node.context isn't finalized until now
        if (node._observeAttrs) node._observeAttrs();
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