/**
 * JELI LOCAL VARIABLES
 */
var $eUID = 1;
var CoreBootstrapContext = ({
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    $isAfterBootStrap: false,
    enableDebugger: true
});

/**
 * returns random ID
 */
function getUID() {
    return 'jeli:' + +new Date + ":" + $eUID++;
}

export var INITIALIZERS = new ProviderToken('AppInitializers', true);
/**
 * Static Bootstrap Options
 * @param {*} moduleToBootStrap
 */
export function bootStrapApplication(moduleToBootStrap) {
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
                fromDOM: true,
                providers: [
                    moduleToBootStrap.annotations.rootElement
                ]
            }, null);

            /**
             * bootstrap application
             */
            ElementCompiler.resolve(CoreBootstrapContext.bootStrapComponent, function() {});
        }
    }

    /**
     * 
     * @param {*} moduleFn 
     */
    function InitializeModule(moduleFn) {
        // trigger the moduleFn
        moduleFn();
        if (moduleFn.annotations.requiredModules) {
            moduleFn.annotations.requiredModules.forEach(InitializeModule);
        }
    }
};