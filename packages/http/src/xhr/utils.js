var defaultOptions = {
    url: "",
    type: 'GET',
    processData: true,
    headers: {
        'Accept': 'text/javascript, application/json, text/html, application/xml, text/xml, */*'
    },
    asynchronous: true,
    data: '',
    xhr: null,
    getResponseHeader: null,
    cache: true
};

var staticMethods = ['put', 'get', 'post', 'request', 'head', 'patch', 'delete'];

/**
 * unsafe http headers
 * will be use to validate headers passed to the httpservice layer
 */
export var unsafeHeaders = {
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
 * @method xhr()
 * Generate an XHR request instance
 */
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

/**
 * 
 * @param {*} text 
 */
function parseXML(text) {
    if (!!window.DOMParser) {
        return new DOMParser().parseFromString(text, 'text/xml');
    } else {
        var xml = new ActiveXObject('Microsoft.XMLDOM');
        xml.async = 'false';
        xml.loadXML(text);
        return xml;
    }
}

/**
 * 
 * @param {*} string 
 * @param {*} tError 
 */
function parseJSON(string, tError) {
    var content;
    try {
        content = JSON.parse(string);
    } catch (e) {
        if (tError) {
            throw new Error(e);
        } else {
            content = string;
        }
    }

    return content
}

/**
 * Core HttpResponse
 * @param {*} response 
 */
export function HttpResponse(status, readyState, url) {
    this.status = status;
    this.readyState = readyState;
    this.url = url;
    this.data = null;
    this.success = false;
}