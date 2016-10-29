  // End of jQlite
  //jEli Module Configuration starts here  

  function  _Template()
  {
      var arg = arguments,
      $self = this;
      this.arg = arg;
      this.callee = function (func) 
      {
          return func($self.arg[1]);
      };
      this.evaluate = function (str)
      {
          if (str.indexOf('{%') > -1)
          return new _Template(str);
           else
          return str;
      };
      this.extract = function () {};
      this.pattern = /\{\%(.*?)\%\}/g;
      this.init = function (){};
  };


  function jConfigProvider()
  {
     var _configuration = {};
     this.register = function(module,config)
     {
        if( !_configuration[module] )
        {
          _configuration[module] = [];
        }

        //push to configuration
        _configuration[module].push( config );
     };

     //register configuration
     this.resolve = function(module)
     {
        for(var i in _configuration[module])
        {
          var next = _configuration[module][i];
            if(!next[1])
            {
                next[1] = true;
                q('$jConfigProvider', next[0]);
            }
        }
     };
  }

  /*
    @ProviderName : jRunProvider
    @return : Object
  */

  function jRunProvider(){
    var _runfn = {};
    this.register = function(module,fn){
        _runfn[module] = fn;
    };

    this.resolve = function(module){
      return q('$jRunProvider', _runfn[module]);
    }
  }

         
  function $templateFactory()
  {
      this.get = function(a)
      {
          return $template[a];
      };

      this.put = function(a,b)
      {
          $template[a] = b;
      };

      this.evaluate = function(a,b)
      {
          return new _Template(a,b).init();
      };

  }

  /*
    $httpProvider functionality
    $interceptor idea was referenced from https://en.wikipedia.org/wiki/Interceptor_pattern
  */


  function $httpProvider()
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
  }

  function $providerFn(provide)
  {
      var _providers = {};
      this.register = function(moduleName,name,value)
      {
        //reject all call to register after application bootStrap
          if($isAfterBootStrap && !_providers[moduleName][name]){ return;}

          if(!_providers[moduleName])
          {
            _providers[moduleName] = {};
          }

         _providers[moduleName][name] = value;
      };

      this.resolve = function(moduleName , name , reference)
      {
          if(!_providers[moduleName])
          {
            this.register.apply(this,arguments);
            return false;
          }

          switch(provide)
          {
            case('$jProvideProvider'):
                var injected = _providers[moduleName][name];
                if(reference)
                {
                  //return the resolved $get
                  return q('$resolveProvider',$inject( injected.$get ));
                }

                return injected;
            break;
            default:
              return _providers[moduleName][name];
            break
          }
          
      };
  }


  function jControllerProvider()
  {
    //Generate a new provider Object 
     var newControllerInstance = new $providerFn('$jControllerProvider');

     newControllerInstance.$initialize = function(ctrl, model, resolvers,ctrlAs,locals)
     {
        if($isString(ctrl))
        {
          ctrl  = new $dependencyInjector().get( $removeWhiteSpace(ctrl) );
        }
          var fn = ((ctrl.$injector)?ctrl : $inject(ctrl)),
          //if resolvers is defined
          _resolvers = fn.$resolvers || resolvers;

          //set locals
          locals = locals || {};

            
            //resolve our controller
            //initialize the controller
            

            function initialize()
            {
              return  q('$jControllerProvider', fn , model, function(args){
                    var init = binding(fn,args),
                        jCtrlModel = new init();

                      if(ctrlAs)
                      {
                          // set Controller AS Object
                            model[ctrlAs] = jCtrlModel;
                      }
                  },locals);
            }

            if(_resolvers){
              this.initializeResolvers(_resolvers,locals)
              .then(function(){
                initialize();
                console.log(locals);
              });
            }else{
              initialize();
            }
     };


     newControllerInstance.initializeResolvers = function(resolvers,locals){
      var $q = new $p(),
          promiseResolvers = [],
          resolversKey = Object.keys(resolvers);
        for(var resolve in resolvers){
          promiseResolvers.push( q('$resolverProvider', $inject(resolvers[resolve] )) );
        }

          //pass all request to our resolver
          $q.all(promiseResolvers).then(function(results){
              //wrap our response in locals
              results.forEach(function(res,idx){
                locals[resolversKey[idx]] = res;
              });

              $q.resolve()
          });

          return $q;
     };

     return newControllerInstance;
  }


  function $controller()
  {
    var controller = new jControllerProvider();
     this.$get = function()
     {
        return ({
            instantiate : function()
            {
                return controller.$initialize.apply(controller,arguments);
            }
        })
     };
  }



  $provider.$get = function(provide)
  {
    if(!this[provide])
    {
      this[provide] = new $providerFn(provide);
    }

    return this[provide];
  };

  $provider.$templateCache = new $templateFactory();

  //$provider for controllers
  $provider.$jControllerProvider = new jControllerProvider();

  //$provider for configuration
  $provider.$jConfigProvider = new jConfigProvider();

  //$httpInterceptor Provider
  $provider.$httpProvider = new $httpProvider();

  //$jInitProvider
  $provider.$jInitProvider = new jRunProvider();


  function $_init(arg)
  {
      this.fire = function()
      {
          if($isFunction(arg))
          {
            return r('$jConfigProvider',arg);
          }
      };
  }

  function p(fn) 
  {
    return  new $_init(fn).fire();
  };