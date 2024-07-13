import {ElementRef} from '../dom/renderer/element.ref';
/**
 * 
 * @param {*} componentClass 
 * @param {*} selector 
 * @param {*} callback 
 */
export function CompileNativeElement(componentClass, selector, callback) {
    var asNative = componentClass.ctors.asNative;
    var childrenNodesLen = asNative ? selector.children.length : 0;
    var elementRef = new ElementRef({
        name: selector,
        isc: true,
        type: 1,
        fromDOM: true,
        asNative,
        templates: {
            /**
             * custom place handler for native compiler
             * @returns
             */
            place: () => (placeSelector, callback) => {
                var children = Array.from(selector.children).splice(0, childrenNodesLen);
                if (placeSelector != '@') {
                    children = children.filter(ele => (
                        !ele.classList.has(placeSelector) || 
                        ele.id != placeSelector || 
                        ele.nodeName != placeSelector || 
                        !ele.hasAttribute(placeSelector)));
                }

                // trigger callback
                children.forEach(callback);
                childrenNodesLen -= children.length;
            }
        }
    }, null);

    var componentInjectors = new ComponentInjectors(elementRef);
    /**
     * bootstrap application
     */
    ElementCompiler(componentClass, elementRef, componentInjectors, function(componentInstance) {
        if (typeof callback === 'function')
            callback(elementRef, componentInstance)
    });
}