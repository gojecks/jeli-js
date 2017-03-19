/*
  jEli filter Provider
  Instance: Object
  Default jEli Filters : json|date|uppercase|lowercase|capitalize|number
  @Params : typr (STRING)
  @return: FilterIntstance
*/
var $eliFilters = 'json|date|uppercase|lowercase|capitalize|number|'.split('|');
$provider.registerProvider('$jFilterProvider', function(){
  var filterInstance = new $providerFn('$jFilterProvider');

  filterInstance.parse = function $filtersProviderFn(type)
  {
    return function(value,exp,$model)
    {
       /*
          Custom defined filters
          Get the require filter and then initialize it
          throw error if filter was not found
        */

      var replacerObject = stringToObject($removeWhiteSpace( (exp || "").toString() ), $model) || exp;

      var filterFn = new $dependencyInjector().get( type );
      if($isFunction(filterFn))
      {
        return filterFn( value , replacerObject );
      }else
      {
        errorBuilder(type+'Provider was not found in FilterProvider');
      }
      //return the value
      return value;
    };
  };

  return filterInstance;
});
