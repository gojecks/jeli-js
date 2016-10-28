    //eli app compiler
function $compileApp()
{
  var elementToBootStrap = $compileTracker.lastCompiledWith; 
  if( $isEqual( elementToBootStrap.nodeName ,'HTML') || $isEqual( elementToBootStrap.nodeType, document.DOCUMENT_NODE ))
  {
    elementToBootStrap = document.body;
    $compileTracker.lastCompiledWith = document;
  }

    //reference the elementToBootStrap
    $0 = $publicProviders.$rootElement = elementToBootStrap;

  $templateCompiler( elementToBootStrap )( $publicProviders.$rootModel );

}

  //@Objectives : register all Factory,Directives,Filters
  function moduleCompiler(moduleName)
  {
      var queue = module.$get(moduleName)._jQueue;

        if(queue.length)
        {
            var len = 0;
            while(len < queue.length)
            {
                var _list = queue[len++];

                switch(_list[0])
                {
                    case('$jElementProvider'):
                    case('jFilterProvider'):
                    case('$jFactoryProvider'):
                      var currentProvider = $provider.$get(_list[0]),
                          _fn = currentProvider.resolve(moduleName,_list[1][0]);
                      //initialize the fn and re-register the module
                      currentProvider.register(moduleName,_list[1][0], q( _list[0], _fn));
                      _list[1][1] = 'registered';
                    break;
                }
            };
        }
  }




  function $jBootStrapApplication()
  {
      if(!$isCompiled)
      {
        //app BootStrap
        domElementProvider.each($compileTracker.compiledModule,function(idx,moduleName)
        {

            if( module[moduleName] )
            {
                $provider.$jConfigProvider.resolve(moduleName);
                $provider.$get('$httpProvider').register();
                $provider.$jInitProvider.resolve(moduleName);
                //compile jFactory,jFilter,jElement
                moduleCompiler(moduleName);
            } 
        });

          $isCompiled = true;
      }
  }

  //eli initializer and compiler
  function $eliInitializer(elementToBootStrap , moduleToBootStrap)
  {
      if(elementToBootStrap.length && $isArray(moduleToBootStrap))
      {
        var moduleName = moduleToBootStrap[0];
          $compileTracker.lastCompiledWith = elementToBootStrap[0];
          $compileTracker.compiledModule = moduleToBootStrap;
          $compileTracker.injectors.$new('$rootModel',$publicProviders.$rootModel);
          $compileTracker.injectors.$new(moduleName,module.$get(moduleName)._jQueue);
          injectRequiredModule( module.$get(moduleName).require );
          $jBootStrapApplication();
          $compileApp();
          $isAfterBootStrap = true;
      }    
  }


  //jEli Queue Builder
  function queueBuilder(providername,injectors)
  {
    return [providername,injectors];
  }

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
  
  //@ Private Function injectRequiredModule
  function injectRequiredModule(required)
  {
    domElementProvider.each(required,function(idx,moduleName)
    {
        $compileTracker.injectors.$new(moduleName,module.$get(moduleName)._jQueue);
        $provider.$jInitProvider.resolve(moduleName);
        $provider.$jConfigProvider.resolve(moduleName);
    });
  }


  function cBuild()
  {
      this.init = function(fn){
        $provider.$get('$jInitProvider').register(this.appName,$inject(fn));
      };

      //directive Provider caller
      this.jElement = function(name,fn)
      {
          if($isString(name) && name.indexOf('-') < 0 && !$isUndefined(fn))
          {
              //add the object to _jInjector Array
              this._jQueue.push( queueBuilder('$jElementProvider',[ name,'unregistered' ]) );
              $provider.$get('$jElementProvider').register(this.appName,name, $inject(fn));
          }

          return this;
      };

      //Module Provider 
      this.jProvider = function(name,fn)
      {
         if($isString(name) && !$isUndefined(fn))
          {
              //add the object to _jInjector Array
              this._jQueue.push( queueBuilder('$jProvideProvider',[ name,'unregistered' ] ) );
              $provider.$get('$jProvideProvider').register(this.appName,name, new fn );
          }

          return this;
      };

      this.jFactory = function(name,fn)
      {
          if($isString(name) && !$isUndefined(fn))
          {
            //add the object to _jInjector Array
            this._jQueue.push( queueBuilder('$jFactoryProvider', [ name,'unregistered'] ) );
            $provider.$get('$jFactoryProvider').register(this.appName,name, $inject(fn));
          }

          return this;
      };

      this.jService = function(name,fn)
      {
          if($isString(name) && !$isUndefined(fn))
          {
            //add the object to _jInjector Array
            this._jQueue.push( queueBuilder('$jServiceProvider', [ name,'unregistered' ] ) );
            $provider.$get('$jServiceProvider').register(this.appName,name, $inject(fn));
          }

          return this
      };

      this.jConfig = function(a)
      {
          var config = [$inject(a)];

          //add the object to _jInjector Array
          this._jQueue.push( queueBuilder('$jConfigProvider', [name]) );
          $provider.$get('$jConfigProvider').register(this.appName , config );

          return this;
      };

      this.jFilter = function(name,fn)
      {
          if(!$isUndefined(name) && !$isUndefined(fn))
          {
            this._jQueue.push( queueBuilder('$jFilterProvider', [ name,'unregistered' ] ) );
            $provider.$get('$jFilterProvider').register(this.appName,name, $inject(fn));
          }

          return this;
      };

      this.jController = function(name,fn)
      {
          if(!$isUndefined(name) && !$isUndefined(fn))
          {

            this._jQueue.push( queueBuilder('$jControllerProvider', [ name ] ) );
            $provider.$get('$jControllerProvider').register(this.appName, name, $inject(fn));
          }

          return this;
      };

      //$value that runs in compile mode
      this.jValue = function(name,fn)
      {
          if(!$isUndefined(name) && !$isUndefined(fn))
          {
              //add the object to _jInjector Array
              this._jQueue.push( queueBuilder('$jValueProvider', [ name ] ) );
              $provider.$get('$jValueProvider').register(this.appName,name,($isFunction(fn)?fn():fn));
          }

          return this;
      };

      this.jCompiler = q;
      this.require = [];
      this._jQueue = [];
  } 