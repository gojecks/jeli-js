  /*
    jEli Controller Provider
    Function Name: jControllerProvider
    Instance: Object
    Property: 
      - initializeResolvers
      - $initialize
      - register
      - resolve
  */

  $provider.registerProvider('$jControllerProvider',  function jControllerProvider()
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

              $q.resolve(locals);
          });

          return $q;
     };

     return newControllerInstance;
  });