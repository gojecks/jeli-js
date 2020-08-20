Service({})
export function WebStateProvider() {
    this.routeTrial = 0;
    this.isLoaded = false;
    this.intentFallback = null;
    this.fallback = null;
    this.html5Mode = false;
}

WebStateProvider.prototype.getRouteObj = function(name) {
    return $stateCollection[name];
};

WebStateProvider.prototype.getParentRoute = function(name) {
    var parent = $stateCollection[name],
        fnd;
    do {
        if (parent) { fnd = parent; }
    } while (parent = parent.route.parent);

    return fnd;
};

WebStateProvider.prototype.getIntent = function(intentName) {
    return $intentCollection[intentName];
};

/**
 * @param {*} route
 * @param {*} params
 */
WebStateProvider.prototype.getRoute = function(route, params) {
    //Fix for maximum stack
    if (this.routeTrial > 2) {
        this.routeTrial = 0;
        return false;
    }
    var webRoutes = getRequiredRoute(route).checkParams(params);
    if (webRoutes) {
        return webRoutes;
    }

    //Fallback when the route is not found
    if (this.fallback) {
        location.hash = '#' + this.fallback;
    }
};