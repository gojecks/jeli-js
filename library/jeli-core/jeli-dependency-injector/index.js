
/*@Private Function findInProvider
@Argument : Provider to inject (String)
@return if found or else throw new error*/

function findInProvider(provider)
{
    if($provider.hasOwnProperty(provider))
    {
        var _provider = $provider.$get(provider);
        return (function()
        {
              if(_provider.$get)
              {
                return _provider.$get();
              }

              return _provider;
        })();

    }else{
        return new $dependencyInjector(2).get(provider);
    }
}


//@Private Function
//@DependencyInjector( fn );
function $dependencyInjector( restricted )
{
    
    this.inject = function(fn,provider,model,locals)
    {
      var nArg = [],
          i = 0,
          dependencies = fn.$injector; //dependency injection Array

          if(dependencies && dependencies.length )
          {
              for(; i < dependencies.length; i++)
              {
                var doInject = dependencies[i],
                    injectedArgument = null;
                  //Try and catch injectors
                  if(doInject)
                  {
                      switch(provider)
                      {
                          case('$jConfigProvider'):
                          case('$jProvideProvider'):
                              injectedArgument = findInProvider( doInject );
                          break;
                          default:
                            try
                            {
                              if($inArray(doInject,['$scope','$model','model']))
                              {
                                  injectedArgument = model;
                              }else
                              {
                                injectedArgument =  this.get( doInject, provider,locals);
                              }

                            }catch(e){}
                            finally
                            {
                                if($isNull(injectedArgument))
                                {
                                    throw new Error('Could not Find '+doInject+'Provider in ' + provider);
                                }
                            }
                          break;
                      }
                  }

                  nArg.push( injectedArgument );
              }
          }

          return nArg;
      };

    this.get = function(arg,reference,resolver)
    {
        if(resolver[arg]){
          return resolver[arg];
        }
          //check publicProviders
          if($publicProviders[arg])
          {
            return $publicProviders[arg];
          } 

          var dependency = null,
              provider=null,
              _injectors = $compileTracker.injectors.$getAll();
            domElementProvider.each(_injectors,function(idx,queue)
            {
                if($isArray(queue))
                {
                  var found = queue.filter(function(item){
                    return item[1][0] === arg;
                  });

                  if(found && found.length){
                    //set provider when its found
                      provider = found[0][0];
                      dependency = $provider.$get(provider).resolve(idx,arg,reference);

                      if($isEqual(found[0][1][1],'unregistered'))
                      {
                        //only inject dependency
                        //when its required
                        if(dependency && dependency.$injector){
                          dependency = q( provider, dependency );
                        }
                        //register the application
                        $provider.$get(provider).register(idx,arg,dependency);
                        found[0][1][1] = 'registered';
                      }
                  }
                }else
                {
                    if($isEqual(idx,arg))
                    {
                      dependency = queue;
                    }
                }
            });

            if(restricted)
            {
              if($inArray(provider,$provider.$restrictDebugMode[restricted]))
              {
                var msg = ((restricted < 2)?'Could not Find '+arg+'Provider in ' + provider:'Cannot inject '+provider+' in Config State');
                errorBuilder(msg);
              }
            }
        //return the dependency
        return dependency;
    };
}


/*
  @Function Binding
  @argument {Function} {ARRAY}
  @return Function
*/
function binding(fn,arg)
{
  var init = function()
      {
        return fn.apply(this, arg);
      };
      
  init.prototype = fn.prototype;
    return init;
}

function q( provider , fn , model , initializer,locals)
{
    if( $isFunction( fn ) && provider)
    {
      //get all dependency injectors
      var nArg = new $dependencyInjector().inject( fn , provider , model ,locals);

      //initialize the defined function
      //only initializes when its defined
      if(initializer && $isFunction(initializer)){
          return initializer(nArg);
      }

      switch(provider)
      {
        case('$jFactoryProvider'):
        case('$jControllerProvider'):
          return fn.construct(nArg);
        break;
        case('$jServiceProvider'):
          return binding(fn,nArg);
        break;
        default:
          return fn.apply( fn , nArg );
        break;
      }
    }

    return fn;
}

function $injectorChecker(fn)
{
    return ($isFunction(fn))?fn.toString().match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1].replace(/ /g, '').split(',') : fn;
}

function $inject(arg)
{
    var fn,nArg;

    if($isArray(arg))
    {
      //create a copy of the array with reference to the parent
      var nArg = Array.prototype.slice.call(arg,0);
        fn = nArg.pop(); //pop the function out of the array
        fn.$injector = nArg; //other arrays remains the dependencies
     }
    else if($isFunction(arg))
    {
        var fn = arg;
        fn.$injector = $injectorChecker(arg); 
    }

    return fn;
}

function r(module,arg,provider)
{
    var fn  = $inject(arg);
    if($isObject(module))
    {
        return module.jCompiler(provider,fn);
    }
    else{
        return q(module,fn);
    }
}


