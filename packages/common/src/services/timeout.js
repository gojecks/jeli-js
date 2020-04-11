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

Service({
    name: '$timeout'
})
export function TimeoutService() {
    //timeout functionality
    return function(cb, timer) {
        var timeout = nativeTimeout(trigger(cb, true), timer);
        return function() {
            clearTimeout(timeout);
        };
    }
}


Service({
    name: '$interval'
})
export function IntervalService() {
    return function(cb, timer) {
        var interval = nativeInterval(trigger(cb, true), timer);
        return function() {
            clearInterval(interval);
        };
    };
}