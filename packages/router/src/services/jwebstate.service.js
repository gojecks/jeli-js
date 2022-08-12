// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

// jeliWebState Service
import { LocationService } from './route.location.service';
Service({
    DI: [LocationService]
})

/**
 * 
 * @param {*} viewHandler 
 */
export function WebStateService(locationService) {
    this.locationService = locationService;
    Object.defineProperty(this, 'state', {
        get: function() {
            return this.locationService.currentRoute;
        }
    })
};

/**
 * 
 * @param {*} path 
 * @param {*} params 
 * @param {*} targetWindow 
 */
WebStateService.prototype.go = function(path, params, targetWindow) {
    path = getHref(path, params);
    if (!targetWindow) {
        this.locationService.go(path, params);
    } else {
        window.open(this.locationService.getFullPath(path), targetWindow);
    }
};

/**
 * Method Name : $href
 * @param {*} stateName 
 * @param {*} params 
 */
WebStateService.prototype.href = function(stateName, params) {
    return getHref(stateName, params);
};

/**
 * getState param
 */
WebStateService.prototype.getParam = function(name) {
    return this.locationService.currentRoute.route.params[name];
};

/**
 * getState param
 */
WebStateService.prototype.getUrlParams = function() {
    return Object(this.locationService.currentRoute.route.params);
};