/**
 * 
 * @param {*} ctrl 
 * @param {*} resolvers 
 * @param {*} locals 
 * @param {*} CB 
 */
function ControllerInitializer(ctrl, locals, CB) {
    locals = locals || {};
    if (ctrl.resolvers) {
        ControllerResolvers(ctrl.resolvers, locals).then(initialize);
    } else {
        initialize(locals);
    }
    /**
     * 
     * @param {*} locals 
     */
    function initialize(locals) {
        DependencyInjectorService.inject(ctrl, locals, function(instance) {
            try {
                CB(instance);
            } catch (e) {
                errorBuilder(e);
            }
        });
    }
};

/**
 * 
 * @param {*} resolvers 
 * @param {*} locals 
 */
function ControllerResolvers(resolvers, locals) {
    var promise = (new _Promise),
        promiseResolvers = [],
        resolversKey = Object.keys(resolvers)
    resolversKey.forEach(function(resolve) {
        promiseResolvers.push(resolvers[resolve].resolve());
    });

    //pass all request to our resolver
    promise.all(promiseResolvers).done(function(results) {
        //wrap our response in locals
        results.forEach(function(res, idx) {
            locals[resolversKey[idx]] = res;
        });

        promise.resolve(locals);
    }).fail(promise.reject);

    return promise;
};