/**
 * 
 * @param {*} next 
 */
function CurrentInstance(next) {
    this.pending = null;
    this.hasAsync = false;
    this.failed = false;
    this.errors = null;
    this.count = 0;
    this.stop = function() {
        next(this.failed ? this.errors : null);
    }
}

/**
 * @param len
 */
CurrentInstance.prototype.add = function(totalValidators) {
    this.count = totalValidators;
    this.errors = {};
    this.failed = false;
    this.hasAsync = false;
    this.resolve = null;
};

/**
 * @param passed
 * @param field
 * @param type
 */
CurrentInstance.prototype.rem = function(passed, type) {
    this.count--;
    if (!passed) {
        this.failed = true;
        this.errors[type] = true;
    }

    /**
     * finished resolving but have some errors
     * push to the error domain
     */
    if (!this.count) {
        this.stop();
    }
};

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