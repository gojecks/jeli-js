/**
 * Static Bootstrap Options
 * @param {*} moduleToBootStrap
 */
function BootStrapApplication(moduleToBootStrap, bootStrapComponent) {
    if (moduleToBootStrap && !$compileTracker.bootStrapComponent) {
        var _module = ModuleService.get(moduleToBootStrap);
        $compileTracker.bootStrapComponent = bootStrapComponent;
        $compileTracker.compiledModule = [_module];
        ModuleService.injectRequiredModule(_module.options.requiredModules, function(_mod) {
            $compileTracker.compiledModule.push(_mod);
        });
        ProviderService.resolveConfig(_module.annotations.config);
        interceptor.register();
        ProviderService.initModule(_module.annotations.initializers);
        /**
         * Bind to Document EventListener
         * Boostrap Application once document is loaded
         */
        BootStrapApplication.onDocumentReadyFn = function() {
            $isDomLoaded = true;
            if (!$isCompiled) {
                // BootStrap Entry Component
                $isCompiled = true;
                HtmlParser.transverse(HtmlParser.__extractor(document.querySelector(bootStrapComponent)), null);
                $isAfterBootStrap = true;
            }
        };
    } else if (BootStrapApplication.onDocumentReadyFn) {
        BootStrapApplication.onDocumentReadyFn();
        BootStrapApplication.onDocumentReadyFn = null;
    }
}