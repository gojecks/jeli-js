export function AbstractStrategy(locationService) {
    this.originalState = null;
    this.locationService = locationService;
    this.isReplaceState = false;
    this.stateChanged = false;

    /**
     * attach event listener for popstate
     * prevent 
     */
    // window.addEventListener('popstate', event => {});
}

AbstractStrategy.prototype.getBaseHref = function() {}
AbstractStrategy.prototype.path = function() {}
AbstractStrategy.prototype.pushState = function(data, path) {
    if  (history){
        history.pushState(data, null, this.path(path));
    }
}