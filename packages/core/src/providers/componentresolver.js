import { noop } from "../utils/closure";

/**
 * 
 * @param {*} componentFactory 
 * @param {*} viewComponent 
 * @param {*} callback 
 * @param {*} skipElemetInsert 
 * @returns 
 */
export function ComponentFactoryResolver(componentFactory, viewComponent, callback, skipElementInsert) {
    if (!componentFactory || !componentFactory.annotations.exposeView) {
        errorBuilder('No exported factory found for <' + componentFactory.annotations.selector + '> in ' + componentFactory.annotations.module);
        return null;
    }

    if (!viewComponent) {
        throw new Error('Unable to determine viewRef');
    }

    var viewDefinition = {
        name: componentFactory.annotations.selector,
        type: 'element',
        isc: true,
        providers: [componentFactory]
    };
    var componentRef = new ElementRef(viewDefinition, viewComponent, true);
    var localInjectors = new ComponentInjectors(componentRef);
    ElementCompiler(componentFactory, componentRef, localInjectors, function(componentInstance) {
        if (!skipElementInsert) {
            elementInsertAfter(viewComponent, componentRef.nativeElement, viewComponent.nativeElement);
            viewComponent.children.add(componentRef);
        }
        noop(callback)(componentRef, componentInstance);
    });
    localInjectors = null;
    viewDefinition = null;
}