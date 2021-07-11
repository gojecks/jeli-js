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
function elementAddViewQuery(hostElement, option, childEelement) {
    if (!isequal(option[1], hostElement.tagName)) {
        return hostElement.parent && elementAddViewQuery(hostElement.parent.hostRef, option, childEelement);
    }

    switch (option[0].type) {
        case (staticInjectionToken.QueryList):
            if (!hostElement.componentInstance.hasOwnProperty(option[0].name)) {
                hostElement.componentInstance[option[0].name] = new QueryList();
            }
            hostElement.componentInstance[option[0].name].add(childEelement);
            break;
        case (staticInjectionToken.ElementRef):
            hostElement.componentInstance[option[0].name] = childEelement;
            break;
        default:
            Object.defineProperty(hostElement.componentInstance, option[0].name, {
                get: function() {
                    return (childEelement.nodes.has(option[0].type) ? childEelement.nodes.get(option[0].type) : childEelement.context);
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
    targetNode = targetNode || hostElement.nativeElement;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    hostElement.changeDetector.detectChanges();
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
};

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
    elementRef.providers = null;
    elementRef._viewQuery = null;
    elementRef.nodes.clear();
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
 * methods exposed to public
 */
export var DOMHelper = {
    insert: elementInsertAfter,
    remove: removeElement
};