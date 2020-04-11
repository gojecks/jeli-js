// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

// jeliWebState Service
import { isequal, isundefined } from 'js.helpers/helpers';

Service({
    name: '$webState',
    DI: ['$jeliWebStateProvider', '$resolve?', 'jViewHandler', 'Event?']
})

/**
 * 
 * @param {*} $jeliWebProvider 
 * @param {*} $resolve 
 * @param {*} jViewHandler 
 * @param {*} $Events 
 */
export function WebStateService($jeliWebProvider, $resolve, jViewHandler, $Events) {
    var locationStates = null,
        lastState = null,
        _this = this;
    this.isReplaceState = false;
    this.state = {
        route: { params: {} },
    };


    /**
     * trigger method when view load
     */
    function viewLoaded(route) {
        var previousState = extend({}, _this.state.route);
        //dispatch event for webRoute Success
        _this.events.$broadcast('$webRouteSuccess', route, previousState);
        _this.state = route;
    }

    function updateAllProcess() {
        /**
         * change progressState when component is resolved
         */
        jViewHandler.stateInProgress = false;
        // set the location hash with the resolved route
        location.hash = _this.$$baseUrl;
    }

    //create an Event
    //Add Default Function to our listener
    //if Slave Function calls preventDefault
    //Master FN is not triggered
    this.events = new $Events('listener', function(e, route, path) {
        if (isequal('$webRouteStart', e.type)) {
            //set the baseUrl to the $webState Object
            //BaseUrl is neccessary when replace state is in use.
            _this.$$baseUrl = path;
            //set the current view
            //get the RouteView Object
            var locals = {};
            /*
             resolve the resolvers if defined
            */
            var viewResolver = jViewHandler.resolveViews(route, _this.state);
            if (route.resolver) {
                $resolve(route.resolver, locals)
                    .then(function() {
                        /**
                         * check if route changed by resolver
                         */
                        var lastTransitionQueue = jViewHandler.stateQueue.pop();
                        if (lastTransitionQueue) {
                            // change route
                            _this.$$baseUrl = lastTransitionQueue.path;
                            route = $jeliWebProvider.getRequiredRoute(lastTransitionQueue.path).checkParams(lastTransitionQueue.params);
                            viewResolver = jViewHandler.resolveViews(route, _this.state);
                            jViewHandler.stateQueue.length = 0;
                        }

                        // check to make sure current state is not same as state to resolve
                        if (!isequal(_this.$$baseUrl, _this.state.url)) {
                            viewResolver(viewLoaded);
                            //set relovers
                            route.resolvedData = locals;
                        } else {
                            // trigger error route state
                            _this.events.$broadcast('$webRouteError', route);
                        }

                        updateAllProcess();
                    });
            } else {
                viewResolver(viewLoaded);
                updateAllProcess();
            }
        }
    });
    //regsister an event
    this.events.listener('go', function() {
        gotoState.apply(null, arguments);
    });

    //register replaceState event
    this.events.listener('replaceState', function(ev) {
        _this.isReplaceState = true;
    });

    //add an event
    this.events.listener('go.state', gotoState);

    /**
     * go to path
     * @param {*} path 
     * @param {*} params 
     */
    function go(path, params) {
        //set up new events
        var route = $jeliWebProvider.getRoute(path, params);
        if (route) {
            //set stateInProgress to true
            jViewHandler.stateInProgress = true;
            //initialize state changed 
            _this.events.$broadcast('$webRouteStart', route, path);
        }
    };

    /**
     * 
     * @param {*} ev 
     * @param {*} path 
     * @param {*} params 
     */
    function gotoState(ev, path, params) {
        //check if state in Progress
        if (!path) {
            return false;
        }
        //set the current State
        jViewHandler.previousState = jViewHandler.currentState;
        jViewHandler.currentState = path;
        if (jViewHandler.stateInProgress) {
            // check if previous and current state are same
            if (isequal(jViewHandler.currentState, jViewHandler.previousState)) {
                return;
            }
            jViewHandler.stateQueue.push({
                path: path,
                param: params
            });
            jViewHandler.$stateTransitioned = true;
        } else {
            go(path, params);
        }
    }

    //check for pending view rendering
    this.events.listener('view.render', function(ev, viewName) {
        if (jViewHandler._pendingViewStack.has(viewName)) {
            jViewHandler.compileViewTemplate(jViewHandler._pendingViewStack.get(viewName), jViewHandler.viewsHolder.get(viewName));
            jViewHandler._pendingViewStack.delete(viewName);
        }
    });


    /* 
			Method Name : href
			Parameter : stateName (STRING) , Params (OBJECT)
			@returns : Path || Fallback
		*/
    this.$href = function(stateName, params) {
        var state = $jeliWebProvider.getRouteObj(stateName);
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

        return $jeliWebProvider.fallback;
    };

    /**
     * Method Name : GO
     * Parameter : stateName (STRING) , Params (OBJECT)
     * @returns : self
     */
    this.go = function(path, params) {
        path = this.$href(path, params);
        if (this.$stateChanged(path)) {
            gotoState(null, path, params);
        }
        return this;
    };

    /*
    	Webstate.replaceWebState
    	replaces the browser history state
    */

    this.replaceWebState = function(hash) {
        //replace state for jeli webRoute
        if (!locationStates && !hash) { return; }

        locationStates = ({
            state: 'replaceState',
            hash: '#' + (hash || locationStates.previousHash).replace(/^#/, ''),
            previousHash: lastState,
            currentLocation: location.hash
        });

        // Fallback for HTML4 browsers
        lastState = locationStates.hash;
    };

    /*Webstate.getRootUrl
    	@return {String} url
    */
    this.currentState = function(set) {
        if (!isundefined(set)) {
            locationStates = set;
            return;
        }

        return locationStates;
    };

    return this;
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

WebStateService.prototype.$stateChanged = function(path) {
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