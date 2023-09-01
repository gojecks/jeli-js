
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
    this.data = route.data;
    this.redirect = redirectMethod;
    Object.defineProperty(this, 'params', {
        get: () => route.route.params
    });
}