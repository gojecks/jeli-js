import {ElementRef} from '../dom/renderer/element.ref';
import { TemplateRef } from '../dom/renderer/templateref';
/**
 * 
 * @param {*} componentClass 
 * @param {*} selector 
 * @param {*} callback 
 */
export function CompileNativeElement(componentClass, selector, callback, hydrate) {
    var asNative = componentClass.ctors.asNative;
    var elementRef = new ElementRef({
        name: selector,
        isc: true,
        type: 1,
        fromDOM: true,
        asNative,
        // SSR hydration (Phase 3): the root host tag (e.g. <app-root>) is
        // *already* always adopted via fromDOM above, for every app,
        // hydrating or not - that's just how bootstrap has always worked.
        // `hydrate` additionally signals that this root's own *contents*
        // (server-rendered markup already inside that tag) should be
        // adopted too, rather than recreated - see AbstractElementRef's
        // constructor (element.ref.js) and ViewParser.jit (dom/renderer/index.js).
        hydrate: !!hydrate,
        templates: TemplateRef.templatesCompiler(selector.children, asNative)
    }, null);

    var componentInjectors = new ComponentInjectors(elementRef);
    /**
     * bootstrap application
     */
    ElementCompiler.compile(componentClass, elementRef, componentInjectors, componentInstance => {
        if (typeof callback === 'function')
            callback(elementRef, componentInstance)
    });
}