import { extend, unserialize } from '@jeli/helpers/utils';
import { ProviderToken, errorBuilder } from '@jeli/core';

export var ROUTE_INTERCEPTOR = new ProviderToken('RouteInterceptor', true);
/**
 * ROUTE_LOCATION_STRATEGY
 */
export var ROUTE_LOCATION_STRATEGY = new ProviderToken('RouteLocationStrategy', false, { value: HashStrategyService });

export var staticRoutePrefix = '^';

// default routeConfig
export var routeConfig = Object({
    isLoaded: false,
    intentFallback: null,
    useHash: true,
    fallback: {
        url: '/',
        name: '.'
    },
    restoreOnRefresh: true,
    delimiter: ['#!', ''],
    autoInitialize: true,
    allowChangeFromLocationBar: true,
    scrollTop: true
});

// $webRouteStart|$webRouteNotFound|$webRouteSuccess|$webRouteError
export var ROUTE_EVENT_ENUMS = {
    SUCCESS: "WEB_ROUTE_SUCCESS",
    ERROR: "WEB_ROUTE_ERROR",
    START: "WEB_ROUTE_START",
    NOTFOUND: "WEB_ROUTE_NOT_FOUND",
    GUARDCHECK: "WEB_ROUTE_GUARD_CHECK",
    REDIRECT: "WEB_ROUTE_REDIRECT",
    RENDER: "WEB_ROUTE_RENDER",
    LME: "WEB_ROUTE_MODULE_LOAD_ERROR"
};

/**
 * @internal
 */
var _unregistered = {};
var routeCollections = {};
var $intentCollection = {};
/**
 * 
 * @param {*} url 
 */
function createRoute(url) {
    var replacer = "\/([\\w-@!.\s%]+)",
        paramsMapping = [];
    url = url.replace(/([\/]|)([:]|)+(\w+)/g, function (match) {
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
 * @param {*} viewId 
 * @param {*} route 
 */
function addViewMatcher(viewId, route, viewsArray) {
    if (route.component) {
        //add the required target view to the view scope
        route.views = (route.views || {});
        route.views[viewId] = route.component;
        delete route.component;
        if (viewsArray) viewsArray.push(viewId);
    }
}

/**
 * 
 * @param {*} route 
 * @param {*} views 
 */
function attachRouteViews(route) {
    // get the view names
    // used to track multiple views
    var views = Object.keys(route.views || {});
    if (route.parent) {
        var parentRoute = routeCollections[route.parent];
        route.views = route.views || {}; // create new view
        //copy all views except for
        //targeted view
        for (var view in parentRoute.views) {
            if (view !== route.targetView) {
                route.views[view] = parentRoute.views[view];
            } else if (!route.views[view]) {
                addViewMatcher(view, route);
            }
        }

        /**
         * only match when the route
         * doesn't have the targeted view
         * and has views property
         * Pardon usage errors
         */
        if (route.targetView && !route.views[route.targetView]) {
            addViewMatcher(route.targetView, route);
        }

        //check if parent views exist in child views
        if (!views.length && !route.abstract) {
            views = parentRoute.route._views;
        }
        parentRoute = null;
    } else {
        addViewMatcher(route.targetView || staticRoutePrefix, route, views);
    }

    //set the current route view paths
    route.route._views = views;
}

/**
 * 
 * @param {*} route 
 * @param {*} requireParent 
 * @returns 
 */
function generateRoute(route, requireParent) {
    /**
     * register the intent
     */
    if (route.isIntent) {
        $intentCollection[route.name] = route;
        return;
    }
    if (routeCollections[route.name] && !(_unregistered[route.parent] && _unregistered[route.parent].includes(route.name))) {
        console.info('[Route] Duplicate route found: ' + route.name + ', skipping to use existing');
        return;
    }

    // check for abstract route
    route.route = createRoute(route.url || '^');
    // attach views
    attachRouteViews(route);

    if (!route.views && (!route.component && !route.loadModule) && !requireParent) {
        console.info('[Router] Skipping view configuration for: ' + route.name);
        return;
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

    // register authorities if defined in parent
    if (route.parent && routeCollections.hasOwnProperty(route.parent)){
        var parent = routeCollections[route.parent];
        if (parent.data && parent.data.authorities && (!route.data || !route.data.authorities)){
            route.data = route.data || {};
            route.data.authorities = parent.data.authorities;
        }
    }

    //set the route
    routeCollections[route.name] = route;

    //check if route is parent that needs to register child
    if (_unregistered.hasOwnProperty(route.name)) {
        _unregistered[route.name].forEach(function (uName) {
            setupRoute(routeCollections[uName], true);
        });

        //remove the registration
        delete _unregistered[route.name];
    }
}

/**
 * generate route children
 * @param {*} config 
 */
function setRouteChildren(route, fromLazyLoad) {
    if (route.children) {
        for (var childRoute of route.children) {
            if (childRoute.name) {
                var name = childRoute.name;
                // concat the parentName with the childName
                childRoute.name = [route.name, name].join('.');
                if (!routeCollections[childRoute.name]) {
                    childRoute.url = ((route.url || ('/' + route.name)) + (childRoute.url || '/' + name));
                    childRoute.parent = route.name;
                    generateRoute(childRoute, true);
                    setRouteChildren(childRoute);
                } else if (fromLazyLoad) {
                    lazyLoadRoute(childRoute);
                }
            } else {
                errorBuilder('unregistered child route in parent<' + route.name + '>, name is required:' + JSON.stringify(childRoute));
            }
        }
    }
}

/**
 * 
 * @param {*} route 
 * @param {*} routeElements 
 * @returns 
 */
function setupRoute(route) {
    var requireParent = route.hasOwnProperty('parent');
    if (!route.name && route.url) {
        route.name = route.url.replace(/[/:]/g, _ => _ == '/' ? '.' : '')
    }

    /**
     * current route is binded to a parent
     * check if parent is resolve
     * else move to unregistered holder
     */
    if (requireParent && !routeCollections.hasOwnProperty(route.parent)) {
        //push unregistered route to object
        if (!_unregistered.hasOwnProperty(route.parent)) {
            _unregistered[route.parent] = [];
        }

        //push to the unregistered watchlist
        _unregistered[route.parent].push(route.name);
        routeCollections[route.name] = route;
        return;
    }

    generateRoute(route, requireParent);

    /**
     * trigger recursive children
     */
    setRouteChildren(route);
}

/**
 * 
 * @param {*} route 
 */
function lazyLoadRoute(route) {
    if (route.name) {
        var mainRoute = routeCollections[route.name];
        if (mainRoute) {
            Object.assign(mainRoute, route);
            // attach the targetView
            attachRouteViews(mainRoute);
            // compile children
            setRouteChildren(mainRoute, true);
        } else {
            setupRoute(route);
        }
    }
}

/**
 * patch routeParams to route
 * @param {*} route 
 * @param {*} params 
 */
function patchParams(route, params, queryParam) {
    route.route.params = extend({}, route.params || {}, params || {});
    if (queryParam && route.route.paramsMapping.length && !params) {
        route.route.regexp.exec(queryParam).splice(1)
            .forEach(function (val, inc) {
                var isNumber = Number(val);
                route.route.params[route.route.paramsMapping[inc]] = !isNaN(isNumber) ? isNumber : decodeURIComponent(val);
            });
    }
}

/**
 * 
 * @param {*} name 
 * @returns 
 */
export function getParentRoute(name) {
    return routeCollections[name];
}

/**
 * 
 * @param {*} urlPath
 * @returns 
 */
function getRouteObj(urlPath) {
    for (var prop in routeCollections) {
        if (!routeCollections[prop].abstract && routeCollections[prop].route.regexp.test(urlPath)) {
            return routeCollections[prop];
        }
    }

    return routeCollections[routeConfig.fallback.name] || null;
}

export function parseDelimeter() {
    return routeConfig.delimiter.map(a => (a = a.split(''), a.unshift(''), a.join('\\'))).join('(.*)');
}

/**
 * 
 * @param {*} routeName 
 * @param {*} params 
 */
export function getRoute(routeName, params) {
    var route = routeCollections[routeName];
    if (!route){
        route  = routeCollections[routeConfig.fallback.name] || null;
    }
    // patch params
    patchParams(route, params || route.params);
    var url = parseUrl(route.url, route.route.params);
    return  {route, url};
}

/**
 * 
 * @param {*} url 
 * @param {*} params 
 * @returns 
 */
export function getRequiredRoute(url, params) {
    var queryParam = url.split("?");
    var foundRoute = getRouteObj(queryParam[0]);
    if (foundRoute) {
        patchParams(foundRoute, params, queryParam[0]);
        // route contains queryParam
        if (queryParam[1]) {
            foundRoute.route.params = extend( foundRoute.route.params, unserialize(queryParam[1]));
        }
    }

    return foundRoute;
}

export function parseUrl(href, params) {
    return href.replace(/\:(\w)+/g, function (index, key) {
        var param = index.split(":")[1];
        return param in params ? encodeURIComponent(params[param]) : '';
    });
}

/**
 * 
 * @param {*} routeName 
 * @param {*} params 
 * @returns 
 */
export function getHref(routeName, params) {
    var route = routeCollections[routeName];
    if (route) {
        params = params || route.params;
        if (route.route.paramsMapping.length && !params) {
            return errorBuilder(routeName + " requires parameter, but none was provided");
        }

        return parseUrl(route.url, params);
    }

    return routeConfig.fallback.url;
}
