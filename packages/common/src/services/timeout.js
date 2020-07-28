var nativeTimeout = window.setTimeout;
var nativeClearTimeout = window.clearTimeout;
var nativeInterval = window.setInterval;
var nativeClearInterval = window.clearInterval;

window.setTimeout = function(fn, timer, detectChanges) {
    return nativeTimeout(trigger(fn, detectChanges), timer);
};

window.clearTimeout = function(timeoutID) {
    nativeClearTimeout(timeoutID);
};

window.clearInterval = function(intervalID) {
    nativeClearInterval(intervalID);
};

window.setInterval = function(fn, interval, detectChanges) {
    return nativeInterval(trigger(fn, detectChanges), interval);
};


/**
 * 
 * @param {*} fn 
 * @param {*} detectChanges 
 */
function trigger(fn, detectChanges) {
    return function() {
        fn();
        if (detectChanges) {
            CoreBootstrapContext.detectChanges();
        }
    };
};