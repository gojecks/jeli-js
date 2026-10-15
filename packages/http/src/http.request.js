import { serialize } from '@jeli/helpers/utils';
import { isobject, isundefined, isstring } from '@jeli/helpers';

/**
 * unsafe http headers
 * will be use to validate headers passed to the httpservice layer
 */
// swappable so an opt-in alternate transport (e.g. FetchXHRAdapter, see
// ./fetch/fetch-xhr-adapter.js) can stand in for a real XMLHttpRequest -
// default stays real XHR, zero behavior change unless useFetchTransport()
// is explicitly called
var xhrFactory = function () { return new XMLHttpRequest(); };

export function setXhrFactory(factory) {
    xhrFactory = factory;
}

var unsafeHeaders = {
    'Accept-Charset': true,
    'Accept-Encoding': true,
    'Access-Control-Request-Headers': true,
    'Access-Control-Request-Method': true,
    'Connection': true,
    'Content-Length': true,
    'Cookie': true,
    'Cookie2': true,
    'Content-Transfer-Encoding': true,
    'Date': true,
    'DNT': true,
    'Expect': true,
    'Host': true,
    'Keep-Alive': true,
    'Origin': true,
    'Referer': true,
    'Set-Cookie': true,
    'TE': true,
    'Trailer': true,
    'Transfer-Encoding': true,
    'Upgrade': true,
    'User-Agent': true,
    'Via': true
};

export class HttpRequest {
    /**
     * creates a new instance of http request
     * @param {*} url
     * @param {*} options
     */
    constructor(url, options) {
        if (!options && isobject(url)) {
            options = url;
        }
        this.url = options.url || url;
        this.type = (options.type || 'GET').toLowerCase();
        this.processData = !isundefined(options.processData) ? options.processData : true;
        this.headers = Object.assign({
            'Accept': 'application/json',
            'CONTENT-TYPE': 'application/json'
        }, options.headers || {});
        this.asynchronous = !isundefined(options.asynchronous) ? options.asynchronous : true;
        this.data = options.data || '';
        this.xhrInstance = xhrFactory();
        this.cache = !isundefined(options.cache) ? options.cache : true;
        // opt-in, off by default (matches XHR's own default) - can also be
        // flipped by an interceptor via setWithCredentials() before send,
        // e.g. to attach cookies/auth on a cross-origin request
        this.withCredentials = !isundefined(options.withCredentials) ? options.withCredentials : false;
    }

    progress(progressCallback) {
        this.xhrInstance.addEventListener('progress', progressCallback, false);
    }

    /**
     *
     * @param {*} headers
     */
    setHeaders(headers) {
        Object.assign(this.headers, headers);
    }

    /**
     *
     * @param {*} flag
     */
    setWithCredentials(flag) {
        this.withCredentials = !!flag;
    }

    processRequest() {
        this.processData = false;
        if (!isstring(this.data)) {
            if (this.type === 'get') {
                this.data = serialize(this.data);
            } else {
                this.data = JSON.stringify(this.data);
            }
        }

        //Set the options data and cache
        if (this.type === 'get') {
            if (this.data) {
                this.url += ((/\?/).test(this.url) ? '&' : '?') + this.data;
            }

            if (!this.cache) {
                this.url += ((/\?/).test(this.url) ? '&' : '?') + '_=' + Date.now();
            }
        }
    }

    processRequestHeaders() {
        for (var name in this.headers) {
            if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
                throw new Error("Refused to set unsafe header \"" + name + "\"");
            }

            this.xhrInstance.setRequestHeader(name, this.headers[name]);
        }
    }
}
