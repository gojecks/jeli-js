// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

// jeliWebState Service
import { LocationService } from './route.location.service';
import { EventEmitter } from '@jeli/core';
import { getHref } from './utils';
Service({
    DI: [LocationService]
})

/**
 * 
 * @param {*} locationService 
 */
/**
 *
 * @param {*} locationService
 */
export class WebStateService {
    constructor(locationService) {
        this.onParamsChanged = new EventEmitter();
        this.locationService = locationService;
    }

    get state(){
        return this.locationService.currentRoute;
    }

    /**
     *
     * @param {*} routeName
     * @param {*} params
     * @param {*} targetWindow
     */
    go(routeName, params, targetWindow) {
        var isHrefRequest = routeName.includes('/');
        if (routeName.includes('//')) {
            return (targetWindow ? window.open(routeName, targetWindow) : location.href = routeName);
        }

        if (!targetWindow) {
            if (isHrefRequest) {
                this.locationService.byUrl(routeName, params);
            } else {
                this.locationService.byName(routeName, params);
            }
        } else {
            var url = (isHrefRequest ? routeName : getHref(routeName, params));
            window.open(this.locationService.getFullPath(url), targetWindow);
        }
    }
    /**
     * getState param
     */
    getParam(name) {
        return this.locationService.currentRoute.route.params[name];
    }
    setParam(name, value) {
        var params = this.locationService.currentRoute.route.params;
        var newParam = {};
        if (typeof name !== 'object') {
            newParam[name] = value;
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
    getUrlParams() {
        return Object.assign({}, this.locationService.currentRoute.route.params);
    }
}