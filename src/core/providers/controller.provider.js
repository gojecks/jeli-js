/**
 * 
 * @param {*} ctrl 
 * @param {*} resolvers 
 * @param {*} locals 
 */
function ControllerInitializer(ctrl, resolvers, locals) {
    var $defer = new Defer();
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
            $defer.resolve(instance);
        }, locals);
    }

    return $defer;
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
        promiseResolvers.push(dependencyInjectorMain($inject(resolvers[resolve])));
    }

    //pass all request to our resolver
    $q.all(promiseResolvers).then(function(results) {
        //wrap our response in locals
        results.forEach(function(res, idx) {
            locals[resolversKey[idx]] = res;
        });

        $q.resolve(locals);
    });

    return $q;
};