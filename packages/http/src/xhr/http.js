import { Subject } from '@jeli/core';
import { isobject, isstring, inarray } from 'js-helpers/helpers';
import { extend, serialize } from 'js-helpers/utils';
import './utils';
import { HttpResponse } from './utils';

/**
 * 
 * @param {*} url 
 * @param {*} options 
 * @param {*} interceptor 
 * @param {*} changeDetection 
 */
function CoreHttp(url, options, interceptor, changeDetection) {
    var xhrPromise = new Subject();
    if (!options && isobject(url)) {
        options = url;
    }

    options = extend(true, defaultOptions, options);
    options.url = options.url || url;
    options.type = options.type.toLowerCase();
    var xhrInstance = xhr();

    /**
     * $httpProvider Interceptor
     * Request Interceptor
     **/
    interceptor.resolveInterceptor(options, function(request) {
        if (!request) {
            throw new Error('HTTP: Interceptor should return a value');
        }

        /**
         * trigger change detection 
         */
        if (changeDetection) {
            changeDetection();
        }

        if (options.processData) {
            processRequest();
        }

        sendRequest();
    });

    /**
     * 
     * @param {*} readyState 
     */
    function respondToReadyState(readyState) {
        var response = new HttpResponse(xhrInstance.status, xhrInstance.readyState, options.url);
        if (xhrInstance.readyState == 4) {
            try {
                response.data = parseJSON(xhrInstance.responseText, !!xhrInstance.responseText);
                response.success = (
                    (xhrInstance.status >= 200 && xhrInstance.status < 300) ||
                    xhrInstance.status == 304 ||
                    (xhrInstance.status == 0 && xhrInstance.responseText)
                );
                interceptor.resolveInterceptor(response, function(response) {
                    if (response instanceof HttpResponse) {

                    } else if (response instanceof HttpErrorResponse) {}
                });
            } catch (e) {
                xhrPromise.error(e);
            }

            xhrPromise.completed();
        }
    }

    /**
     * @method getResponseHeaders
     * @param {*} name 
     */
    function getResponseHeaders(name) {
        if (!isobject(name)) {
            return xhrInstance.getResponseHeader(name);
        } else {
            for (var i in name) {
                name[i] = xhrInstance.getResponseHeader(name[i]);
            }

            return name;
        }
    }

    /**
     * set Request Headers
     */
    function setHeaders() {
        for (var name in options.headers) {
            if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
                throw new Error("Refused to set unsafe header \"" + name + "\"");
            }

            xhrInstance.setRequestHeader(name, options.headers[name]);
        }
    }

    /**
     * process Request
     */
    function processRequest() {
        //check if header requires withCredentials flag
        if (options.xhrFields && options.xhrFields.withCredentials) {
            //set the withCredentials Flag
            xhrInstance.withCredentials = true;
        }

        if (!options.headers['Content-Type'] && options.data) {
            options.headers['Content-Type'] = 'application/json';
        }


        if (!isstring(options.data)) {
            switch (options.type) {
                case ("get"):
                    options.data = serialize(options.data);
                    break;
                default:
                    options.data = JSON.stringify(options.data);
                    break;
            }
        }

        //Set the options data and cache
        if (options.type === 'get') {
            if (options.data) {
                options.url += ((/\?/).test(options.url) ? '&' : '?') + options.data;
            }

            if (!options.cache) {
                options.url += ((/\?/).test(options.url) ? '&' : '?') + '_=' + (new Date()).getTime();
            }
        }
    }

    function sendRequest() {
        xhrInstance.onreadystatechange = respondToReadyState;
        xhrInstance.open(options.type, options.url, options.asynchronous);
        /**
         * handle before send
         * function recieves the XMLHTTPREQUEST
         */
        if (options.beforeSend && isfunction(options.beforeSend)) {
            options.beforeSend.apply(options.beforeSend, [xhrInstance]);
        }

        setHeaders();
        var body = null;
        if (inarray(options.type, ['post', 'put', 'delete'])) {
            body = options.data;
        }

        //send the request
        try {
            xhrInstance.send(body);
        } catch (e) {
            triggerError(e);
        }
    }

    return xhrPromise;
}