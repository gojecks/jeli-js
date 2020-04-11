// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph


/**
 * 
 * @param {*} jeliWebProvider 
 * @param {*} $webState 
 */
export function jViewInitFn(jeliWebProvider, $webState) {
    var originalState = location.hash,
        stateChanged = false,
        html5Mode = jeliWebProvider.html5Mode;

    jeliWebProvider.isLoaded = true;
    //set the hash Functionality
    //First checked to see if window supports onhashchange Event
    //@Function window.addEeventListener("haschange",FN,false)
    if ("onhashchange" in window) {
        /**
         * register Events
         */
        window.addEventListener('$locationReplaceState', locationReplaceState)
        window.addEventListener("hashchange", webRouteChangedFn);
        //hashChange event doesn't fire on reload
        //work around was to check if location# is not empty
        //set location if its empty
        if (!originalState) {
            var hash = refineHash() || jeliWebProvider.fallback;
            location.hash = hash;
        } else {
            /**
             * Triggered When user reloads the page
             */
            $webState.events.$broadcast('go', refineHash());
        }
    }

    //set the PopState Functionality
    //First checked to see if window supports onPopChange Event
    //@Function window.addEventListener("popState",FN,false)

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
        $webState.events.$broadcast('go', locHash);
    }

    //function refineHash
    function refineHash() {
        var hash = location.hash;
        if (hash && hash.indexOf('#') > -1) {
            return hash.replace('#', '');
        }

        return hash;
    }
}