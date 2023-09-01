import { routeConfig } from "./utils";
/**
 * 
 * @param {*} webStateService 
 */
export function RouterInitService(locationService) {
    /**
     * hashChange event doesn't fire on reload
     * work around was to check if location# is not empty
     * fallback if originalState is empty
     */
    if (routeConfig.autoInitialize){
        locationService.initializeRoute(routeConfig.restoreOnRefresh);
    }
}