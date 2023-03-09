var nativeTimeout = window.setTimeout;
var nativeInterval = window.setInterval;

/**
 * 
 * @param {*} fn 
 * @param {*} timer 
 * @param {*} trigerDetector 
 * @returns 
 */
window.setTimeout = function(fn, timer, trigerDetector) {
    return nativeTimeout(trigger(fn, trigerDetector), timer);
};

/**
 * 
 * @param {*} fn 
 * @param {*} interval 
 * @param {*} trigerDetector 
 * @returns 
 */
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
    }
};