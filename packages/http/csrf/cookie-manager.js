import { isundefined, isnull } from '@jeli/helpers';

Service()
export class HttpCookieManager {
    constructor() {
        Object.defineProperty(this, 'cookies', {
            get: function() {
                return this._getAll();
            }
        });
    }

    /**
     *
     * @param {*} name
     * @param {*} value
     * @param {*} options
     */
    set(name, value, options) {
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
    }

    get(name) {
        return this.cookies[name];
    }

    _getAll() {
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
}
