  //register default providers
  _defaultRegistry('j-eli', '$jProvideProvider', '$controller')({
      $get: function() {
          return ({
              instantiate: function() {
                  var controller = $provider.$get('$jControllerProvider');
                  return controller.$initialize.apply(controller, arguments);
              }
          })
      }
  });

  //register default providers
  _defaultRegistry('j-eli', '$jProvideProvider', '$resolve')({
      //Function for dependency Resolvers
      // @return $promise
      // register our Resolve provider
      $get: function() {
          return ({
              instantiate: function() {
                  var resolvers = $provider.$get('$jControllerProvider');
                  return resolvers.initializeResolvers.apply(resolvers, arguments);
              }
          })
      }
  });

  //register JSON filters
  //return a stringified json object
  _defaultRegistry('j-eli', '$jFilterProvider', 'json')(
      // jsonFilter
      function jsonFilter() {
          return function(value) {
              return $isObject(value) ? JSON.stringify(value) : value;
          }
      });

  //register UPPERCASE filters
  //return a UPPERCASE TEXT
  _defaultRegistry('j-eli', '$jFilterProvider', 'uppercase')(
      // upperCaseFilter
      function upperCaseFilter() {
          return function(value) {
              return value.toUpperCase();
          }
      });

  //register LOWERCASE filters
  //return a LOWERCASE TEXT
  _defaultRegistry('j-eli', '$jFilterProvider', 'lowercase')(
      // lowerCaseFilter
      function lowerCaseFilter() {
          return function(value) {
              return value.toLowerCase();
          }
      });

  _defaultRegistry('j-eli', '$jFilterProvider', 'capitalize')(
      // lowerCaseFilter
      function lowerCaseFilter() {
          return function(value) {
              return value.charAt(0).toUpperCase() + value.substr(1, value.length);
          }
      });


  // register filterService
  _defaultRegistry('j-eli', '$jFactoryProvider', '$filter')(function() {
      return $provider.$jFilterProvider.parse
  });

  // register $timeout service
  _defaultRegistry('j-eli', '$jFactoryProvider', '$timeout')(function() {
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
  });