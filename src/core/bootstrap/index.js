/**
 * Static Bootstrap Options
 * @param {*} moduleToBootStrap
 */
function BootStrapApplication(moduleToBootStrap, bootStrapComponent) {
    if (moduleToBootStrap && !$compileTracker.bootStrapComponent) {
        $compileTracker.bootStrapComponent = bootStrapComponent;
        $compileTracker.compiledModule = ModuleService._factories.get(moduleToBootStrap);
        /**
         * Bind to Document EventListener
         * Boostrap Application once document is loaded
         */
        // BootStrapApplication.onDocumentReadyFn();
    }

    return {
        onInit: function(registry) {
            $compileTracker.compiledModule.annotations.initializers.push($inject(registry));
        }
    }
}

BootStrapApplication.onDocumentReadyFn = function() {
    if (!$compileTracker.$isCompiled && $compileTracker.compiledModule) {
        ModuleService.compileModule($compileTracker.compiledModule);
        interceptor.register();
        // BootStrap Entry Component
        $compileTracker.$isCompiled = true;
        HtmlParser.transverse(HtmlParser.__extractor(document.querySelector($compileTracker.bootStrapComponent)), null);
    }

    // unregister listener
    document.removeEventListener('DOMContentLoaded', BootStrapApplication.onDocumentReadyFn);
};