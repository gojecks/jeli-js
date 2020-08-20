/**
 * 
 * @param {*} jeliWebProvider 
 * @param {*} $webState 
 */
export function ViewInit(jeliWebProvider, $webState) {
    var originalState = location.hash;
    var stateChanged = false;
    var html5Mode = jeliWebProvider.html5Mode;
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
            $webState._gotoState(null, refineHash());
        }
    }

    /**
     * set the PopState Functionality
     * First checked to see if window supports onPopChange Event
     * @Function window.addEventListener("popState", callback ,false)
     */
    if ("onpopstate" in window) {
        if (html5Mode) {
            window.onpopstate = function(e) {

            };
        }
    }

    function locationReplaceState(e) {
        var state = $webState.currentState();
        $webState.isReplaceState = true;
        if ((state.hash !== state.previousHash) || stateChanged) {
            location.replace(state.hash);
            originalState = state.currentLocation;
        }
    }


    function webRouteChangedFn(e) {
        var locHash = refineHash();
        if (!location.hash.length || !$webState.$stateChanged(locHash) || $webState.isReplaceState) {
            $webState.isReplaceState = false;
            return;
        }
        //go to the required hash
        $webState.go(locHash);
    }

    //function refineHash
    function refineHash() {
        return (location.hash || '').replace('#', '');
    }
}