    domElementProvider.compile = function(obj)
    {
      var model = $provider.$get('$jEliServices').$get('$rootModel').$new();
      //extend the model
      if(obj && $isObject(obj))
      {
        if(obj.hasOwnProperty('$mId') && $modelMapping.$get(obj.$mId))
        {
          model = obj;
        }else{
          extend(model,obj);
        }
      }
      
      return $templateCompiler(this[0])(model);
    };

    domElementProvider.jModel = function()
    {
        if(!findInProvider('jDebugProvider').$disableDebugMode)
        {
          return $modelMapping.$get(this.data('jModel'));
        }

        return undefined;
    };



      domElementProvider.injector = function()
      {
        if(this[0] === $compileTracker.lastCompiledWith)
        {
          return new $dependencyInjector(1);
        }

        return undefined;
      };