import { isequal } from '@jeli/helpers';
import { staticInjectionToken } from '../../component/injectors';
import { AttributeAppender } from '../attribute';
import { QueryList } from '../queryList';
import { TemplateRef } from './templateref';

var isAllowedArrayType = ['style'];
/**
 * 
 * @param {*} nativeElement 
 * @param {*} callback 
 */
export function elementMutationObserver(nativeElement, callback) {
    // Create an observer instance linked to the callback function
    var observer = new MutationObserver(function(mutationsList) {
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
    var querySet = elementRef.internal_getDefinition('cq');
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

function elementBefore(targetNode, insertNode){
    if (!targetNode || !targetNode.parentNode) return;
    if (targetNode.before)
        targetNode.before(insertNode)
    else 
        targetNode.parentNode.insertBefore(insertNode, targetNode);
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
    if (!fromElement) return;
    var targetNode = fromElement.nativeElement;
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
            return document.createElement(tag);
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
    function setValue() {
        var value = compileTemplate(textNodeRef.ast, textNodeRef.parent.context, textNodeRef.parent.componentInstance);
        if (textNodeRef.nativeNode.nodeValue === value) return;
        textNodeRef.nativeNode.nodeValue = value;
    }

    if (!textNodeRef.ast.once && textNodeRef.parent && textNodeRef.parent.hostRef) {
        attachElementObserver(textNodeRef.parent, SubscribeObservables(textNodeRef.parent.hostRef.refId, setValue));
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
    var observerKeys = Object.keys(attrObservers);
    var unsubscribe = SubscribeObservables(element.hostRef.refId, observe);
    attachElementObserver(element, unsubscribe);

    function observe() {
        for (var propName of observerKeys) {
            // remove the config
            if (attrObservers[propName].once && observerStarted) continue;
            // compile array observers
            // only for styles
            if (isAllowedArrayType.includes(propName) && Array.isArray(attrObservers[propName])) {
                var objectValues = attrObservers[propName].reduce((accum, item) => {
                    if(item.once && observerStarted) return accum;
                    var value = compileTemplate(item, element.context, element.componentInstance);
                    if (value) {
                       if (!accum) accum = {};
                       Object.assign(accum, (isobject(value) ? value : {[item.type]: ElementStyle.fixValue(value, item.suffix)}));
                    }
                    return accum;
                }, null);

                AttributeAppender.helpers[propName](element.nativeElement, objectValues);
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
            var value = compileTemplate(template, element.context, element.componentInstance);
            AttributeAppender.setProp(element.nativeElement, propName, value, template);
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
            if (localVariables[propName] && typeof localVariables[propName] == 'string' && localVariables[propName].match(/\s/)) {
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
 * 
 * @param {*} targetContext 
 * @param {*} targetElement 
 * return element context
 */
export function getElementContext(targetContext, targetElement){
    if (!targetContext) return targetElement.context;

    if (targetContext.locaVariables){
        return targetContext.locaVariables;
    }
    var componentRef = ComponentRef.get(targetContext.refId, targetContext.parentRefId);
    return componentRef.context;
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
    createElement: function(tag, attributes, content, parent, replaceParentContent) {
        var ele = document.createElement(tag);
        AttributeAppender(ele, attributes || {});
        if (content){
            if(typeof content == 'function'){
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
    createTextNode: function(textContent, parent){
        var textNode = document.createTextNode(textContent);
        if (parent) parent.appendChild(textNode);
        return textNode;
    }
};