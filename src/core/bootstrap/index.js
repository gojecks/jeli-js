/**
 * Static Bootstrap Options
 * @param {*} moduleToBootStrap
 */
function BootStrapApplication(moduleToBootStrap, bootStrapComponent) {
    if (moduleToBootStrap && !$compileTracker.bootStrapComponent) {
        var _module = ModuleService.get(moduleToBootStrap);
        $compileTracker.bootStrapComponent = bootStrapComponent;
        $compileTracker.compiledModule = [_module];
        ModuleService.compileModule(_module, function(_mod) {
            $compileTracker.compiledModule.push(_mod);
        });
        interceptor.register();
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