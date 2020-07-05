/**
 * 
 * @param {*} resolvers 
 * @param {*} locals 
 */
function CoreResolvers(resolvers, locals) {
    var promise = (new _Promise);
    var promiseResolvers = [];
    var resolversKey = Object.keys(resolvers);
    resolversKey.forEach(function(resolve) {
        promiseResolvers.push(resolvers[resolve].resolve());
    });

    //pass all request to our resolver
    _Promise.all(promiseResolvers).done(function(results) {
        //wrap our response in locals
        results.forEach(function(res, idx) {
            locals[resolversKey[idx]] = res;
        });

        promise.resolve(locals);
    }).fail(promise.reject);

    return promise;
};