/**
 * 
 * @param {*} next 
 * @param {*} isDeep 
 */
class CurrentInstance {
    constructor(next, isDeep) {
        this.pending = null;
        this.hasAsync = false;
        this.isDeep = isDeep;
        this.failed = false;
        this.errors = null;
        this.count = 0;
        this.stop = function () {
            next(this.failed ? this.errors : null);
        };
    }
    /**
     * @param len
     */
    add(totalValidators) {
        this.count = totalValidators;
        this.errors = {};
        this.failed = false;
        this.hasAsync = false;
        this.resolve = null;
    }
    /**
     * @param passed
     * @param field
     * @param type
     */
    rec(passed, type, fieldName) {
        this.count--;
        if (passed !== true) {
            this.failed = true;
            if (this.isDeep) {
                this.errors[fieldName] = this.errors[fieldName] || {};
                this.errors[fieldName][type] = true;
            } else {
                this.errors[type] = true;
            }
        }

        /**
         * finished resolving but have some errors
         * push to the error domain
         */
        if (!this.count) {
            this.stop();
        }
    }
    /**
     *
     * @param {*} asyncInstance
     * @param {*} name
     */
    registerAsyncValidator(asyncInstance, name, fieldName) {
        this.hasAsync = true;
        var callback = (value) => {
            this.rec(value, name, fieldName);
        };

        asyncInstance.then(callback, callback);
    }
}