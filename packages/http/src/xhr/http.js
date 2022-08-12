import { Subject, InterceptorResolver } from '@jeli/core';
import { inarray } from 'js-helpers/helpers';
import { HttpRequestError } from '../http.error';
import { HttpRequest } from '../http.request';
import { HttpResponse } from '../http.response';
import './utils';
import { HTTP_INTERCEPTORS } from './utils';

/**
 * 
 * @param {*} url 
 * @param {*} options 
 * @param {*} changeDetection 
 */
function CoreHttp(url, options, changeDetection) {
    var xhrPromise = new Subject();
    var httpRequest = new HttpRequest(url, options);
    var httpError = new HttpRequestError('');

    /**
     * $httpProvider Interceptor
     * Request Interceptor
     **/
    InterceptorResolver(HTTP_INTERCEPTORS, httpRequest)
        .then(function(request) {
            if (!request) {
                httpError.setMessage('HTTP: Interceptor should return a value');
                return xhrPromise.error(httpError);
            }

            /**
             * trigger change detection 
             */
            if (changeDetection) {
                changeDetection();
            }

            if (request.processData) {
                request.processRequest();
            }

            sendRequest();
        });

    /**
     * 
     * @param {*} readyState 
     */
    function respondToReadyState() {
        var response = new HttpResponse(httpRequest);
        if (httpRequest.xhrInstance.readyState == 4) {
            try {
                var data = parseJSON(httpRequest.xhrInstance.responseText);
                xhrPromise.next(data, response);
            } catch (e) {
                xhrPromise.error(httpError);
            }

            xhrPromise.completed();
            changeDetection();
        }
    }

    function attachListener() {
        httpRequest.xhrInstance.addEventListener('load', respondToReadyState);
        httpRequest.xhrInstanceaddEventListener('timeout', handleError);
        httpRequest.xhrInstance.addEventListener('error', handleError);
        httpRequest.xhrInstance.addEventListener('abort', handleError);

        function handleError(e) {
            httpError.setErrorType(e.type);
            xhrPromise.error(httpError);
        }
    }

    /**
     * set Request Headers
     */
    function sendRequest() {
        attachListener();
        httpRequest.xhrInstance.open(httpRequest.type, httpRequest.url, httpRequest.asynchronous);
        httpRequest.processRequestHeaders();
        var body = null;
        if (inarray(httpRequest.type, ['post', 'put', 'delete'])) {
            body = httpRequest.data;
        }

        //send the request
        try {
            httpRequest.xhrInstance.send(body);
        } catch (e) {
            httpError.setMessage(e);
            xhrPromise.error(httpError);
        }
    }

    return xhrPromise;
}