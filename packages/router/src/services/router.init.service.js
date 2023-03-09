import { routeConfig } from "./utils";
/**
 * 
 * @param {*} webStateService 
 */
export function RouterInitService(locationService) {
    routeConfig.isLoaded = true;
    /**
     * hashChange event doesn't fire on reload
     * work around was to check if location# is not empty
     * fallback if originalState is empty
     */
    var path = "";
    if (routeConfig.restoreOnRefresh) {
        path = locationService.strategy.path();
    }

    /**
     * navigate to the requiredPath
     */
    locationService.go(path || routeConfig.fallback.url);
}