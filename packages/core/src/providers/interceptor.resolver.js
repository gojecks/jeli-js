import { Inject } from "../dependency.injector";

/**
 * This method will resolve all registered Interceptors
 * @param {*} interceptorToken 
 * @returns 
 */
export function InterceptorResolver(interceptorToken, locals, callback) {
    var interceptors = Inject(interceptorToken);
    if (!interceptors || !interceptors.length) {
        return callback(locals);
    }

    var len = 0;

    /**
     * iterator method
     */
    function next() {
        var interceptor = interceptors[len];
        len++;
        if (interceptor) {
            interceptor.resolve(locals, next);
        } else {
            callback(locals);
        }
    }

    next();
}