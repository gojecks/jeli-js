/**
 * 
 * @param {*} ctrl 
 * @param {*} resolvers 
 * @param {*} locals 
 * @param {*} CB 
 */
function ControllerInitializer(ctrl, resolvers, locals, CB) {
    if ($isString(ctrl)) {
        return DependencyInjectorService.get(ctrl, locals);
    }

    resolvers = resolvers || ctrl.resolvers;
    locals = locals || {};

    if (resolvers) {
        ControllerResolvers(_resolvers, locals).then(initialize);
    } else {
        initialize(locals);
    }
    /**
     * 
     * @param {*} locals 
     */
    function initialize(locals) {
        dependencyInjectorMain(ctrl, function(args) {
            var instance = dependencyFnWrapper(ctrl, args);
            CB(instance);
        }, locals);
    }
};

/**
 * 
 * @param {*} resolvers 
 * @param {*} locals 
 */
function ControllerResolvers(resolvers, locals) {
    var $q = (new _Promise),
        promiseResolvers = [],
        resolversKey = Object.keys(resolvers);
    for (var resolve in resolvers) {
        promiseResolvers.push(resolvers[resolve].resolve());
    }

    //pass all request to our resolver
    $q.all(promiseResolvers).done(function(results) {
        //wrap our response in locals
        results.forEach(function(res, idx) {
            locals[resolversKey[idx]] = res;
        });

        $q.resolve(locals);
    }).fail($q.reject);

    return $q;
};