import { HttpInterceptor } from './http.interceptor';
import { ChangeDetector } from '@jeli/core';
import './xhr/http';
Service({
    DI: [HttpInterceptor, ChangeDetector]
})

export function HttpService(interceptor, changeDetector) {
    /**
     * factory to expose
     * @param {*} url 
     * @param {*} options 
     */
    function http(url, options) {
        return CoreHttp(url, options, interceptor, changeDetector);
    }

    /**
     * 
     * @param {*} type 
     */
    function generateOptionalHTTP(type) {
        http[type] = function(url, data, headers) {
            var options = {};
            options.type = type;
            options.data = data;
            options.headers = headers || {};
            return http(url, options);
        };
    }

    /**
     * create static methods
     */
    staticMethods.forEach(generateOptionalHTTP);

    return http;
}