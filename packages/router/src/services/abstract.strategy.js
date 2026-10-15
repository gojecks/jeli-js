export class AbstractStrategy {
    constructor(locationService) {
        this.originalState = null;
        this.locationService = locationService;
        this.isReplaceState = false;
        this.stateChanged = false;
        // server render: no popstate/hashchange concept without a real
        // browser, and - since renders are serialized through one shared
        // document/window (see server/render-to-string.mjs) - registering
        // a listener per render would leak an ever-growing pile of them on
        // that one shared window across every subsequent render
        if (!this.locationService.locationContext) {
            this.listenEvent();
        }
    }
    getBaseHref() { }
    path() { }
    pushState(data, path) {
        // server render: no real browser history to push to; getFullPath's
        // read (via LocationService.getRootUrl) already resolves against
        // locationContext when present, so this is purely a client-side
        // side effect to skip, not a value to fake
        if (this.locationService.locationContext) return;
        if (history) {
            history.pushState(data, null, this.locationService.getFullPath(path));
        }
    }

    listenEvent(){ }
}

