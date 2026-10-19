import { staticInjectionToken } from '../../component/injectors';
import { AttributeAppender } from '../attribute';
import { QueryList } from '../queryList';
import { TemplateRef } from './templateref';

var isAllowedArrayType = ['style'];
// tags a createLocalVariables scope object, vs. componentInstance (never tagged) - see catalogue [[jeli-js]] "*for row click-assignment"
// exported so resolveIdentifier can tell a real local scope (own-properties-only, walk SCOPE_PARENT)
// apart from an arbitrary resolved value (e.g. a namespace segment) which needs normal `in` semantics
export var LOCAL_SCOPE_TAG = Symbol('localVariablesScope');
// explicit ref from a nested *for/*if row's context to its parent row's context (not a copy) - walked by resolveIdentifier and by jeli-cli's compiled [core.SCOPE_PARENT] hops
export var SCOPE_PARENT = Symbol('localVariablesScopeParent');
/**
 * Tags that must be created in the SVG namespace - document.createElement()
 * produces an inert HTMLUnknownElement for these (no rendering, no SVG DOM
 * interface), so they need createElementNS instead.
 */
var SVG_NS = 'http://www.w3.org/2000/svg';
var svgTags = new Set([
    'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon',
    'text', 'tspan', 'textpath', 'defs', 'marker', 'symbol', 'use', 'image',
    'clippath', 'mask', 'pattern', 'lineargradient', 'radialgradient', 'stop',
    'foreignobject', 'switch', 'view', 'desc', 'title', 'metadata', 'filter'
]);

function isSvgTag(tag) {
    return typeof tag === 'string' && svgTags.has(tag.toLowerCase());
}
/**
 * 
 * @param {*} nativeElement 
 * @param {*} callback 
 */
export function elementMutationObserver(nativeElement, callback) {
    if (!nativeElement) return;
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(function (mutationsList) {
        if (mutationsList.length) {
            callback.apply(null, arguments);
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(nativeElement, { attributes: false, childList: true, subtree: true });
}

/**
 * Process light dom attachment
 * @param {*} elementRef 
 */
function AttachComponentContentQuery(elementRef) {
    var querySet = elementRef.internal_getDefinition('cq');
    if (querySet) {
        var componentInstance = elementRef.componentInstance;
        var props = Object.keys(querySet);
        props.forEach(attachQueryValue);
        /**
         * 
         * @param {*} prop 
         */
        function attachQueryValue(prop) {
            var mapping = querySet[prop];
            var value = null;
            // sinlgleton mapping
            if (!mapping[3]) {
                if (Array.isArray(mapping[2])) {
                    value = QueryList.from(mapping[2].map(ast => processTmpl(ast, mapping[0])));
                } else {
                    value = processTmpl(mapping[2], mapping[0]);
                }

                // preserve the generated value
                if (mapping[0] === staticInjectionToken.TemplateRef) {
                    mapping[2] = value;
                    mapping[3] = true;
                }
            } else {
                value = mapping[2];
            }

            // attach the content child value
            componentInstance[prop] = value;
            value = null;
        }

        /**
         * 
         * @param {*} ast 
         * @param {*} type 
         */
        function processTmpl(ast, type) {
            // structural element
            switch (type) {
                case (staticInjectionToken.TemplateRef):
                    return new TemplateRef(ast, true);
                case (staticInjectionToken.ContentData):
                    return {}
            }
        }

        // attach element obsserver
        // clean up all mappings
        attachElementObserver(elementRef, function () {
            props.forEach(prop => {
                if (QueryList.is(componentInstance[prop])) {
                    componentInstance[prop].destroy();
                } else {
                    componentInstance[prop] = null;
                }
            })
        });
    }
}

// unwraps a DocumentFragment-shaped row (e.g. a bare <j-fragment>'s compiled '#' holder) to its real last child, recursively - a detached fragment's .parentNode is always null and can't anchor an insertion
function resolveAnchorNode(elementRef) {
    var node = elementRef && (elementRef.nativeElement || elementRef.nativeNode);
    if (node && node.nodeType === 11 && elementRef.children && elementRef.children.last) {
        return resolveAnchorNode(elementRef.children.last);
    }
    return node;
}

/**
 *
 * @param {*} hostElement
 * @param {*} targetNode
 * @param {*} insertNode
 * @returns
 */
function elementBefore(targetNode, insertNode) {
    if (!targetNode || !targetNode.parentNode) return;
    if (targetNode.before){
        targetNode.before(insertNode)
    } else {
        targetNode.parentNode.insertBefore(insertNode, targetNode);
    }
}


/**
 * 
 * @param {*} hostElement 
 * @param {*} newNode 
 * @param {*} targetNode 
 * @returns 
 */
function elementInsertAfter(hostElement, newNode, targetNode, ignoreDetector) {
    if (!targetNode || !targetNode.parentNode) return;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    if (hostElement && !ignoreDetector) hostElement.changeDetector.onlySelf();
}

/**
 * replace an element
 * @param {ElementRef} fromElement 
 * @param {ElementRef} toElement 
 */
function replaceElement(fromElement, toElement) {
    var targetNode = fromElement && fromElement.nativeElement;
    if (!targetNode) return;
    if (11 === targetNode.nodeType) {
        targetNode = fromElement.children.first.nativeElement;
    }
    fromElement.parent.children.replace(fromElement, toElement, true);
    targetNode.replaceWith(toElement.nativeElement);
    removeElement(fromElement);
    targetNode = null;
}

/**
 * 
 * @param {*} nativeElement 
 * @param {*} removeFromParent 
 */
function removeElement(elementRef, removeFromParent) {
    if (!elementRef) return;
    if (elementRef instanceof AbstractElementRef) {
        if (elementRef.nativeElement && elementRef.nativeElement.nodeType != 11) {
            elementRef.nativeElement.remove();
        }

        if (removeFromParent && elementRef.parent) {
            elementRef.parent.children.remove(elementRef, true);
        }

        cleanupElementRef(elementRef);
    } else if (elementRef instanceof TextNodeRef) {
        elementRef.nativeNode.remove();
    }
}

/**
 * Observe when an element is removed
 * from the DOM
 * remove all watchList
 * Destroy Model observer if any
 * @param {*} element
 * @param {*} onDestroyListener
 */
function attachElementObserver(element, onDestroyListener) {
    if (onDestroyListener) {
        element.$observers.push(onDestroyListener)
    }
}

/**
 * 
 * @param {*} tag 
 * @param {*} text 
 * @param {*} fromDOM 
 */
function createElementByType(tag, text, fromDOM) {
    if (fromDOM)
        return tag;

    switch (tag) {
        case ('##'):
            return document.createComment(text);
        case ('#'):
            return document.createDocumentFragment();
        default:
            return isSvgTag(tag) ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
    }
}

/**
 * 
 * @param {*} elementRef 
 * @param {*} eventListener 
 */
export function ObserveUntilDestroyed(elementRef, eventListener) {
    if (elementRef.hostRef) {
        var unsubscribe = SubscribeObservables(elementRef.hostRef.componentRef, eventListener.next);
        attachElementObserver(elementRef, function () {
            unsubscribe();
            eventListener.done(true);
        });
    }
}


// checks `.observables` (nulled by destroy()), not just componentRef's own liveness
function SubscribeObservables(componentRef, fn) {
    return (componentRef && componentRef.observables) ? componentRef.observables.subscribe(fn) : null;
}

/**
 * 
 * @param {*} textNodeRef 
 */
function textNodeCompiler(textNodeRef) {
    function setValue() {
        /**
         * compiledBindings codegen (jeli-cli) emits a real function at
         * ast[1] instead of the interpreted `[placeholder, filterModel]`
         * pair list - call it directly instead of walking the AST
         * interpreter. Falls through to the interpreter unchanged for
         * every existing/uncompiled bundle (backward compatible, no
         * version marker needed).
         */
        var value = typeof textNodeRef.ast[1] === 'function' ?
            textNodeRef.ast[1](textNodeRef.parent.viewContext, textNodeRef.parent.componentInstance) :
            compileTemplate(textNodeRef.ast, textNodeRef.parent.viewContext, textNodeRef.parent.componentInstance);
        if (textNodeRef.nativeNode.nodeValue === value) return;
        textNodeRef.nativeNode.nodeValue = value;
    }

    if (!textNodeRef.ast[2] && textNodeRef.parent && textNodeRef.parent.hostRef) {
        attachElementObserver(textNodeRef.parent, SubscribeObservables(textNodeRef.parent.hostRef.componentRef, setValue));
    };

    setValue();
}

/**
 * 
 * @param {*} elementRef 
 */
function cleanupElementRef(elementRef) {
    if (!elementRef) return;
    elementRef.events && elementRef.events.destroy();
    /**
     * trigger registered listeners
     */
    while (elementRef.$observers.length) {
        elementRef.$observers.pop()();
    }

    /**
     * remove children
     */
    elementRef.children.destroy();
    elementRef.nativeElement = null;
    elementRef.parent = null;
    if (elementRef.providers) {
        elementRef.providers = null;
        elementRef.nodes.clear();
    }
};

/**
 * 
 * @param {*} element 
 * @param {*} observers 
 */
export function setupAttributeObservers(element, attrObservers) {
    var observerStarted = false;
    // last value written per property; a re-evaluation that yields the same value is not re-applied
    var lastAppliedValues = {};
    var observerKeys = Object.keys(attrObservers);
    var unsubscribe = SubscribeObservables(element.hostRef.componentRef, observe);
    attachElementObserver(element, unsubscribe);
    element._observeAttrs = observe;

    function observe() {
        for (var propName of observerKeys) {
            // remove the config
            if (attrObservers[propName].once && observerStarted) continue;
            // compile array observers
            // only for styles
            if (isAllowedArrayType.includes(propName) && Array.isArray(attrObservers[propName])) {
                var objectValues = attrObservers[propName].reduce((accum, item) => {
                    if (item.once && observerStarted) return accum;
                    /**
                     * compiledBindings: each style-array item is the same
                     * filterModel shape attributeEvaluator handles below -
                     * .compiledFn sits alongside .prop/.type/.suffix, so
                     * this dual-path swap doesn't touch how .type/.suffix
                     * reach ElementStyle.fixValue just below.
                     */
                    var value = typeof item.compiledFn === 'function' ?
                        item.compiledFn(element.context, element.componentInstance) :
                        compileTemplate(item, element.context, element.componentInstance);
                    if (value) {
                        if (!accum) accum = {};
                        // fixValue(value, name, suffix): name is the CSS prop (item.type), not item.suffix
                        Object.assign(accum, (isobject(value) ? value : { [item.type]: ElementStyle.fixValue(value, item.type, item.suffix) }));
                    }
                    return accum;
                }, null);

                AttributeAppender.byType(propName, element.nativeElement, objectValues);
                continue;
            }

            attributeEvaluator(propName, attrObservers[propName]);
        }

        /**
         *
         * @param {*} propName
         * @param {*} template
         */
        function attributeEvaluator(propName, template) {
            /**
             * compiledBindings: template is either the filterModel object
             * shape (native attr / component-prop bindings - carries
             * .compiledFn) or, for a plain attribute with an embedded
             * ${} placeholder (e.g. class="btn-${state}"), the same
             * array shape text nodes use (compiled function at index 1).
             */
            var compiledFn = Array.isArray(template) ? template[1] : template.compiledFn;
            var value = typeof compiledFn === 'function' ?
                compiledFn(element.context, element.componentInstance) :
                compileTemplate(template, element.context, element.componentInstance);
            // skip unchanged primitives: re-writing e.g. option.selected would undo a choice the user just made.
            // objects are always written - the same reference can be mutated in place
            var isPrimitive = value === null || typeof value !== 'object';
            if (isPrimitive && lastAppliedValues.hasOwnProperty(propName) && lastAppliedValues[propName] === value) return;
            lastAppliedValues[propName] = isPrimitive ? value : undefined;
            AttributeAppender.setProp(element.nativeElement, propName, value, template);
        }

        observerStarted = true;
    }
}

/**
 * @param {*} localVariables
 */
export function createLocalVariables(localVariables, localContext, parentContext) {
    // never Object.create(parentContext) - no link to componentInstance; nested reads use the explicit SCOPE_PARENT ref below. See catalogue [[jeli-js]] "*for row click-assignment"
    var context = {};
    if (parentContext && parentContext[LOCAL_SCOPE_TAG]) {
        context[SCOPE_PARENT] = parentContext;
    }
    context[LOCAL_SCOPE_TAG] = true;

    if (localVariables) {
        for (var propName in localVariables) {
            if (typeof localVariables[propName] === 'function') {
                writeCompiledPropertyBinding(propName);
            } else if (localVariables[propName] && typeof localVariables[propName] == 'string' && localVariables[propName].match(/\s/)) {
                context[propName] = localVariables[propName];
            } else {
                writePropertyBinding(propName);
            }
        }
    }

    /**
     *
     * @param {*} propName
     */
    function writePropertyBinding(propName) {
        Object.defineProperty(context, propName, {
            get: function () {
                if (!localContext) return null;
                return evaluateExpression(localVariables[propName], localContext, parentContext);
            }
        });
    }

    /**
     * compiledBindings: <j-place>/static <j-fragment> `context="{...}"`
     * bindings compile per-key instead of the whole object - same lazy-
     * getter contract as writePropertyBinding above (re-invoked on every
     * read, not cached at creation time, since this context object
     * persists and gets re-read across multiple change-detection ticks).
     * @param {*} propName
     */
    function writeCompiledPropertyBinding(propName) {
        Object.defineProperty(context, propName, {
            get: function () {
                if (!localContext) return null;
                return localVariables[propName](localContext, parentContext);
            }
        });
    }
    return context;
}

/**
 * 
 * @param {*} targetContext 
 * @param {*} targetElement 
 * return element context
 */
export function getElementContext(targetContext, targetElement) {
    if (!targetContext) return targetElement.context;

    if (targetContext.locaVariables) {
        return targetContext.locaVariables;
    }
    var componentRef = targetContext.componentRef || (targetContext.hostRef && targetContext.hostRef.componentRef);
    return componentRef && componentRef.context;
}

/**
 * methods exposed to public
 */
export var DOMHelper = {
    insert: elementInsertAfter,
    remove: removeElement,
    replace: replaceElement,
    /**
     * 
     * @param {*} tag 
     * @param {*} attributes 
     * @param {*} content 
     * @param {*} parent 
     * @param {*} replaceParentContent 
     * @returns 
     */
    createElement: function (tag, attributes, content, parent, replaceParentContent) {
        var ele = isSvgTag(tag) ? document.createElementNS(SVG_NS, tag) : document.createElement(tag);
        AttributeAppender.set(ele, attributes || {});
        if (content) {
            if (typeof content == 'function') {
                content(ele);
            } else {
                ele.innerHTML = content
            }
        }

        if (parent) {
            // empty the parent if flag is true
            if (replaceParentContent) parent.innerHTML = '';
            parent.appendChild(ele);
        }

        return ele;
    },
    /**
     * 
     * @param {*} textContent 
     * @param {*} parent 
     * @returns 
     */
    createTextNode: function (textContent, parent) {
        var textNode = document.createTextNode(textContent);
        if (parent) parent.appendChild(textNode);
        return textNode;
    }
};