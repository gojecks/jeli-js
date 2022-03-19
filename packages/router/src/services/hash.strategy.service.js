import { AbstractStrategy } from "./abstract.strategy";


Service({
    static: true
})
export function HashStrategyService(locationService) {
    AbstractStrategy.call(this, locationService);
    var _this = this;
    /**
     * set the hash Functionality
     * First checked to see if window supports onhashchange Event
     * @Function window.addEeventListener("haschange", callback ,false)
     */
    window.addEventListener("hashchange", function(e) {
        var locHash = _this.path();
        if (!locHash.length || !locationService.changed(locHash) || _this.isReplaceState) {
            _this.isReplaceState = false;
            return;
        }
        //go to the required hash
        locationService.go(locHash);
    }, false);
}

HashStrategyService.prototype = Object.create(AbstractStrategy.prototype);
HashStrategyService.prototype.constructor = AbstractStrategy;

HashStrategyService.prototype.replace = function() {
    var state = this.locationService.getState();
    this.isReplaceState = true;
    if ((state.hash !== state.previousHash) || stateChanged) {
        location.replace(state.hash);
        this.originalState = state.currentLocation;
    }
}

HashStrategyService.prototype.pushState = function(path) {
    history.pushState(null, '', '#' + path);
}

HashStrategyService.prototype.path = function() {
    return location.hash.replace(/^#/, '');
}