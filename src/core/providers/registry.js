/**
 * ProviderService exports
 */
var InternalProviderService = new Map();
InternalProviderService.set('$promise', _Promise);
InternalProviderService.set('$defer', Defer);
InternalProviderService.set('changeDetector', ComponentRef.detectChanges);
InternalProviderService.set('EventEmitter', (function() {
    return new $EventEmitter;
}));
InternalProviderService.set('Event', CustomEventHandler);
InternalProviderService.set('$localStorage', window.localStorage);
InternalProviderService.set('$sessionStorage', window.sessionStorage);
InternalProviderService.set('$injector', new DependencyInjectorService());
InternalProviderService.set('$sce', HtmlParser.sce);
InternalProviderService.set('$Observer', Observer);
InternalProviderService.set('$resolve', ControllerResolvers);
InternalProviderService.set('jDebugProvider', { $disableDebugMode: false });
InternalProviderService.set('ComponentResolver', ComponentFactoryResolver);
InternalProviderService.set('dom', new HtmlDOM);

/**
 * 
 * @param {*} tokenName 
 */
function ProviderToken(tokenName) {
    InternalProviderService.set(tokenName, )
}