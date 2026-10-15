/**
 * Type declarations for @jeli/router
 *
 * Hand-authored from the actual runtime source. Covers every symbol
 * reachable from `public.api.js` -> `src/module.js` and
 * `src/services/utils.js`'s imports (jeli's compiler flattens the whole
 * reachable import graph's exports into one package surface - see
 * @jeli/compiler-cli/lib/core/compiler.js).
 *
 * OUT OF SCOPE: `Directive({...})`/`Element({...})`/`Service({...})`
 * decorator option objects (see packages/core/index.d.ts header for the
 * full rationale) - only the decorated classes'/functions' actual runtime
 * members are declared.
 */

/// <reference path="../core/index.d.ts" />

import { ProviderToken, EventEmitter, ElementRef } from '@jeli/core';

/** Loosely-typed route definition, as passed to `RouterModule.setRoutes`/`.lazyLoad`. */
export interface RouteDefinition {
    name?: string;
    url?: string;
    parent?: string;
    component?: any;
    loadModule?: () => Promise<any>;
    children?: RouteDefinition[];
    data?: Record<string, any>;
    views?: Record<string, any>;
    targetView?: string;
    abstract?: boolean;
    fallback?: boolean;
    isIntent?: boolean;
    transition?: number;
    [key: string]: any;
}

/** Root module: registers the router's directives/elements and the `APP_BOOTSTRAP` initializer. */
export declare class RouterModule {
    static setRoutes(routes: RouteDefinition | RouteDefinition[]): void;
    static lazyLoad(routes: RouteDefinition | RouteDefinition[]): void;
}

// ---------------------------------------------------------------------------
// Tokens / config / route registry (src/services/utils.js)
// ---------------------------------------------------------------------------

/** Multi-provider token for route guards/interceptors (`{ resolve(routeInstance, next, reject) }`). */
export declare const ROUTE_INTERCEPTOR: ProviderToken<any[]>;
/** Single-provider token selecting the location strategy class (defaults to `HashStrategyService`). */
export declare const ROUTE_LOCATION_STRATEGY: ProviderToken<typeof AbstractStrategy>;

export declare const staticRoutePrefix: string;

export declare const routeConfig: {
    isLoaded: boolean;
    intentFallback: any;
    useHash: boolean;
    fallback: { url: string; name: string };
    restoreOnRefresh: boolean;
    delimiter: string[];
    autoInitialize: boolean;
    allowChangeFromLocationBar: boolean;
    scrollTop: boolean;
    [key: string]: any;
};

export declare const ROUTE_EVENT_ENUMS: {
    SUCCESS: string;
    ERROR: string;
    START: string;
    NOTFOUND: string;
    GUARDCHECK: string;
    REDIRECT: string;
    RENDER: string;
    COMPLETE: string;
    LME: string;
};

export declare const INTENT_EVENT_ENUMS: {
    SUCCESS: string;
    ERROR: string;
    START: string;
    NOTFOUND: string;
    GUARDCHECK: string;
    REDIRECT: string;
    RENDER: string;
    COMPLETE: string;
};

export declare function getParentRoute(name: string): RouteDefinition | undefined;
export declare function getFallback(urlPath: string, deep?: boolean): RouteDefinition | null;
export declare function parseDelimeter(): string;
export declare function getRoute(routeName: string, params?: Record<string, any>): { route: RouteDefinition; url: string };
export declare function getRequiredRoute(url: string, params?: Record<string, any>, deep?: boolean): RouteDefinition | undefined;
export declare function parseUrl(href: string, params: Record<string, any>): string;
export declare function getHref(routeName: string, params?: Record<string, any>): string;

// ---------------------------------------------------------------------------
// Components / directives
// ---------------------------------------------------------------------------

/** `<a go="routeName">` / `[go]` - navigates via `WebStateService.go` on click. */
export declare class GoFn {
    params: Record<string, any>;
    constructor(webStateService: WebStateService);
    pathName?: string;
    target?: string;
    clickHandler(event: MouseEvent): void;
}

/** `<router-view>` / `[j-view]` - a named outlet the router renders resolved route components into. */
export declare function jViewFn(viewHandler: ViewHandler, elementRef: ElementRef): void;

/** `[openIntent]` - opens a registered "intent" (modal/overlay-style route) on click. */
export declare function OpenIntent(viewIntent: ViewIntentService): void;

/** `<router-intent-container>` - host element intents are mounted into. */
export declare class JIntentContainer {
    constructor(viewIntent: ViewIntentService, elementRef: ElementRef);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/** Opens/closes/transitions "intent" routes (modal-style views registered with `isIntent: true`). */
export declare class ViewIntentService {
    intentContainer: ElementRef | null;
    onCloseEvent: EventEmitter;
    constructor();
    openIntent(intentName: string, params?: Record<string, any>): void;
    closeIntent(data?: any): void;
    destroyAllIntent(): void;
    removeIntent(intentName: string): void;
    transitIntent(intentName: string): void;
    getIntentView(intentName: string): any;
    hideAllIntent(): void;
    getCurrentIntent(): any;
    getParams(): Record<string, any> | undefined;
}

/** Tracks named `<router-view>` outlets and compiles resolved route components into them. */
export declare class ViewHandler {
    viewsHolder: Map<string, any>;
    currentView: string;
    constructor();
    isResolved(parentName: string, setValue?: boolean): boolean;
    setViewReference(elementRef: ElementRef, ref: string): void;
    getView(view: string, name?: string): any;
    compileViewTemplate(viewComponent: RouteDefinition, viewObjectInstance: any, callback: () => void): void;
    removeViews(views: string[]): void;
    getCurrentView(route: RouteDefinition): string[];
    resolveViews(route: RouteDefinition): Promise<void>;
    destroy(ref: string): void;
    handlePendingView(viewName: string): void;
    cleanUp(viewInstance: any): void;
}

/** Facade for programmatic navigation (`go`) and reading the current route's params. */
export declare class WebStateService {
    locationService: LocationService;
    onParamsChanged: EventEmitter;
    constructor(locationService: LocationService);
    readonly state: any;
    go(routeName: string, params?: Record<string, any>, targetWindow?: string): void;
    getParam(name: string): any;
    setParam(name: string | Record<string, any>, value?: any): void;
    getUrlParams(): Record<string, any>;
}

/** `APP_BOOTSTRAP` factory that kicks off the initial route resolution (registered by `RouterModule`). */
export declare function RouterInitService(locationService: LocationService): void;

/** Central navigation/history coordinator: resolves routes, runs interceptors, drives `ViewHandler`. */
export declare class LocationService {
    viewHandler: ViewHandler;
    strategy: AbstractStrategy;
    lastVisited: string;
    currentRoute: { route: { params: Record<string, any> }; [key: string]: any };
    constructor(viewHandler: ViewHandler, locationStrategy?: new (locationService: LocationService) => AbstractStrategy);
    changed(path: string): boolean;
    replace(path?: string): void;
    getState(state?: any): any;
    go(routeObj: { route: RouteDefinition; url: string; initial?: string | null }): boolean | void;
    getRootUrl(): string;
    getFullPath(path: string): string;
    initializeRoute(restoreOnRefresh?: boolean): void;
    search(query: string): string;
    getSearchParams(): Record<string, any>;
    href(stateName: string, params?: Record<string, any>): string;
    subscribe(eventName: string, callback: (...args: any[]) => void): number | null;
    redirect(routeName: string, params?: Record<string, any>): void;
    byUrl(url: string, params?: Record<string, any>): void;
    byName(name: string, params?: Record<string, any>): void;
}

/** Base for a browser-history integration strategy (hash-based or pushState-based). */
export declare class AbstractStrategy {
    originalState: any;
    locationService: LocationService;
    isReplaceState: boolean;
    constructor(locationService: LocationService);
    getBaseHref(): string | void;
    path(path?: string): string | void;
    pushState(data: any, path: string): void;
    listenEvent(): void;
}

/** `#!/...`-style hash-based location strategy. */
export declare class HashStrategyService extends AbstractStrategy {
    hashRegEx: RegExp;
    replace(): void;
    path(path?: string): string;
    listenEvent(): void;
}

/** `history.pushState`-based (real-path) location strategy. */
export declare class PathStrategyService extends AbstractStrategy {
    path(path?: string): string;
    listenEvent(): void;
}

// ---------------------------------------------------------------------------
// Events (constructor-style; instantiated with `new`)
// ---------------------------------------------------------------------------

/** Guard/interceptor-facing route context, passed to every `ROUTE_INTERCEPTOR` entry. */
export declare class RouteInterceptorInstance {
    name?: string;
    path: string;
    locals: Record<string, any>;
    currentRoute: any;
    originalUrl?: string;
    data?: Record<string, any>;
    redirect: (routeName: string, params?: Record<string, any>) => void;
    readonly params: Record<string, any>;
    constructor(route: RouteDefinition, path: string, currentRoute: any, redirectMethod: (routeName: string, params?: Record<string, any>) => void);
}

export declare class RouteErrorEvent {
    url: string;
    message: string;
    constructor(path: string);
}

export declare class RouteEvent {
    path: string;
    name?: string;
    params: Record<string, any>;
    data?: Record<string, any>;
    previous?: { path: string; name?: string; params: Record<string, any> };
    constructor(path: string, route: RouteDefinition, previousRoute?: RouteDefinition, previousPath?: string);
}
