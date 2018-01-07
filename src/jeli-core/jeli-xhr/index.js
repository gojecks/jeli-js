/*@Function $httpProvider
@Interceptor : returns promise object*/
function xhr() {
    if (typeof XMLHttpRequest !== 'undefined' && (!window.ActiveXObject)) {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.6.0');
        } catch (e) {}
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
        } catch (e) {}
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {}
    }
    return false;
}

var unsafeHeaders = {
    'Accept-Charset': true,
    'Accept-Encoding': true,
    'Connection': true,
    'Content-Length': true,
    'Cookie': true,
    'Cookie2': true,
    'Content-Transfer-Encoding': true,
    'Date': true,
    'Expect': true,
    'Host': true,
    'Keep-Alive': true,
    'Referer': true,
    'TE': true,
    'Trailer': true,
    'Transfer-Encoding': true,
    'Upgrade': true,
    'User-Agent': true,
    'Via': true
};

//@Function Ajax
function ajax(url, options) {
    var request = xhr(),
        xhrPromise = new $d,
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
    options.type = options.type ? options.type.toLowerCase() : 'get';
    options.asynchronous = options.asynchronous || true;
    options.data = options.data || '';

    if (options.contentType) {
        options.headers['Content-Type'] = options.contentType;
    }

    //$httpProvider Interceptor
    //Request Interceptor
    if (interceptor) {
        interceptor.resolveInterceptor('request', {
                headers: options.headers,
                url: options.url,
                type: options.type
            })
            .then(function(_opts) {
                options = extend({}, options, _opts);
            });
    }


    //Successful Request
    function successfulRequest(request) {
        return (request.status >= 200 && request.status < 300) || request.status == 304 || (request.status == 0 && request.responseText);
    }

    function respondToReadyState(readyState) {
        var data;
        if (request.readyState == 4) {
            var contentType = response.contentType = request.mimeType || request.getResponseHeader('content-type') || '';
            response.status = request.status;
            chain.readyState = request.readyState;
            response.path = options.url;
            if (/json/.test(options.dataType || response.contentType)) {
                try {
                    data = JSON.parse(request.responseText);
                } catch (e) {
                    data = null;
                }

            } else if (/xml/.test(options.dataType || response.contentType)) {
                data = parseXML(request.responseText);
            } else {
                data = request.responseText;
            }

            response.success = successfulRequest(request);
            if (options.callback) {
                return options.callback(response, request);
            }

            response.data = data;

            //intercept response
            if (interceptor) {
                interceptor
                    .resolveInterceptor(((response.success) ? 'responseSuccess' : 'responseError'), response);
            }

            //resolve our response
            xhrPromise[((response.success) ? 'resolve' : 'reject')](response, request);

            //send the response header
            if (options.getResponseHeader) {
                options.getResponseHeader.apply(options.getResponseHeader, [getResponseHeaders]);
            }

        }
    }

    //getResponseHeaders
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



    function setHeaders() {
        for (var name in options.headers) {
            if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
                throw new Error("Refused to set unsafe header \"" + name + "\"");
            }

            request.setRequestHeader(name, options.headers[name]);
        }
    }

    if (!$isString(options.data)) {
        switch (options.type) {
            case ("get"):
                options.data = serialize(options.data);
                break;
            default:
                options.data = JSON.stringify(options.data);
                if (!options.contentType) {
                    options.headers['Content-Type'] = 'application/json';
                }
                break;
        }

    }

    //Set the options data and cache
    if (options.type === 'get') {
        if (options.data) {
            options.url += ((/\?/).test(options.url) ? '&' : '?') + options.data;
        }

        if (!$isUndefined(options.cache) && !options.cache) {
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


    function send() {
        try {
            var body = $inArray(options.type, ['post', 'put', 'delete']) ? options.data : null;
            request.send(body);
        } catch (e) {
            if (options.error) {
                options.error();
            }
        }
    }

    //set the headers
    setHeaders();
    //send the request
    send();

    /**
     * 
     * @param {*} callback 
     */
    xhrPromise.end = function(callback) {
        //write callback function
        //only when options.callback is not defined
        if (!options.callback && callback) {
            options.callback = callback;
        }

        //resend our request
        send();
        return this;
    };

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

//setup $httpProvider
function $http(url, options) {
    return ajax.apply(ajax, arguments);
}

$http.put = generateOptionalHTTP('PUT');
$http.get = generateOptionalHTTP('GET');
$http.post = generateOptionalHTTP('POST');
$http['delete'] = generateOptionalHTTP('DELETE');


function generateOptionalHTTP(type) {
    return function(url, data, headers) {
        var options = {};
        options.type = type;
        options.data = data;
        options.headers = headers || {};

        return ajax(url, options);
    };
}