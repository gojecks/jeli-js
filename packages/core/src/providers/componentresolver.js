/**
 * 
 * @param {*} componentFactory 
 * @param {*} element 
 * @param {*} callback 
 */
export function ComponentFactoryResolver(componentFactory, viewComponent, callback) {
    if (!componentFactory || !componentFactory.annotations.exposeView) {
        errorBuilder('No exported factory found for <' + componentFactory.annotations.selector + '> in ' + componentFactory.annotations.module);
    }

    if (!viewComponent) {
        throw new Error('Unable to resolve component: ' + selector);
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
        viewComponent.insertAfter(component.nativeElement, viewComponent.nativeElement);
        callback(component, componentInstance);
    });
    localInjectors = null;
    viewDefinition = null;
}