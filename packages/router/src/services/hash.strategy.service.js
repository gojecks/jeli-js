import { AbstractStrategy } from "./abstract.strategy";
import { parseDelimeter, routeConfig } from "./utils";
export class HashStrategyService extends AbstractStrategy {
    constructor(locationService) {
        super(locationService);
        this.hashRegEx = new RegExp(parseDelimeter());
    }
    replace() {
        var state = this.locationService.getState();
        this.isReplaceState = true;
        if ((state.hash !== state.previousHash) || stateChanged) {
            location.replace(state.hash);
            this.originalState = state.currentLocation;
        }
    }
    path(path) {
        //construct location path
        if (path) return routeConfig.delimiter.join(path);
        // extract path from location
        var execPath = this.hashRegEx.exec(location.hash);
        return execPath ? execPath[1] : '';
    }

    listenEvent(){
        /**
         * set the hash Functionality
         * First checked to see if window supports onhashchange Event
         * @Function window.addEventListener("haschange", callback ,false)
         */
        window.addEventListener("hashchange", e => {
            if (!routeConfig.allowChangeFromLocationBar) return;
            var locHash = location.hash.split(/#/)[1];
            if (!locHash.length || !this.locationService.changed(locHash) || this.isReplaceState) {
                this.isReplaceState = false;
                return;
            }
            //go to the required hash
            e.preventDefault();
            this.locationService.byUrl(locHash);
        }, false);
    }
}