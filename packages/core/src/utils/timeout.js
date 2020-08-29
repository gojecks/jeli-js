var nativeTimeout = window.setTimeout;
var nativeClearTimeout = window.clearTimeout;
var nativeInterval = window.setInterval;
var nativeClearInterval = window.clearInterval;

window.setTimeout = function(fn, timer) {
    return nativeTimeout(trigger(fn), timer);
};

window.clearTimeout = function(timeoutID) {
    nativeClearTimeout(timeoutID);
};

window.clearInterval = function(intervalID) {
    nativeClearInterval(intervalID);
};

window.setInterval = function(fn, interval) {
    return nativeInterval(trigger(fn), interval);
};


/**
 * 
 * @param {*} fn 
 */
function trigger(fn) {
    return function() {
        fn();
        ChangeDetector();
    };
};