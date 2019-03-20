function TimeoutService() {
    //timeout functionality
    return function(fn, timer) {
        var timeout = setTimeout(function() {
            fn();
            ComponentRef.detectChanges();
        }, timer);

        return function() {
            clearTimeout(timeout);
        }
    };
}

function IntervalService() {

    return function(fn, interval) {
        var currentIterVal = setInterval(function() {
            fn();
            ComponentRef.detectChanges();
        }, interval);

        return function() {
            clearInterval(currentIterVal);
        }
    }
}