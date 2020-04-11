/**
 * 
 * @param {*} type 
 * @param {*} errorHandler 
 */
function CurrentInstance(successHandler, errorHandler) {
    this.pending = {
        count: 0,
        fields: {}
    };
    this.hasAjax = false;
    /**
     * @param field
     * @param len
     */
    this.add = function(field, len) {
        this.pending.fields[field] = {
            count: len,
            failed: []
        };

        this.pending.count++;
    };

    /**
     * @param passed
     * @param field
     * @param type
     */
    this.rem = function(passed, field, type) {
        this.pending.fields[field].count--;
        if (!passed) {
            this.pending.fields[field].failed.push(type);
        }

        /**
         * finished resolving but have some errors
         * push to the error domain
         */
        if (!this.pending.fields[field].count) {
            if (this.pending.fields[field].failed.length) {
                errorHandler(field, this.pending.fields[field].failed);
            }
            this.pending.count--;
        }

        if (!this.pending.count && successHandler) {
            /**
             * trigger when no pending status
             */
            successHandler();
        }
    };
}

CurrentInstance.prototype.clean = function() {
    this.pending = {
        count: 0,
        fields: {}
    };

    this.hasAjax = false;
    this.resolve = null;
};

/**
 * @param AjaxInstance
 * @param Request
 * @param field
 * @param name
 */
CurrentInstance.prototype.registerAjax = function(AjaxInstance, Request, field, name) {
    this.hasAjax = true;
    var _this = this;
    AjaxInstance.then(function(res) {
        _this.rem((Request.onsuccess || function() { return true; })(res), field, name);
    }, function(res) {
        _this.rem((Request.onerror || function() { return false; })(res), field, name);
    });
};