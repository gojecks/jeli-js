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
        return Promise.reject('No exported factory found for <' + componentFactory.ctors.selector + '>');
    }

    var componentRef = new ElementRef({
        name: componentFactory.ctors.selector,
        type: 'element',
        isc: true,
        providers: [componentFactory]
    }, viewRef, true);
    var localInjectors = new ComponentInjectors(componentRef);
    return new Promise((resolve, reject) => {
        try {
            ElementCompiler(componentFactory, componentRef, localInjectors, function(componentInstance) {
                if (!skipElementInsert && viewRef) {
                    elementInsertAfter(viewRef, componentRef.nativeElement, viewRef.nativeElement);
                    viewRef.children.add(componentRef);
                }

                EventHandler.registerListener(componentRef);
                (callback || resolve)(componentRef, componentInstance);
            });
        } catch(exception) {
            reject(exception)
        }

        localInjectors = null;
    });
}