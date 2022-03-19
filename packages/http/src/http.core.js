import { ChangeDetector } from '@jeli/core';
import './xhr/http';

var staticMethods = ['put', 'get', 'post', 'request', 'patch', 'delete'];

Service({
    DI: [ChangeDetector]
})

export function HttpService(changeDetector) {
    /**
     * factory to expose
     * @param {*} url 
     * @param {*} options 
     */
    function http(url, options) {
        return CoreHttp(url, options, changeDetector);
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