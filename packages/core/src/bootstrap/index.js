import { CompileNativeElement } from '../component/custom.dom';
import { Inject, ProviderToken } from '../dependency.injector';
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
export var APP_BOOTSTRAP = new ProviderToken('AppBootstrap', true);
export var APP_BASE_HREF = new ProviderToken('AppBaseHref', false);
export var APP_ASSET_URL = new ProviderToken('AppAssetsURL', false);

/**
 * SSR hydration (Phase 3, see .claude/plans/greedy-singing-mist.md). Opt-in,
 * ambient flag - same shape as Phase 2's lifecycle promise tracking
 * (component/lifecycle.js). Enable immediately before calling
 * bootStrapApplication() against a DOM that already contains server-
 * rendered markup at the root selector; disable afterward. Zero effect on
 * the normal client bootstrap path when never called.
 */
var _hydrateMode = false;
export function enableHydrationMode() { _hydrateMode = true; }
export function disableHydrationMode() { _hydrateMode = false; }
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
        var isNative = moduleToBootStrap.rootElement.ctors.asNative;
        if (moduleToBootStrap.rootElement && !isNative) {
            var selector = moduleToBootStrap.rootElement.ctors.selector;
            CompileNativeElement(moduleToBootStrap.rootElement, document.querySelector(selector), function(elementRef) {
                CoreBootstrapContext.bootStrapComponent = elementRef;
                Inject(APP_BOOTSTRAP, CoreBootstrapContext.injector).forEach(function(callback) {
                    callback();
                });
            }, _hydrateMode);
        }
    }
};

/**
 * 
 * @param {*} m 
 */
export function compileModule(m) {
    return m && (m.fac(), new m());
}

/**
 * Change detector
 */
export function ChangeDetector() {
    if (!CoreBootstrapContext.bootStrapComponent) return;
    CoreBootstrapContext.bootStrapComponent.changeDetector.detectChanges();
};

/**
 * @internal devtools-only accessor for the currently bootstrapped root
 * ElementRef (see utils/debugger.js's global.jeli.devtools) - not for use
 * by application code.
 */
export function _getBootstrapRoot() {
    return CoreBootstrapContext.bootStrapComponent;
}

/**
 * @internal devtools-only accessor, see _getBootstrapRoot above.
 */
export function _isDebuggerEnabled() {
    return CoreBootstrapContext.enableDebugger;
}