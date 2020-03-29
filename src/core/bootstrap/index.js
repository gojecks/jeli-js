/**
 * Static Bootstrap Options
 * @param {*} moduleToBootStrap
 */
function bootStrapApplication(moduleToBootStrap) {
    CoreBootstrapContext.compiledModule = moduleToBootStrap;
    InitializeModule(moduleToBootStrap);
    // BootStrap Entry Component
    CoreBootstrapContext.$isCompiled = true;
    bootStrapElement();

    function bootStrapElement() {
        if (moduleToBootStrap.annotations.rootElement) {
            var selector = moduleToBootStrap.annotations.rootElement.annotations.selector;
            CoreBootstrapContext.bootStrapComponent = new ElementRef({
                name: selector,
                isc: true,
                type: 'element',
                fromDOM: true
            }, null);
            ElementCompiler(moduleToBootStrap.annotations.rootElement, CoreBootstrapContext.bootStrapComponent, function() {});
        }
    }
};

var INITIALIZERS = new ProviderToken('AppInitializers');
/**
 * 
 * @param {*} moduleFn 
 */
function InitializeModule(moduleFn) {
    console.log(INITIALIZERS);
    moduleFn.annotations.initializers.forEach(Depene);
    if (moduleFn.annotations.requiredModules) {
        moduleFn.annotations.requiredModules.forEach(InitializeModule);
    }
}

export {
    INITIALIZERS,
    bootStrapApplication
};