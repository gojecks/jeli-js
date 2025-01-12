import { AbstractStrategy } from "./abstract.strategy";
export class PathStrategyService extends AbstractStrategy {
    constructor(locationService) {
        super(locationService);
    }
    
    path(path) {
        return path || location.pathname;
    }

    listenEvent(){
        /**
         * set the popstate Functionality
         * First checked to see if window supports onhashchange Event
         * @Function window.addEventListener("popstate", callback ,false)
         */
        window.addEventListener("popstate", e => {
            e.preventDefault();
            var state = e.state;
            if (state && this.locationService.changed(state.name)){
                this.locationService.byName(state.name, state.params);
            }
        }, false);
    }
}