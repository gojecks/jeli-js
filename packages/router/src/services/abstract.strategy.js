import { routeConfig } from "./utils";
export function AbstractStrategy(locationService) {
    this.originalState = null;
    this.locationService = locationService;
    this.isReplaceState = false;
    this.stateChanged = false;
}

AbstractStrategy.prototype.getBaseHref = function() {}

AbstractStrategy.prototype.path = function() {}