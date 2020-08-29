/**
 * 
 * @param {*} jeliWebProvider 
 * @param {*} webStateService 
 */
export function ViewInit(jeliWebProvider, webStateService) {
    var originalState = location.hash;
    var stateChanged = false;
    jeliWebProvider.isLoaded = true;
    /**
     * set the hash Functionality
     * First checked to see if window supports onhashchange Event
     * @Function window.addEeventListener("haschange", callback ,false)
     */
    if ("onhashchange" in window) {
        /**
         * register Events
         */
        window.addEventListener('$locationReplaceState', locationReplaceState)
        window.addEventListener("hashchange", webRouteChangedFn);
    }

    function locationReplaceState(e) {
        var state = webStateService.currentState();
        webStateService.isReplaceState = true;
        if ((state.hash !== state.previousHash) || stateChanged) {
            location.replace(state.hash);
            originalState = state.currentLocation;
        }
    }


    function webRouteChangedFn(e) {
        var locHash = refineHash();
        if (!location.hash.length || !webStateService._stateChanged(locHash) || webStateService.isReplaceState) {
            webStateService.isReplaceState = false;
            return;
        }
        //go to the required hash
        webStateService._gotoState(null, locHash);
    }

    //function refineHash
    function refineHash() {
        return (location.hash || '').replace('#', '');
    }

    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            /**
             * hashChange event doesn't fire on reload
             * work around was to check if location# is not empty
             * fallback if originalState is empty
             */
            if (!originalState) {
                location.hash = refineHash() || jeliWebProvider.fallback;
            } else {
                /**
                 * Triggered When user reloads the page
                 */
                webStateService._gotoState(null, refineHash());
            }
            resolve(true);
        }, 0);
    })
}