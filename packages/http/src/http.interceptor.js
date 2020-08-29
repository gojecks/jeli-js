import { ProviderToken, Inject } from '@jeli/core';
export var HTTP_INTERCEPTORS = new ProviderToken('interceptors', true);
/*
 * $httpProvider functionality
 * $interceptor idea was referenced from https://en.wikipedia.org/wiki/Interceptor_pattern
 * Function Name:  $httpProvider
 * Instance: Function
 * Properties: 
 *   - resolveInterceptor
 *   - register
 *   - $get
 */

Service()
export function HttpInterceptor() {
    /**
     * 
     * @param {*} options 
     * @param {*} next 
     */
    this.resolveInterceptor = function(options, callback) {
        var interceptors = Inject(HTTP_INTERCEPTORS);
        if (!interceptors || !interceptors.length) {
            return callback(options);
        }

        var len = 0;

        /**
         * iterator method
         */
        function next() {
            var interceptor = interceptors[len];
            len++;
            if (interceptor) {
                interceptor.resolve(options, callback);
            } else {
                callback(options);
            }
        }

        next();
    };
}