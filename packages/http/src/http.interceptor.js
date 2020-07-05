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
    DI: ['interceptors:Token?'],
})

/**
 * 
 * @param {*} interceptors 
 */
export function HttpInterceptor(interceptors) {
    /**
     * 
     * @param {*} state 
     * @param {*} options 
     */
    this.resolveInterceptor = function(state, options) {
        if (interceptors.length) {
            interceptors.forEach(function(interceptorInstance) {
                options = interceptorInstance[state].apply(interceptorInstance, [options]);
            });
        }

        return options;
    };

    //register all interceptors
    this.register = function() {
        //loop through all list of interceptors
        interceptors = interceptors.map(function(interceptorFactory) {
            //get a factory interceptor
            if ($isString(interceptorFactory)) {
                return DependencyInjectorService.get(interceptorFactory);
            } else {
                return DependencyInjectorService.inject(interceptorFactory);
            }
        });
    };
}