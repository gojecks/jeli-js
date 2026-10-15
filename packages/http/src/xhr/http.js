import { Subject, InterceptorResolver } from '@jeli/core';
import { inarray } from '@jeli/helpers';
import { HttpRequestError } from '../http.error';
import { HttpRequest } from '../http.request';
import { HttpResponse } from '../http.response';
import { HTTP_INTERCEPTORS, parseJSON, isJSONResponse } from './utils';

class HttpTransport {
    /**
     * @param {*} url
     * @param {*} options
     * @param {*} changeDetection
     */
    constructor(url, options, changeDetection) {
        this.xhrPromise = new Subject();
        this.httpRequest = new HttpRequest(url, options);
        this.httpError = new HttpRequestError('');
        this.changeDetection = changeDetection;

        /**
         * $httpProvider Interceptor
         * Request Interceptor
         **/
        InterceptorResolver(HTTP_INTERCEPTORS, this.httpRequest)
            .then((request) => this.onInterceptorsResolved(request));
    }

    onInterceptorsResolved(request) {
        if (!request) {
            this.httpError.setMessage('HTTP: Interceptor should return a value');
            return this.xhrPromise.error(this.httpError);
        }

        /**
         * trigger change detection
         */
        if (this.changeDetection) {
            this.changeDetection();
        }

        if (request.processData) {
            request.processRequest();
        }

        this.sendRequest();
    }

    respondToReadyState() {
        var response = new HttpResponse(this.httpRequest);
        if (this.httpRequest.xhrInstance.readyState == 4) {
            try {
                var responseText = this.httpRequest.xhrInstance.responseText;
                var data = isJSONResponse(this.httpRequest.xhrInstance) ? parseJSON(responseText) : responseText;
                this.xhrPromise.next(data, response);
            } catch (e) {
                this.xhrPromise.error(this.httpError);
            }

            this.xhrPromise.completed();
            this.changeDetection();
        }
    }

    handleError(e) {
        this.httpError.setErrorType(e.type);
        this.xhrPromise.error(this.httpError);
    }

    attachListener() {
        var xhrInstance = this.httpRequest.xhrInstance;
        xhrInstance.addEventListener('load', () => this.respondToReadyState());
        xhrInstance.addEventListener('timeout', (e) => this.handleError(e));
        xhrInstance.addEventListener('error', (e) => this.handleError(e));
        xhrInstance.addEventListener('abort', (e) => this.handleError(e));
    }

    /**
     * set Request Headers
     */
    sendRequest() {
        this.attachListener();
        var xhrInstance = this.httpRequest.xhrInstance;
        xhrInstance.open(this.httpRequest.type, this.httpRequest.url, this.httpRequest.asynchronous);
        // must be set after open() and before send() - throws InvalidStateError otherwise
        xhrInstance.withCredentials = this.httpRequest.withCredentials;
        this.httpRequest.processRequestHeaders();

        var body = null;
        if (inarray(this.httpRequest.type, ['post', 'put', 'delete'])) {
            body = this.httpRequest.data;
        }

        //send the request
        try {
            xhrInstance.send(body);
        } catch (e) {
            this.httpError.setMessage(e);
            this.xhrPromise.error(this.httpError);
        }
    }
}

/**
 *
 * @param {*} url
 * @param {*} options
 * @param {*} changeDetection
 */
export function CoreHttp(url, options, changeDetection) {
    return new HttpTransport(url, options, changeDetection).xhrPromise;
}
