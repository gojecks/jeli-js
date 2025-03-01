import {ElementRef} from '../dom/renderer/element.ref';
import { TemplateRef } from '../dom/renderer/templateref';
/**
 * 
 * @param {*} componentClass 
 * @param {*} selector 
 * @param {*} callback 
 */
export function CompileNativeElement(componentClass, selector, callback) {
    var asNative = componentClass.ctors.asNative;
    var elementRef = new ElementRef({
        name: selector,
        isc: true,
        type: 1,
        fromDOM: true,
        asNative,
        templates: TemplateRef.templatesCompiler(selector.children, asNative)
    }, null);

    var componentInjectors = new ComponentInjectors(elementRef);
    /**
     * bootstrap application
     */
    ElementCompiler(componentClass, elementRef, componentInjectors, componentInstance => {
        if (typeof callback === 'function')
            callback(elementRef, componentInstance)
    });
}