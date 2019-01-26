function $timeoutService() {
    /** Promise with Timeout **/
    function $chain() {
        return ({
            delay: function(ms) {
                var p = new $p();
                setTimeout(p.resolve, ms);
                return p;
            }
        });
    }
    //timeout functionality
    return function(fn, timer) {
        $chain()
            .delay(timer || 0)
            .then(fn);
    };
}