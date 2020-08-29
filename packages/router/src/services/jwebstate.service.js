// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

// jeliWebState Service
import { isequal } from 'js-helpers/helpers';
import { CustomEventHandler } from '@jeli/core';
import { WebStateProvider } from './jwebstate.provider';
import { ViewHandler } from './jWebViewHandler.service';
import { ResolveRouteInterceptor } from './utils';
Service({
    DI: [WebStateProvider, ViewHandler, CustomEventHandler]
})

/**
 * 
 * @param {*} webStateProvider 
 * @param {*} viewHandler 
 * @param {*} $resolve 
 * @param {*} customEventHandler 
 */
export function WebStateService(webStateProvider, viewHandler, customEventHandler) {
    var _this = this;
    this.locationStates = null;
    this.lastState = null;
    this.isReplaceState = false;
    this.state = {
        route: { params: {} },
    };
    this.webStateProvider = webStateProvider;
    this.viewHandler = viewHandler;

    function _routeEventListener(e, route, path) {
        if (isequal('$webRouteStart', e.type)) {
            //set the baseUrl to the $webState Object
            //BaseUrl is neccessary when replace state is in use.
            _this.$$baseUrl = path;
            ResolveRouteInterceptor({
                name: route.name,
                path: path,
                url: route.url
            }, function() {
                /**
                 * check if route changed by resolver
                 */
                var lastTransitionQueue = viewHandler.stateQueue.pop();
                if (lastTransitionQueue) {
                    // change route
                    _this.$$baseUrl = lastTransitionQueue.path;
                    route = getRequiredRoute(lastTransitionQueue.path).checkParams(lastTransitionQueue.params);
                    viewHandler.stateQueue.length = 0;
                }

                // check to make sure current state is not same as state to resolve
                if (!isequal(_this.$$baseUrl, _this.state.url)) {
                    //dispatch event for webRoute Success
                    _this.events.dispatch('$webRouteSuccess', route, _this.state.route);
                    _this.state = route;
                    viewHandler.resolveViews(route, _this.state);
                } else {
                    // trigger error route state
                    _this.events.dispatch('$webRouteError', route);
                }

                /**
                 * change progressState when component is resolved
                 */
                viewHandler.stateInProgress = false;
                // set the location hash with the resolved route
                location.hash = _this.$$baseUrl;
            });

        }
    }

    /**
     * create an Event
     * Add Default Function to our listener
     * if Slave Function calls preventDefault
     * Master FN is not triggered
     */
    this.events = new customEventHandler('listener', _routeEventListener);
    //register replaceState event
    this.events.listener('replaceState', function(ev) {
        _this.isReplaceState = true;
    });
    //check for pending view rendering
    this.events.listener('view.render', function(ev, viewName) {
        if (viewHandler._pendingViewStack.has(viewName)) {
            viewHandler.compileViewTemplate(viewHandler._pendingViewStack.get(viewName), viewHandler.viewsHolder.get(viewName));
            viewHandler._pendingViewStack.delete(viewName);
        }
    });
};

/**
 * 
 * @param {*} ev 
 * @param {*} path 
 * @param {*} params 
 */
WebStateService.prototype._gotoState = function(ev, path, params) {
    //check if state in Progress
    if (!path) {
        return false;
    }
    //set the current State
    this.viewHandler.previousState = this.viewHandler.currentState;
    this.viewHandler.currentState = path;
    if (this.viewHandler.stateInProgress) {
        // check if previous and current state are same
        if (isequal(this.viewHandler.currentState, this.viewHandler.previousState)) {
            return;
        }
        this.viewHandler.stateQueue.push({
            path: path,
            param: params
        });
        this.viewHandler.$stateTransitioned = true;
    } else {
        //set up new events
        var route = this.webStateProvider.getRoute(path, params);
        if (route) {
            //set stateInProgress to true
            this.viewHandler.stateInProgress = true;
            //initialize state changed 
            this.events.dispatch('$webRouteStart', route, path);
        }
    }
}

/**
 * Method Name : GO
 * Parameter : stateName (STRING) , Params (OBJECT)
 * @returns : self
 */
WebStateService.prototype.go = function(path, params) {
    path = this.$href(path, params);
    if (this._stateChanged(path)) {
        this._gotoState(null, path, params);
    }
    return this;
};

/**
 * Method Name : $href
 * @param {*} stateName 
 * @param {*} params 
 */
WebStateService.prototype.$href = function(stateName, params) {
    var state = this.webStateProvider.getRouteObj(stateName);
    if (state) {
        if (state.route.paramsLength && !params) {
            throw new Error(stateName + " requires parameter, buit none was provided");
        }

        var href = state.url.replace(/\:(\w)+/g, function(index, key) {
            var chkr = index.split(":")[1]
            return chkr in params && params[chkr] ? params[chkr] : index;
        });

        return href;
    }

    return this.webStateProvider.fallback;
};

/**
 * Webstate.replaceWebState
 * replaces the browser history state
 * @param {*} hash 
 */
WebStateService.prototype.replaceWebState = function(hash) {
    //replace state for jeli webRoute
    if (!this.locationStates && !hash) return;
    this.locationStates = ({
        state: 'replaceState',
        hash: '#' + (hash || this.locationStates.previousHash).replace(/^#/, ''),
        previousHash: this.lastState,
        currentLocation: location.hash
    });

    // Fallback for HTML4 browsers
    this.lastState = this.locationStates.hash;
};

/**
 * get or set the currentState
 * @param {*} state 
 */
WebStateService.prototype.currentState = function(state) {
    if (state) {
        this.locationStates = state;
        return;
    }

    return this.locationStates;
};

WebStateService.prototype.search = function(query) {
    return window.location.search = query;
};

/**
 * getState param
 */
WebStateService.prototype.getParam = function(name) {
    return this.state.route.params[name];
};

WebStateService.prototype._stateChanged = function(path) {
    return !isequal(this.$$baseUrl, path);
};

WebStateService.prototype.getRootUrl = function() {
    var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
    if (document.location.port || false) {
        rootUrl += ':' + document.location.port;
    }
    rootUrl += '/';

    // Return
    return rootUrl;
};