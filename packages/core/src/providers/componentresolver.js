import { ElementCompiler } from "../component/compiler";
import { ComponentInjectors } from "../component/injectors";
import { ElementRef } from "../dom/renderer/element.ref";

/**
 * 
 * @param {*} componentFactory 
 * @param {*} viewRef 
 * @param {*} callback 
 * @param {*} skipElemetInsert 
 * @returns 
 */
export function ComponentFactoryResolver(componentFactory, viewRef, callback, skipElementInsert) {
    if (!componentFactory) {
        return Promise.reject('No exported factory found for <' + componentFactory?.ctors?.selector + '>');
    }

    const elementRef = new ElementRef({
        name: componentFactory.ctors.selector,
        type: 'element',
        isc: true,
        providers: [componentFactory]
    }, viewRef, true);

    const componentInjector = new ComponentInjectors(elementRef);

    return new Promise((resolve, reject) => {
        try {
            ElementCompiler.compile(componentFactory, elementRef, componentInjector, (componentInstance) => {
                if (!skipElementInsert && viewRef) {
                    elementInsertAfter(viewRef, elementRef.nativeElement, viewRef.nativeElement);
                    viewRef.children.add(elementRef);
                }

                EventHandler.registerListener(elementRef);
                (callback || resolve)(elementRef, componentInstance);
            });
        } catch(exception) {
            reject(exception)
        }
    });
}