import { ViewHandler } from "./jWebViewHandler.service";
import { EventManager, InterceptorResolver } from '@jeli/core';
import { getHref, getRequiredRoute, routeConfig, RouteInterceptorInstance, ROUTE_INTERCEPTOR } from './utils';
import { HashStrategyService } from "./hash.strategy.service";
import { PathStrategyService } from "./path.strategy.service";

Service({
    DI: [ViewHandler, HashStrategyService, PathStrategyService]
})
export function LocationService(viewHandler) {
    var _this = this;
    this.viewHandler = viewHandler;
    this.strategy = routeConfig.useHash ? new HashStrategyService(this) : new PathStrategyService(this);
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
     */
    this.events = new EventManager(function(e, route, path) {
        if (('$webRouteStart' === e.type)) {
            //set the lastVisited to the $webState Object
            //lastVisited is neccessary when replace state is in use.
            var navigatedPath = (route.name === routeConfig.fallback.name ? route.url : path);
            /**
             * check if route changed by resolver
             */
            var lastTransitionQueue = viewHandler.stateQueue.pop();
            if (lastTransitionQueue) {
                // change route
                navigatedPath = lastTransitionQueue[0];
                route = getRequiredRoute.apply(null, lastTransitionQueue);
                viewHandler.stateQueue.length = 0;
            }

            // check to make sure current state is not same as state to resolve
            if (_this.changed(navigatedPath)) {
                //dispatch event for webRoute Success
                _this.events.dispatch('$webRouteSuccess', route, _this.currentRoute);
                _this.currentRoute = route;
                _this.strategy.pushState(navigatedPath);
                viewHandler.resolveViews(route);
            } else {
                // trigger error route state
                _this.events.dispatch('$webRouteError', route);
            }

            /**
             * change progressState when component is resolved
             */
            _this.viewHandler.stateInProgress = false;
            // set the location hash with the resolved route
            _this.lastVisited = navigatedPath;
        }
    });

    //check for pending view rendering
    this.events.add('view.render', function(ev, viewName) {
        if (viewHandler._pendingViewStack.has(viewName)) {
            viewHandler.compileViewTemplate(viewHandler._pendingViewStack.get(viewName), viewHandler.viewsHolder.get(viewName));
            viewHandler._pendingViewStack.delete(viewName);
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
    var _this = this;
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
    function redirect(path, params) {
        /**
         * binded to redirect 
         */
        path = getHref(path, params);
        if (_this.changed(path)) {
            _this.go(path, params);
        } else {
            stopped = true;
        }
    }

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
                .then(function() {
                    if (!stopped) {
                        _this.events.dispatch('$webRouteStart', route, path);
                    }
                });
        } else {
            this.events.dispatch('$webRouteNotFound', {
                path: path,
                params: params,
                message: 'unable to resolve route'
            });
        }
    }
}


LocationService.prototype.getRootUrl = function() {
    var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
    if (document.location.port || false) {
        rootUrl += ':' + document.location.port;
    }

    // Return
    return rootUrl;
};

LocationService.prototype.getFullPath = function(path) {
    return this.getRootUrl() + (routeConfig.useHash ? '#' : '') + path;
}