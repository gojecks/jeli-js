/**
 * $
 * @param {*} triggerAfterResolve 
 */
function Defer(triggerAfterResolve) {
    function DeferProcessComplete(type) {
        if (!this.$$state.pending) {
            this.execute(this.$$state.resolvedWith, this.$$state.value);
        }
    }

    function _coreDefer() {
        this._done = [];
        this._fail = [];
        this.$$state = {
            pending: true,
            value: null,
            resolvedWith: ""
        };
    }

    /**
     * 
     * @param {*} list 
     * @param {*} args 
     */
    _coreDefer.prototype.execute = function(type, args) {
        var i = this[type].length,
            len = 0,
            deferredFn = this[type];

        args = Array.prototype.slice.call(args);
        while (i > len) {
            deferredFn[len] && deferredFn[len].apply(null, args);
            len++;
        }

        this.$$state.pending = false;
        this.$$state.value = args;
        this.$$state.resolvedWith = type;
        // triggerOnResolve
        (triggerAfterResolve || function() {})();
    };

    _coreDefer.prototype.resolve = function() {
        this.execute('_done', arguments);
    };


    _coreDefer.prototype.reject = function() {
        this.execute('_fail', arguments);
    };

    /**
     * 
     * @param {*} callback 
     */
    _coreDefer.prototype.done = function(callback) {
        this._done.push(callback);
        DeferProcessComplete.call(this, 'execute');
        return this;
    };

    /**
     * 
     * @param {*} callback 
     */
    _coreDefer.prototype.fail = function(callback) {
        this._fail.push(callback);
        DeferProcessComplete.call(this, 'execute');
        return this;
    };

    return (new _coreDefer);
}