import { ViewHandler } from "./jWebViewHandler.service";
import { EventManager, InterceptorResolver } from '@jeli/core';
import { getHref, getRequiredRoute, routeConfig, RouteInterceptorInstance, ROUTE_EVENT_ENUMS, ROUTE_INTERCEPTOR, ROUTE_LOCATION_STRATEGY } from './utils';

Service({
    DI: [ViewHandler, ROUTE_LOCATION_STRATEGY]
})
export function LocationService(viewHandler, locationStrategy) {
    this.viewHandler = viewHandler;
    this.strategy = new locationStrategy(this);
    this.lastVisited = '';
    this.previousState = null;
    this.locationState = null;
    this.previous = null;
    this.currentRoute = Object({
        route: { params: {} },
    });

    /**
     * create an Event
     * Add Default Function to our listener
     * if Slave Function calls preventDefault
     * Master FN is not triggered
     * list of eventNames $webRouteStart|$webRouteNotFound|$webRouteSuccess|$webRouteError
     */
    this.events = new EventManager((e, route, path) => {
        if (route.loadModule) {
            // process module loading
            this.viewHandler._loadModule(route.loadModule, rootElement => {
                this._processState(e, route, path, rootElement);
            });
        } else {
            this._processState(e, route, path)
        }
    });
}

LocationService.prototype.changed = function(path) {
    return this.lastVisited !== path;
};

/**
 * Webstate.replaceWebState
 * replaces the browser history state
 * @param {*} hash 
 */
LocationService.prototype.replace = function(path) {
    //replace state for jeli webRoute
    if (!this.locationState && !path) return;
    this.locationState = ({
        state: 'replaceState',
        path: (path || this.locationState.previous),
        previous: this.previousState,
        current: this.lastVisited
    });

    // Fallback for HTML4 browsers
    this.previous = this.locationState.path;
};

/**
 * get or set the currentState
 * @param {*} state 
 */
LocationService.prototype.getState = function(state) {
    if (state) {
        this.locationState = state;
        return;
    }

    return this.locationState;
};

LocationService.prototype.search = function(query) {
    return window.location.search = query;
};

/**
 * 
 * @param {*} path 
 * @param {*} params 
 * @returns 
 */
LocationService.prototype.go = function(path, params) {
    //check if state in Progress
    if (!path) {
        return false;
    }
    //set the current State
    this.viewHandler.previousState = this.viewHandler.currentState;
    this.viewHandler.currentState = path;
    /**
     * 
     * @param {*} path 
     * @param {*} params 
     */
    var redirect = (path, params) => {
        /**
         * binded to redirect 
         */
        path = getHref(path, params);
        if (this.changed(path)) {
            this.go(path, params);
        } else {
            stopped = true;
        }
    };

    if (this.viewHandler.stateInProgress) {
        // check if previous and current state are same
        if ((this.viewHandler.currentState === this.viewHandler.previousState)) {
            return;
        }
        this.viewHandler.stateQueue.push([path, params]);
        this.viewHandler.$stateTransitioned = true;
    } else if (this.changed(path)) {
        //set up new events
        var route = getRequiredRoute(path, params);
        var stopped = false;
        if (route) {
            this.viewHandler.stateInProgress = true;
            var routeInstance = new RouteInterceptorInstance(route, path, this.currentRoute, redirect);
            InterceptorResolver(ROUTE_INTERCEPTOR, routeInstance)
                .then(() => {
                    if (!stopped) {
                        this.events.dispatch(ROUTE_EVENT_ENUMS.START, route, path);
                    }
                });
        } else {
            this.events.dispatch(ROUTE_EVENT_ENUMS.NOTFOUND, {
                path: path,
                params: params,
                message: 'unable to resolve route'
            });
        }
    }
}


LocationService.prototype.getRootUrl = function() {
    var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
    if (document.location.port) {
        rootUrl += ':' + document.location.port;
    }

    // Return
    return rootUrl;
};

LocationService.prototype.getFullPath = function(path) {
    return this.getRootUrl() + this.strategy.path(path);
}

/**
 * 
 * @param {*} event 
 * @param {*} route 
 * @param {*} path 
 * @param {*} rootElement 
 */
LocationService.prototype._processState = function(event, route, path, rootElement){
    if ((ROUTE_EVENT_ENUMS.START === event.type)) {
        //set the lastVisited to the $webState Object
        //lastVisited is neccessary when replace state is in use.
        var navigatedPath = (route.name === routeConfig.fallback.name ? route.url : path);
        /**
         * check if route changed by resolver
         */
        var lastTransitionQueue = this.viewHandler.stateQueue.pop();
        if (lastTransitionQueue) {
            // change route
            navigatedPath = lastTransitionQueue[0];
            route = getRequiredRoute.apply(null, lastTransitionQueue);
            this.viewHandler.stateQueue.length = 0;
        }

        // check to make sure current state is not same as state to resolve
        if (this.changed(navigatedPath)) {
            //dispatch event for webRoute Success
            this.events.dispatch(ROUTE_EVENT_ENUMS.SUCCESS, route, this.currentRoute);
            this.currentRoute = route;
            this.strategy.pushState({name:route.name, params:route.params}, navigatedPath);
            this.viewHandler.resolveViews(route,  rootElement);
        } else {
            // trigger error route state
            this.events.dispatch(ROUTE_EVENT_ENUMS.ERROR, route);
        }

        /**
         * change progressState when component is resolved
         */
        this.viewHandler.stateInProgress = false;
        // set the location hash with the resolved route
        this.lastVisited = navigatedPath;
    }
}