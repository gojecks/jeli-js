/**
 * 
 * @param {*} path 
 * @param {*} route 
 * @param {*} previousRoute 
 * @param {*} previousPath 
 */
export function RouteEvent(path, route, previousRoute, previousPath){
    this.path = path;
    this.name = route.name;
    this.params = route.route.params;
    this.data  = route.data;
    if  (previousPath) {
        this.previous = {
            path: previousPath,
            name: previousRoute.name,
            params: previousRoute.route.params
        };
    }
}