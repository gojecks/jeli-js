/**
 * 
 * @param {*} type 
 * @param {*} context 
 */
function filterParser(type, context) {
    var filterFn = DependencyInjectorService.get(type);
    if (!filterFn) {
        errorBuilder(type + 'Provider was not found in FilterProvider');
    }

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
                arg = maskedEval(arg.toString(), context) || arg;
            }
            _args.push(arg);
        }

        return filterFn.compile.apply(filterFn, _args);
    };
};