/**
 * Core PromiseEvent Handler
 * this method does the heavy lifting
 * @param {*} triggerAfterResolve 
 */
export function CorePromiseHandler(triggerAfterResolve) {
    var _untilObserver = [];
    var untilStarted = false;
    var state = {
        pending: true,
        value: null,
        resolvedWith: ""
    };
    var _pending = [];

    function checkPendingState() {
        if (!state.pending) {
            _complete(state.resolvedWith, state.value);
        } else if (_untilObserver.length && !untilStarted) {
            untilStarted = true;
            startUntilObserver();
        }
    }

    /**
     * 
     * @param {*} context 
     */
    function startUntilObserver() {
        var _interval = setInterval(function() {
            var allPassed = _untilObserver.map(function(fn) {
                return fn();
            }).filter(function(ans) {
                return !!ans;
            }).length;

            /**
             * check if all criteria is met
             */
            if (allPassed === _untilObserver.length) {
                _complete('resolve');
                _untilObserver.length = 0;
                clearInterval(_interval);
            }
        }, 100);
    }

    /**
     * 
     * @param {*} type 
     * @param {*} result 
     */
    function _complete(type, result) {
        while (_pending[0]) {
            var fn = _pending.shift()[type];
            fn.apply(null, result);
        }

        state.pending = false;
        state.value = result;
        state.resolvedWith = type;
        (triggerAfterResolve || function() {})();
    };

    function _registerListener(listeners) {
        _pending.push(listeners);
        checkPendingState();
    }

    return ({
        complete: _complete,
        checkPendingState: checkPendingState,
        startUntilObserver: startUntilObserver,
        until: _untilObserver,
        registerListener: _registerListener
    });
}