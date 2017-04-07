  /*
    $httpProvider functionality
    $interceptor idea was referenced from https://en.wikipedia.org/wiki/Interceptor_pattern
    Function Name:  $httpProvider
    Instance: Function
    Properties: 
      - resolveInterceptor
      - register
      - $get
  */

// register $http Provider
$provider.registerProvider('$httpProvider', function $httpProvider()
{
    var _interceptors = [],
        _resolved = ({
          request : [],
          responseError : [],
          responseSuccess : []
        }),
        _isRegistered = false;

    this.resolveInterceptor = function(state,options)
    {
      var $defer = new $p();
      if(!_isRegistered)
      {
        this.register();
        _isRegistered = true;
      }


      findInList.call(_resolved[state],function(idx,_intercept)
      {
        var callback = _intercept.apply(_intercept,[options]);

          $defer[callback?'resolve':'reject'](callback);
      });

      return $defer;
    };

    //register all interceptors
    this.register = function()
    {
      //loop through all list of interceptors
        findInList.call(_interceptors,function(idx,_intercept)
        {
          //get a factory interceptor
            if($isString(_intercept))
            {
              _intercept = new $dependencyInjector().get(_intercept);
            }else
            {
              _intercept = q('$resolveHttpInterceptor',$inject(_intercept) );
            }

            if($isObject(_intercept))
            {
              var _key = Object.keys(_intercept).join('');
              _resolved[_key].push( _intercept[_key] ); 
            }
        });

         _isRegistered = true;
    };

    this.$get = function()
    {
        return ({
            interceptors : _interceptors
        });
    };
});