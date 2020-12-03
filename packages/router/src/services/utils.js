import { extend, unserialize } from 'js-helpers/utils';
import { ProviderToken, _Promise, Inject, errorBuilder } from '@jeli/core';
export var ROUTE_INTERCEPTOR = new ProviderToken('RouteInterceptor', true);
/**
 * @internal
 */
var _unregistered = {};
var $stateCollection = {};
var $intentCollection = {};
/**
 * 
 * @param {*} url 
 */
function createRoute(url) {
    var replacer = "\/([\\w-]+)",
        paramsMapping = [];
    url = url.replace(/([\/]|)([:]|)+(\w+)/g, function(match) {
        if (match.indexOf(":") > -1) {
            paramsMapping.push(match.split(":")[1]);
            return replacer;
        }
        return match;
    });

    return ({
        params: {},
        paramsMapping: paramsMapping,
        regexp: new RegExp("(?:" + url.split("?")[0] + ")$")
    });
}

/**
 * 
 * @param {*} routeConfig 
 * @param {*} requireParent 
 */
function generateRoute(routeConfig, requireParent) {
    function addViewMatcher(view) {
        //add the required target view to the view scope
        if (routeConfig.component) {
            if (!routeConfig.views[view]) {
                routeConfig.views[view] = {};
            }

            routeConfig.views[view] = routeConfig.component;
            delete routeConfig.component;
        }
    }

    /**
     * register the intent
     */
    if (routeConfig.isIntent) {
        $intentCollection[routeConfig.name] = routeConfig;
        return;
    }

    // check for abstract route
    routeConfig.route = createRoute(routeConfig.url || '^');
    // get the view names
    // used to track multiple views
    var _views = Object.keys(routeConfig.views || {});

    /**
     * compile parent
     */
    if (requireParent) {
        var parentRoute = $stateCollection[routeConfig.parent];
        routeConfig.views = routeConfig.views || {}; // create new view
        //copy all views except for
        //targeted view
        for (var view in parentRoute.views) {
            if (view !== routeConfig.targetView) {
                routeConfig.views[view] = parentRoute.views[view];
            } else if (!routeConfig.views[view]) {
                addViewMatcher(view);
            }
        }

        /**
         * only match when the routeConfig
         * doesn't have the targeted view
         * and has views property
         * Pardon usage errors
         */
        if (routeConfig.targetView && !routeConfig.views[routeConfig.targetView]) {
            addViewMatcher(routeConfig.targetView);
        }

        //overwrite our routeConfig
        routeConfig.route.parent = parentRoute;
        //check if parent views exist in child views
        if (!_views.length && !routeConfig.abstract) {
            _views = parentRoute.route.$$views;
        }

        parentRoute = null;
        delete routeConfig.parent;
    }

    if (!routeConfig.url) {
        routeConfig.abstract = true;
    }

    //set the current route view paths
    routeConfig.route.$$views = _views;
    //set the route
    $stateCollection[routeConfig.name] = routeConfig;

    //check if route is parent that needs to register child
    if (_unregistered.hasOwnProperty(routeConfig.name)) {
        _unregistered[routeConfig.name].forEach(function(uName) {
            setupRoutes(uName, $stateCollection[uName]);
        });

        //remove the registra
        delete _unregistered[routeConfig.name];
    }
}

/**
 * 
 * @param {*} routeConfig 
 */
function setupRoutes(routeConfig) {
    var requireParent = routeConfig.hasOwnProperty('parent');
    /**
     * current route is binded to a parent
     * check if parent is resolve
     * else move to unregistered holder
     */
    if (requireParent && !$stateCollection.hasOwnProperty(routeConfig.parent)) {
        //push unregistered route to object
        if (!_unregistered.hasOwnProperty(routeConfig.parent)) {
            _unregistered[routeConfig.parent] = [];
        }

        //push to the unregistered watchlist
        _unregistered[routeConfig.parent].push(routeConfig.name);
        $stateCollection[routeConfig.name] = routeConfig;
        return this;
    }

    generateRoute(routeConfig, requireParent);

    /**
     * compile children route
     */
    function addChildren(config) {
        if (config.children) {
            config.children.forEach(function(childConfig) {
                if (childConfig.name) {
                    var name = childConfig.name;
                    /**
                     * concat the parentName with the childName
                     */
                    childConfig.name = [config.name, name].join('.');
                    childConfig.url = ('/' + config.name + (childConfig.url || '/' + name));
                    childConfig.parent = config.name;
                    generateRoute(childConfig, true);
                    addChildren(childConfig);
                } else {
                    errorBuilder('unregistered child route in parent<' + config.name + '>, name is required:' + JSON.stringify(childConfig));
                }
            });
        }
    }

    /**
     * trigger recursive children
     */
    addChildren(routeConfig);
}

/**
 * 
 * @param {*} routeName 
 */
function getRequiredRoute(routeName) {
    var queryParam = routeName.split("?"),
        foundRoute = (function() {
            for (var prop in $stateCollection) {
                if (!$stateCollection[prop].abstract && $stateCollection[prop].route.regexp.test(queryParam[0])) {
                    return $stateCollection[prop];
                }
            }
        })();

    return ({
        get: function() {
            return foundRoute;
        },
        checkParams: function(params) {
            if (foundRoute) {
                foundRoute.route.params = extend({}, foundRoute.params || {}, params || {});
                if (foundRoute.route.paramsMapping.length && !params) {
                    foundRoute.route.regexp.exec(queryParam[0]).splice(1)
                        .forEach(function(val, inc) {
                            var isNumber = parseInt(val);
                            foundRoute.route.params[foundRoute.route.paramsMapping[inc]] = !isNaN(isNumber) ? isNumber : val;
                        });
                }

                // route contains queryParam
                if (queryParam[1]) {
                    foundRoute.route.params = extend(
                        foundRoute.route.params,
                        unserialize(queryParam[1])
                    );
                }
            }

            return foundRoute;
        }
    });
}

/**
 * 
 * @param {*} route 
 * @param {*} callback 
 */
export function ResolveRouteInterceptor(route, callback) {
    var interceptors = Inject(ROUTE_INTERCEPTOR);
    var locals = {};
    if (!interceptors || !interceptors.length) {
        return callback(locals);
    }

    var len = 0;

    /**
     * iterator method
     */
    function next() {
        var interceptor = interceptors[len];
        len++;
        if (interceptor) {
            interceptor.resolve(route, locals, next);
        } else {
            callback(locals);
        }
    }

    next();
};