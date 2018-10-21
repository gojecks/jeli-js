/**
 * 
 * @param {*} url 
 * @param {*} options 
 */
function ajax(url, options) {
    var xhrPromise = (new $d),
        response = {},
        interceptor = $provider && $provider.$get('$httpProvider'),
        chain = {},
        _defaultHeader = ({
            'Accept': 'text/javascript, application/json, text/html, application/xml, text/xml, */*',
            'Content-Type': 'application/x-www-form-urlencoded'
        });

    if (typeof options === 'undefined' && $isObject(url)) {
        options = url;
    }

    options = options || {};
    options.headers = extend({}, _defaultHeader, options.headers);
    options.url = options.url || url;
    options.type = (options.type || 'GET').toLowerCase();
    options.asynchronous = options.asynchronous || true;
    options.data = options.data || '';
    var request = options.xhr || xhr();
    if (options.contentType) {
        options.headers['Content-Type'] = options.contentType;
    }

    /**
     * $httpProvider Interceptor
     * Request Interceptor
     **/
    if (interceptor) {
        options = interceptor.resolveInterceptor('request', options);
        if (!options) {
            throw new Error('$HTTP: Interceptor should return a value');
        }
    }

    /**
     * 
     * @param {*} readyState 
     */
    function respondToReadyState(readyState) {
        var data;
        if (request.readyState == 4) {
            response.contentType = options.dataType || request.mimeType || request.getResponseHeader('content-type') || '';
            response.status = request.status;
            chain.readyState = request.readyState;
            response.path = options.url;
            if (/json/.test(response.contentType)) {
                try {
                    data = JSON.parse(request.responseText);
                } catch (e) {
                    data = null;
                }

            } else if (/xml/.test(response.contentType)) {
                data = parseXML(request.responseText);
            } else {
                data = request.responseText;
            }

            response.success = (request.status >= 200 && request.status < 300) || request.status == 304 || (request.status == 0 && request.responseText);
            response.data = data;
            //intercept response
            if (interceptor) {
                interceptor
                    .resolveInterceptor(((response.success) ? 'responseSuccess' : 'responseError'), response);
            }

            if (options.callback) {
                return options.callback(response, request);
            }
            //resolve our response
            xhrPromise[((response.success) ? 'resolve' : 'reject')](response, request);

            //send the response header
            if (options.getResponseHeader) {
                options.getResponseHeader.apply(options.getResponseHeader, [getResponseHeaders]);
            }

        }
    }

    /**
     * @method getResponseHeaders
     * @param {*} name 
     */
    function getResponseHeaders(name) {
        if (!$isObject(name)) {
            return request.getResponseHeader(name)
        } else {
            for (var i in name) {
                name[i] = request.getResponseHeader(name[i]);
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

            request.setRequestHeader(name, options.headers[name]);
        }
    }

    /**
     * process Request
     */
    function processRequest() {
        //check if header requires withCredentials flag
        if (options.xhrFields && options.xhrFields.withCredentials) {
            //set the withCredentials Flag
            request.withCredentials = true;
        }

        /**
         * check register success and error handler
         */
        if (options.success) {
            xhrPromise.done(options.success);
        }

        if (options.error) {
            xhrPromise.fail(options.error);
        }

        if (!options.contentType) {
            options.headers['Content-Type'] = 'application/json';
        }


        if (typeof options.data !== 'string') {
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

        request.onreadystatechange = respondToReadyState;
        request.open(options.type, options.url, options.asynchronous);
        //handle before send
        //function recieves the XMLHTTPREQUEST
        if (options.beforeSend && $isFunction(options.beforeSend)) {
            options.beforeSend.apply(options.beforeSend, [request]);
        }

        setHeaders();
        //send the request
        try {
            var body = $inArray(options.type, ['post', 'put', 'delete']) ? options.data : null;
            request.send(body);
        } catch (e) {
            if (options.error) {
                options.error();
            }
        }
    }

    processRequest();


    /**
     * 
     * @param {*} done 
     * @param {*} fail 
     */
    xhrPromise.then = function(done, fail) {
        this.done(done);
        this.fail(fail);

        return this;
    };



    return xhrPromise;
}
/** End of Ajax**/