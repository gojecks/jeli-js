import { isequal, isfunction } from 'js-helpers/helpers';
import { isequal } from 'js-helpers/helpers';
import { staticInjectionToken } from '../../component/injectors';
import { AttributeAppender } from '../attribute';
/**
 * 
 * @param {*} nativeElement 
 * @param {*} callback 
 */
function elementMutationObserver(nativeElement, callback) {
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(function(mutationsList, observer) {
        if (mutationsList.length) {
            callback.apply(null, arguments);
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(nativeElement, { attributes: false, childList: true, subtree: true });
};

/**
 * 
 * @param {*} hostElement 
 * @param {*} option 
 * @param {*} childEelement 
 * @returns 
 */
function addViewQuery(hostElement, option, childElement) {
    if (!isequal(option[1], hostElement.tagName)) {
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
                get: function() {
                    return (childElement.nodes.has(type) ? childElement.nodes.get(type) : childElement.context);
                }
            });
            break;
    }
}


/**
 * 
 * @param {*} hostElement 
 * @param {*} newNode 
 * @param {*} targetNode 
 * @returns 
 */
function elementInsertAfter(hostElement, newNode, targetNode) {
    if (!targetNode || !targetNode.parentNode) return;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    hostElement.changeDetector.detectChanges();
}

/**
 * replace an element
 * @param {ElementRef} fromElement 
 * @param {ElementRef} toElement 
 */
function replaceElement(fromElement, toElement) {
    var targetNode = fromElement.nativeElement;
    if (Node.DOCUMENT_FRAGMENT_NODE === targetNode.nodeType) {
        targetNode = fromElement.children.first.nativeElement;
    }
    fromElement.parent.children.replace(fromElement, toElement, true);
    targetNode.replaceWith(toElement.nativeElement);
    removeElement(fromElement, true);
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
            elementRef.parent.children.remove(elementRef);
        }

        cleanupElementRef(elementRef);
    } else {
        elementRef.nativeNode.remove();
    }
}

/**
 * Observe when an element is removed
 * from the DOM
 * remove all watchList
 * Destroy Model observer if any
 * 
 * @param {*} onDestroyListener
 */
function attachElementObserver(element, onDestroyListener) {
    if (onDestroyListener) {
        element.$observers.push(onDestroyListener)
    }
}

/**
 * 
 * @param {*} elementRef 
 * @param {*} eventListener 
 */
function ObserveUntilDestroyed(elementRef, eventListener) {
    var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, eventListener.next);
    attachElementObserver(elementRef, function() {
        unsubscribe();
        eventListener.done(true);
    });
}


/**
 * 
 * @param {*} refId 
 * @param {*} fn 
 */
function SubscribeObservables(refId, fn) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
    }

    return unsubscribe;
}

/**
 * 
 * @param {*} textNodeRef 
 */
function textNodeCompiler(textNodeRef) {
    function _compiler() {
        compileTemplate(textNodeRef.ast, textNodeRef.parent.context, textNodeRef.parent.componentInstance, function(value) {
            if (textNodeRef.nativeNode.nodeValue === value) return;
            textNodeRef.nativeNode.nodeValue = value;
        });
    }

    if (!textNodeRef.ast.once) {
        attachElementObserver(textNodeRef.parent, SubscribeObservables(textNodeRef.parent.hostRef.refId, _compiler));
    };

    _compiler();
}

/**
 * 
 * @param {*} elementRef 
 */
function cleanupElementRef(elementRef) {
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
 * @param {*} tag 
 * @param {*} text 
 * @param {*} fromDOM 
 */
function createElementByType(tag, text, fromDOM) {
    if (fromDOM) {
        return document.querySelector(tag);
    }

    switch (tag) {
        case ('#comment'):
            return document.createComment(text);
        case ('#fragment'):
            return document.createDocumentFragment();
        default:
            return document.createElement(tag);
    }
};

/**
 * 
 * @param {*} element 
 * @param {*} observers 
 */
function setupAttributeObservers(element, attrObservers) {
    var observerStarted = false;
    attachElementObserver(element, SubscribeObservables(element.hostRef.refId, observe));

    function observe() {
        for (var propName in attrObservers) {
            /**
             * remove the config
             */
            if (attrObservers[propName].once && observerStarted) {
                break;
            }
            attributeEvaluator(propName, attrObservers[propName]);
        }

        /**
         * 
         * @param {*} propName 
         * @param {*} template 
         */
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, element.componentInstance, function(value) {
                try {
                    AttributeAppender.setProp(element.nativeElement, propName, value, template);
                } catch (e) {
                    console.error(e);
                }
            });
        }

        observerStarted = true;
    }
}

/**
 * 
 * @param {*} localVariables 
 */
function createLocalVariables(localVariables, localContext, parentContext) {
    var context = {};
    if (localVariables) {
        for (var propName in localVariables) {
            if (!Array.isArray(localVariables[propName]) && localVariables[propName].match(/\s/)) {
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
            get: function() {
                if (!localContext) return null;
                return evaluateExpression(localVariables[propName], localContext, parentContext);
            }
        });
    }
    return context;
}

/**
 * methods exposed to public
 */
export var DOMHelper = {
    insert: elementInsertAfter,
    remove: removeElement
};