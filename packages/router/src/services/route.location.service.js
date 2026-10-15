import { ViewHandler } from "./jWebViewHandler.service";
import { EventManager, InterceptorResolver } from '@jeli/core';
import {
    getHref,
    getRequiredRoute,
    routeConfig,
    ROUTE_EVENT_ENUMS,
    ROUTE_INTERCEPTOR,
    ROUTE_LOCATION_STRATEGY,
    ROUTE_LOCATION_CONTEXT,
    getParentRoute,
    getRoute
} from './utils';
import { RouteInterceptorInstance } from "../events/route-interceptor.event";
import { unserialize } from '@jeli/helpers/utils';
import { RouteErrorEvent } from "../events/route-error.event";
import { RouteEvent } from "../events/route.event";

Service({
    DI: [ViewHandler, ROUTE_LOCATION_STRATEGY, ROUTE_LOCATION_CONTEXT]
})
export class LocationService {
    constructor(viewHandler, locationStrategy, locationContext) {
        this.viewHandler = viewHandler;
        // server-render-only override, see ROUTE_LOCATION_CONTEXT's own doc
        // comment (utils.js) - null on every client-side/real-browser path
        this.locationContext = locationContext || null;
        if (this.locationContext) {
            // a fresh server render - routeConfig.isLoaded is a module-level
            // flag that would otherwise make initializeRoute() a no-op on
            // every render after the very first one in this process
            routeConfig.isLoaded = false;
        }
        this.strategy = new (locationStrategy || HashStrategyService)(this);
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
        this.events = new EventManager((e, route, path, initial) => {
            if (ROUTE_EVENT_ENUMS.RENDER === e.type) {
                var parentRoute = null;
                if (route.parent && !this.viewHandler.isResolved(route.parent, true)) {
                    parentRoute = getParentRoute(route.parent);
                }

                // process module loading
                this.viewHandler._loadModule((parentRoute ? parentRoute.loadModule : route.loadModule))
                    .then(rootElement => {
                        if (initial && initial !== path){
                            const reroute = getRequiredRoute(initial, null, true);
                            if (reroute.name !== route.name){
                                return this.go({ 
                                    route: reroute, 
                                    url: initial, 
                                    initial
                                });
                            }
                        }
                       
                        this._processState(route, path, rootElement);
                    }).catch(err => this.events.dispatch(ROUTE_EVENT_ENUMS.LME, err));
            }
        });
    }
    changed(path) {
        return this.lastVisited !== path;
    }
    /**
     * Webstate.replaceWebState
     * replaces the browser history state
     * @param {*} hash
     */
    replace(path) {
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
    getState(state) {
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
    go(routeObj) {
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
        var path = routeObj.url;
        var redirect = (routeName, params) => this.redirect(routeName, params);
        var transitioned = () => (this.transitionState.currentState !== path);
        var checkTransition = ()  => {
           if ((path === this.transitionState.currentState)) return;
           this.transitionState.stateQueue.push([path, routeObj.route.route.params]);
           this.transitionState.transitioned = true;
       };

        //set the current State
        this.transitionState.previousState = this.transitionState.currentState;
        if (this.transitionState.inProgress) {
            checkTransition(routeObj);
        }

        if (this.changed(path) && transitioned()) {
            // dispatch route start event
            this.transitionState.currentState = path;
            this.transitionState.inProgress = true;
            this.events.dispatch(ROUTE_EVENT_ENUMS.START, {
                current: this.lastVisited,
                path,
                redirected: this.transitionState.transitioned
            });
            // dispatch guardcheck event
            this.events.dispatch(ROUTE_EVENT_ENUMS.GUARDCHECK, routeObj.route);
            var routeInstance = new RouteInterceptorInstance(routeObj.route, path, this.currentRoute, redirect);
            InterceptorResolver(ROUTE_INTERCEPTOR, routeInstance)
                .then(() => {
                    if (!this.transitionState.stopped && !transitioned()) {
                        this.events.dispatch(ROUTE_EVENT_ENUMS.RENDER, routeObj.route, path, routeObj.initial);
                    } else if(!this.transitionState.transitioned){
                        Object.assign(this.transitionState, {
                            inProgress: false,
                            currentState: this.transitionState.previousState,
                            stopped: false
                        });
                    }
                    routeObj = null;
                })
                .catch(() => {
                    // an interceptor called reject() (e.g. a guard redirecting
                    // elsewhere via locals.redirect()) - reset transition state
                    // instead of leaving it stuck on the blocked path, and avoid
                    // an unhandled promise rejection on every blocked navigation
                    if (!this.transitionState.transitioned) {
                        Object.assign(this.transitionState, {
                            inProgress: false,
                            currentState: this.transitionState.previousState,
                            stopped: false
                        });
                    }
                    routeObj = null;
                });
        }
    }

    getRootUrl() {
        var loc = this.locationContext || document.location;
        var rootUrl = loc.protocol + '//' + (loc.hostname || loc.host);
        if (loc.port) {
            rootUrl += ':' + loc.port;
        }

        // Return
        return rootUrl;
    }
    getFullPath(path) {
        return this.getRootUrl() + this.strategy.path(path);
    }
    /**
     *
     * @param {*} event
     * @param {*} route
     * @param {*} path
     * @param {*} rootElement
     */
    _processState(route, path, rootElement) {
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
            var routeEvent = new RouteEvent(navigatedPath, route, this.currentRoute, this.lastVisited);
            this.events.dispatch(ROUTE_EVENT_ENUMS.SUCCESS, routeEvent);
            this.currentRoute = route;
            this.viewHandler.resolveViews(route, rootElement)
                .then(() => {
                    this.strategy.pushState({ name: route.name, params: route.route.params }, navigatedPath);
                    if (routeConfig.scrollTop) window.scrollTo(0, 0);
                    this.events.dispatch(ROUTE_EVENT_ENUMS.COMPLETE, routeEvent);
                    // cleanup
                    routeEvent = null;
                });
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
    initializeRoute(restoreOnRefresh) {
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
    search(query) {
        if (this.locationContext) {
            return this.locationContext.search = query;
        }
        return window.location.search = query;
    }
    getSearchParams() {
        var search = (this.locationContext || window.location).search || '';
        return unserialize(search.substring(1));
    }
    /**
     * Method Name : $href
     * @param {*} stateName
     * @param {*} params
     */
    href(stateName, params) {
        return getHref(stateName, params);
    }
    /**
     *
     * @param {*} eventName
     * @param {*} callback
     * @returns Subscription
     */
    subscribe(eventName, callback) {
        var eventList = Object.values(ROUTE_EVENT_ENUMS);
        if (eventList.includes(eventName)) {
            var events = this.events;
            var index = events.add(eventName, callback);
            return function unsubscribe() {
                events.unlink(eventName, index);
            };
        } else {
            console.error(eventName + ' does not exist, please use ' + eventList.join('|'));
            return null;
        }
    }

    /**
     *
     * @param {*} routeName
     * @param {*} params
     */
    redirect(routeName, params) {
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
    byUrl(url, params) {
        url = url || routeConfig.fallback.url;
        var route = getRequiredRoute(url, params);
        this.go({ 
            route, 
            url: (route && route.fallback) ? route.url : url, 
            initial: routeConfig.isLoaded ? null : url 
        });
    }

    byName(name, params) {
        this.go(getRoute(name, params));
    }
}

