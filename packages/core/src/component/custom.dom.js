import {ElementRef} from '../dom/renderer/element.ref';
/**
 * 
 * @param {*} componentClass 
 * @param {*} selector 
 * @param {*} callback 
 */
export function bootstrapFromDOM(componentClass, selector, callback) {
    var elementRef = new ElementRef({
        name: selector,
        isc: true,
        type: 1,
        fromDOM: true
    }, null);

    var componentInjectors = new ComponentInjectors(elementRef);
    /**
     * bootstrap application
     */
    ElementCompiler(componentClass, elementRef, componentInjectors, function(componentInstance) {
        if (callback && typeof callback === 'function') {
            callback(elementRef, componentInstance)
        }
    });
}