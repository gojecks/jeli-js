import { isundefined, isnull } from 'js-helpers/helpers';

Service()
    /**
     * 
     * @param {*} name 
     * @param {*} value 
     * @param {*} options 
     */
export function HttpCookieManager() {
    Object.defineProperty(this, 'cookies', {
        get: function() {
            return this._getAll();
        }
    });
};

/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} options 
 */
HttpCookieManager.prototype.set = function(name, value, options) {
    if (!isnull(value) && !isundefined(value)) {
        if (value === null) {
            value = "";
            options.expires = -1;
        }

        var expires = "";
        var isNumberExpires = typeof options.expires === 'number';
        if (options.expires && (isNumberExpires || options.expires.toUTCString)) {
            var date;
            if (isNumberExpires) {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000))
            } else {
                date = options.expires
            }
            expires = "; expires=" + date.toUTCString()
        }
        var path = options.path ? "; path=" + (options.path) : "";
        var domain = options.domain ? "; domain=" + (options.domain) : "";
        var secure = options.secure ? "; secure" : "";
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("")
    }
};

HttpCookieManager.prototype.get = function(name) {
    return this.cookies[name];
}

HttpCookieManager.prototype._getAll = function() {
    var cookieValues = {};
    var cookies = (document.cookie || '').split(";");
    if (cookies.length) {
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim().split("=");
            cookieValues[cookie[0]] = cookie[1];
        }
    }

    return cookieValues;
}