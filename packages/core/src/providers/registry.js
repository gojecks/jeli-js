import { publicDependencyInjector } from '../dependency.injector';
import { ComponentFactoryResolver } from './componentresolver';
import { CoreResolvers } from './component.initializer'
/**
 * ProviderService exports
 */
var InternalProviderService = new Map();
InternalProviderService.set('changeDetector', ComponentRef.detectChanges);
InternalProviderService.set('EventEmitter', (function() {
    return new $EventEmitter;
}));
InternalProviderService.set('Event', CustomEventHandler);
InternalProviderService.set('$localStorage', window.localStorage);
InternalProviderService.set('$sessionStorage', window.sessionStorage);
InternalProviderService.set('$injector', publicDependencyInjector);
InternalProviderService.set('$sce', HtmlParser.sce);
InternalProviderService.set('$Observer', Observer);
InternalProviderService.set('$resolve', CoreResolvers);
InternalProviderService.set('jDebugProvider', { $disableDebugMode: false });
InternalProviderService.set('ComponentResolver', ComponentFactoryResolver);

/**
 * 
 * @param {*} tokenName 
 */
export function ProviderToken(tokenName) {
    // InternalProviderService.set(tokenName, )
}