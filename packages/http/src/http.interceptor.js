import { ProviderToken } from '@jeli/core';
export var INTERCEPTORS = new ProviderToken('interceptors', true);
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

Service({
    DI: [INTERCEPTORS],
})

/**
 * 
 * @param {*} interceptors 
 */
export function HttpInterceptor(interceptors) {
    /**
     * 
     * @param {*} options 
     * @param {*} next 
     */
    this.resolveInterceptor = function(options, callback) {
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