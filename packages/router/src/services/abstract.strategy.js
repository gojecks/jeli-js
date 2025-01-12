export class AbstractStrategy {
    constructor(locationService) {
        this.originalState = null;
        this.locationService = locationService;
        this.isReplaceState = false;
        this.stateChanged = false;
        this.listenEvent();
    }
    getBaseHref() { }
    path() { }
    pushState(data, path) {
        if (history) {
            history.pushState(data, null, this.locationService.getFullPath(path));
        }
    }

    listenEvent(){ }
}

