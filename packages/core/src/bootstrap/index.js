import { Inject } from '../dependency.injector';
import { _Promise } from '../rx/promise/promise';
/**
 * JELI LOCAL VARIABLES
 */
var $eUID = 1;
var CoreBootstrapContext = ({
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    injector: null,
    enableDebugger: true
});

export var INITIALIZERS = new ProviderToken('AppInitializers', true);
/**
 * Static Bootstrap Options
 * @param {*} moduleToBootStrap
 */
export function bootStrapApplication(moduleToBootStrap) {
    CoreBootstrapContext.compiledModule = moduleToBootStrap;
    InitializeModule(moduleToBootStrap);
    /**
     * trigger INITIALIZERS
     */
    CoreBootstrapContext.injector = new AbstractInjectorInstance();
    _Promise.all(Inject(INITIALIZERS, CoreBootstrapContext.injector)
        .map(function(callback) {
            return callback();
        })).done(function() {
        // BootStrap Entry Component
        CoreBootstrapContext.$isCompiled = true;
        bootStrapElement();
    }, function(err) {
        console.error(err);
    });

    function bootStrapElement() {
        if (moduleToBootStrap.annotations.rootElement) {
            var selector = moduleToBootStrap.annotations.rootElement.annotations.selector;
            CoreBootstrapContext.bootStrapComponent = new ElementRef({
                name: selector,
                isc: true,
                type: 'element',
                fromDOM: true
            }, null);

            /**
             * bootstrap application
             */
            ElementCompiler(
                moduleToBootStrap.annotations.rootElement,
                CoreBootstrapContext.bootStrapComponent,
                CoreBootstrapContext.injector,
                function() {});
        }
    }

    /**
     * 
     * @param {*} moduleFn 
     */
    function InitializeModule(moduleFn) {
        moduleFn();
        if (moduleFn.annotations.requiredModules) {
            moduleFn.annotations.requiredModules.forEach(InitializeModule);
        }
    }
};