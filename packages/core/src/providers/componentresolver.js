import { noop } from "../utils/closure";

/**
 * 
 * @param {*} componentFactory 
 * @param {*} viewRef 
 * @param {*} callback 
 * @param {*} skipElemetInsert 
 * @returns 
 */
export function ComponentFactoryResolver(componentFactory, viewRef, callback, skipElementInsert) {
    if (!componentFactory || !componentFactory.ctors.exposeView) {
        errorBuilder('No exported factory found for <' + componentFactory.ctors.selector + '>');
        return null;
    }

    var viewDefinition = {
        name: componentFactory.ctors.selector,
        type: 'element',
        isc: true,
        providers: [componentFactory]
    };

    var componentRef = new ElementRef(viewDefinition, viewRef, true);
    var localInjectors = new ComponentInjectors(componentRef);
    return new Promise((resolve, reject) => {
        try {
            ElementCompiler(componentFactory, componentRef, localInjectors, function(componentInstance) {
                if (!skipElementInsert && viewRef) {
                    elementInsertAfter(viewRef, componentRef.nativeElement, viewRef.nativeElement);
                    viewRef.children.add(componentRef);
                }

                (callback || resolve)(componentRef, componentInstance);
            });
        } catch(exception) {
            reject(exception)
        }

        localInjectors = null;
        viewDefinition = null;
    });
}