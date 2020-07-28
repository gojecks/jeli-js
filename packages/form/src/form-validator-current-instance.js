/**
 * 
 * @param {*} next 
 */
function CurrentInstance(next) {
    this.pending = null;
    this.hasAsync = false;
    /**
     * @param len
     */
    this.add = function(totalValidators) {
        this.pending = {
            count: totalValidators,
            errors: {},
            failed: false
        };

        this.hasAsync = false;
        this.resolve = null;
    };

    /**
     * @param passed
     * @param field
     * @param type
     */
    this.rem = function(passed, type) {
        this.pending.count--;
        if (!passed) {
            this.pending.failed = true;
            this.pending.errors[type] = true;
        }

        /**
         * finished resolving but have some errors
         * push to the error domain
         */
        if (!this.pending.count) {
            next(this.pending.failed ? this.pending.errors : null);
        }
    };
}

/**
 * @param asyncInstance
 * @param Request
 * @param field
 * @param name
 */
CurrentInstance.prototype.registerAsyncValidator = function(asyncInstance, Request, name) {
    this.hasAsync = true;
    var _this = this;
    var callback = function(type, ret) {
        return function(response) {
            _this.rem((Request[type]) ? Request[type](response) : ret, name);
        }
    };

    asyncInstance.then(callback('onsuccess', true), callback('onerror', false));
};