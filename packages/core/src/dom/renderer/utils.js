import { isequal, isfunction } from '@jeli/helpers';
import { isequal } from '@jeli/helpers';
import { staticInjectionToken } from '../../component/injectors';
import { AttributeAppender } from '../attribute';
import { QueryList } from '../queryList';
import { TemplateRef } from './templateref';
/**
 * 
 * @param {*} nativeElement 
 * @param {*} callback 
 */
export function elementMutationObserver(nativeElement, callback) {
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(function(mutationsList, observer) {
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
function AttachComponentContentQuery(elementRef){
    var querySet = elementRef.cq;
    if (querySet){
        var componentInstance = elementRef.componentInstance;
        var props = Object.keys(querySet);
        props.forEach(attachQueryValue);
        /**
         * 
         * @param {*} prop 
         */
        function attachQueryValue(prop){
            var mapping = querySet[prop];
            var value = null;
            // sinlgleton mapping
            if (!mapping[3]){
                if (Array.isArray(mapping[2])) {
                    value = QueryList.from(mapping[2].map(ast => processTmpl(ast, mapping[0])));
                } else {
                   value = processTmpl(mapping[2], mapping[0]);
                }

                // preserve the generated value
                if (mapping[0] === staticInjectionToken.TemplateRef){
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
        function processTmpl(ast, type){
            // structural element
            switch(type) {
                case(staticInjectionToken.TemplateRef):
                    return new TemplateRef(ast, true);
                case(staticInjectionToken.ContentData):
                    return {}
            }
        }

        // attach element obsserver
        // clean up all mappings
        attachElementObserver(elementRef, function(){
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
function elementInsertAfter(hostElement, newNode, targetNode, ignoreDetector) {
    if (!targetNode || !targetNode.parentNode) return;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    if (!ignoreDetector) hostElement.changeDetector.onlySelf();
}

/**
 * replace an element
 * @param {ElementRef} fromElement 
 * @param {ElementRef} toElement 
 */
function replaceElement(fromElement, toElement) {
    var targetNode = fromElement.nativeElement;
    if (11 === targetNode.nodeType) {
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
    } else if(elementRef instanceof TextNodeRef){
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
 * @param {*} elementRef 
 * @param {*} eventListener 
 */
export function ObserveUntilDestroyed(elementRef, eventListener) {
    if (elementRef.hostRef) {
        var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, eventListener.next);
        attachElementObserver(elementRef, function() {
            unsubscribe();
            eventListener.done(true);
        });
    }
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

    if (!textNodeRef.ast.once && textNodeRef.parent && textNodeRef.parent.hostRef) {
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
        case ('##'):
            return document.createComment(text);
        case ('#'):
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
    var unsubscribe = SubscribeObservables(element.hostRef.refId, observe);
    attachElementObserver(element, unsubscribe);

    function observe() {
        for (var propName in attrObservers) {
            /**
             * remove the config
             */
            if (attrObservers[propName].once && observerStarted) {
                return;
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
export function createLocalVariables(localVariables, localContext, parentContext) {
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
    remove: removeElement,
    replace: replaceElement
};