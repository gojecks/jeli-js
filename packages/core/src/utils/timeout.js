var nativeTimeout = window.setTimeout;
var nativeClearTimeout = window.clearTimeout;
var nativeInterval = window.setInterval;
var nativeClearInterval = window.clearInterval;

window.setTimeout = function(fn, timer, trigerDetector) {
    return nativeTimeout(trigger(fn, trigerDetector), timer);
};

window.clearTimeout = function(timeoutID) {
    nativeClearTimeout(timeoutID);
};

window.clearInterval = function(intervalID) {
    nativeClearInterval(intervalID);
};

window.setInterval = function(fn, interval, trigerDetector) {
    return nativeInterval(trigger(fn, trigerDetector), interval);
};


/**
 * 
 * @param {*} fn 
 * @param {*} trigerDetector 
 */
function trigger(fn, trigerDetector) {
    return function() {
        fn();
        trigerDetector && ChangeDetector();
    };
};