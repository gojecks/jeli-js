  /**Promise Function*/
  function _Promise(triggerAfterResolve) {

      function PromiseProcessComplete(type) {
          if (!this.$$state.pending) {
              this[type](this.$$state.resolvedWith, this.$$state.value);
          }
      }

      function _corePromise() {
          this.pending = [];
          this.resolve = function() {
              this.complete('resolve', arguments);
          };

          this.reject = function(result) {
              this.complete('reject', arguments);
          };

          this.$$state = {
              pending: true,
              value: null,
              resolvedWith: ""
          };
      }

      /**
       * 
       * @param {*} success 
       * @param {*} failure 
       */
      _corePromise.prototype.then = function(success, failure) {
          this.pending.push({
              resolve: success || function() {},
              reject: failure || function() {}
          });

          PromiseProcessComplete.call(this, 'complete');

          return this;
      };

      /**
       * 
       * @param {*} failure 
       */
      _corePromise.prototype.catch = function(failure) {
          this.pending.push({
              reject: failure || function() {},
              resolve: function() {}
          });

          PromiseProcessComplete.call(this, 'complete');
      };

      /**
       * 
       * @param {*} type 
       * @param {*} result 
       */
      _corePromise.prototype.complete = function(type, result) {
          while (this.pending[0]) {
              var fn = this.pending.shift()[type];
              fn.apply(null, result);
          }

          this.$$state.pending = false;
          this.$$state.value = result;
          this.$$state.resolvedWith = type;
          (triggerAfterResolve || function() {})();
      };

      /**
       * 
       * @param {*} resolve 
       */
      _corePromise.prototype.all = function(resolve) {
          var slice = [].slice,
              resolveValues = arguments.length == 1 && $isArray(resolve) ? resolve : slice.call(arguments),
              length = resolveValues.length,
              remaining = length,
              deferred = new Defer(),
              failed = 0,
              results = [];
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
              if (cur.$$state) {
                  cur.then(updateDefered(i), updateDefered(i, 1))
              } else {
                  updateDefered(i)(cur);
              }
          }

          return deferred;
      };

      return (new _corePromise);
  }