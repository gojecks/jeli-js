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
 * Method Name : GO
 * Parameter : stateName (STRING) , Params (OBJECT)
 * @returns : self
 */
WebStateService.prototype.go = function(path, params) {
    path = getHref(path, params);
    this.locationService.go(path, params);
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