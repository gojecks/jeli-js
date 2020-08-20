 import { CorePromiseHandler } from './core';
 import { Defer } from './defer';
 /**
  * 
  * @param {*} triggerAfterResolve 
  */
 export function _Promise(triggerAfterResolve) {
     var core = CorePromiseHandler(triggerAfterResolve);
     this.resolve = function() {
         core.complete('resolve', arguments);
     };

     this.reject = function(result) {
         core.complete('reject', arguments);
     };

     this.until = function(untilObserver) {
         core.until.push(untilObserver);
         return this;
     };

     /**
      * 
      * @param {*} success 
      * @param {*} failure 
      */
     this.then = function(success, failure) {
         core.registerListener({
             resolve: success || function() {},
             reject: failure || function() {}
         });
         return this;
     };

     /**
      * 
      * @param {*} failure 
      */
     this.catch = function(failure) {
         core.registerListener({
             reject: failure || function() {}
         });
     };
 }

 /**
  * 
  * @param {*} resolve 
  */
 _Promise.all = function(resolve) {
     var slice = [].slice;
     var resolveValues = arguments.length == 1 && resolve.length ? resolve : slice.call(arguments);
     var length = resolveValues.length;
     var remaining = length;
     var deferred = new Defer();
     var failed = 0;
     var results = [];
     /**
      * 
      * @param {*} idx 
      * @param {*} err 
      */
     function updateDefered(idx, err) {
         return function(res) {
             results[idx] = res;
             if (err) {
                 ++failed;
             }

             if (!(--remaining)) {
                 deferred[(failed) ? 'reject' : 'resolve'](results);
             }
         };
     }

     for (var i = 0; i < length; i++) {
         var cur = resolveValues[i];
         if (cur instanceof _Promise) {
             cur.then(updateDefered(i), updateDefered(i, true))
         } else {
             updateDefered(i)(cur);
         }
     }

     return deferred;
 };