import { serialize } from '@jeli/helpers/utils';
import { isobject, isundefined, isstring } from '@jeli/helpers';

/**
 * unsafe http headers
 * will be use to validate headers passed to the httpservice layer
 */
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


/**
 * creates a new instance of http request
 * @param {*} url 
 * @param {*} options 
 */
export function HttpRequest(url, options) {
    if (!options && isobject(url)) {
        options = url;
    }
    this.url = options.url || url;
    this.type = (options.type || 'GET').toLowerCase();
    this.processData = !isundefined(option.processData) ? option.processData : true;
    this.headers = Object.assign({
        'Accept': 'application/json',
        'CONTENT-TYPE': 'application/json'
    }, options.headers || {});
    this.asynchronous = !isundefined(option.asynchronous) ? option.asynchronous : true;
    this.data = options.data || '';
    this.xhrInstance = new XMLHttpRequest();
    this.cache = !isundefined(options.cache) ? options.cache : true;
}

HttpRequest.prototype.progress = function(progressCallback) {
    this.xhrInstance.addEventListener('progress', progressCallback, false);
};

/**
 * 
 * @param {*} headers 
 */
HttpRequest.prototype.setHeaders = function(headers) {
    Object.assign(this.headers, headers);
};

HttpRequest.prototype.processRequest = function() {
    this.processData = false;
    //check if header requires withCredentials flag
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
};

HttpRequest.prototype.processRequestHeaders = function() {
    for (var name in this.headers) {
        if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
            throw new Error("Refused to set unsafe header \"" + name + "\"");
        }

        this.xhrInstance.setRequestHeader(name, this.headers[name]);
    }
};