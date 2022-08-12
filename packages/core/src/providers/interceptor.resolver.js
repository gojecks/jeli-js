import { Inject } from "../dependency.injector";

/**
 * This method will resolve all registered Interceptors
 * @param {*} interceptorToken 
 * @returns 
 */
export function InterceptorResolver(interceptorToken, locals) {
    var interceptors = Inject(interceptorToken);
    return new Promise(function(resolve, reject) {
        if (!interceptors || !interceptors.length) {
            return resolve();
        }

        var len = 0;

        /**
         * iterator method
         */
        function next() {
            var interceptor = interceptors[len];
            len++;
            if (interceptor) {
                interceptor.resolve(locals, next, reject);
            } else {
                resolve();
            }
        }

        next();
    });
}