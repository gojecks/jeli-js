import { CorePromiseHandler } from './core';
/**
 * 
 * @param {*} triggerAfterResolve 
 */
export default function Defer(triggerAfterResolve) {
    var core = CorePromiseHandler(triggerAfterResolve);
    this.resolve = function() {
        core.complete('done', arguments);
    };


    this.reject = function() {
        core.complete('fail', arguments);
    };

    /**
     * 
     * @param {*} callback 
     */
    this.done = function(callback) {
        core.registerListener({
            done: callback
        });
        return this;
    };

    /**
     * 
     * @param {*} callback 
     */
    this.fail = function(callback) {
        core.registerListener({
            fail: callback
        });
        return this;
    };
}