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
    delimiter: ['#!', '']
});

// $webRouteStart|$webRouteNotFound|$webRouteSuccess|$webRouteError
export var ROUTE_EVENT_ENUMS = {
    SUCCESS: "$webRouteSuccess",
    ERROR: "$webRouteError",
    START: "$webRouteStart",
    NOTFOUND: "$webRouteNotFound"
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
    var replacer = "\/([\\w-@!.]+)",
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
 * @param {*} view 
 * @param {*} route 
 */
function addViewMatcher(view, route) {
    if (route.component) {
        //add the required target view to the view scope
        route.views = (route.views || {});
        route.views[view] = route.component;
        delete route.component;
    }
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

    if (!route.views && (!route.component && !route.loadModule)) {
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

        //overwrite our route
        route.route.parent = parentRoute;
        //check if parent views exist in child views
        if (!_views.length && !route.abstract) {
            _views = parentRoute.route._views;
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
    route.route._views = _views;
    //set the route
    routeCollections[route.name] = route;

    //check if route is parent that needs to register child
    if (_unregistered.hasOwnProperty(route.name)) {
        _unregistered[route.name].forEach(function (uName) {
            setupRoute(routeCollections[uName]);
        });

        //remove the registra
        delete _unregistered[route.name];
    }
}

/**
 * generate route children
 * @param {*} config 
 */
function setRouteChildren(config) {
    if (config.children) {
        for (var childConfig of config.children) {
            if (childConfig.name) {
                var name = childConfig.name;
                /**
                 * concat the parentName with the childName
                 */
                childConfig.name = [config.name, name].join('.');
                childConfig.url = ('/' + config.name + (childConfig.url || '/' + name));
                childConfig.parent = config.name;
                generateRoute(childConfig, true);
                setRouteChildren(childConfig);
            } else {
                errorBuilder('unregistered child route in parent<' + config.name + '>, name is required:' + JSON.stringify(childConfig));
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
     * component without view definition
     */
    if (!route.parent) {
        addViewMatcher(route.targetView || staticRoutePrefix, route);
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
        return this;
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
            if (mainRoute.targetView) {
                addViewMatcher(mainRoute.targetView, mainRoute);
            } else if(route.views)  {
                mainRoute.route._views = Object.keys(route.views);
            }
            // compile children
            setRouteChildren(mainRoute);
        } else {
            setupRoute(route);
        }
    }
}

/**
 * 
 * @param {*} name 
 * @returns 
 */
export function getParentRoute(name) {
    var parent = routeCollections[name],
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
    for (var prop in routeCollections) {
        if (!routeCollections[prop].abstract && routeCollections[prop].route.regexp.test(queryParam[0])) {
            return routeCollections[prop];
        }
    }

    return routeCollections[routeConfig.fallback.name] || null;
}

export function parseDelimeter(){
    return routeConfig.delimiter.map(a => (a=a.split(''), a.unshift(''),a.join('\\'))).join('(.*?)');
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
                .forEach(function (val, inc) {
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
    return href.replace(/\:(\w)+/g, function (index, key) {
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
    var state = routeCollections[stateName];
    if (state) {
        params = params || state.params;
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
export function RouteInterceptorInstance(route, path, currentRoute, redirectMethod) {
    this.name = route.name;
    this.path = path;
    this.locals = {};
    this.currentRoute = currentRoute;
    this.originalUrl = route.url;
    this.params = route.params;
    this.data = route.data;
    this.redirect = redirectMethod;
}