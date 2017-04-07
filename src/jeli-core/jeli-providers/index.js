  // End of jQlite
  //jEli Module Configuration starts here  

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

$provider.$get = function(provide)
{
  if(!this[provide])
  {
    this[provide] = new $providerFn(provide);
  }

  return this[provide];
};

$provider.registerProvider = function(name, providerFn){
  this[name] = (new providerFn);

  return this;
};
