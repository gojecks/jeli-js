  
  //Register default providers
  function _defaultRegistry(module,provider,name)
  {
       //register to default Module
      //add the object to _jInjector Array
      $compileTracker.injectors.$push(module,queueBuilder(provider,[name,'unregistered' ]));
      return function(fn)
      {
        $provider.$get(provider).register(module,name,($isFunction(fn)?$inject(fn):fn));
      };
  }