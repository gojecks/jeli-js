/*
  jEli filter Provider
  Instance: Object
  Default jEli Filters : json|date|uppercase|lowercase|capitalize|number
  @Params : typr (STRING)
  @return: FilterIntstance
*/
var $eliFilters = 'json|date|uppercase|lowercase|capitalize|number|'.split('|');
$provider.registerProvider('$jFilterProvider', function() {
    var filterInstance = new $providerFn('$jFilterProvider');

    filterInstance.parse = function $filtersProviderFn(type, $options) {
        return function(value) {
            /*
               Custom defined filters
               Get the require filter and then initialize it
               throw error if filter was not found
             */
            var _args = [value],
                arg,
                i = 1;
            for (; i < arguments.length; i++) {
                arg = removeQuotesFromString($removeWhiteSpace(arguments[i]));
                if ($isJsonString(arg)) {
                    arg = maskedEval(arg.toString(), $options) || arg;
                }
                _args.push(arg);
            }
            var filterFn = new $dependencyInjector().get(type);
            if ($isFunction(filterFn)) {
                return filterFn.apply(filterFn, _args);
            } else {
                errorBuilder(type + 'Provider was not found in FilterProvider');
            }
            //return the value
            return value;
        };
    };

    return filterInstance;
});