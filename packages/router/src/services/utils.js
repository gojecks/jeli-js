import { extend, unserialize } from 'js-helpers/utils';
import { ProviderToken, errorBuilder } from '@jeli/core';
export var ROUTE_INTERCEPTOR = new ProviderToken('RouteInterceptor', true);
export var staticRoutePrefix = '^';
export var routeConfig = Object({
    isLoaded: false,
    intentFallback: null,
    useHash: true,
    fallback: {
        url: '/',
        name: '.'
    },
    restoreOnRefresh: true
});
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
    var replacer = "\/([\\w-@!.]+)",
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
 * attach view to a route configuration
 * @param {*} view 
 * @param {*} route 
 */
function addViewMatcher(view, route, routeElements) {
    //add the required target view to the view scope
    if (route.component) {
        route.views = (route.views || {});
        if (!route.views[view]) {
            route.views[view] = {};
        }

        var isStringComp = typeof route.component === 'string';
        if (isStringComp && !routeElements || (routeElements && !routeElements.has(route.component))) {
            errorBuilder('Invalid route configuration, missing view component', 0, route);
        }

        route.views[view] = isStringComp ? routeElements.get(route.component) : route.component;
        delete route.component;
    }
}

/**
 * 
 * @param {*} route 
 * @param {*} requireParent 
 * @param {*} routeElements 
 * @returns 
 */
function generateRoute(route, requireParent, routeElements) {
    /**
     * register the intent
     */
    if (route.isIntent) {
        $intentCollection[route.name] = route;
        return;
    } else if ($stateCollection[route.name] && !(_unregistered[route.parent] && _unregistered[route.parent].includes(route.name))) {
        console.info('[Route] Duplicate route found: ' + route.name + ', skipping to use existing');
        return;
    } else if (!route.views && !route.component) {
        console.info('[Router] missing view configuration for: ' + route.name);
        return;
    }

    // check for abstract route
    route.route = createRoute(route.url || '^');
    // get the view names
    // used to track multiple views
    var _views = Object.keys(route.views || {});

    /**
     * compile parent
     */
    if (requireParent) {
        var parentRoute = $stateCollection[route.parent];
        route.views = route.views || {}; // create new view
        //copy all views except for
        //targeted view
        for (var view in parentRoute.views) {
            if (view !== route.targetView) {
                route.views[view] = parentRoute.views[view];
            } else if (!route.views[view]) {
                addViewMatcher(view, route, routeElements);
            }
        }

        /**
         * only match when the route
         * doesn't have the targeted view
         * and has views property
         * Pardon usage errors
         */
        if (route.targetView && !route.views[route.targetView]) {
            addViewMatcher(route.targetView, route, routeElements);
        }

        //overwrite our route
        route.route.parent = parentRoute;
        //check if parent views exist in child views
        if (!_views.length && !route.abstract) {
            _views = parentRoute.route.$$views;
        }

        parentRoute = null;
        delete route.parent;
    }

    if (!route.url) {
        route.abstract = true;
    }
    // check if route has fallBack flag
    if (route.fallback) {
        routeConfig.fallback = {
            name: route.name,
            url: route.url
        };
    }

    //set the current route view paths
    route.route.$$views = _views;
    //set the route
    $stateCollection[route.name] = route;

    //check if route is parent that needs to register child
    if (_unregistered.hasOwnProperty(route.name)) {
        _unregistered[route.name].forEach(function(uName) {
            setupRoutes($stateCollection[uName], routeElements);
        });

        //remove the registra
        delete _unregistered[route.name];
    }
}

/**
 * 
 * @param {*} route 
 * @param {*} routeElements 
 * @returns 
 */
function setupRoutes(route, routeElements) {
    var requireParent = route.hasOwnProperty('parent');
    if (!route.name && route.url) {
        route.name = route.url.replace(/[/:]/g, _ => _ == '/' ? '.' : '')
    }

    /**
     * component without view definition
     */
    if (!route.parent) {
        addViewMatcher(route.targetView || staticRoutePrefix, route, routeElements);
    }

    /**
     * current route is binded to a parent
     * check if parent is resolve
     * else move to unregistered holder
     */
    if (requireParent && !$stateCollection.hasOwnProperty(route.parent)) {
        //push unregistered route to object
        if (!_unregistered.hasOwnProperty(route.parent)) {
            _unregistered[route.parent] = [];
        }

        //push to the unregistered watchlist
        _unregistered[route.parent].push(route.name);
        $stateCollection[route.name] = route;
        return this;
    }

    generateRoute(route, requireParent, routeElements);

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
                    generateRoute(childConfig, true, routeElements);
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
    addChildren(route);
}
/**
 * 
 * @param {*} name 
 * @returns 
 */
export function getParentRoute(name) {
    var parent = $stateCollection[name],
        fnd;
    do {
        if (parent) { fnd = parent; }
    } while (parent = parent.route.parent);

    return fnd;
}

/**
 * 
 * @param {*} routeName 
 * @returns 
 */
function getRouteObj(routeName) {
    var queryParam = routeName.split("?");
    for (var prop in $stateCollection) {
        if (!$stateCollection[prop].abstract && $stateCollection[prop].route.regexp.test(queryParam[0])) {
            return $stateCollection[prop];
        }
    }

    return $stateCollection[routeConfig.fallback.name] || null;
}

/**
 * 
 * @param {*} routeName 
 * @param {*} params 
 * @returns 
 */
export function getRequiredRoute(routeName, params) {
    var queryParam = routeName.split("?"),
        foundRoute = getRouteObj(routeName);
    if (foundRoute) {
        foundRoute.route.params = extend({}, foundRoute.params || {}, params || {});
        if (foundRoute.route.paramsMapping.length && !params) {
            foundRoute.route.regexp.exec(queryParam[0]).splice(1)
                .forEach(function(val, inc) {
                    var isNumber = Number(val);
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

export function parseUrl(href, params) {
    return href.replace(/\:(\w)+/g, function(index, key) {
        var param = index.split(":")[1];
        return param in params ? params[param] : '';
    });
}

/**
 * 
 * @param {*} stateName 
 * @param {*} params 
 * @returns 
 */
export function getHref(stateName, params) {
    var state = $stateCollection[stateName];
    if (state) {
        if (state.route.paramsMapping.length && !params) {
            throw new Error(stateName + " requires parameter, but none was provided");
        }

        return parseUrl(state.url, params);
    }

    return routeConfig.fallback.url;
}

/**
 * 
 * @param {*} route 
 * @param {*} path 
 * @param {*} redirectMethod 
 */
export function RouteInterceptorInstance(route, path, redirectMethod) {
    this.name = route.name;
    this.path = path;
    this.data = route.data;
    this.params = route.params;
    this.originalUrl = route.url;
    this.locals = {};
    this.redirect = redirectMethod;
}