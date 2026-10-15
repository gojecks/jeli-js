import assert from 'node:assert/strict';
import { router } from '../support/mount-router.mjs';

/**
 * Phase 1 of the SSR/hydration plan (.claude/plans/greedy-singing-mist.md) -
 * LocationService/strategy services accepting an injectable, per-render
 * `locationContext` instead of only reading `document.location`/
 * `window.location` as an ambient singleton. Tests LocationService directly
 * (not through the full DI graph) since `viewHandler` is only ever stored,
 * never invoked, by its constructor - this isolates the location-context
 * wiring itself from the router's separate, pre-existing view-resolution
 * machinery.
 */

// jsdom doesn't expose a public listener-count API; wrap addEventListener
// once so `it`s below can assert on listener registration counts.
if (!window.__listenerCountsInstalled) {
    window.__listenerCountsInstalled = true;
    window.__listenerCounts = {};
    const originalAddEventListener = window.addEventListener.bind(window);
    window.addEventListener = function (type, ...rest) {
        window.__listenerCounts[type] = (window.__listenerCounts[type] || 0) + 1;
        return originalAddEventListener(type, ...rest);
    };
}
function countListeners(type) {
    return (window.__listenerCounts && window.__listenerCounts[type]) || 0;
}

describe('LocationService / strategy services - per-request location context (SSR Phase 1)', () => {
    const fakeViewHandler = {};

    it('falls back to the real global location when no context is provided (zero client-side behavior change)', () => {
        const service = new router.LocationService(fakeViewHandler, router.PathStrategyService, null);
        assert.equal(service.locationContext, null);
        assert.equal(service.getRootUrl(), document.location.protocol + '//' + document.location.hostname);
    });

    it('uses the injected location context instead of the global when provided', () => {
        const context = { pathname: '/products/42', search: '', hash: '', protocol: 'https:', hostname: 'example.com', host: 'example.com', port: '' };
        const service = new router.LocationService(fakeViewHandler, router.PathStrategyService, context);
        assert.equal(service.getRootUrl(), 'https://example.com');
        assert.equal(service.strategy.path(), '/products/42');
    });

    it('resets routeConfig.isLoaded when a context is provided, so initializeRoute is not a no-op on a second render', () => {
        // simulate routeConfig already having been "loaded" by a prior render
        // in this same process (routeConfig is a module-level singleton -
        // exactly the hazard this reset exists to guard against)
        const contextA = { pathname: '/a', search: '', hash: '', protocol: 'http:', hostname: 'localhost', host: 'localhost', port: '' };
        const serviceA = new router.LocationService(fakeViewHandler, router.PathStrategyService, contextA);
        serviceA.initializeRoute(true);

        const contextB = { pathname: '/b', search: '', hash: '', protocol: 'http:', hostname: 'localhost', host: 'localhost', port: '' };
        const serviceB = new router.LocationService(fakeViewHandler, router.PathStrategyService, contextB);
        // this is the regression case: without the routeConfig.isLoaded reset,
        // the module-level flag set by serviceA's initializeRoute() would make
        // serviceB's call below silently return without doing anything
        serviceB.initializeRoute(true);
        assert.equal(serviceB.strategy.path(), '/b');
    });

    it('does not register window popstate/hashchange listeners when a context is provided (would otherwise leak across every render)', () => {
        const before = countListeners('popstate');
        const context = { pathname: '/', search: '', hash: '', protocol: 'http:', hostname: 'localhost', host: 'localhost', port: '' };
        new router.LocationService(fakeViewHandler, router.PathStrategyService, context);
        assert.equal(countListeners('popstate'), before);
    });

    it('getSearchParams reads from the injected context instead of window.location', () => {
        const context = { pathname: '/', search: '?foo=bar&baz=1', hash: '', protocol: 'http:', hostname: 'localhost', host: 'localhost', port: '' };
        const service = new router.LocationService(fakeViewHandler, router.PathStrategyService, context);
        const params = service.getSearchParams();
        assert.equal(params.foo, 'bar');
        // unserialize auto-converts numeric-looking values - correct
        // existing behavior, not something this change touches
        assert.equal(params.baz, 1);
    });
});
