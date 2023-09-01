import { ViewHandler } from "./jWebViewHandler.service";
import { EventManager, InterceptorResolver } from '@jeli/core';
import { 
    getHref,
    getRequiredRoute,
    routeConfig,
    ROUTE_EVENT_ENUMS,
    ROUTE_INTERCEPTOR,
    ROUTE_LOCATION_STRATEGY,
    getParentRoute,
    getRoute 
} from './utils';
import { RouteInterceptorInstance } from "../events/route-interceptor.event";
import { unserialize } from '@jeli/helpers/utils';
import { RouteErrorEvent } from "../events/route-error.event";
import { RouteEvent } from "../events/route.event";

Service({
    DI: [ViewHandler, ROUTE_LOCATION_STRATEGY]
})
export function LocationService(viewHandler, locationStrategy) {
    this.viewHandler = viewHandler;
    this.strategy = new locationStrategy(this);
    this.lastVisited = '';
    this.previousState = null;
    this.locationState = null;
    this.transitionState = {
        currentState: "",
        previousState: "",
        inProgress: false,
        stateQueue: [],
        transitioned: false,
        stopped: false
    };
    this.previous = null;
    this.currentRoute = Object({
        route: { params: {} },
    });

    /**
     * create an Event
     * Add Default Function to our listener
     * if slave function calls preventDefault
     * Master FN is not triggered
     */
    this.events = new EventManager((e, route, path) => {
        if (ROUTE_EVENT_ENUMS.RENDER === e.type) {
            var parentRoute = null;
            if (route.parent && !this.viewHandler.isResolved(route.parent, true)) {
                parentRoute = getParentRoute(route.parent);
            }

            // process module loading
            this.viewHandler._loadModule((parentRoute ? parentRoute.loadModule : route.loadModule))
                .then(rootElement => {
                    this._processState(route, path, rootElement);
                }).catch(err => this.events.dispatch(ROUTE_EVENT_ENUMS.LME, err));
        }
    });
}

LocationService.prototype.changed = function (path) {
    return this.lastVisited !== path;
};

/**
 * Webstate.replaceWebState
 * replaces the browser history state
 * @param {*} hash 
 */
LocationService.prototype.replace = function (path) {
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
}

/**
 * get or set the currentState
 * @param {*} state 
 */
LocationService.prototype.getState = function (state) {
    if (state) {
        this.locationState = state;
        return;
    }

    return this.locationState;
}

/**
 * 
 * @param {*} path 
 * @param {*} params 
 * @returns 
 */
LocationService.prototype.go = function (routeObj) {
    //check if state in Progress
    if (!routeObj || !routeObj.url || !routeObj.route) {
        this.events.dispatch(ROUTE_EVENT_ENUMS.NOTFOUND, {
            message: 'unable to resolve route'
        });
        return false;
    }
    /**
     * 
     * @param {*} routeName 
     * @param {*} params 
     */
    var redirect = (routeName, params) => this.redirect(routeName, params);

    //set the current State
    this.transitionState.previousState = this.transitionState.currentState;
    this.transitionState.currentState = routeObj.url;
    if (this.transitionState.inProgress) {
        this.checkTransition(routeObj.url, routeObj.route.route.params);
    } else if (this.changed(routeObj.url)) {
        // dispatch route start event
        this.events.dispatch(ROUTE_EVENT_ENUMS.START, {
            current: this.lastVisited,
            path: routeObj.url,
        });

        this.transitionState.inProgress = true;
        // dispatch guardcheck event
        this.events.dispatch(ROUTE_EVENT_ENUMS.GUARDCHECK, routeObj.route);
        var routeInstance = new RouteInterceptorInstance(routeObj.route, routeObj.url, this.currentRoute, redirect);
        InterceptorResolver(ROUTE_INTERCEPTOR, routeInstance)
            .then(() => {
                if (!this.transitionState.stopped) {
                    this.events.dispatch(ROUTE_EVENT_ENUMS.RENDER, routeObj.route, routeObj.url);
                }
                routeObj = null;
            });
    }
}


LocationService.prototype.getRootUrl = function () {
    var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
    if (document.location.port) {
        rootUrl += ':' + document.location.port;
    }

    // Return
    return rootUrl;
};

LocationService.prototype.getFullPath = function (path) {
    return this.getRootUrl() + this.strategy.path(path);
}

/**
 * 
 * @param {*} event 
 * @param {*} route 
 * @param {*} path 
 * @param {*} rootElement 
 */
LocationService.prototype._processState = function (route, path, rootElement) {
    //set the lastVisited to the $webState Object
    //lastVisited is neccessary when replace state is in use.
    var navigatedPath = (route.name === routeConfig.fallback.name ? route.url : path);
    /**
     * check if route changed by resolver
     */
    var lastTransitionQueue = this.transitionState.stateQueue.pop();
    if (lastTransitionQueue) {
        // change route
        navigatedPath = lastTransitionQueue[0];
        route = getRequiredRoute.apply(null, lastTransitionQueue);
        this.transitionState.stateQueue.length = 0;
    }

    // check to make sure current state is not same as state to resolve
    if (this.changed(navigatedPath)) {
        //dispatch event for webRoute Success
        this.events.dispatch(ROUTE_EVENT_ENUMS.SUCCESS, new RouteEvent(navigatedPath, route, this.currentRoute, this.lastVisited));
        this.currentRoute = route;
        this.strategy.pushState({ name: route.name, params: route.params }, navigatedPath);
        this.viewHandler.resolveViews(route, rootElement);
    } else {
        // trigger error route state
        this.events.dispatch(ROUTE_EVENT_ENUMS.ERROR, new RouteErrorEvent(navigatedPath));
    }

    // change progressState when component is resolved
    this.transitionState.inProgress = false;
    this.transitionState.stopped = false;
    // set the location hash with the resolved route
    this.lastVisited = navigatedPath;
}

LocationService.prototype.initializeRoute = function (restoreOnRefresh) {
    if (routeConfig.isLoaded) return;
    var path = "";
    if (restoreOnRefresh) {
        path = this.strategy.path();
    }

    /**
     * navigate to the requiredPath
     */
    this.byUrl(path);
    routeConfig.isLoaded = true;
}

LocationService.prototype.search = function (query) {
    return window.location.search = query;
}


LocationService.prototype.getSearchParams = function () {
    return unserialize(window.location.search.substring(1));
}

/**
 * Method Name : $href
 * @param {*} stateName 
 * @param {*} params 
 */
LocationService.prototype.href = function (stateName, params) {
    return getHref(stateName, params);
};

/**
 * 
 * @param {*} eventName 
 * @param {*} callback 
 * @returns Subscription
 */
LocationService.prototype.subscribe = function (eventName, callback) {
    var eventList = Object.values(ROUTE_EVENT_ENUMS);
    if (eventList.includes(eventName)){
        return this.events.add(eventName, callback);
    } else {
        console.error(eventName + ' does not exist, please use ' + eventList.join('|'));
        return null;
    }
}

LocationService.prototype.checkTransition = function (path, params) {
    if ((this.transitionState.currentState === this.transitionState.previousState)) return;
    this.transitionState.stateQueue.push([path, params]);
    this.transitionState.transitioned = true;
}

/**
 * 
 * @param {*} routeName 
 * @param {*} params 
 */
LocationService.prototype.redirect = function (routeName, params) {
    /**
     * binded to redirect 
     */
    var config = getRoute(routeName, params);
    if (this.changed(config.url)) {
        // dispatch redirect event
        this.events.dispatch(ROUTE_EVENT_ENUMS.REDIRECT, {
            current: this.transitionState.currentState,
            path: config.url,
        });
        this.go(config);
    } else {
        this.transitionState.stopped = true;
    }
}

/**
 * 
 * @param {*} url 
 * @param {*} params 
 */
LocationService.prototype.byUrl = function(url, params){
    url = url || routeConfig.fallback.url;
    var route = getRequiredRoute(url, params);
    this.go({route, url});
}

LocationService.prototype.byName = function(name, params) {
    this.go(getRoute(name, params));
};
