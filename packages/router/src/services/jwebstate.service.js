// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

// jeliWebState Service
import { LocationService } from './route.location.service';
import { EventEmitter } from '@jeli/core';
import { ROUTE_EVENT_ENUMS } from './utils';
Service({
    DI: [LocationService]
})

/**
 * 
 * @param {*} viewHandler 
 */
export function WebStateService(locationService) {
    this.onParamsChanged = new EventEmitter();
    this.locationService = locationService;
    Object.defineProperty(this, 'state', {
        get: function() {
            return this.locationService.currentRoute;
        }
    });
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
}

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
}

WebStateService.prototype.setParam = function(name, value){
    var params = this.locationService.currentRoute.route.params;
    var newParam = {};
    if (typeof name !== 'object')  {
        newParam[name]  = value; 
    } else {
        newParam = name;
    }

    Object.assign(params, newParam);
    this.onParamsChanged.emit(newParam);
    newParam = null;
}

/**
 * getState param
 */
WebStateService.prototype.getUrlParams = function() {
    return Object.assign({}, this.locationService.currentRoute.route.params);
}


/**
 * 
 * @param {*} eventName 
 * @param {*} callback 
 * @returns Subscription
 */
WebStateService.prototype.subscribe = function(eventName, callback){
    var eventList = Object.values(ROUTE_EVENT_ENUMS);
    if (!eventList.includes(eventName)) throw new TypeError(eventName + ' does not exist, please use '+ eventList.join('|'));
    return this.locationService.events.add(eventName, callback);
}