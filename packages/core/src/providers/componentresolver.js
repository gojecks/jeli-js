/**
 * 
 * @param {*} componentFactory 
 * @param {*} viewComponent 
 * @param {*} callback 
 * @param {*} skipElemetInsert 
 * @returns 
 */
export function ComponentFactoryResolver(componentFactory, viewComponent, callback, skipElemetInsert) {
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
    var component = new ElementRef(viewDefinition, viewComponent);
    var localInjectors = new ComponentInjectors(component);
    ElementCompiler(componentFactory, component, localInjectors, function(componentInstance) {
        elementInsertAfter(viewComponent, component.nativeElement, viewComponent.nativeElement);
        callback(component, componentInstance);
    });
    localInjectors = null;
    viewDefinition = null;
}