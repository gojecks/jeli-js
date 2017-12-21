  /*
      @ProviderName : jRunProvider
      @return : Object
    */
  $provider.registerProvider('$jInitProvider', function() {
      var _runfn = {};
      this.register = function(module, fn) {
          _runfn[module] = fn;
      };

      this.resolve = function(module) {
          return dependencyInjectorMain('$jRunProvider', _runfn[module]);
      }
  });