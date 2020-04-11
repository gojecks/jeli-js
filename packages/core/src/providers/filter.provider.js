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

    return filterFn.compile.apply(filterFn, context);
};