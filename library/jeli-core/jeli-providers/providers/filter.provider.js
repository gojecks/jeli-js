/*
  jEli filter Provider
  Instance: Object
  Default jEli Filters : json|date|uppercase|lowercase|capitalize|number
  @Params : typr (STRING)
  @return: Function
*/
var $eliFilters = 'json|date|uppercase|lowercase|capitalize|number|'.split('|');
$provider.registerProvider('$jFilterProvider', function(){
  var filterInstance = new $providerFn('$jFilterProvider');

filterInstance.parse = function $filtersProviderFn(type)
{
  return function(exp,value,$model)
  {
     /*
        Custom defined filters
        Get the require filter and then initialize it
        throw error if filter was not found
      */
    var replacerObject="",
        hasExpression = $removeWhiteSpace( exp );

    if( hasExpression && $isJsonString(hasExpression) )
    {
      replacerObject = stringToObject(hasExpression,$model);
      if(!$isObject(replacerObject))
      {
        replacerObject = exp;
      }
    }else
    {
      replacerObject = exp;
    }

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
