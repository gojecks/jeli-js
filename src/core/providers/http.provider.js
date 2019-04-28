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

// register $http Provider
function HttpProvider() {
    var _interceptors = [],
        _resolved = ({
            request: [],
            responseError: [],
            responseSuccess: []
        }),
        _isRegistered = false;

    /**
     * 
     * @param {*} state 
     * @param {*} options 
     */
    this.resolveInterceptor = function(state, options) {
        if (!_isRegistered) {
            this.register();
            _isRegistered = true;
        }

        var _stateInterceptor = _resolved[state];
        if (_stateInterceptor.length) {
            _stateInterceptor.forEach(function(_intercept) {
                options = _intercept.apply(_intercept, [options]);
            });
        }

        return options;
    };

    //register all interceptors
    this.register = function() {
        //loop through all list of interceptors
        _interceptors.forEach(function(_intercept) {
            //get a factory interceptor
            if ($isString(_intercept)) {
                _intercept = DependencyInjectorService.get(_intercept);
            } else {
                // '$resolveHttpInterceptor', 
                _intercept = dependencyInjectorMain($inject(_intercept));
            }

            if ($isObject(_intercept)) {
                Object.keys(_intercept).forEach(function(_key) {
                    _resolved[_key].push(_intercept[_key]);
                });
            }
        });

        _isRegistered = true;
    };

    this.$get = function() {
        return ({
            interceptors: _interceptors
        });
    };
}