import { bootstrapFromDOM } from '../component/custom.dom';
import { Inject } from '../dependency.injector';
/**
 * JELI LOCAL VARIABLES
 */
var CoreBootstrapContext = Object({
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    injector: null,
    enableDebugger: true
});

export var INITIALIZERS = new ProviderToken('AppInitializers', true);
export var APP_BOOTSTRAP = new ProviderToken('AppBootstrap', true)
    /**
     * Static Bootstrap Options
     * @param {*} moduleToBootStrap
     */
export function bootStrapApplication(moduleToBootStrap) {
    return new Promise(function(resolve, reject) {
        try {
            CoreBootstrapContext.compiledModule = moduleToBootStrap;
            compileModule(moduleToBootStrap)
            /**
             * trigger INITIALIZERS
             */
            Promise.all(Inject(INITIALIZERS, CoreBootstrapContext.injector)
                .map(function(callback) {
                    return callback();
                })).then(function() {
                // BootStrap Entry Component
                CoreBootstrapContext.$isCompiled = true;
                bootStrapElement();
                resolve();
            }, reject);
        } catch (e) {
            errorBuilder(e.message);
            reject();
        }
    });

    function bootStrapElement() {
        if (moduleToBootStrap.rootElement) {
            var selector = moduleToBootStrap.rootElement.ctors.selector;
            bootstrapFromDOM(moduleToBootStrap.rootElement, selector, function(elementRef) {
                CoreBootstrapContext.bootStrapComponent = elementRef;
                Inject(APP_BOOTSTRAP, CoreBootstrapContext.injector).forEach(function(callback) {
                    callback();
                });
            });
        }
    }
};

/**
 * 
 * @param {*} dModule 
 */
export function compileModule(dModule) {
    dModule.fac();
    dModule();
}

/**
 * Change detector
 */
export function ChangeDetector() {
    if (!CoreBootstrapContext.bootStrapComponent) return;
    CoreBootstrapContext.bootStrapComponent.changeDetector.detectChanges();
};