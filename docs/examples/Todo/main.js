!function(factory, __required) {
    'use strict';
    /** trigged factory **/ 
    factory(__required);
}(function(__required) {
    var core = __required(1153);
var bootStrapApplication = core.bootStrapApplication;
var AppModule = __required(1165, 'AppModule');
bootStrapApplication(AppModule);
}, (function(modules,  self) { 
    'use strict';
    var OD = Object.defineProperty,
    installedModules = {},
    dep_name = 'jeli_chunk_loaded',
    buildArgs = {"hasStyles":true},
    pendingLazyLoad = [];
    OD(self, dep_name, {
        set: function(value) {
            Object.assign(modules, value || {});
        }
    });

    function __required(moduleId, property) {
        'use strict';
        if (!installedModules.hasOwnProperty(moduleId)){
            /** create a new ref **/ 
            installedModules[moduleId] = { exports: true };
            try {
                modules[moduleId](installedModules[moduleId], installedModules[moduleId], __required, self);
            } catch (e) {}
        }

        return property ? installedModules[moduleId][property] : installedModules[moduleId];
    }

    function loadScript(mid){
        var scriptElement = document.createElement('script');
        var path = [buildArgs.deployURL || '', mid, ".js"].join('')
        scriptElement.src = path;
        scriptElement.type = "module";
        scriptElement.async = true;
        scriptElement.charset = "utf-8",
        scriptElement.timeout = 120,
        (document.getElementsByTagName('head')[0]).appendChild(scriptElement);
        if (0 > scriptElement.src.indexOf(window.location.origin + "/")) {
            scriptElement.crossOrigin = "use-credentials"
        }
        return scriptElement;
    }

    __required.r = function(context, name, value) {
        if (!context.hasOwnProperty(name)) {
            OD(context, name, {
                get: value,
                configurable: false,
                enumerable: true
            });
        }
    };

    __required.l = function(mid) {
        return new Promise(function(resolve, reject){
            if (pendingLazyLoad.includes(mid)) return;
            if (installedModules[mid]) {
                resolve(installedModules[mid]);
            } else {
                pendingLazyLoad.push(mid);
                var scriptElement = loadScript(mid);
                scriptElement.onreadystatechange = scriptElement.onload = scriptElement.onerror  = function() {
                    var state = scriptElement.readyState;
                    if ((!state || /loaded|complete/.test(state))) {
                        resolve(__required(mid));
                        pendingLazyLoad.splice(pendingLazyLoad.indexOf(mid), 1);
                    }
                    scriptElement.parentNode.removeChild(scriptElement);
                };
            }
        });
    };

    return __required;
})( /** JELI DEPENDECY HUB **/ {1115 : (module, exports, __required, global) => {
"use strict";
exports.default = function (str) {
    return typeof str === 'string' && new String(str) instanceof String;
}
},
1116 : (module, exports, __required, global) => {
"use strict";
exports.default = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
},
1117 : (module, exports, __required, global) => {
"use strict";
var isarray = __required(1116, 'default');
var isstring = __required(1115, 'default');
exports.default = function (needle, haystack) {
    return (isstring(haystack) || isarray(haystack)) && haystack.indexOf(needle) > -1;
}
},
1118 : (module, exports, __required, global) => {
"use strict";
exports.default = function (bool) {
    return Object.prototype.toString.call(bool) === '[object Boolean]';
}
},
1119 : (module, exports, __required, global) => {
"use strict";
exports.default = function (val) {
    return typeof val !== 'undefined';
}
},
1120 : (module, exports, __required, global) => {
"use strict";
exports.default = function (n) {
    return parseFloat(n) > 0;
}
},
1121 : (module, exports, __required, global) => {
"use strict";
exports.default = function (val) {
    if (val && typeof val === 'object') {
        return Object.values(val).length < 1;
    }
    return !val || val === '';
}
},
1122 : (module, exports, __required, global) => {
"use strict";
exports.default = equal;
function equal(a, b) {
    if (a === b)
        return true;
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        if (a.constructor !== b.constructor || a !== b)
            return false;
        var length, i, keys;
        if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
                return false;
            for (i = length; i-- !== 0;)
                if (!equal(a[i], b[i]))
                    return false;
            return true;
        }
        if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length)
            return false;
        for (i = length; i-- !== 0;) {
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
                return false;
        }
        for (i = length; i-- !== 0;) {
            var key = keys[i];
            if (!equal(a[key], b[key]))
                return false;
        }
        return true;
    }
    return a !== a && b !== b;
}
;
},
1123 : (module, exports, __required, global) => {
"use strict";
exports.default = function (n) {
    return Number(n) === n && n % 1 !== 0;
}
},
1124 : (module, exports, __required, global) => {
"use strict";
exports.default = function (fn) {
    return typeof fn === 'function';
}
},
1125 : (module, exports, __required, global) => {
"use strict";
exports.default = function (str) {
    return str && typeof str === 'string' && '{['.indexOf(str.charAt(0)) > -1 && '}]'.indexOf(str.charAt(str.length - 1)) > -1;
}
},
1126 : (module, exports, __required, global) => {
"use strict";
exports.default = function (val) {
    return null === val;
}
},
1127 : (module, exports, __required, global) => {
"use strict";
exports.default = function (n) {
    return Number(n) === n && n % 1 === 0;
}
},
1128 : (module, exports, __required, global) => {
"use strict";
exports.default = function (obj) {
    return typeof obj === 'object' && obj instanceof Object && Object.prototype.toString.call(obj) === '[object Object]';
}
;
},
1129 : (module, exports, __required, global) => {
"use strict";
exports.default = function (val) {
    return typeof val === 'undefined';
}
},
1130 : (module, exports, __required, global) => {
"use strict";
exports.default = function (list, item, index) {
    if (index >= list.length) {
        list.push(item);
    } else {
        list.splice(index, 0, item);
    }
}
},
1131 : (module, exports, __required, global) => {
"use strict";
exports.default = function (list, index) {
    if (index >= list.length - 1) {
        return list.pop();
    } else {
        return list.splice(index, 1)[0];
    }
}
},
1132 : (module, exports, __required, global) => {
"use strict";

exports.removeFromArray = __required(1131, 'default');
exports.addToArray = __required(1130, 'default');
exports.isundefined = __required(1129, 'default');
exports.isstring = __required(1115, 'default');
exports.isobject = __required(1128, 'default');
exports.isnumber = __required(1127, 'default');
exports.isnull = __required(1126, 'default');
exports.isjsonstring = __required(1125, 'default');
exports.isfunction = __required(1124, 'default');
exports.isfloat = __required(1123, 'default');
exports.isequal = __required(1122, 'default');
exports.isempty = __required(1121, 'default');
exports.isdouble = __required(1120, 'default');
exports.isdefined = __required(1119, 'default');
exports.isboolean = __required(1118, 'default');
exports.isarray = __required(1116, 'default');
exports.inarray = __required(1117, 'default');
},
1133 : (module, exports, __required, global) => {
"use strict";
exports.default = function () {
    return {
        encode: function (str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        },
        decode: function (str) {
            return decodeURIComponent(Array.prototype.map.call(atob(str), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    };
}
},
1134 : (module, exports, __required, global) => {
"use strict";
exports.default = function (str) {
    return str(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (p2) {
            return p2.toUpperCase();
        }
        return p1.toLowerCase();
    });
}
},
1135 : (module, exports, __required, global) => {
"use strict";
var camelCase = __required(1134, 'default');
exports.default = function (str) {
    return str.charAt(0).toUpperCase() + camelCase(str.substring(1));
}
},
1136 : (module, exports, __required, global) => {
"use strict";
exports.default = function (str) {
    return str.split('').map(function (char, idx) {
        if (/[A-Z]/.test(char)) {
            return '-' != str[idx - 1] ? '-' + char.toLowerCase() : char.toLowerCase();
        }
        return char;
    }).join('');
}
;
},
1137 : (module, exports, __required, global) => {
"use strict";
exports.default = function (name, value) {
    if (typeof value != 'undefined') {
        setCookie.apply(null, arguments);
    } else {
        return getCookie(name);
    }
}
;
function setCookie(name, value, options) {
    options = options || {};
    if (value === null) {
        value = '';
        options.expires = -1;
    }
    var expires = '', isNumberExpires = typeof options.expires === 'number';
    if (options.expires && (isNumberExpires || options.expires.toUTCString)) {
        var date;
        if (isNumberExpires) {
            date = new Date();
            date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        } else {
            date = options.expires;
        }
        expires = '; expires=' + date.toUTCString();
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var secure = options.secure ? '; secure' : '';
    document.cookie = [
        name,
        '=',
        encodeURIComponent(value),
        expires,
        path,
        domain,
        secure
    ].join('');
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) == name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
},
1138 : (module, exports, __required, global) => {
"use strict";
exports.default = extend;
function extend() {
    var extended = {};
    var deep = typeof arguments[0] === 'boolean';
    var i = 0;
    var length = arguments.length;
    if (deep) {
        i++;
        deep = arguments[0];
    }
    if (!deep && Object.assign) {
        return Object.assign.apply(Object, arguments);
    }
    if (Object.prototype.toString.call(arguments[i]) === '[object Array]') {
        extended = Array(arguments[i].length);
    }
    var merger = function (source) {
        for (var name in source) {
            if (source.hasOwnProperty(name)) {
                if (deep && (source[name] && typeof source[name] === 'object') && !Object.keys(source[name]).length) {
                    extended[name] = extend(true, extended[name], source[name]);
                } else {
                    extended[name] = source[name];
                }
            }
        }
    };
    for (; i < length; i++) {
        merger(arguments[i]);
    }
    return extended;
}
},
1139 : (module, exports, __required, global) => {
"use strict";
var extend = __required(1138, 'default');
exports.default = function (item, deep) {
    var type = {};
    if (Object.prototype.toString.call(item) === '[object Array]') {
        type = [];
    }
    if (item && item.nodeType)
        return item.cloneNode(true);
    if (typeof item === 'object' && !deep)
        return item;
    if (item instanceof Date)
        return new Date(item.getTime());
    if (item instanceof RegExp)
        return new RegExp(item);
    if (typeof item !== 'object')
        return item;
    if (deep) {
        var ret;
        try {
            ret = JSON.parse(JSON.stringify(item));
        } catch (e) {
            ret = extend(true, item);
        }
        return ret;
    }
    return extend(type, item);
}
},
1140 : (module, exports, __required, global) => {
"use strict";
exports.default = copyFrom;
function copyFrom(to, from) {
    for (var key in to) {
        if (from.hasOwnProperty(key)) {
            if (typeof to[key] === 'object') {
                to[key] = copyFrom(to[key], from[key]);
            } else {
                to[key] = from[key];
            }
        }
    }
    return to;
}
},
1141 : (module, exports, __required, global) => {
"use strict";
exports.default = function (obj) {
    return Object.keys(obj).length;
}
},
1142 : (module, exports, __required, global) => {
"use strict";
var isobject = __required(1128, 'default');
exports.default = function (objToInspect) {
    var isObject = isobject(objToInspect);
    function contains(ins) {
        if (isObject) {
            return objToInspect.hasOwnProperty(ins) || ins in objToInspect;
        } else {
            return objToInspect.indexOf(ins) > -1;
        }
    }
    function search(str, iteratorFn) {
        if (!objToInspect) {
            return false;
        }
        var found = false, len = 0, trigger = function (prop) {
                if (iteratorFn && typeof iteratorFn === 'function') {
                    if (iteratorFn(objToInspect[prop], prop, len)) {
                        found = objToInspect[prop];
                    }
                } else {
                    if (JSON.stringify(objToInspect[prop]) === JSON.stringify(str)) {
                        found = objToInspect[len];
                    }
                }
                len++;
            };
        if (isObject) {
            var ObjKeys = Object.keys(objToInspect);
            while (ObjKeys.length > len) {
                trigger(ObjKeys[len]);
            }
            ObjKeys = null;
        } else {
            while (objToInspect.length > len) {
                trigger(len);
            }
            ;
        }
        return found;
    }
    function each(iterator) {
        this.search(null, iterator);
    }
    return {
        search: search,
        contains: contains,
        each: each
    };
}
},
1143 : (module, exports, __required, global) => {
"use strict";
exports.default = function (code) {
    var hash = 0, i, chr, len;
    if (!code || code.length === 0)
        return hash;
    for (i = 0, len = code.length; i < len; i++) {
        chr = code.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}
},
1144 : (module, exports, __required, global) => {
"use strict";
exports.default = logger;
var logLevels = {
    DEBUG: 4,
    LOG: 3,
    INFO: 2,
    WARN: 1,
    ERROR: 0
};
var logger = {
    _log: function logger(mockOptions, args, level) {
        var loggerLevel = 2;
        var logLevelMethods = [
            'error',
            'warn',
            'info',
            'log',
            'debug'
        ];
        if (mockOptions && typeof mockOptions.logging !== 'undefined') {
            loggerLevel = mockOptions.logging;
        }
        level = level === 0 ? level : level || logLevels.LOG;
        args = args.splice ? args : [args];
        if (loggerLevel === false || loggerLevel < level) {
            return;
        }
        if (mockOptions.log) {
            return mockOptions.log(args[1] || args[0]);
        } else if (mockOptions.logger && mockOptions.logger[logLevelMethods[level]]) {
            return mockOptions.logger[logLevelMethods[level]].apply(mockOptions.logger, args);
        }
    },
    debug: function (m, a) {
        return this._log(m, a, logLevels.DEBUG);
    },
    log: function (m, a) {
        return this._log(m, a, logLevels.LOG);
    },
    info: function (m, a) {
        return this._log(m, a, logLevels.INFO);
    },
    warn: function (m, a) {
        return this._log(m, a, logLevels.WARN);
    },
    error: function (m, a) {
        return this._log(m, a, logLevels.ERROR);
    }
};
},
1145 : (module, exports, __required, global) => {
"use strict";
exports.default = function (e) {
    var uid = '';
    var f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var g = 0; g < e; g++) {
        uid += f.charAt(Math.floor(Math.random() * f.length));
    }
    return uid;
}
},
1146 : (module, exports, __required, global) => {
"use strict";
exports.default = function (arr) {
    return arr.reduce(function (all, item, index) {
        if (arr.indexOf(arr[index]) === index) {
            all.push(item);
        }
        return all;
    }, []);
}
},
1147 : (module, exports, __required, global) => {
"use strict";
var isFunction = __required(1124, 'default');
var isObject = __required(1128, 'default');
var isArray = __required(1116, 'default');
exports.default = serialize;
function serialize(obj) {
    if (!obj)
        return;
    var param = [];
    function buildParams(prefix, dn) {
        if (isArray(dn)) {
            dn.forEach(function (n) {
                if (/\[\]$/.test(prefix)) {
                    add(prefix, n);
                } else {
                    buildParams(prefix + '[' + (isObject(n) ? prefix : '') + ']', n);
                }
            });
        } else if (isObject(dn)) {
            for (var name in dn) {
                buildParams(prefix + '[' + name + ']', dn[name]);
            }
        } else {
            add(prefix, dn);
        }
    }
    function add(key, value) {
        value = isFunction(value) ? value() : value === '' ? '' : value;
        param[param.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    ;
    return Object.keys(obj).map(function (key) {
        return buildParams(key, obj[key]);
    }).join('&').replace(/%20/g, '+');
}
},
1148 : (module, exports, __required, global) => {
"use strict";
exports.default = function (str, regexp) {
    return (str || '').split(regexp).map(function (val) {
        return val.trim();
    });
}
},
1149 : (module, exports, __required, global) => {
"use strict";
exports.default = function (str, replacerObj) {
    var newObj;
    var splitedStr = str.match(new RegExp('\\' + str.charAt(0) + '(.*?)' + '\\' + str.charAt(str.length - 1)));
    var newObj = '{' === str.charAt(0) ? {} : [];
    splitedStr = (splitedStr && splitedStr[1] || '').split(',');
    replacerObj = replacerObj || {};
    for (var j in splitedStr) {
        var xSplitedStr = splitedStr[j].split(':');
        newObj[xSplitedStr.shift()] = replacerObj[xSplitedStr.join(':')] || xSplitedStr.pop();
    }
    return newObj;
}
},
1150 : (module, exports, __required, global) => {
"use strict";
exports.default = function (par) {
    if (!par || typeof par !== 'string')
        return {};
    return par.split('&').reduce(function (accum, val) {
        if (val) {
            var splitPairs = val.split('=');
            accum[splitPairs[0]] = splitPairs[1] ? parseJSON(splitPairs[1]) : splitPairs[1];
        }
        return accum;
    }, {});
    function parseJSON(str) {
        try {
            str = JSON.parse(str);
        } catch (e) {
        }
        return str;
    }
}
},
1151 : (module, exports, __required, global) => {
"use strict";
exports.default = function ($boolValue) {
    return {
        'true': true,
        '1': true,
        'on': true,
        'yes': true,
        'false': false,
        '0': false,
        'off': false,
        'no': false,
        'null': null,
        'undefined': undefined
    }[$boolValue];
}
},
1152 : (module, exports, __required, global) => {
"use strict";

exports.simpleBooleanParser = __required(1151, 'default');
exports.kebabCase = __required(1136, 'default');
exports.pascalCase = __required(1135, 'default');
exports.camelcase = __required(1134, 'default');
exports.unserialize = __required(1150, 'default');
exports.toobject = __required(1149, 'default');
exports.splitntrim = __required(1148, 'default');
exports.serialize = __required(1147, 'default');
exports.nodubs = __required(1146, 'default');
exports.makeuid = __required(1145, 'default');
exports.logger = __required(1144, 'default');
exports.hashcode = __required(1143, 'default');
exports.extend = __required(1138, 'default');
exports.expect = __required(1142, 'default');
exports.count = __required(1141, 'default');
exports.copyfrom = __required(1140, 'default');
exports.copy = __required(1139, 'default');
exports.cookie = __required(1137, 'default');
exports.base64 = __required(1133, 'default');
},
1153 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'LazyLoader', () => { return LazyLoader;});
__required.r(exports, 'InterceptorResolver', () => { return InterceptorResolver;});
__required.r(exports, 'IterableProfiler', () => { return IterableProfiler;});
__required.r(exports, 'ComponentFactoryResolver', () => { return ComponentFactoryResolver;});
__required.r(exports, 'rxInterval', () => { return rxInterval;});
__required.r(exports, 'rxTimeout', () => { return rxTimeout;});
__required.r(exports, 'rxWhile', () => { return rxWhile;});
__required.r(exports, 'rxDebounceTime', () => { return rxDebounceTime;});
__required.r(exports, 'debounce', () => { return debounce;});
__required.r(exports, 'EventManager', () => { return EventManager;});
__required.r(exports, 'Promise2', () => { return Promise2;});
__required.r(exports, 'EventEmitter', () => { return EventEmitter;});
__required.r(exports, 'StateManager', () => { return StateManager;});
__required.r(exports, 'interpolationHelper', () => { return interpolationHelper;});
__required.r(exports, 'CustomEventHandler', () => { return CustomEventHandler;});
__required.r(exports, 'TextNodeRef', () => { return TextNodeRef;});
__required.r(exports, 'ViewRef', () => { return ViewRef;});
__required.r(exports, 'AbstractObserver', () => { return AbstractObserver;});
__required.r(exports, 'Observable', () => { return Observable;});
__required.r(exports, 'Subscription', () => { return Subscription;});
__required.r(exports, 'SubscriptionStates', () => { return SubscriptionStates;});
__required.r(exports, 'Subject', () => { return Subject;});
__required.r(exports, 'QueryList', () => { return QueryList;});
__required.r(exports, 'ElementClassList', () => { return ElementClassList;});
__required.r(exports, 'ElementStyle', () => { return ElementStyle;});
__required.r(exports, 'AttributeAppender', () => { return AttributeAppender;});
__required.r(exports, 'DOMHelper', () => { return DOMHelper;});
__required.r(exports, 'ObserveUntilDestroyed', () => { return ObserveUntilDestroyed;});
__required.r(exports, 'elementMutationObserver', () => { return elementMutationObserver;});
__required.r(exports, 'sce', () => { return sce;});
__required.r(exports, 'scheduler', () => { return scheduler;});
__required.r(exports, 'ViewParser', () => { return ViewParser;});
__required.r(exports, 'ElementRef', () => { return ElementRef;});
__required.r(exports, 'bootstrapFromDOM', () => { return bootstrapFromDOM;});
__required.r(exports, 'ChangeDetector', () => { return ChangeDetector;});
__required.r(exports, 'compileModule', () => { return compileModule;});
__required.r(exports, 'bootStrapApplication', () => { return bootStrapApplication;});
__required.r(exports, 'APP_BOOTSTRAP', () => { return APP_BOOTSTRAP;});
__required.r(exports, 'INITIALIZERS', () => { return INITIALIZERS;});
__required.r(exports, 'Observer', () => { return Observer;});
__required.r(exports, 'staticInjectionToken', () => { return staticInjectionToken;});
__required.r(exports, 'TemplateRef', () => { return TemplateRef;});
__required.r(exports, 'elementInputLinker', () => { return elementInputLinker;});
__required.r(exports, 'LifeCycle', () => { return LifeCycle;});
__required.r(exports, 'LifeCycleConst', () => { return LifeCycleConst;});
__required.r(exports, 'noop', () => { return noop;});
__required.r(exports, 'resolveClosureRef', () => { return resolveClosureRef;});
__required.r(exports, 'closureRef', () => { return closureRef;});
__required.r(exports, 'AbstractInjectorInstance', () => { return AbstractInjectorInstance;});
__required.r(exports, 'wireResolvers', () => { return wireResolvers;});
__required.r(exports, 'AutoWire', () => { return AutoWire;});
__required.r(exports, 'Inject', () => { return Inject;});
__required.r(exports, 'ProviderToken', () => { return ProviderToken;});
__required.r(exports, 'errorBuilder', () => { return errorBuilder;});
var utils = __required(1152);
var hashcode = utils.hashcode;
var helpers = __required(1132);
var isnumber = helpers.isnumber;
var isarray = helpers.isarray;
var isnull = helpers.isnull;
var isundefined = helpers.isundefined;
var isboolean = helpers.isboolean;
var addToArray = helpers.addToArray;
var removeFromArray = helpers.removeFromArray;
var inarray = helpers.inarray;
var isstring = helpers.isstring;
var isequal = helpers.isequal;
var isobject = helpers.isobject;
var isfunction = helpers.isfunction;
var __buildOptions = {};
function errorBuilder(error, logLevel, stack) {
    var loggerLevel = void 0 == logLevel ? 0 : logLevel;
    var logLevelMethods = [
        'error',
        'warn',
        'info',
        'log',
        'debug'
    ];
    function userException() {
        this.name = 'jEliException';
        this.message = error;
        this.stack = stack;
    }
    userException.prototype.toString = function () {
        return this.name + ': "' + this.message + '"';
    };
    if (typeof error == 'string') {
        error = new userException();
    }
    console[logLevelMethods[loggerLevel]](error);
}
function closureRef(closureRefFn) {
    if (isfunction(closureRefFn)) {
        closureRefFn.__ref__ = closureRef;
    }
    return closureRefFn;
}
function resolveClosureRef(ref) {
    if (isfunction(ref) && ref.__ref__ === closureRef) {
        return ref();
    } else {
        return ref;
    }
}
;
function noop(callback) {
    return callback || function () {
    };
}
;
var existingInstance = new Map();
function ProviderToken(tokenName, multiple, provide) {
    var tokenRecords = [];
    var _persists = true;
    var resolved = false;
    this.tokenName = tokenName;
    this.register = function (value, persist) {
        if (multiple) {
            tokenRecords.push(value);
        } else {
            tokenRecords = value;
        }
        _persists = persist;
        resolved = false;
    };
    this.resolve = function () {
        if (resolved && _persists)
            return tokenRecords;
        var token = null;
        try {
            if (multiple) {
                token = tokenRecords.map(getToken);
            } else {
                token = getToken(tokenRecords);
            }
            if (!_persists)
                tokenRecords = [];
            else
                tokenRecords = token;
            resolved = _persists;
        } catch (e) {
            errorBuilder('error while resolving ' + tokenName);
        }
        return token;
    };
    if (provide) {
        this.register(provide, true);
    }
    function getToken(token) {
        return resolved ? token : AutoWire(token);
    }
}
function Inject(dep, localInjector) {
    if (!dep)
        return null;
    if (dep.instance) {
        return dep.instance;
    } else if (dep instanceof ProviderToken) {
        return dep.resolve();
    } else if (localInjector && localInjector.has(dep.tokenName)) {
        return localInjector.get(dep);
    } else if (isfunction(dep)) {
        if (!dep.ctors) {
            return resolveClosureRef(dep);
        }
        var instance = dep.ctors.instance;
        if (!instance) {
            instance = AutoWire(resolveClosureRef(dep), localInjector);
            if (!dep.ctors.noSingleton) {
                dep.ctors.instance = instance;
            }
        }
        return instance;
    }
    return null;
}
;
function AutoWire(factory, localInjector, callback) {
    if (isfunction(factory)) {
        var deps = resolveDeps(factory.ctors && factory.ctors.DI, localInjector);
        var protos = Object.create(factory.prototype);
        var result = factory.apply(protos, deps) || protos;
        if (existingInstance.has(factory)) {
            existingInstance.set(factory, result);
        }
        if (isfunction(callback)) {
            return callback(result);
        }
        return result;
    }
    factory = resolveTokenBase(factory, localInjector);
    return factory;
}
;
function wireResolvers(deps, localInjector) {
    if (deps) {
        for (var i = 0; i < deps.length; i++) {
            var token = deps[i];
            var tokenValue = resolveTokenBase(token, localInjector);
            if (token.name instanceof ProviderToken) {
                token.name.register(tokenValue, false);
            } else if (isfunction(token.name)) {
                console.log(token, tokenValue);
            }
        }
    }
}
function resolveTokenBase(token, localInjector) {
    var tokenValue;
    if (token.factory) {
        tokenValue = resolveClosureRef.factory(token, localInjector);
    } else if (token.useClass) {
        tokenValue = Inject(token.useClass, localInjector);
    } else if (token.reference) {
        tokenValue = resolveReference(Inject(token.reference, localInjector), localInjector);
    } else if (token.value) {
        tokenValue = token.value;
    }
    return tokenValue;
}
function resolveDeps(deps, localInjector) {
    return (deps || []).map(function (di) {
        var injectableParam = null;
        var err = false;
        try {
            injectableParam = Inject(di, localInjector);
        } catch (e) {
            err = true;
        } finally {
            if (err && !di.optional) {
                throw new Error('Unable to resolve provider ' + di.name || di.tokenName);
            }
        }
        return injectableParam;
    });
}
function resolveReference(reference, localInjector) {
    if (isfunction(reference)) {
        if (reference.instance)
            return reference.instance;
        else if (localInjector.has(reference))
            return localInjector.get(reference);
        else if (reference.ctors) {
            existingInstance.set(reference, null);
            return function () {
                return existingInstance.get(reference);
            };
        }
        return AutoWire(reference);
    } else {
        return reference;
    }
}
resolveClosureRef.factory = function (token, localInjector) {
    var args = resolveDeps(token.DI, localInjector);
    return function () {
        return resolveClosureRef(token.factory).apply(null, args);
    };
};
function AbstractInjectorInstance() {
    this.injectors = {};
    this.has = function (injectorToken) {
        return this.injectors.hasOwnProperty(injectorToken);
    };
}
AbstractInjectorInstance.prototype.set = function (tokenName, value) {
    this.injectors[tokenName] = value;
};
AbstractInjectorInstance.prototype.get = function (injectorToken) {
    return this.injectors[injectorToken];
};
AbstractInjectorInstance.prototype.destroy = function () {
    this.injectors = null;
};
var LifeCycleConst = {
    willObserve: 0,
    didChange: 1,
    didInit: 2,
    viewDidLoad: 3,
    viewDidDestroy: 4
};
var LifeCycleKeys = Object.keys(LifeCycleConst);
function LifeCycle(componentInstance) {
    var _cycleState = {
        didInit: !!componentInstance.didInit,
        viewDidLoad: !!componentInstance.viewDidLoad,
        viewDidDestroy: !!componentInstance.viewDidDestroy,
        willObserve: !!componentInstance.willObserve,
        didChange: !!componentInstance.didChange
    };
    this.has = function (cycle) {
        return _cycleState[cycle] && isfunction(componentInstance[cycle]);
    };
    this.trigger = function (cycle, args) {
        var cycleId = LifeCycleKeys[cycle];
        if (this.has(cycleId)) {
            componentInstance[cycleId](args);
        }
    };
}
function TemplateRef(templates, isContentChild) {
    this.createElement = function (parentNode, viewContainer, context) {
        return ViewParser.builder[templates.type](templates, parentNode, viewContainer, context);
    };
    this.getContext = function () {
        return templates.context;
    };
    this.forEach = function (selector, callback) {
        if (templates.hasOwnProperty(selector)) {
            templates[selector].forEach(tmpl => callback(isfunction(tmpl) ? tmpl() : tmpl));
        }
    };
}
TemplateRef.factory = function (node, templateId, silent) {
    var templates = node['[[tmpl]]'];
    if (!templates || !templates.hasOwnProperty(templateId)) {
        if (!silent)
            errorBuilder('No templates Defined #' + templateId);
        return null;
    }
    if (typeof templates[templateId] === 'function') {
        templates[templateId] = templates[templateId]();
    }
    return new TemplateRef(templates[templateId]);
};
var staticInjectionToken = {
    ElementRef: 'ElementRef',
    TemplateRef: 'TemplateRef',
    ContentData: 'ContentData',
    changeDetector: 'changeDetector',
    ViewRef: 'ViewRef',
    ParentRef: 'ParentRef',
    VALIDATORS: 'VALIDATORS',
    QueryList: 'QueryList',
    Function: 'Function',
    HostRef: 'HostRef',
    HTMLElement: 'HTMLElement'
};
function ComponentInjectors(elementRef, selector) {
    AbstractInjectorInstance.call(this, elementRef);
    this.injectors.ElementRef = elementRef;
    this.injectors.Selector = selector;
    this.has = function (tokenName) {
        return this.injectors.hasOwnProperty(tokenName) || staticInjectionToken.hasOwnProperty(tokenName);
    };
}
ComponentInjectors.prototype = Object.create(AbstractInjectorInstance.prototype);
ComponentInjectors.prototype.constructor = AbstractInjectorInstance;
ComponentInjectors.prototype.destroy = function () {
    this.injectors.ElementRef = null;
    this.injectors = null;
    this.currentClassAnnotations = null;
};
ComponentInjectors.prototype.get = function (dep) {
    if (this.injectors.hasOwnProperty(dep.tokenName))
        return this.injectors[dep.tokenName];
    else if (staticInjectionToken[dep.tokenName])
        return _ComponentInjectionToken(dep, this);
};
function _ComponentInjectionToken(dep, context) {
    switch (dep.tokenName) {
    case staticInjectionToken.TemplateRef:
        return TemplateRef.factory(context.injectors.ElementRef, context.get({ tokenName: 'Selector' }));
    case staticInjectionToken.changeDetector:
        return context.injectors.ElementRef.changeDetector;
    case staticInjectionToken.ViewRef:
        return new ViewRef(context.injectors.ElementRef);
    case staticInjectionToken.ParentRef: {
            if (dep.value) {
                return findParentRef(context.injectors.ElementRef.parent, dep);
            }
            return context.injectors.ElementRef.parent.componentInstance;
        }
    case staticInjectionToken.VALIDATORS:
        return getValidators(context.injectors.ElementRef);
    }
}
function getValidators(elementRef) {
    return [
        'required',
        'pattern',
        'minlength',
        'maxlength'
    ].reduce(function (accum, key) {
        if (elementRef.hasAttribute(key)) {
            accum[key] = elementRef.getAttribute(key);
        }
        return accum;
    }, {});
}
function findParentRef(parentRef, refInstance) {
    var selector = refInstance.value + (refInstance.type ? ':' + refInstance.type : '');
    if (parentRef && (!parentRef.nodes || !parentRef.nodes.has(selector))) {
        return findParentRef(parentRef.parent, refInstance);
    }
    if (!parentRef) {
        return null;
    }
    return parentRef.nodes.get(selector);
}
function elementInputLinker(componentInstance, elementRef, lifeCycle, definition) {
    lifeCycle.trigger(LifeCycleConst.willObserve);
    var propChanges = null;
    var registeredProperty = {};
    var isPrimitive = [];
    var always = false;
    if (definition.props) {
        always = _updateViewBinding();
    }
    function _updateViewBinding() {
        var hasBinding = false;
        var context = null;
        if (elementRef.hasContext) {
            context = elementRef.context;
        } else {
            context = (isequal(elementRef.parent.type, 8) && !elementRef.isc ? elementRef : elementRef.parent).context;
        }
        for (var prop in definition.props) {
            if (isPrimitive.includes(prop))
                continue;
            var item = definition.props[prop];
            var name = item.value || prop;
            var value;
            if (elementRef.props && elementRef.props.hasOwnProperty(name)) {
                try {
                    if (isobject(elementRef.props[name])) {
                        hasBinding = true;
                        value = getFilteredTemplateValue(elementRef.props[name], context, elementRef.parent.componentInstance);
                    } else {
                        value = getPrimitiveValue(item.type, name, elementRef.props[name]);
                        isPrimitive.push(prop);
                    }
                    setValue(prop, value);
                } catch (e) {
                    console.error(e);
                }
            } else if (elementRef.hasAttribute(name)) {
                isPrimitive.push(prop);
                setValue(prop, elementRef.attr[name]);
            }
        }
        if (propChanges) {
            lifeCycle.trigger(LifeCycleConst.didChange, propChanges);
            propChanges = null;
        }
        return hasBinding;
    }
    function hash(a, count) {
        var count = count || 0;
        if (a === null || a === undefined)
            return count;
        else if (typeof a === 'number')
            count += a;
        else if (typeof a === 'string')
            count += a.length;
        else if (typeof a === 'boolean')
            count += a ? 1 : 0;
        else if (typeof a === 'object' && (a.constructor === Object || a.constructor === Array)) {
            for (var prop in a) {
                if (typeof prop === 'number')
                    count += prop;
                else
                    count += prop.length;
                count = hash(a[prop], count);
            }
        } else {
            count += 1;
        }
        return count;
    }
    function setValue(property, value) {
        var hasProp = registeredProperty.hasOwnProperty(property);
        var sameValue = isequal(componentInstance[property], value);
        if (hasProp && sameValue)
            return;
        if (propChanges === null) {
            propChanges = {};
        }
        registeredProperty[property] = true;
        propChanges[property] = value;
        componentInstance[property] = value;
    }
    function getPrimitiveValue(type, name, value) {
        switch (type) {
        case staticInjectionToken.TemplateRef:
            return TemplateRef.factory(elementRef, name);
        case staticInjectionToken.Function:
            return elementRef.parent.componentInstance[value];
        default:
            return value;
        }
    }
    ObserveUntilDestroyed(elementRef, {
        next: function () {
            if (always)
                _updateViewBinding();
            lifeCycle.trigger(LifeCycleConst.willObserve);
        },
        done: function () {
            registeredProperty = null;
            isPrimitive.length = 0;
        }
    });
}
function ElementCompiler(factory, elementRef, componentInjectors, next) {
    var ctors = factory.ctors;
    var lifeCycle;
    function CoreComponentCompiler(componentInstance) {
        if (!elementRef.isc) {
            return;
        }
        var componentRef = componentDebugContext.get(elementRef.refId);
        componentRef.componentInstance = componentInstance;
        if (factory.view) {
            try {
                var renderedElement = factory.view(elementRef);
                elementMutationObserver(elementRef.nativeElement, function (mutationList, observer) {
                    AttachComponentContentQuery(elementRef);
                    lifeCycle && lifeCycle.trigger(LifeCycleConst.viewDidLoad);
                    observer.disconnect();
                });
                elementRef.nativeElement.appendChild(renderedElement);
                elementRef.changeDetector.detectChanges();
            } catch (e) {
                errorBuilder(e);
            }
        }
        attachElementObserver(elementRef, function () {
            lifeCycle.trigger(LifeCycleConst.viewDidDestroy);
            componentRef.destroy();
            lifeCycle = null;
            componentRef = null;
        });
        componentRef.changeDetector.detectChanges(true, true);
    }
    function compileEventsRegistry(componentInstance) {
        if (ctors.events) {
            Object.keys(ctors.events).forEach(_registry);
        }
        function _registry(evName) {
            switch (ctors.events[evName].type) {
            case 'event':
                EventHandler.attachEvent(elementRef.events, evName, ctors.events[evName].value, componentInstance);
                break;
            case 'emitter':
                EventHandler.attachEventEmitter(elementRef, evName, componentInstance);
                break;
            case 'dispatcher':
                EventHandler.attachEventDispatcher(elementRef, evName, componentInstance);
                break;
            }
        }
    }
    function registerDirectiveInstance(componentInstance) {
        if (!elementRef.isc) {
            elementRef.nodes.set(factory.ctors.exportAs || ctors.selector, componentInstance);
            lifeCycle && lifeCycle.trigger(LifeCycleConst.viewDidLoad);
            attachElementObserver(elementRef, function () {
                lifeCycle.trigger(LifeCycleConst.viewDidDestroy);
                elementRef.nodes.delete(ctors.selector);
            });
        }
    }
    ComponentFactoryInitializer(factory, componentInjectors, function triggerInstance(componentInstance) {
        compileEventsRegistry(componentInstance);
        lifeCycle = new LifeCycle(componentInstance);
        elementInputLinker(componentInstance, elementRef, lifeCycle, ctors);
        lifeCycle.trigger(LifeCycleConst.didInit);
        registerDirectiveInstance(componentInstance);
        next(componentInstance);
        CoreComponentCompiler(componentInstance);
    });
}
ElementCompiler.resolve = function (node, nextTick) {
    var inc = 0;
    var componentInjectors = new ComponentInjectors(node);
    function next() {
        var factory = node.providers[inc];
        inc++;
        if (factory) {
            componentInjectors.set('Selector', factory.ctors.selector);
            try {
                ElementCompiler(factory, node, componentInjectors, next);
            } catch (e) {
                errorBuilder(e);
            }
        } else {
            componentInjectors.destroy();
            nextTick(node);
        }
    }
    next(null);
};
function ComponentFactoryInitializer(factory, injectorInstance, CB) {
    wireResolvers(factory.ctors.resolve, injectorInstance);
    AutoWire(factory, injectorInstance, function (instance) {
        try {
            CB(instance);
        } catch (e) {
            errorBuilder(e);
        }
    });
}
;
function Observer() {
    this.$notifyInProgress = 0;
    this.bindingIdx = 0;
    this.retry = false;
    this._entries = new Map();
}
Observer.prototype.subscribe = function (callback) {
    var self = this, bindingIdx = this.bindingIdx++;
    this.retry = true;
    this._entries.set(bindingIdx, {
        handler: callback,
        state: false
    });
    return function () {
        self._entries.delete(bindingIdx);
    };
};
Observer.prototype.observeForKey = function (key, callback, core) {
    var index = 0;
    var self = this;
    var keyObserver;
    if (!this._entries.has(key)) {
        this._entries.push(key, {
            watchKey: key,
            handler: [callback],
            core: core,
            state: false
        });
    } else {
        keyObserver = this.get(key);
        index = keyObserver.length;
        keyObserver.handler.push(fn);
    }
    return function () {
        if (!index) {
            self._entries.delete(key);
        } else {
            keyObserver.handler.splice(index, 1);
        }
    };
};
Observer.prototype.notifyAllObservers = function (model, ignoreCheck) {
    if (this.$notifyInProgress) {
        this.retry = true;
        return;
    }
    this.$notifyInProgress = true;
    this._entries.forEach(function (subscription) {
        rxNotify(subscription, model, ignoreCheck);
    });
    if (this.retry) {
        this.retry = false;
        this.notifyAllObservers(model);
    }
    this.$notifyInProgress = false;
};
Observer.prototype.destroy = function () {
    this._entries.clear();
    this.notifyAllObservers = 0;
    this.retry = false;
};
function InternalChangeDetector(context) {
    this._changeDetectorState = 3;
    Object.defineProperty(this, 'status', {
        get: function () {
            return _changeDetectorState;
        }
    });
    this.detectChanges = function () {
        if (this._changeDetectorState == 3) {
            tick.apply(null, arguments);
        }
    };
    function tick(ignoreChild, ignoreParent) {
        if (!context.observables) {
            return;
        }
        if (context.parent && !ignoreParent && componentDebugContext.has(context.parent)) {
            var parent = componentDebugContext.get(context.parent);
            parent.changeDetector.detectChanges(true);
            triggerChild(parent.child, []);
        }
        context.observables && context.observables.notifyAllObservers(context.componentInstance);
        if (!ignoreChild) {
            triggerChild(context.child, []);
        }
        function triggerChild(children, ignore) {
            for (var i = 0; i < children.length; i++) {
                var refId = children[i];
                if (!ignore.includes(refId) && componentDebugContext.has(refId)) {
                    var child = componentDebugContext.get(refId);
                    child.changeDetector.detectChanges(false, true);
                }
            }
        }
    }
    ;
}
InternalChangeDetector.prototype.onlySelf = function () {
    this.detectChanges(false, true);
};
InternalChangeDetector.prototype.markAsChecked = function () {
    this._changeDetectorState = 1;
};
InternalChangeDetector.prototype.markAsUnChecked = function () {
    this._changeDetectorState = 3;
};
InternalChangeDetector.prototype.markAsOnce = function () {
    this._changeDetectorState = 2;
};
var componentDebugContext = new Map();
function ComponentRef(refId, context) {
    this.componentRefId = refId;
    this.observables = new Observer();
    this.child = [];
    this.parent = null;
    this.changeDetector = new InternalChangeDetector(this);
    this._componentInstance = null;
    this._context = context || null;
    Object.defineProperties(this, {
        context: {
            get: function () {
                if (this._context) {
                    return this._context;
                }
                return this.componentInstance;
            }
        },
        componentInstance: {
            get: function () {
                if (!this._componentInstance && this.parent && componentDebugContext.has(this.parent)) {
                    return componentDebugContext.get(this.parent).componentInstance;
                }
                return this._componentInstance;
            },
            set: function (componentInstance) {
                this._componentInstance = componentInstance;
            }
        }
    });
}
ComponentRef.prototype.removeChild = function (refId) {
    this.child.splice(this.child.indexOf(refId), 1);
    componentDebugContext.delete(refId);
};
ComponentRef.prototype.updateModel = function (propName, value) {
    if (isobject(propName)) {
        for (var prop in propName) {
            setModelValue(prop, this.context, propName[name]);
        }
    } else {
        setModelValue(propName, this.context, value);
    }
    this.changeDetector.detectChanges(false, true);
    return this;
};
ComponentRef.prototype.destroy = function () {
    if (!componentDebugContext.has(this.componentRefId))
        return;
    this.changeDetector.markAsChecked();
    componentDebugContext.delete(this.componentRefId);
    if (this.parent && componentDebugContext.has(this.parent)) {
        componentDebugContext.get(this.parent).removeChild(this.componentRefId);
    }
    this._componentInstance = null;
    this._context = null;
    this.observables.destroy();
    this.changeDetector = null;
    this.observables = null;
    this.parent = null;
    this.child.length = 0;
};
ComponentRef.create = function (refId, parentId, context) {
    var componentRef = componentDebugContext.get(refId);
    if (!componentRef) {
        componentRef = new ComponentRef(refId, context);
        componentDebugContext.set(refId, componentRef);
    } else {
        componentRef._context = context || null;
    }
    if (parentId && componentDebugContext.has(parentId)) {
        componentRef.parent = parentId;
        componentDebugContext.get(parentId).child.push(refId);
    }
    componentRef = null;
};
ComponentRef.get = function (refId, hostRefId) {
    return componentDebugContext.get(refId) || componentDebugContext.get(hostRefId) || {};
};
function ElementRef(definition, parent, _lazyCompiled) {
    AbstractElementRef.call(this, definition, parent);
    this.events = new EventHandler((definition.events || []).slice());
    this._lazyCompiled = _lazyCompiled;
    if (definition.isc) {
        ComponentRef.create(this.refId, parent && parent.hostRef.refId);
    }
    if (definition.attr$) {
        setupAttributeObservers(this, definition.attr$);
    }
}
ElementRef.prototype = Object.create(AbstractElementRef.prototype);
ElementRef.prototype.constructor = AbstractElementRef;
function bootstrapFromDOM(componentClass, selector, callback) {
    var elementRef = new ElementRef({
        name: selector,
        isc: true,
        type: 1,
        fromDOM: true
    }, null);
    var componentInjectors = new ComponentInjectors(elementRef);
    ElementCompiler(componentClass, elementRef, componentInjectors, function (componentInstance) {
        if (callback && typeof callback === 'function') {
            callback(elementRef, componentInstance);
        }
    });
}
var CoreBootstrapContext = Object({
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    injector: null,
    enableDebugger: true
});
var INITIALIZERS = new ProviderToken('AppInitializers', true);
var APP_BOOTSTRAP = new ProviderToken('AppBootstrap', true);
function bootStrapApplication(moduleToBootStrap) {
    return new Promise(function (resolve, reject) {
        try {
            CoreBootstrapContext.compiledModule = moduleToBootStrap;
            compileModule(moduleToBootStrap);
            Promise.all(Inject(INITIALIZERS, CoreBootstrapContext.injector).map(function (callback) {
                return callback();
            })).then(function () {
                CoreBootstrapContext.$isCompiled = true;
                bootStrapElement();
                resolve();
            }, reject);
        } catch (e) {
            errorBuilder(e.message);
            reject();
        }
    });
    function bootStrapElement() {
        if (moduleToBootStrap.rootElement) {
            var selector = moduleToBootStrap.rootElement.ctors.selector;
            bootstrapFromDOM(moduleToBootStrap.rootElement, selector, function (elementRef) {
                CoreBootstrapContext.bootStrapComponent = elementRef;
                Inject(APP_BOOTSTRAP, CoreBootstrapContext.injector).forEach(function (callback) {
                    callback();
                });
            });
        }
    }
}
;
function compileModule(dModule) {
    dModule.fac();
    dModule();
}
function ChangeDetector() {
    if (!CoreBootstrapContext.bootStrapComponent)
        return;
    CoreBootstrapContext.bootStrapComponent.changeDetector.detectChanges();
}
;
var scheduler = {
    schedule: function (taskFn, timer) {
        if (!window.requestAnimationFrame) {
            var taskId = setTimeout(taskFn, timer === undefined ? 15 : timer);
            return function () {
                clearTimeout(taskId);
            };
        }
        var taskId = window.requestAnimationFrame(taskFn);
        return function () {
            window.cancelAnimationFrame(taskId);
        };
    }
};
var ViewParser = function () {
    function JSONCompiler() {
        var fragment = document.createDocumentFragment();
        this.compile = function (transpiledHTML, elementRef) {
            for (var i = 0; i < transpiledHTML.length; i++) {
                var compiled = ViewParser.builder[transpiledHTML[i].type](transpiledHTML[i], elementRef, this);
                if (compiled) {
                    this.pushToView(compiled);
                }
            }
            return fragment;
        };
        this.pushToView = function (compiled) {
            compiled.parent && compiled.parent.children.add(compiled);
            fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
            transverse(compiled);
        };
    }
    function element(definition, parent, viewContainer, context) {
        var elementRef = new ElementRef(definition, parent);
        if (definition.attr) {
            AttributeAppender(elementRef.nativeElement, definition.attr);
        }
        if (definition.children) {
            for (var i = 0; i < definition.children.length; i++) {
                var childDefinition = typeof definition.children[i] === 'function' ? definition.children[i]() : definition.children[i];
                if (!childDefinition)
                    continue;
                var child = ViewParser.builder[childDefinition.type](childDefinition, elementRef, viewContainer, context, true);
                if (child) {
                    pushToParent(child, elementRef, i);
                }
            }
        }
        if (definition.vc) {
            addViewQuery(elementRef.hostRef, definition.vc, elementRef);
        }
        return elementRef;
    }
    function pushToParent(child, parent, index) {
        parent.children.add(child, index);
        parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
    }
    function comment(definition, parent) {
        return new AbstractElementRef(definition, parent);
    }
    function text(definition, parent) {
        return new TextNodeRef(definition, parent);
    }
    function place(definition, parent, viewContainer, context, appendToParent) {
        var hostRef = parent.hostRef;
        var createPlaceElement = !(viewContainer || appendToParent);
        var template = TemplateRef.factory(hostRef, 'place', true);
        var placeElement = createPlaceElement ? new AbstractElementRef({
            name: '#',
            type: 11
        }, hostRef) : null;
        function createAndAppend(elementDefinition) {
            var child = ViewParser.builder[elementDefinition.type](elementDefinition, hostRef.parent, viewContainer, context);
            child.hostRefId = hostRef.refId;
            if (appendToParent || createPlaceElement) {
                pushToParent(child, placeElement || parent);
            } else {
                viewContainer.pushToView(child);
            }
            if (definition.vc && [
                    elementDefinition.refId,
                    child.tagName
                ].includes(definition.vc[0].value)) {
                addViewQuery(hostRef, definition.vc, child);
            }
        }
        if (template) {
            template.forEach(definition.refId, createAndAppend);
        }
        return placeElement;
    }
    function outlet(def, parent, viewContainer, context) {
        var currentValue = null;
        var element = null;
        var unsubscribeScheduler = noop();
        function checkAndCompileTemplate(fromObserver) {
            var templateId = getFilteredTemplateValue(def.$templateId, context || parent.context, parent.componentInstance);
            if (currentValue != templateId) {
                unsubscribeScheduler();
                currentValue = templateId;
                var template = def._GT && def._GT(templateId);
                if (template) {
                    var oldElement = element;
                    element = ViewParser.builder[template.type](template, parent, viewContainer, context);
                    if (!fromObserver)
                        return element;
                    unsubscribeScheduler = scheduler.schedule(function () {
                        transverse(element);
                        replaceElement(oldElement, element);
                        oldElement = null;
                    });
                }
            }
        }
        if (def.$templateId) {
            if (!def.context) {
                ObserveUntilDestroyed(parent, {
                    next: function () {
                        checkAndCompileTemplate(true);
                    },
                    done: function () {
                        element = null;
                    }
                });
            }
            return checkAndCompileTemplate();
        }
        return null;
    }
    return {
        JSONCompiler: JSONCompiler,
        builder: {
            1: element,
            3: text,
            11: place,
            13: outlet,
            8: comment
        }
    };
}();
function transverse(node) {
    if (node._lazyCompiled)
        return;
    if (node instanceof AbstractElementRef) {
        if (node.providers && node.providers.length) {
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else if (node instanceof TextNodeRef && node.hasBinding) {
        textNodeCompiler(node);
    }
    function proceedWithCompilation(node) {
        if (isequal(node.type, 8)) {
            return;
        }
        ;
        EventHandler.registerListener(node);
        node.children.forEach(transverse);
    }
}
var sce = function () {
    var element = document.createElement('div');
    function htmlEscape(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    ;
    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            str = htmlEscape(str).replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '').replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '').replace(/^[ \n\r\t\f]+/, '').replace(/[ \n\r\t\f]+$/, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }
        return str;
    }
    return {
        trustAsHTML: decodeHTMLEntities,
        escapeHTML: htmlEscape,
        isPlainHtml: /<[a-z][\s\S]*>/i
    };
}();
function ElementStyle(nativeElement, name, value) {
    if (name && !value && isstring(name)) {
        if (!!window.getComputedStyle) {
            var ret = window.getComputedStyle(nativeElement)[name];
            return parseInt(ret) || ret;
        }
        return;
    }
    if (isobject(name)) {
        for (var prop in name) {
            ElementStyle.set(nativeElement, prop, name[prop]);
        }
    } else {
        ElementStyle.set.apply(null, arguments);
    }
}
;
ElementStyle.set = function (nativeElement, name, value, suffix) {
    if (typeof value === 'number' && ElementStyle.props.WithSuffix.includes(name)) {
        value += suffix || 'px';
    } else if (ElementStyle.props.background.includes(name) && value.includes('.') && !value.startsWith('url')) {
        value = 'url(' + value + ')';
    }
    nativeElement.style[name] = value;
};
ElementStyle.props = {
    WithSuffix: 'width|height|top|bottom|left|right|marginTop|marginBottom|marginLeft|marginRight|paddingRight|paddingLeft|paddingTop|paddingBottom|fontSize'.split('|'),
    background: 'backgroundImage'.split('|')
};
function ElementClassList(nativeElement, classList, type) {
    if (type) {
        nativeElement.classList[type].apply(nativeElement.classList, toClass(classList));
    } else if (classList) {
        nativeElement.classList.value = classList;
    } else {
        return nativeElement.classList.value;
    }
}
function toClass(classList) {
    return classList.split(/\s/g).filter(function (k) {
        return !!k;
    });
}
ElementClassList.add = function (nativeElement, classList, removeClass) {
    if (!classList || !nativeElement) {
        return;
    }
    if (isobject(classList)) {
        for (var className in classList) {
            if (classList[className]) {
                nativeElement.classList.add(className);
            } else {
                nativeElement.classList.remove(className);
            }
        }
    } else {
        nativeElement.classList.add.apply(nativeElement.classList, toClass(classList));
    }
};
ElementClassList.remove = function (nativeElement, classList) {
    if (!classList || !nativeElement) {
        return;
    }
    nativeElement.classList.remove.apply(nativeElement.classList, toClass(classList));
};
ElementClassList.contains = function (nativeElement, className) {
    return nativeElement.classList.contains(className);
};
function AttributeAppender(nativeElement, prop, value) {
    if (11 === nativeElement.nodeType)
        return;
    if (isobject(prop)) {
        for (var name in prop) {
            if (AttributeAppender.helpers[name]) {
                AttributeAppender.helpers[name](nativeElement, prop[name]);
            } else {
                AttributeAppender.setValue(nativeElement, name, prop[name]);
            }
        }
    } else {
        AttributeAppender.setValue(nativeElement, prop, value);
    }
}
AttributeAppender.setValue = function (nativeElement, prop, value, canRemoveAttr) {
    var elementValue = nativeElement.getAttribute(prop);
    if (elementValue === value)
        return;
    if (canRemoveAttr && !value) {
        nativeElement.removeAttribute(prop);
    } else {
        nativeElement.setAttribute(prop, value);
    }
};
AttributeAppender.helpers = {
    style: function (nativeElement, value, template) {
        if (isobject(value)) {
            ElementStyle(nativeElement, value);
        } else if (template) {
            ElementStyle.set(nativeElement, template.type, value, template.suffix);
        } else {
            nativeElement.setAttribute('style', value);
        }
    },
    innerhtml: function (nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'innerHTML', sce.trustAsHTML(value));
    },
    src: function (nativeElement, value) {
        if (![
                'IMG',
                'IFRAME',
                'SOURCE'
            ].includes(nativeElement.tagName)) {
            return errorBuilder('src is not a valid property of ' + nativeElement.tagName);
        }
        AttributeAppender.setValue(nativeElement, 'src', value);
    },
    href: function (nativeElement, value) {
        if (!isequal('A', nativeElement.tagName)) {
            return errorBuilder('href is not a valid property of ' + nativeElement.nativeElement.tagName);
        }
        AttributeAppender.setValue(nativeElement, 'href', value);
    },
    class: function (nativeElement, value) {
        ElementClassList.add(nativeElement, value);
    },
    list: function (nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'list', value);
    },
    readonly: function (nativeElement, value) {
        AttributeAppender.setValue(nativeElement, 'readonly', value, true);
    }
};
AttributeAppender.setProp = function (nativeElement, propName, propValue, template) {
    if (propValue === undefined || !nativeElement || nativeElement.nodeType !== 1)
        return;
    if (AttributeAppender.helpers[propName]) {
        return AttributeAppender.helpers[propName](nativeElement, propValue, template);
    }
    if (propName in nativeElement) {
        nativeElement[propName] = propValue;
    } else {
        AttributeAppender.setValue(nativeElement, propName, propValue);
    }
};
var SubscriptionStates = {
    onError: 0,
    onSuccess: 1,
    onCompleted: 2
};
var statedIDs = Object.keys(SubscriptionStates);
function Subscription(replayOnSubscription) {
    this.subscriptions = [];
    this.state = {
        pending: false,
        value: null,
        resolveWith: -1
    };
}
Subscription.prototype.add = function (success, error, completed) {
    if (isobject(success)) {
        this.subscriptions.push(success);
    } else {
        this.subscriptions.push({
            onSuccess: success,
            onError: error,
            onCompleted: completed
        });
    }
    return this;
};
Subscription.prototype.notify = function (state, args) {
    if (!this.state || this.state.resolveWith === SubscriptionStates.onCompleted) {
        return;
    }
    var stateId = statedIDs[state];
    for (var subscription of this.subscriptions) {
        var callback = subscription[stateId];
        if (callback && isfunction(callback)) {
            callback(args);
        }
    }
    this.state.pending = this.subscriptions.length < 1;
    this.state.resolveWith = state;
    this.state.value = args;
};
Subscription.prototype.destroy = function () {
    this.subscriptions.length = 0;
    this.state = null;
};
function Observable(callback) {
    var _observer = AbstractObserver();
    callback(_observer);
    this.subscribe = function (success, error, completed) {
        var subscription = new Subscription();
        subscription.add(success, error, completed);
        _observer.add(subscription);
        return subscription;
    };
}
function AbstractObserver() {
    var subscriptions = [];
    this.add = function (subscription) {
        if (!(subscription instanceof Subscription)) {
            throw new Error('Expected instance of subscriptions but got ' + typeof subscription);
        }
        subscriptions.push(subscription);
    };
    this._forEach = function (callback) {
        var length = subscriptions.length;
        var _subscriptions = subscriptions.slice();
        for (var i = 0; i < length; i++) {
            if (callback(_subscriptions[i])) {
                subscriptions.splice(i, i);
            }
        }
        _subscriptions.length = 0;
    };
    this.hasObservers = function () {
        return subscriptions.length > 0;
    };
}
AbstractObserver.prototype.next = function (value) {
    this._forEach(function (subscription) {
        subscription.notify(SubscriptionStates.onCompleted, value);
    });
};
AbstractObserver.prototype.error = function (errorObject) {
    this._forEach(function (subscription) {
        subscription.notify(SubscriptionStates.onError, errorObject);
    });
};
AbstractObserver.prototype.completed = function () {
    this._forEach(function (subscription) {
        subscription.notify(SubscriptionStates.onCompleted);
    });
};
AbstractObserver.prototype.destroy = function () {
    this._forEach(function (subscription) {
        subscription.destroy();
        return true;
    });
};
function Subject() {
    this._observer = new AbstractObserver();
}
Subject.prototype.subscribe = function (success, error, completed) {
    var subscription = new Subscription(false);
    subscription.add(success, error, completed);
    this._observer.add(subscription);
    return subscription;
};
Subject.prototype.destroy = function () {
    this._observer.destroy();
};
Subject.prototype.hasObservers = function () {
    return this._observer.hasObservers();
};
Subject.prototype.next = function (value) {
    this._observer.next(value);
};
Subject.prototype.error = function (error) {
    this._observer.error(error);
};
Subject.prototype.completed = function () {
    this._observer.completed();
};
function QueryList() {
    Object.defineProperties(this, {
        first: {
            get: function () {
                return this[0];
            }
        },
        last: {
            get: function () {
                return this[this.length - 1];
            }
        }
    });
}
QueryList.constructor = Array;
QueryList.prototype = Object.create(Array.prototype);
QueryList.prototype.add = function (element, index, emitEvent) {
    addToArray(this, element, index);
    if (emitEvent) {
        this.onChanges.next({
            value: element,
            index: index,
            type: 'add'
        });
    }
};
QueryList.prototype.replace = function (from, to, emitEvent) {
    var index = this.indexOf(from);
    if (index > -1) {
        this[index] = to;
    }
    if (emitEvent) {
        this.onChanges.next({
            value: to,
            index: index,
            type: 'replace'
        });
    }
};
QueryList.prototype.get = function (element) {
    if (element) {
        return this.find(function (ele) {
            return ele === element;
        });
    }
    return this;
};
QueryList.prototype.getByIndex = function (index) {
    return this[index];
};
QueryList.prototype.destroy = function () {
    while (this.length) {
        var element = this.pop();
        if (element)
            removeElement(element);
    }
    this.onChanges.destroy();
};
QueryList.prototype.remove = function (element) {
    var index = this.indexOf(element);
    return this.removeByIndex(index);
};
QueryList.prototype.hasIndex = function (index) {
    return this.length - 1 > index;
};
QueryList.prototype.removeByIndex = function (index) {
    var element = removeFromArray(this, index);
    this.onChanges.next({
        value: element,
        index: index,
        type: 'detached'
    });
    return element;
};
QueryList.prototype.onChanges = new Subject();
QueryList.from = function (iterable) {
    if (!Array.isArray(iterable))
        throw new Error(typeof iterable + ' ' + iterable + ' is not iterable');
    var instance = new QueryList(iterable);
    iterable.forEach(it => instance.push(it));
    return instance;
};
QueryList.is = function (instance) {
    return instance instanceof QueryList;
};
function elementMutationObserver(nativeElement, callback) {
    var observer = new MutationObserver(function (mutationsList, observer) {
        if (mutationsList.length) {
            callback.apply(null, arguments);
        }
    });
    observer.observe(nativeElement, {
        attributes: false,
        childList: true,
        subtree: true
    });
}
function AttachComponentContentQuery(elementRef) {
    var querySet = elementRef.cq;
    if (querySet) {
        var componentInstance = elementRef.componentInstance;
        var props = Object.keys(querySet);
        props.forEach(attachQueryValue);
        function attachQueryValue(prop) {
            var mapping = querySet[prop];
            var value = null;
            if (!mapping[3]) {
                if (Array.isArray(mapping[2])) {
                    value = QueryList.from(mapping[2].map(ast => processTmpl(ast, mapping[0])));
                } else {
                    value = processTmpl(mapping[2], mapping[0]);
                }
                if (mapping[0] === staticInjectionToken.TemplateRef) {
                    mapping[2] = value;
                    mapping[3] = true;
                }
            } else {
                value = mapping[2];
            }
            componentInstance[prop] = value;
            value = null;
        }
        function processTmpl(ast, type) {
            switch (type) {
            case staticInjectionToken.TemplateRef:
                return new TemplateRef(ast, true);
            case staticInjectionToken.ContentData:
                return {};
            }
        }
        attachElementObserver(elementRef, function () {
            props.forEach(prop => {
                if (QueryList.is(componentInstance[prop])) {
                    componentInstance[prop].destroy();
                } else {
                    componentInstance[prop] = null;
                }
            });
        });
    }
}
function addViewQuery(hostElement, option, childElement) {
    if (!isequal(option[1], hostElement.tagName)) {
        return hostElement.parent && addViewQuery(hostElement.parent.hostRef, option, childElement);
    }
    var name = option[0].name;
    var type = option[0].type;
    switch (type) {
    case staticInjectionToken.QueryList:
        if (!hostElement.componentInstance.hasOwnProperty(name)) {
            hostElement.componentInstance[name] = new QueryList();
        }
        hostElement.componentInstance[name].add(childElement);
        break;
    case staticInjectionToken.ElementRef:
        hostElement.componentInstance[name] = childElement;
        break;
    case staticInjectionToken.HTMLElement:
        hostElement.componentInstance[name] = childElement.nativeElement;
        break;
    default:
        Object.defineProperty(hostElement.componentInstance, name, {
            configurable: true,
            enumerable: true,
            get: function () {
                return childElement.nodes.has(type) ? childElement.nodes.get(type) : childElement.context;
            }
        });
        break;
    }
}
function elementInsertAfter(hostElement, newNode, targetNode, ignoreDetector) {
    if (!targetNode || !targetNode.parentNode)
        return;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    if (!ignoreDetector)
        hostElement.changeDetector.onlySelf();
}
function replaceElement(fromElement, toElement) {
    var targetNode = fromElement.nativeElement;
    if (11 === targetNode.nodeType) {
        targetNode = fromElement.children.first.nativeElement;
    }
    fromElement.parent.children.replace(fromElement, toElement, true);
    targetNode.replaceWith(toElement.nativeElement);
    removeElement(fromElement, true);
    targetNode = null;
}
function removeElement(elementRef, removeFromParent) {
    if (!elementRef)
        return;
    if (elementRef instanceof AbstractElementRef) {
        if (elementRef.nativeElement && elementRef.nativeElement.nodeType != 11) {
            elementRef.nativeElement.remove();
        }
        if (removeFromParent && elementRef.parent) {
            elementRef.parent.children.remove(elementRef);
        }
        cleanupElementRef(elementRef);
    } else if (elementRef instanceof TextNodeRef) {
        elementRef.nativeNode.remove();
    }
}
function attachElementObserver(element, onDestroyListener) {
    if (onDestroyListener) {
        element.$observers.push(onDestroyListener);
    }
}
function ObserveUntilDestroyed(elementRef, eventListener) {
    if (elementRef.hostRef) {
        var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, eventListener.next);
        attachElementObserver(elementRef, function () {
            unsubscribe();
            eventListener.done(true);
        });
    }
}
function SubscribeObservables(refId, fn) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
    }
    return unsubscribe;
}
function textNodeCompiler(textNodeRef) {
    function _compiler() {
        compileTemplate(textNodeRef.ast, textNodeRef.parent.context, textNodeRef.parent.componentInstance, function (value) {
            if (textNodeRef.nativeNode.nodeValue === value)
                return;
            textNodeRef.nativeNode.nodeValue = value;
        });
    }
    if (!textNodeRef.ast.once && textNodeRef.parent && textNodeRef.parent.hostRef) {
        attachElementObserver(textNodeRef.parent, SubscribeObservables(textNodeRef.parent.hostRef.refId, _compiler));
    }
    ;
    _compiler();
}
function cleanupElementRef(elementRef) {
    elementRef.events && elementRef.events.destroy();
    while (elementRef.$observers.length) {
        elementRef.$observers.pop()();
    }
    elementRef.children.destroy();
    elementRef.nativeElement = null;
    elementRef.parent = null;
    if (elementRef.providers) {
        elementRef.providers = null;
        elementRef.nodes.clear();
    }
}
;
function createElementByType(tag, text, fromDOM) {
    if (fromDOM) {
        return document.querySelector(tag);
    }
    switch (tag) {
    case '##':
        return document.createComment(text);
    case '#':
        return document.createDocumentFragment();
    default:
        return document.createElement(tag);
    }
}
;
function setupAttributeObservers(element, attrObservers) {
    var observerStarted = false;
    var unsubscribe = SubscribeObservables(element.hostRef.refId, observe);
    attachElementObserver(element, unsubscribe);
    function observe() {
        for (var propName in attrObservers) {
            if (attrObservers[propName].once && observerStarted) {
                return;
            }
            attributeEvaluator(propName, attrObservers[propName]);
        }
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, element.componentInstance, function (value) {
                try {
                    AttributeAppender.setProp(element.nativeElement, propName, value, template);
                } catch (e) {
                    console.error(e);
                }
            });
        }
        observerStarted = true;
    }
}
function createLocalVariables(localVariables, localContext, parentContext) {
    var context = {};
    if (localVariables) {
        for (var propName in localVariables) {
            if (!Array.isArray(localVariables[propName]) && localVariables[propName].match(/\s/)) {
                context[propName] = localVariables[propName];
            } else {
                writePropertyBinding(propName);
            }
        }
    }
    function writePropertyBinding(propName) {
        Object.defineProperty(context, propName, {
            get: function () {
                if (!localContext)
                    return null;
                return evaluateExpression(localVariables[propName], localContext, parentContext);
            }
        });
    }
    return context;
}
var DOMHelper = {
    insert: elementInsertAfter,
    remove: removeElement,
    replace: replaceElement
};
var $eUID = 1;
var $elementContext = '__jContext__';
function AbstractElementRef(definition, parentRef) {
    this.nativeElement = createElementByType(definition.name, definition.text, definition.fromDOM);
    this.$observers = [];
    this.refId = '__eid_' + $eUID++;
    this.children = new QueryList();
    this.parent = parentRef;
    this.hostRefId = parentRef ? parentRef.isc ? parentRef.refId : parentRef.hostRefId || this.refId : this.refId;
    this.type = definition.type;
    this.tagName = definition.name.toLowerCase();
    this.index = definition.index;
    this.attr = definition.attr;
    this.props = definition.props;
    this.isc = definition.isc;
    this.hasContext = !!definition.context || !definition.isc && parentRef && parentRef.hasContext;
    if (definition.providers) {
        this.providers = definition.providers;
        this.nodes = new Map();
    }
    Object.defineProperties(this, {
        context: {
            get: function () {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).context;
                }
                return this.parent && this.parent.context;
            }
        },
        componentInstance: {
            get: function () {
                var hostElement = ComponentRef.get(this.refId, this.hostRefId);
                return hostElement.componentInstance;
            }
        },
        changeDetector: {
            get: function () {
                var hostElement = ComponentRef.get(this.refId, this.hostRefId);
                return hostElement.changeDetector;
            }
        },
        hostRef: {
            get: function () {
                if (this.isc) {
                    return this;
                }
                return this.parent && this.parent.hostRef;
            }
        },
        '[[tmpl]]': {
            get: function () {
                return definition.templates;
            }
        },
        nativeNode: {
            get: function () {
                return this.type === 8 ? this.nativeElement : null;
            }
        },
        data: {
            get: function () {
                return definition.data;
            }
        },
        cq: {
            get: function () {
                return definition.cq;
            }
        }
    });
    if (11 !== this.nativeElement.nodeType) {
        Object.defineProperty(this.nativeElement, $elementContext, {
            get: () => {
                return this;
            }
        });
    }
}
;
AbstractElementRef.prototype.hasAttribute = function (name) {
    return this.attr && this.attr.hasOwnProperty(name);
};
AbstractElementRef.prototype.getAttribute = function (name) {
    return this.attr && name in this.attr ? this.attr[name] : this.nativeElement.getAttribute(name);
};
function ViewRef(elementRef) {
    this._destroyed = false;
    this.get = function (index) {
        return this[index];
    };
    this.createEmbededView = function (templateRef, context, index) {
        var view = new EmbededViewContext(elementRef, templateRef, context);
        view.renderView(index);
        addToArray(this, view, index);
        return view;
    };
}
ViewRef.constructor = Array;
ViewRef.prototype = Object.create(Array.prototype);
ViewRef.prototype.move = function (prev, curr) {
    var view = this.get(prev);
    scheduler.schedule(function () {
        if (view) {
            var parent = view.compiledElement.parent;
            var targetNode = parent.children.getByIndex(curr - 1);
            if (targetNode) {
                elementInsertAfter(parent, view.compiledElement.nativeElement, targetNode.nativeElement);
            }
        }
    });
};
ViewRef.prototype.remove = function (index) {
    var view = removeFromArray(this, index);
    if (view) {
        view._destroyed_view = true;
        view.destroy();
    }
    view = null;
};
ViewRef.prototype.clearView = function () {
    while (this.length) {
        var view = this.shift();
        view.destroy();
    }
};
function EmbededViewContext(parentRef, templateRef, context) {
    var _componentRef = null;
    this.context = context;
    var templateContext = templateRef.getContext();
    var componentRefContext = createLocalVariables(templateContext, context, parentRef.context);
    this.compiledElement = templateRef.createElement(parentRef, null, componentRefContext);
    this.compiledElement.hasContext = !!templateContext;
    this.unsubscribeScheduler;
    if (this.compiledElement && this.compiledElement.hasContext) {
        ComponentRef.create(this.compiledElement.refId, parentRef.hostRef.refId, componentRefContext);
    }
    this.renderView = function (index) {
        var targetNode = (parentRef.children.last || parentRef).nativeElement;
        var _arrIndex = index ? index - 1 : index;
        if (index !== undefined && parentRef.children.hasIndex(_arrIndex)) {
            targetNode = parentRef.children.getByIndex(_arrIndex).nativeElement;
        }
        if (!this.compiledElement)
            return;
        var nativeElement = this.compiledElement.nativeElement || this.compiledElement.nativeNode;
        var changeDetector = this.compiledElement && this.compiledElement.changeDetector;
        parentRef.children.add(this.compiledElement, index);
        var _scheduler = () => {
            try {
                transverse(this.compiledElement);
                elementInsertAfter(parentRef, nativeElement, targetNode, true);
                if (changeDetector) {
                    changeDetector.onlySelf();
                }
                nativeElement = null;
                changeDetector = null;
                targetNode = null;
            } catch (e) {
            }
        };
        this.unsubscribeScheduler = scheduler.schedule(_scheduler);
    };
    this.destroy = function () {
        this.unsubscribeScheduler();
        if (_componentRef && !this.compiledElement.isc) {
            _componentRef.destroy();
            _componentRef = null;
        }
        removeElement(this.compiledElement, true);
        this.compiledElement = null;
        this.context = null;
    };
    this.setContext = function (context) {
        this.context = context;
        this.compiledElement.changeDetector.detectChanges();
    };
}
EmbededViewContext.prototype.updateContext = function (updates) {
    if (!this.context)
        return;
    for (var prop in updates) {
        this.context[prop] = updates[prop];
    }
};
function TextNodeRef(definition, parent) {
    this.nativeNode = document.createTextNode(definition.ast[0]);
    this.type = 3;
    this.hasBinding = definition.ast.length > 1;
    if (this.hasBinding) {
        Object.defineProperties(this, {
            parent: {
                get: function () {
                    return parent;
                }
            },
            ast: {
                get: function () {
                    return definition.ast;
                }
            }
        });
    }
}
function EventHandler(events) {
    this._events = events;
    this.registeredEvents = new Map();
}
EventHandler.prototype.destroy = function () {
    this.registeredEvents.forEach(function (removeListenerFn) {
        removeListenerFn();
    });
    this.registeredEvents.clear();
    this._events.length = 0;
};
EventHandler.customRegistry = {
    window: new CustomEventHandler(window),
    document: new CustomEventHandler(document)
};
EventHandler.registerListener = function (element) {
    if (!element.events || !element.events._events.length)
        return;
    var eventInstance = element.events;
    var handler = function ($ev) {
        handleEvent(element, $ev);
    };
    function _registerEvent(eventName) {
        if (!eventInstance.registeredEvents.has(eventName)) {
            if (eventName.includes('.')) {
                var event = eventName.split('.');
                if (EventHandler.customRegistry[event[0]]) {
                    var unsubscribe = EventHandler.customRegistry[event[0]].register(event[1], function (htmlEvent) {
                        handleEvent(element, htmlEvent, eventName);
                    });
                    eventInstance.registeredEvents.set(eventName, unsubscribe);
                }
            } else {
                element.nativeElement.addEventListener(eventName, handler, false);
                eventInstance.registeredEvents.set(eventName, function () {
                    element.nativeElement.removeEventListener(eventName, handler);
                });
            }
        }
    }
    var totalEvents = eventInstance._events.length;
    while (totalEvents--) {
        var event = eventInstance._events[totalEvents];
        if (!event.custom) {
            event.name.split(' ').forEach(_registerEvent);
        }
    }
};
EventHandler.attachEvent = function (eventInstance, eventName, eventValue, componentInstance) {
    eventInstance._events.push({
        name: eventName,
        handler: function ($event) {
            return _executeEventsTriggers(eventValue, componentInstance, null, $event);
        }
    });
};
EventHandler.attachEventEmitter = function (element, eventName, componentInstance) {
    var registeredEvent = getEventsByType(element.events._events, eventName)[0];
    if (registeredEvent && registeredEvent.value) {
        var unSubscribe = componentInstance[eventName].subscribe(function (value) {
            var parentElement = element && element.parent;
            parentElement = parentElement.isc ? parentElement : parentElement.hostRef;
            _executeEventsTriggers(registeredEvent.value, parentElement.componentInstance, element.hasContext ? element.context : element.parent.hasContext ? element.parent.context : parentElement.context, value);
            parentElement && parentElement.changeDetector && parentElement.changeDetector.detectChanges();
        });
        element.events.registeredEvents.set(eventName, unSubscribe);
    }
};
EventHandler.attachEventDispatcher = function (element, eventName, componentInstance) {
    var registeredEvent = getEventsByType(element.events._events, eventName)[0];
    var context = null;
    if (registeredEvent && registeredEvent.value) {
        context = element.context;
        if (element.isc) {
            context = element.parent.context;
        }
        if (context.hasOwnProperty(eventName)) {
            var unSubscribe = context[eventName].subscribe(function (value) {
                _executeEventsTriggers(registeredEvent.value, componentInstance, element.context, value);
                element && element.changeDetector.detectChanges();
            });
            element.events.registeredEvents.set(eventName, unSubscribe);
        }
    }
};
function getEventsByType(events, type) {
    return events.filter(function (event) {
        return event.name.split(/\s/g).includes(type);
    });
}
;
function _executeEventsTriggers(eventTriggers, componentInstance, context, ev) {
    eventTriggers.forEach(_dispatch);
    function _dispatch(event) {
        if (event.left) {
            parseObjectExpression(event, context, componentInstance, ev);
        } else if (event.fn) {
            var fn = getFnFromContext(event, componentInstance);
            if (fn) {
                var narg = generateArguments(event.args, context || componentInstance, null, ev);
                fn.apply(fn.context, narg);
                fn.context = null;
                fn = null;
            }
        }
    }
}
function getFnFromContext(eventInstance, componentInstance) {
    var instance = componentInstance;
    if (eventInstance.namespaces) {
        instance = resolveContext(eventInstance.namespaces, componentInstance);
    }
    var fn = instance[eventInstance.fn];
    if (instance instanceof Array || !componentInstance[eventInstance.fn]) {
        fn.context = instance;
    } else {
        fn.context = componentInstance;
    }
    instance = null;
    return fn;
}
;
function handleEvent(element, event, eventName) {
    eventName = eventName || event.type;
    if (inarray(eventName, [
            'touchstart',
            'touchend',
            'touchmove',
            'submit'
        ])) {
        event.preventDefault();
    }
    try {
        getEventsByType(element.events._events, eventName).forEach(triggerEvents);
    } catch (e) {
        errorBuilder(e);
    } finally {
        element && element.changeDetector && element.changeDetector.detectChanges();
    }
    function isClosest(target) {
        return target.some(query => event.target.closest(query));
    }
    function triggerEvents(registeredEvent) {
        if (registeredEvent.handler) {
            return registeredEvent.handler(event);
        } else {
            var selectedElem = element;
            if (registeredEvent.target) {
                if (!isClosest(registeredEvent.target))
                    return;
                selectedElem = event.target[$elementContext] || element;
            }
            _executeEventsTriggers(registeredEvent.value, element.hostRef.componentInstance, selectedElem.context, event);
            selectedElem = null;
        }
    }
}
function CustomEventHandler(element) {
    var _this = this;
    var trigger = function (event) {
        _this.trigger(event);
    };
    this.element = element;
    this.registeredEvents = {};
    this.register = function (type, callback) {
        var _this = this;
        var index = -1;
        if (this.element && this.registeredEvents) {
            if (!this.registeredEvents.hasOwnProperty(type)) {
                this.registeredEvents[type] = [];
                this.element.addEventListener(type, trigger, false);
            }
            index = this.registeredEvents[type].push(callback);
            return function () {
                _this.registeredEvents[type].splice(index - 1, 1);
            };
        }
    };
    this.trigger = function (event) {
        var listeners = this.registeredEvents[event.type];
        if (listeners && listeners.length) {
            listeners.forEach(function (listener) {
                listener(event);
            });
        }
    };
    this.destroy = function () {
        for (var type in this.registeredEvents) {
            this.registeredEvents[type].length = 0;
            delete this.registeredEvents[type];
            this.element.removeEventListener(type, trigger, false);
        }
        this.element = null;
        this.registeredEvents = null;
    };
}
function filterParser(filterClass, context) {
    var filterInstance = Inject(filterClass);
    if (!filterInstance) {
        errorBuilder(filterClass + 'Provider was not found in FilterProvider');
    }
    return filterInstance.compile.apply(filterInstance, context);
}
;
function getFilteredTemplateValue(templateModel, context, componentInstance) {
    var value = resolveValueFromContext(templateModel.prop, context, componentInstance);
    if (templateModel.fns) {
        value = templateModel.fns.reduce(function (accum, filterClass, idx) {
            if (!filterClass)
                return accum;
            var filterArgs = [];
            if (templateModel.args[idx])
                filterArgs = generateArguments(templateModel.args[idx], context, componentInstance);
            filterArgs.unshift(accum);
            return filterParser(filterClass, filterArgs);
        }, value);
    }
    return value;
}
function compileTemplate(definition, context, componentInstance, cb) {
    var value = undefined;
    if (definition.length > 1) {
        value = definition[1].reduce(function (accum, options) {
            return accum.replace(options[0], evaluateExpression(options[1], context, componentInstance));
        }, definition[0]);
    } else {
        value = getFilteredTemplateValue(definition, context, componentInstance);
    }
    cb(value == null || value == undefined || value == 'null' ? '' : value);
}
function evaluateExpression(expr, context, componentInstance) {
    if (isobject(expr) && expr.prop) {
        return getFilteredTemplateValue(expr, context, componentInstance);
    }
    return resolveValueFromContext(expr, context, componentInstance);
}
;
function generateArguments(args, context, componentInstance, event) {
    return args.map(argumentMapper);
    function argumentMapper(node) {
        if (isarray(node)) {
            if (!node.length)
                return node;
            var isEvent = isequal(node[0], '$event');
            return resolveContext(node.slice(isEvent ? 1 : 0), isEvent ? event : context, componentInstance);
        } else if (isobject(node) && node.arg)
            return generateArguments(node.arg, context, componentInstance, event);
        else if (isstring(node))
            return isequal(node, '$event') ? event : context.hasOwnProperty(node) ? context[node] : node;
        return resolveValueFromContext(node, context, componentInstance, event);
    }
}
function resolveValueFromContext(expression, context, componentInstance) {
    if (isundefined(expression) || isnull(expression) || isboolean(expression) || isnumber(expression) || /(#|rgb)/.test(expression))
        return expression;
    else if (isobject(expression))
        return parseObjectExpression(expression, context, componentInstance);
    else if (isarray(expression))
        return resolveContext(expression, context, componentInstance);
    else if (expression === '$this')
        return componentInstance;
    else if (isobject(context) && expression in context)
        return context[expression];
    else if (isobject(componentInstance) && expression in componentInstance)
        return componentInstance[expression];
    return context && context.hasOwnProperty(expression) ? context[expression] : null;
}
function parseObjectExpression(expression, context, componentInstance, event) {
    var internalParser = {
        ite: function () {
            return resolveValueFromContext(expression.test, context, componentInstance) ? resolveValueFromContext(expression.cons, context, componentInstance) : resolveValueFromContext(expression.alt, context, componentInstance);
        },
        call: function () {
            var dcontext = context;
            if (expression.namespaces) {
                dcontext = resolveContext(expression.namespaces, context, componentInstance);
            } else {
                dcontext = dcontext && expression.fn in dcontext ? context : componentInstance;
            }
            if (dcontext && isfunction(dcontext[expression.fn])) {
                var args = generateArguments(expression.args, context, componentInstance, event);
                return dcontext[expression.fn].apply(dcontext, args);
            }
            return null;
        },
        obj: function () {
            if (expression.expr) {
                return Object.keys(expression.expr).reduce(function (accum, key) {
                    accum[key] = resolveValueFromContext(expression.expr[key], context, componentInstance);
                    return accum;
                }, {});
            }
        },
        asg: function () {
            var value = generateArguments([expression.right], context, componentInstance, event)[0];
            return setModelValue(expression.left, context, componentInstance, value);
        },
        una: function () {
            var val = resolveValueFromContext(expression.args, context, componentInstance, event);
            if (expression.ops === '+')
                return +val;
            if (expression.ops === '-')
                return -val;
            if (expression.ops === '~')
                return ~val;
            if (expression.ops === '!')
                return !val;
        },
        bin: function () {
            if (expression.ops === '&&') {
                var l = resolveValueFromContext(expression.left, context, componentInstance, event);
                if (!l)
                    return l;
                return resolveValueFromContext(expression.right, context, componentInstance, event);
            } else if (expression.ops === '||') {
                var l = resolveValueFromContext(expression.left, context, componentInstance, event);
                if (l)
                    return l;
                return resolveValueFromContext(expression.right, context, componentInstance, event);
            }
            var l = resolveValueFromContext(expression.left, context, componentInstance, event);
            var r = resolveValueFromContext(expression.right, context, componentInstance, event);
            if (expression.ops === '==')
                return l == r;
            if (expression.ops === '===')
                return l === r;
            if (expression.ops === '!=')
                return l != r;
            if (expression.ops === '!==')
                return l !== r;
            if (expression.ops === '+')
                return l + r;
            if (expression.ops === '-')
                return l - r;
            if (expression.ops === '*')
                return l * r;
            if (expression.ops === '/')
                return l / r;
            if (expression.ops === '%')
                return l % r;
            if (expression.ops === '<')
                return l < r;
            if (expression.ops === '<=')
                return l <= r;
            if (expression.ops === '>')
                return l > r;
            if (expression.ops === '>=')
                return l >= r;
            if (expression.ops === '|')
                return l | r;
            if (expression.ops === '&')
                return l & r;
            if (expression.ops === '^')
                return l ^ r;
        },
        new: function () {
            errorBuilder('NewExpression not allowed in template interpolation -> (new ' + expression.fn + ') ');
        },
        raw: function () {
            return expression.value;
        },
        mem: function () {
            return resolveValueFromContext(expression.list, context, componentInstance, event);
        }
    };
    return internalParser[expression.type] && internalParser[expression.type]();
}
function setModelValue(key, context, componentInstance, value) {
    var modelContext = {};
    if (isarray(key)) {
        modelContext = resolveContext(key.slice(0, key.length - 1), context, componentInstance);
        key = key[key.length - 1];
    } else {
        modelContext = key in context ? context : componentInstance;
    }
    if (modelContext) {
        if (Array.isArray(key)) {
            key = resolveContext(key, context, componentInstance);
        }
        modelContext[key] = value;
    }
    modelContext = null;
    return value;
}
function resolveContext(key, context, componentInstance) {
    var isEventType = context instanceof Event;
    return key.reduce(function (accum, property, idx) {
        if (isEventType) {
            return accum[property];
        }
        var componentEntry = idx ? null : componentInstance;
        if (Array.isArray(property)) {
            var value = resolveValueFromContext(property, context, componentEntry);
            return accum && accum[value];
        }
        return resolveValueFromContext(property, accum, componentEntry);
    }, context || {});
}
function interpolationHelper(delimiterRegExp, str, replacerData) {
    if (typeof str === 'object' || isboolean(str) || isnumber(str))
        return str;
    return str.replace(delimiterRegExp, function (_, key) {
        return resolveContext(key.split('.'), replacerData);
    });
}
function AbstractEventRx() {
    this._listeners = [];
    this._hooks = [];
}
AbstractEventRx.prototype.when = function () {
    for (var i = 0; i < arguments.length; i++) {
        this._hooks.push(arguments[i]);
    }
    return this;
};
AbstractEventRx.prototype.subscribe = function (fn) {
    var index = this._listeners.length;
    var _this = this;
    if (typeof fn !== 'function') {
        errorBuilder('Expected a function got ' + typeof fn);
        return;
    }
    this._listeners.push(fn);
    return function () {
        _this._listeners.splice(index, 1);
    };
};
AbstractEventRx.prototype.destroy = function () {
    this._listeners.length = 0;
    this._hooks.length = 0;
};
function StateManager(current, callback, states) {
    this.current = '';
    this.states = states || [];
    this.set = function (name) {
        if (!validateAction(this.current, name)) {
            this.current = name;
            this.lastStateIndex = this.states.indexOf(name);
        }
    };
    function validateAction(current, next) {
        return (callback || function () {
            return false;
        })(current, next);
    }
    Object.defineProperties(this, {
        isLast: {
            get: function () {
                return this.lastStateIndex === this.states.length - 1;
            }
        },
        isFirst: {
            get: function () {
                return this.lastStateIndex < 1;
            }
        }
    });
    this.set(current);
}
StateManager.prototype.pushStates = function (states) {
    this.states.push.apply(this.states, states);
};
StateManager.prototype.next = function () {
    var next = this.lastStateIndex + 1;
    if (this.states.length - 1 >= next) {
        this.set(this.states[next]);
    }
};
StateManager.prototype.previous = function () {
    if (this.lastStateIndex) {
        this.set(this.states[this.lastStateIndex - 1]);
    }
};
StateManager.prototype.isState = function (state) {
    return state === this.current;
};
StateManager.prototype.setClass = function (state) {
    return this.isState(state) ? 'active' : '';
};
function EventEmitter() {
    AbstractEventRx.call(this);
}
EventEmitter.prototype = Object.create(AbstractEventRx.prototype);
EventEmitter.prototype.constructor = AbstractEventRx;
EventEmitter.prototype.emit = function (args) {
    _eventRxTrigger(this, args);
};
function Promise2(callback, extension) {
    var _catchCallback = function (e) {
        console.error(e);
    };
    var defer = {
        success: [],
        error: [],
        state: {
            pending: true,
            value: undefined
        }
    };
    var noop = function () {
    };
    function trigger(code) {
        return function (response) {
            defer.state.pending = false;
            defer.state.value = response;
            defer.state.resolvedWith = code;
            while (defer[code].length) {
                call(defer[code].shift());
            }
        };
    }
    function call(fn) {
        defer.state.value = (fn || noop)(defer.state.value);
    }
    function commitOrTrigger(type, fn) {
        if (!defer.state.pending) {
            if (type === defer.state.resolvedWith) {
                call(fn);
            }
        } else {
            defer[type].push(fn);
        }
    }
    this.onSuccess = function (fn) {
        commitOrTrigger('success', fn);
        return this;
    };
    this.onError = function (fn) {
        commitOrTrigger('error', fn);
        return this;
    };
    this.then = function (done, fail) {
        this.onSuccess(done);
        this.onError(fail);
        return this;
    };
    this.catch = function (catchFn) {
        _catchCallback = catchFn;
    };
    if (extension) {
        for (var action in extension) {
            this[action] = extension[action];
        }
    }
    if (callback) {
        try {
            callback(trigger('success'), trigger('error'));
        } catch (e) {
            _catchCallback(e);
        }
    } else {
        throw Error('DBPromise requires a callback method');
    }
}
Promise2.extension = function (callback, events) {
    var eventRegistry = {};
    this.handlers = (events || []).reduce(function (acc, event) {
        acc[event] = registry(event);
        eventRegistry[event] = [];
        return acc;
    }, {});
    function registry(event) {
        return function (fn) {
            eventRegistry[event].push(fn || callback);
            return this;
        };
    }
    this.call = function (eventName, args) {
        if (eventRegistry[eventName] && eventRegistry[eventName].length) {
            while (eventRegistry[eventName].length) {
                eventRegistry[eventName].shift().apply(null, args);
            }
        } else {
            callback.apply(null, args);
        }
    };
};
Promise2.all = function (resolve) {
    var slice = [].slice;
    var resolveValues = arguments.length == 1 && resolve.length ? resolve : slice.call(arguments);
    var length = resolveValues.length;
    var remaining = length;
    var failed = 0;
    var results = [];
    return new Promise2(function (resolve, reject) {
        function updateDefered(idx, err) {
            return function (res) {
                results[idx] = res;
                if (err) {
                    ++failed;
                }
                if (!--remaining) {
                    (failed ? reject : resolve)(results);
                }
            };
        }
        for (var i = 0; i < length; i++) {
            var cur = resolveValues[i];
            if (cur instanceof Promise2 || cur instanceof Promise) {
                cur.then(updateDefered(i), updateDefered(i, true));
            } else {
                updateDefered(i)(cur);
            }
        }
    });
};
function EventManager(defaultCallback, eventExtensionMethod) {
    var _events = {};
    this.defaultCallback = defaultCallback || function () {
    };
    this.eventExtensionMethod = typeof eventExtensionMethod === 'function' ? eventExtensionMethod : function (obj) {
        return obj;
    };
    this.add = function (eventName, callback) {
        if (!_events.hasOwnProperty(eventName)) {
            _events[eventName] = [];
        }
        _events[eventName].push(callback);
        return _events[eventName].length - 1;
    };
    this.get = function (eventName) {
        return _events[eventName] || [];
    };
}
EventManager.prototype._eventsObj = function (type) {
    return this.eventExtensionMethod({
        type: type,
        timestamp: +new Date(),
        isTrusted: true,
        returnValue: true,
        target: null,
        defaultPrevented: false,
        preventDefault: function () {
            this.defaultPrevented = true;
        }
    });
};
EventManager.prototype.dispatch = function (eventName) {
    var eventObj = this._eventsObj(eventName);
    var arg = [eventObj].concat(Array.prototype.slice.call(arguments, 1, arguments.length));
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        eventListeners.forEach(function (fn) {
            fn.apply(fn, arg);
        });
    }
    if (!eventObj.defaultPrevented) {
        this.defaultCallback.apply(this.defaultCallback, arg);
    }
};
EventManager.prototype.unlink = function (eventName, index) {
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        eventListeners.splice(1, index);
    }
};
EventManager.prototype.destroy = function (eventName) {
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        eventListeners.length = 0;
    }
};
EventManager.prototype.one = function (eventName, idx) {
    var eventListeners = this.get(eventName);
    if (eventListeners) {
        return eventListeners[idx];
    }
};
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}
;
function rxDebounceTime(timeout, immediate) {
    return debounce(function (value, listener) {
        listener(true);
    }, timeout, immediate);
}
;
function rxWhile(callback) {
    return function (value, listener) {
        listener(callback(value));
    };
}
;
function rxNotify(subscription, model, ignoreCheck) {
    if (subscription.watchKey) {
        if (model) {
            var value;
            if (isfunction(subscription.watchKey)) {
                value = subscription.watchKey(model);
            } else {
                value = resolveValueFromContext(subscription.watchKey, model);
            }
            if (subscription.core && isfunction(subscription.core)) {
                if (subscription.core(value)) {
                    _trigger(subscription.handler, value);
                }
            } else if (ignoreCheck || _comparison(value, subscription)) {
                _trigger(subscription.handler, value);
            }
        }
    } else {
        subscription.handler(model);
    }
}
function _trigger(handlers, value) {
    if (Array.isArray(handlers)) {
        handlers.forEach(function (cb) {
            cb(value);
        });
    } else {
        handlers(value);
    }
}
function _comparison(value, suscription) {
    var noChanges = !isequal(value, suscription.lastValue);
    suscription.lastValue = value;
    return noChanges;
}
function triggerWhen(operators, args, callback) {
    if (!operators || !operators.length) {
        return callback(true);
    }
    var inc = 0;
    var failed = false;
    function next() {
        var fn = operators[inc];
        if (fn) {
            fn(args, function (value) {
                if (!value) {
                    failed = true;
                }
                inc++;
                next();
            });
        } else {
            callback(!failed);
        }
    }
    next();
}
function _eventRxTrigger(context, value) {
    triggerWhen(context._hooks, value, function (allPassed) {
        if (allPassed) {
            context._listeners.forEach(function (fn) {
                fn(value);
            });
        }
    });
}
function rxTimeout() {
    this.subscription = new Subscription(false);
    this.play = function (timer) {
        this.timerId = nativeTimeout(() => this.subscription.notify(SubscriptionStates.onSuccess), timer || 100);
        return this;
    };
}
rxTimeout.prototype.subscribe = function (callback, onDestroy) {
    this.subscription.add(callback, onDestroy);
    return this;
};
rxTimeout.prototype.stop = function () {
    clearTimeout(this.timerId);
};
rxTimeout.prototype.clearTimeout = function (destroy) {
    this.stop();
    if (destroy) {
        this.subscription.destroy();
    }
};
function rxInterval() {
    this.subscription = new Subscription(false);
    this.intervalId = null;
    this.play = function (interval) {
        this.intervalId = nativeInterval(() => this.subscription.notify(SubscriptionStates.onSuccess), interval || 100);
        return this;
    };
}
rxInterval.prototype.subscribe = function (callback, onDestroy) {
    this.subscription.add(callback, onDestroy);
    return this;
};
rxInterval.prototype.stop = function () {
    clearInterval(this.intervalId);
};
rxInterval.prototype.clearInterval = function (destroy) {
    this.stop();
    if (destroy) {
        this.subscription.destroy();
    }
};
function ComponentFactoryResolver(componentFactory, viewComponent, callback, skipElementInsert) {
    if (!componentFactory || !componentFactory.ctors.exposeView) {
        errorBuilder('No exported factory found for <' + componentFactory.ctors.selector + '>');
        return null;
    }
    if (!viewComponent) {
        throw new Error('Unable to determine viewRef');
    }
    var viewDefinition = {
        name: componentFactory.ctors.selector,
        type: 'element',
        isc: true,
        providers: [componentFactory]
    };
    var componentRef = new ElementRef(viewDefinition, viewComponent, true);
    var localInjectors = new ComponentInjectors(componentRef);
    ElementCompiler(componentFactory, componentRef, localInjectors, function (componentInstance) {
        if (!skipElementInsert) {
            elementInsertAfter(viewComponent, componentRef.nativeElement, viewComponent.nativeElement);
            viewComponent.children.add(componentRef);
        }
        noop(callback)(componentRef, componentInstance);
    });
    localInjectors = null;
    viewDefinition = null;
}
function IterableProfiler(trackBy) {
    this._destroyed = false;
    this.cacheHash = [];
    this.out = null;
    this.trackBy = trackBy || function (item, index) {
        return item || index;
    };
}
IterableProfiler.prototype.diff = function (source) {
    if (this._destroyed) {
        return false;
    }
    if (source && !(source instanceof Array)) {
        throw new Error('Collection should be an array');
    }
    this.out = {
        deleted: [],
        order: []
    };
    var noSource = !source || !source.length;
    if (noSource && (!this.cacheHash || !this.cacheHash.length)) {
        return false;
    }
    if (noSource && this.cacheHash.length) {
        this.out.deleted = Object.keys(this.cacheHash).map(Number);
        this.cacheHash.length = 0;
        return true;
    }
    var len = source.length;
    var totalCacheItem = this.cacheHash.length;
    var newCacheHash = new Array(source.length).fill('').map((_, idx) => this.trackBy(source[idx], idx));
    var operationOrder = [];
    var isDirty = false;
    var skipCheck = [];
    for (var inc = 0; inc < len; inc++) {
        if (skipCheck.includes(inc))
            continue;
        var prevIndex = this.cacheHash.indexOf(newCacheHash[inc]);
        var cacheHashIndex = newCacheHash.indexOf(this.cacheHash[inc]);
        var existsInCache = prevIndex > -1;
        var cacheIndexExistsInSource = cacheHashIndex > -1;
        var outOfCacheRange = inc > totalCacheItem - 1;
        if (existsInCache) {
            if (prevIndex !== inc) {
                isDirty = true;
                if (!cacheIndexExistsInSource) {
                    if (!outOfCacheRange) {
                        this.cacheHash.splice(inc, 1);
                        totalCacheItem--;
                        this.out.deleted.push(inc);
                    }
                } else {
                    operationOrder.push({
                        index: inc,
                        prevIndex: prevIndex,
                        state: 'move'
                    });
                }
            }
        } else {
            isDirty = true;
            var isCreateMode = outOfCacheRange || cacheIndexExistsInSource;
            if (isCreateMode) {
                this.cacheHash.splice(inc, 0, newCacheHash[inc]);
                totalCacheItem++;
            }
            operationOrder.push({
                index: inc,
                state: isCreateMode ? 'create' : 'update'
            });
        }
    }
    if (totalCacheItem > len) {
        for (var i = len; i < totalCacheItem; i++) {
            isDirty = true;
            this.out.deleted.push(i);
        }
    }
    this.cacheHash = newCacheHash;
    this.out.order = operationOrder;
    newCacheHash = null;
    operationOrder = null;
    skipCheck = null;
    return isDirty;
};
IterableProfiler.prototype.forEachDeleted = function (callback) {
    this.out.deleted.forEach(callback);
};
IterableProfiler.prototype.forEachOperation = function (callback) {
    var len = this.out.order.length;
    for (var i = 0; i < len; i++) {
        if (this.out.order[i]) {
            callback(this.out.order[i], i);
        }
    }
};
IterableProfiler.prototype.checkDuplicateRepeater = function (hash) {
    if (this.cacheHash.indexOf(hash) > -1) {
        errorBuilder('Duplicate values are not allowed in repeaters. Use \'track by\' expression to specify unique keys');
    }
};
IterableProfiler.prototype.attachTrackBy = function (fn) {
    if (!isfunction(fn))
        return;
    this.trackBy = fn;
};
IterableProfiler.prototype.destroy = function () {
    this._destroyed = true;
    this.cacheHash.length = 0;
    this.out = null;
};
function InterceptorResolver(interceptorToken, locals) {
    var interceptors = Inject(interceptorToken);
    return new Promise(function (resolve, reject) {
        if (!interceptors || !interceptors.length) {
            return resolve();
        }
        var len = 0;
        function next() {
            var interceptor = interceptors[len];
            len++;
            if (interceptor) {
                interceptor.resolve(locals, next, reject);
            } else {
                resolve();
            }
        }
        next();
    });
}
function LazyLoader(dropZone) {
    this.dropZone = dropZone;
    this.setPath = function (path) {
        this.sourcePath = path;
        return this;
    };
}
LazyLoader.prototype.js = function (obj, callback) {
    this._resolve(obj, callback, 'js');
};
LazyLoader.prototype.css = function (obj) {
    this._resolve(obj, null, 'css');
};
LazyLoader.prototype.jscs = function (obj, callback) {
    for (var type in obj) {
        this._resolve(obj[type], callback, type);
    }
    return this;
};
LazyLoader.prototype._resolve = function (filePaths, callback, type) {
    var stack = [], self = this;
    if (typeof callback !== 'function') {
        callback = function () {
        };
    }
    if (filePaths && isarray(filePaths) && filePaths.length > 0) {
        for (var i = 0; i < filePaths.length; i++) {
            if (LazyLoader.cached.hasOwnProperty(filePaths[i])) {
                break;
            }
            LazyLoader.cached[filePaths[i]] = '' + Math.random();
            switch (type) {
            case 'css':
                _createCss(filePaths[i]);
                break;
            case 'js':
                _createJs(filePaths[i]);
                break;
            }
            ;
        }
        if (type === 'js' && stack.length) {
            process(callback);
        } else {
            callback();
        }
    }
    function _createCss(cssPath) {
        var styleElement = document.createElement('link');
        styleElement.setAttribute('type', 'text/css');
        styleElement.setAttribute('href', clink(cssPath));
        styleElement.setAttribute('rel', 'stylesheet');
        styleElement.setAttribute('id', LazyLoader.cached[cssPath]);
        append(styleElement);
    }
    function _createJs(jsPath) {
        var scriptElement = document.createElement('script');
        scriptElement.setAttribute('src', clink(jsPath));
        scriptElement.setAttribute('type', 'text/javascript');
        scriptElement.async = true;
        scriptElement.setAttribute('id', LazyLoader.cached[jsPath]);
        stack.push(scriptElement);
    }
    function clink(path) {
        if (path.includes('//')) {
            return path;
        }
        return [
            self.sourcePath,
            path,
            '.',
            type
        ].join('');
    }
    function append(scriptElement) {
        (self.dropZone || document.getElementsByTagName('head')[0]).appendChild(scriptElement);
    }
    function process(isCallback) {
        var currentElement = stack.shift();
        append(currentElement);
        currentElement.onreadystatechange = currentElement.onload = function () {
            var state = currentElement.readyState;
            if (!isCallback.done && (!state || /loaded|complete/.test(state))) {
                if (stack.length) {
                    process(isCallback);
                } else {
                    isCallback.done = true;
                    isCallback();
                }
            }
        };
    }
    ;
};
LazyLoader.cached = {};
LazyLoader.staticLoader = function () {
    LazyLoader.prototype._resolve.apply({}, arguments);
};
var jeliContext = Object.create({
    buildTime: Date.now(),
    version: __buildOptions.version,
    debug: jeliDebugger
});
function jeliQuerySelector(b, c) {
    if ((b.nativeElement || b.nativeNode) === c) {
        return b;
    } else if (b.children) {
        for (var e of b.children._list) {
            const f = jeliQuerySelector(e, c);
            if (f)
                return f;
        }
    } else {
        return null;
    }
}
;
function jeliDebugger(element) {
    if (element && CoreBootstrapContext.enableDebugger) {
        return element[$elementContext];
    }
    return null;
}
global.jeli = jeliContext;
var nativeTimeout = window.setTimeout;
var nativeInterval = window.setInterval;
window.setTimeout = function (fn, timer, trigerDetector) {
    return nativeTimeout(trigger(fn, trigerDetector), timer);
};
window.setInterval = function (fn, interval, trigerDetector) {
    return nativeInterval(trigger(fn, trigerDetector), interval);
};
function trigger(fn, trigerDetector) {
    return function () {
        fn();
        trigerDetector && ChangeDetector();
    };
}
;
},
1154 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'ReversePipe', () => { return ReversePipe;});
__required.r(exports, 'FilterPipe', () => { return FilterPipe;});
__required.r(exports, 'whereFilterFn', () => { return whereFilterFn;});
__required.r(exports, 'upperCaseFilter', () => { return upperCaseFilter;});
__required.r(exports, 'QueryFactory', () => { return QueryFactory;});
__required.r(exports, 'orderByFilterFn', () => { return orderByFilterFn;});
__required.r(exports, 'lowerCaseFilter', () => { return lowerCaseFilter;});
__required.r(exports, 'jsonFilterFn', () => { return jsonFilterFn;});
__required.r(exports, 'NumberFilter', () => { return NumberFilter;});
__required.r(exports, 'CurrencyFilter', () => { return CurrencyFilter;});
__required.r(exports, 'capitalizeFilter', () => { return capitalizeFilter;});
__required.r(exports, 'ClassDirective', () => { return ClassDirective;});
__required.r(exports, 'SwitchDefaultDirective', () => { return SwitchDefaultDirective;});
__required.r(exports, 'SwitchCaseDirective', () => { return SwitchCaseDirective;});
__required.r(exports, 'SwitchDirective', () => { return SwitchDirective;});
__required.r(exports, 'IfDirective', () => { return IfDirective;});
__required.r(exports, 'ForDirective', () => { return ForDirective;});
__required.r(exports, 'CommonModule', () => { return CommonModule;});
var helpers = __required(1132);
var isundefined = helpers.isundefined;
var isfunction = helpers.isfunction;
var isarray = helpers.isarray;
var isobject = helpers.isobject;
var isequal = helpers.isequal;
var core = __required(1153);
var ElementClassList = core.ElementClassList;
var IterableProfiler = core.IterableProfiler;
var __buildOptions = {};
function jForRow(context, index, count) {
    this.count = count;
    this.index = index;
    this.$context = context;
    Object.defineProperties(this, {
        first: {
            get: function () {
                return this.index > 0;
            }
        },
        last: {
            get: function () {
                return this.count - 1 === this.index;
            }
        },
        even: {
            get: function () {
                return this.index % 2 === 0;
            }
        },
        odd: {
            get: function () {
                return !this.even;
            }
        }
    });
}
var ForDirective = function () {
    'use strict';
    function ForDirective(viewRef, templateRef) {
        this.viewRef = viewRef;
        this.templateRef = templateRef;
        this.iterable = new IterableProfiler();
        this._forTrackBy = null;
        this._forValue = null;
        this._isForIn = false;
        this._isForOf = false;
        this.inProgress = false;
        Object.defineProperties(this, {
            forIn: {
                set: function (value) {
                    this._isForIn = true;
                    this._forValue = value;
                    this.willObserve();
                },
                get: function () {
                    if (!this._isForIn)
                        return null;
                    return this._forValue;
                }
            },
            forOf: {
                set: function (value) {
                    this._isForOff = true;
                    this._forValue = value;
                    this.willObserve();
                },
                get: function () {
                    if (!this._isForOff)
                        return null;
                    return this._forValue;
                }
            },
            forTrackBy: {
                set: function (fn) {
                    this.iterable.attachTrackBy(fn);
                    this._forTrackBy = fn;
                },
                get: function () {
                    return this._forTrackBy;
                }
            }
        });
    }
    ForDirective.prototype._listenerFn = function () {
        var _this = this;
        this.iterable.forEachDeleted(function (index) {
            _this.viewRef.remove(index);
        });
        this.iterable.forEachOperation(function (item) {
            switch (item.state) {
            case 'create':
                var context = new jForRow(_this._forValue[item.index], item.index, null);
                _this.viewRef.createEmbededView(_this.templateRef, context, item.index);
                break;
            case 'update':
                var view = _this.viewRef.get(item.index);
                view.updateContext({ $context: _this._forValue[item.index] });
                break;
            case 'move':
                _this.viewRef.move(item.prevIndex, item.index);
                break;
            }
        });
        for (var i = 0; i < this.viewRef.length; i++) {
            var view = _this.viewRef.get(i);
            view.updateContext({
                index: i,
                count: _this._forValue.length
            });
        }
        this.inProgress = false;
    };
    ForDirective.prototype.willObserve = function () {
        var changes = this.iterable.diff(this._forValue);
        if (changes && !this.inProgress)
            this.inProgress = true;
        this._listenerFn();
    };
    ForDirective.prototype.viewDidDestroy = function () {
        this.viewRef.clearView();
        this.iterable.destroy();
        this.viewRef = null;
        this.templateRef = null;
    };
    ForDirective.ctors = {
        selector: 'for',
        props: {
            forIn: {},
            forOf: {},
            forTrackBy: { type: 'Function' }
        },
        DI: [
            {
                optional: true,
                tokenName: 'ViewRef'
            },
            {
                optional: true,
                tokenName: 'TemplateRef'
            }
        ]
    };
    return ForDirective;
}();
var IfDirective = function () {
    'use strict';
    function IfDirective(viewRef, templateRef) {
        this._jIfValue = false;
        this._thenTemplateRef = templateRef;
        this._elseTemplateRef = null;
        this._thenView = null;
        this._elseView = null;
        this.createView = function () {
            if (this._jIfValue) {
                if (!this._thenView) {
                    viewRef.clearView();
                    this._elseView = null;
                    if (this._thenTemplateRef) {
                        this._thenView = viewRef.createEmbededView(this._thenTemplateRef);
                    }
                }
            } else {
                if (!this._elseView) {
                    viewRef.clearView();
                    this._thenView = null;
                    if (this._elseTemplateRef) {
                        this._elseView = viewRef.createEmbededView(this._elseTemplateRef);
                    }
                }
            }
        };
        Object.defineProperties(this, {
            if: {
                set: function (value) {
                    this._jIfValue = value;
                    this.createView();
                },
                get: function () {
                    return this._jIfValue;
                }
            },
            ifElse: {
                set: function (templateRef) {
                    this._elseTemplateRef = templateRef;
                    this.createView();
                }
            },
            ifThen: {
                set: function (templateRef) {
                    if (templateRef) {
                        this._thenTemplateRef = templateRef;
                        this.createView();
                    }
                }
            }
        });
    }
    IfDirective.ctors = {
        selector: 'if',
        props: {
            if: {},
            ifElse: { type: 'TemplateRef' },
            ifThen: { type: 'TemplateRef' }
        },
        DI: [
            {
                optional: true,
                tokenName: 'ViewRef'
            },
            {
                optional: true,
                tokenName: 'TemplateRef'
            }
        ]
    };
    return IfDirective;
}();
function SwitchViewContext(viewRef, templateRef) {
    this._isCreated = false;
    this.setState = function (create) {
        if (create && !this._isCreated) {
            this.createView();
        } else if (!create && this._isCreated) {
            this.destroyView();
        }
    };
    this.createView = function () {
        this._isCreated = true;
        viewRef.createEmbededView(templateRef);
    };
    this.destroyView = function () {
        this._isCreated = false;
        viewRef.clearView();
    };
}
var SwitchDirective = function () {
    'use strict';
    function SwitchDirective() {
        this._caseCount = 0;
        this.defaultViews;
        this._lastCaseCheckIndex = 0;
        this._isDefaultCase = false;
        this._previousValue = undefined;
        this._lastCaseMatched = false;
        this._addCase = function () {
            this._caseCount++;
        };
        this._addDefaultView = function (viewContext) {
            if (!this.defaultViews) {
                this.defaultViews = [];
            }
            this.defaultViews.push(viewContext);
        };
        Object.defineProperty(this, 'switch', {
            set: function (value) {
                this._jSwitch = value;
                if (isequal(this._caseCount, 0)) {
                    this._compileDefaultView(true);
                }
            }
        });
    }
    SwitchDirective.prototype._compileDefaultView = function (isDefaultCase) {
        if (this.defaultViews && !isequal(this._isDefaultCase, isDefaultCase)) {
            this._isDefaultCase = isDefaultCase;
            for (var i = 0; i < this.defaultViews.length; i++) {
                var defaultView = this.defaultViews[i];
                defaultView.setState(isDefaultCase);
            }
        }
    };
    SwitchDirective.prototype.viewDidDestroy = function () {
    };
    SwitchDirective.prototype._matchCase = function (caseValue) {
        var matched = isequal(this._jSwitch, caseValue);
        this._lastCaseMatched = this._lastCaseMatched || matched;
        this._lastCaseCheckIndex++;
        if (isequal(this._lastCaseCheckIndex, this._caseCount)) {
            this._compileDefaultView(!this._lastCaseMatched);
            this._lastCaseCheckIndex = 0;
            this._lastCaseMatched = false;
        }
        return matched;
    };
    SwitchDirective.ctors = {
        selector: 'switch',
        props: { switch: {} }
    };
    return SwitchDirective;
}();
var SwitchCaseDirective = function () {
    'use strict';
    function SwitchCaseDirective(viewRef, templateRef, jSwitch) {
        jSwitch._addCase();
        this._view = new SwitchViewContext(viewRef, templateRef);
        this.willObserve = function () {
            this._view.setState(jSwitch._matchCase(this.switchCase));
        };
    }
    SwitchCaseDirective.ctors = {
        selector: 'switchCase',
        props: { switchCase: {} },
        DI: [
            {
                optional: true,
                tokenName: 'ViewRef'
            },
            {
                optional: true,
                tokenName: 'TemplateRef'
            },
            {
                optional: true,
                value: 'switch',
                tokenName: 'ParentRef'
            }
        ]
    };
    return SwitchCaseDirective;
}();
var SwitchDefaultDirective = function () {
    'use strict';
    function SwitchDefaultDirective(viewRef, templateRef, jSwitch) {
        jSwitch._addDefaultView(new SwitchViewContext(viewRef, templateRef));
    }
    SwitchDefaultDirective.ctors = {
        selector: 'switchDefault',
        DI: [
            {
                optional: true,
                tokenName: 'ViewRef'
            },
            {
                optional: true,
                tokenName: 'TemplateRef'
            },
            {
                optional: true,
                value: 'switch',
                tokenName: 'ParentRef'
            }
        ]
    };
    return SwitchDefaultDirective;
}();
var ClassDirective = function () {
    'use strict';
    function ClassDirective(elementRef) {
        this._jClass = undefined;
        this.lastAddedClass = '';
        this._changeClass = function () {
            if (isobject(this._jClass)) {
                ElementClassList.add(elementRef.nativeElement, this._jClass);
            } else {
                if (this.lastAddedClass == this._jClass)
                    return;
                ElementClassList.remove(elementRef.nativeElement, this.lastAddedClass);
                if (this._jClass) {
                    ElementClassList.add(elementRef.nativeElement, this._jClass);
                }
                this.lastAddedClass = this._jClass;
            }
        };
        Object.defineProperty(this, 'class', {
            set: function (value) {
                this._jClass = value;
                this._changeClass();
            },
            get: function () {
                return this._jClass;
            }
        });
    }
    ClassDirective.ctors = {
        selector: 'jClass',
        props: { class: { value: 'jClass' } },
        DI: [{
                optional: true,
                tokenName: 'ElementRef'
            }]
    };
    return ClassDirective;
}();
var capitalizeFilter = function () {
    'use strict';
    function capitalizeFilter() {
        this.compile = function (value) {
            if (!value)
                return '';
            if (typeof value !== 'string')
                return value;
            return value.charAt(0).toUpperCase() + value.slice(1);
        };
    }
    capitalizeFilter.ctors = { name: 'capitalize' };
    return capitalizeFilter;
}();
var NumberFilter = function () {
    'use strict';
    function NumberFilter() {
        function format(n, x, s, c) {
            if (!!window.Intl) {
                var numFormat = new Intl.NumberFormat(navigator.language);
                return numFormat.format(this);
            } else {
                var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')', num = this.toFixed(Math.max(0, ~~n));
                return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
            }
        }
        this.compile = function (value, factoRize) {
            if (!isarray(factoRize)) {
                factoRize = [
                    factoRize,
                    3,
                    ',',
                    '.'
                ];
            }
            return format.apply(value || 0, factoRize);
        };
    }
    NumberFilter.ctors = { name: 'number' };
    return NumberFilter;
}();
var CurrencyFilter = function () {
    'use strict';
    function CurrencyFilter(numberFilter) {
        this.compile = function (value, style) {
            if (!!window.Intl) {
                var currencyFormat = new Intl.NumberFormat(window.navigator.language, style);
                return currencyFormat.format(value);
            } else {
                return (style && style.currency) + numberFilter.format(value);
            }
        };
    }
    CurrencyFilter.ctors = {
        name: 'currency',
        DI: [NumberFilter]
    };
    return CurrencyFilter;
}();
var jsonFilterFn = function () {
    'use strict';
    function jsonFilterFn() {
        this.compile = function (value, spacing) {
            return typeof value === 'object' ? JSON.stringify(value, null, parseInt(spacing || '0')) : value;
        };
    }
    jsonFilterFn.ctors = { name: 'json' };
    return jsonFilterFn;
}();
var lowerCaseFilter = function () {
    'use strict';
    function lowerCaseFilter() {
        this.compile = function (value) {
            return (value || '').toLowerCase();
        };
    }
    lowerCaseFilter.ctors = { name: 'lowercase' };
    return lowerCaseFilter;
}();
var QueryFactory = function () {
    'use strict';
    function QueryFactory(data) {
        this.sortBy = function () {
            var sortArguments = arguments;
            if (isarray(data) && isobject(data[0])) {
                return data.sort(function (obj1, obj2) {
                    var props = sortArguments, i = 0, result = 0, numberOfProperties = props.length, compare = _compare(obj1, obj2);
                    while (result === 0 && i < numberOfProperties) {
                        result = compare(props[i]);
                        i++;
                    }
                    return result;
                });
            }
            function _compare(a, b) {
                var sortOrder = 1;
                return function (property) {
                    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
                    return result * sortOrder;
                };
            }
            return data;
        };
        return this;
    }
    ;
    QueryFactory.ctors = {};
    return QueryFactory;
}();
var orderByFilterFn = function () {
    'use strict';
    function orderByFilterFn() {
        this.compile = function (value, propertyName) {
            if (value.length < 2) {
                return value;
            }
            var _queryApi = new QueryFactory(value);
            var newList;
            var reverse;
            var splitedProps = propertyName.split(':');
            if (splitedProps.length > 1) {
                reverse = splitedProps.pop();
            }
            propertyName = splitedProps.pop();
            newList = _queryApi.sortBy.apply(_queryApi, propertyName.split(','));
            if (reverse) {
                return newList.reverse();
            }
            return value;
        };
    }
    orderByFilterFn.ctors = { name: 'orderBy' };
    return orderByFilterFn;
}();
var upperCaseFilter = function () {
    'use strict';
    function upperCaseFilter() {
        this.compile = function (value) {
            return (value || '').toUpperCase();
        };
    }
    upperCaseFilter.ctors = { name: 'uppercase' };
    return upperCaseFilter;
}();
var whereFilterFn = function () {
    'use strict';
    function whereFilterFn() {
        this.compile = function (model, query) {
            return new QueryFactory(model).where(query);
        };
    }
    whereFilterFn.ctors = { name: 'whereFilter' };
    return whereFilterFn;
}();
var FilterPipe = function () {
    'use strict';
    function FilterPipe() {
        this.compile = function (array, expression) {
            if (!Array.isArray(array)) {
                if (array == null)
                    return array;
                console.error('expected Array type but got ' + typeof array);
            }
            var expressionType = expression !== null ? typeof expression : 'null';
            var predicateFn = null;
            var matchAny;
            switch (expressionType) {
            case 'function':
                predicateFn = expression;
                break;
            case 'boolean':
            case 'null':
            case 'number':
            case 'string':
                matchAny = true;
            case 'object':
                predicateFn = createPredicator(expression, matchAny);
                break;
            default:
                return array;
            }
            return Array.prototype.filter.call(array, predicateFn);
        };
        function createPredicator(expression, matchAny) {
            return function (item) {
                if (isobject(expression)) {
                    for (var key in expression) {
                        var expectedValue = expression[key];
                        if (isfunction(expectedValue) || isundefined(expectedValue)) {
                            continue;
                        }
                        if (expectedValue != item[key]) {
                            return false;
                        }
                    }
                    return true;
                }
            };
        }
    }
    FilterPipe.ctors = { name: 'filter' };
    return FilterPipe;
}();
var ReversePipe = function () {
    'use strict';
    function ReversePipe() {
        this.compile = function (data) {
            if (!Array.isArray(data)) {
                console.error('Reverse pipe expected array but got ', typeof data);
                return;
            }
            return data.reverse();
        };
    }
    ReversePipe.ctors = { name: 'reverse' };
    return ReversePipe;
}();
var CommonModule = function () {
    'use strict';
    function CommonModule() {
    }
    return CommonModule;
}();
},
1155 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'TimeAgoFilterFn', () => { return TimeAgoFilterFn;});
__required.r(exports, 'dateTimeFilterFN', () => { return dateTimeFilterFN;});
__required.r(exports, 'DAYS_FULL', () => { return DAYS_FULL;});
__required.r(exports, 'DAYS_HALF', () => { return DAYS_HALF;});
__required.r(exports, 'MONTHS_FULL', () => { return MONTHS_FULL;});
__required.r(exports, 'MONTHS_HALF', () => { return MONTHS_HALF;});
__required.r(exports, 'CalendarService', () => { return CalendarService;});
__required.r(exports, 'setText', () => { return setText;});
__required.r(exports, 'DateStringConverter', () => { return DateStringConverter;});
__required.r(exports, 'getDays', () => { return getDays;});
__required.r(exports, 'leapYear', () => { return leapYear;});
__required.r(exports, 'DatetimeService', () => { return DatetimeService;});
__required.r(exports, 'calendarFN', () => { return calendarFN;});
__required.r(exports, 'DateTimeModule', () => { return DateTimeModule;});
var core = __required(1153);
var ProviderToken = core.ProviderToken;
var __buildOptions = {};
var leapYear = function (year) {
    return year % 4 == 0 ? 1 : 0;
};
var getDays = function (month, year) {
    var ar = [
        31,
        leapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];
    return ar[month];
};
var DateStringConverter = function (str) {
    function setDay(d) {
        return Number(d) < 10 ? parseInt(d) : Number(d);
    }
    if (typeof str === 'string') {
        var arr = str.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
        if (arr) {
            arr.shift();
            return new Date(arr[0], arr[1] - 1, setDay(arr[2]), arr[3] || 0, arr[4] || 0, arr[5] || 0);
        } else if (/(\d+)-(\d+)-(\d+)/.test(str)) {
            return new Date(str);
        }
    }
    return new Date();
};
var setText = function (text, future) {
    return text + (future ? ' from now' : ' ago');
};
function CalendarObject(firstDay, lastDate, date) {
    this.monthName = now.flags.MMMM;
    this.year = now.flags.YYYY;
    this.weekDays = dateTimeDayHalf;
    this.weeks = [];
    var digit = 1;
    var curCell = 1;
    for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7); ++row) {
        var weekDays = [];
        for (var col = 1; col <= 7; ++col) {
            if (digit > lastDate) {
                break;
            }
            if (curCell < firstDay) {
                weekDays.push({
                    date: null,
                    current: false
                });
                curCell++;
            } else {
                weekDays.push({
                    date: digit,
                    current: digit == date
                });
                digit++;
            }
        }
        this.weeks.push(weekDays);
    }
}
function CalendarService(year, month) {
    var date = new Date().getDate();
    if (year < 1000) {
        year += 1900;
    }
    var firstDayInstance = new Date(year, month, 1), firstDay = firstDayInstance.getDay();
    firstDayInstance = null;
    var days = getDays(month, year);
    return new CalendarObject(firstDay + 1, days, date);
}
var MONTHS_HALF = new ProviderToken('dateTimeMonthHalf', false, {
    value: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ]
});
var MONTHS_FULL = new ProviderToken('dateTimeMonthFull', false, {
    value: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
});
var DAYS_HALF = new ProviderToken('dateTimeDayHalf', false, {
    value: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ]
});
var DAYS_FULL = new ProviderToken('dateTimeDayFull', false, {
    value: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ]
});
var DatetimeService = function () {
    'use strict';
    function DatetimeService(dateTimeMonthHalf, dateTimeMonthFull, dateTimeDayHalf, dateTimeDayFull) {
        var dateFormatRegExp = /D{1,4}|M{1,4}|YY(?:YY)?|([HhMmsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
        this.dateTimeDayHalf = dateTimeDayHalf;
        this.dateTimeMonthHalf = dateTimeMonthHalf;
        this.dateTimeMonthFull = dateTimeMonthFull;
        this.dateTimeDayFull = dateTimeDayFull;
        this.format = function (date, format) {
            var toFormat = this.timeConverter(date).flags;
            return String(format).replace(dateFormatRegExp, function ($0) {
                return $0 in toFormat ? toFormat[$0] : $0.slice(1, $0.length - 1);
            });
        };
        this.buildFullCalendar = function (config) {
            var monthList = [], months = config.fullYear ? 0 : new Date().getMonth();
            for (months; months < 12; months++) {
                var date = new Date(config.year, months, 1);
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var month = CalendarService(year, month);
                month.monthName = this.dateTimeMonthFull[month - 1];
                month.year = year;
                month.weekDays = dateTimeDayHalf;
                monthList.push(month);
            }
            return monthList;
        };
    }
    DatetimeService.prototype._dateTime = function (datetime) {
        var outputDate = !isNaN(Number(datetime)) && Number(datetime) ? new Date(datetime) : DateStringConverter(datetime);
        var g = function (j) {
            return (j < 10 ? '0' : '') + j;
        };
        outputDate.current_time = [
            outputDate.getFullYear(),
            '-',
            g(Math.ceil(outputDate.getMonth() + 1)),
            '-',
            g(outputDate.getDate()),
            ' ',
            g(outputDate.getHours()),
            ':',
            g(outputDate.getMinutes()),
            ':',
            g(outputDate.getSeconds())
        ].join('');
        return outputDate;
    };
    DatetimeService.prototype.timeConverter = function (dateToParse) {
        if (!dateToParse) {
            dateToParse = this._dateTime();
        }
        var currentDateTime = this._dateTime();
        var _dateTimeToParse = dateToParse.current_time ? dateToParse : this._dateTime(dateToParse);
        var j = _dateTimeToParse.getTime();
        var l = currentDateTime.getTime();
        var B = 1000 * 60 * 60 * 24;
        var result = {};
        var p = function (m) {
            return (m < 10 ? '0' : '') + m;
        };
        if (isNaN(_dateTimeToParse.getTime())) {
            var f = n.replace(' ', 'T');
            var r = n.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/), D = r[1] + '-' + p(r[2] - 1) + '-' + r[3] + ' ' + r[4] + ':' + r[5] + ':' + r[6], _dateTimeToParse = new Date(Date.fromISO(f)), j = q.getTime();
            x = new Date();
        }
        var g = Date.UTC(_dateTimeToParse.getFullYear(), _dateTimeToParse.getMonth(), _dateTimeToParse.getDate()), f = Date.UTC(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate()), days = Math.floor((f - g) / B), future = j > l, futureDiff = future ? j - l : l - j;
        result.getTime = function () {
            return j;
        };
        result.ctimestamp = g;
        result.timestamp = f;
        result.time_difference = {
            seconds: Math.floor(futureDiff / 3600000 * (60 * 60)),
            minutes: Math.floor(futureDiff / 3600000 * 60),
            hours: Math.floor(futureDiff / 3600000),
            weeks: Math.floor(days / 7),
            days: days,
            months: Math.floor(days / 30)
        };
        var year = _dateTimeToParse.getFullYear(), month = _dateTimeToParse.getMonth() + 1, day = _dateTimeToParse.getDate(), weekDay = _dateTimeToParse.getDay(), timeSettings = _dateTimeToParse.current_time.split(' ')[1].split(':'), hours = timeSettings[0], minute = parseInt(timeSettings[1]), seconds = parseInt(timeSettings[2]);
        result.flags = {
            YYYY: year,
            YY: String(year).slice(2),
            M: month,
            MM: p(month),
            MMM: this.dateTimeMonthHalf[month - 1],
            MMMM: this.dateTimeMonthFull[month - 1],
            D: day,
            DD: p(day),
            DDD: this.dateTimeDayHalf[weekDay],
            DDDD: this.dateTimeDayFull[weekDay],
            h: hours % 12 || 12,
            hh: p(hours),
            H: hours,
            HH: p(hours),
            m: minute,
            mm: p(minute),
            s: seconds,
            ss: p(seconds),
            t: hours < 12 ? 'a' : 'p',
            tt: hours < 12 ? 'am' : 'pm',
            T: hours < 12 ? 'A' : 'P',
            TT: hours < 12 ? 'AM' : 'PM'
        };
        result.isLeapYear = leapYear(year);
        result.today = this.dateTimeDayHalf[currentDateTime.getDay()] + ', ' + currentDateTime.getDate() + ' ' + this.dateTimeMonthHalf[currentDateTime.getMonth()];
        if (currentDateTime.getFullYear() > _dateTimeToParse.getFullYear()) {
            result.date = this.dateTimeMonthHalf[_dateTimeToParse.getMonth()] + ', ' + _dateTimeToParse.getDate() + ' ' + _dateTimeToParse.getFullYear();
        } else {
            result.date = this.dateTimeDayHalf[_dateTimeToParse.getDay()] + ', ' + _dateTimeToParse.getDate() + ' ' + this.dateTimeMonthHalf[_dateTimeToParse.getMonth()];
        }
        if (result.time_difference.seconds <= 60) {
            result.timeago = result.time_difference.seconds + setText(' seconds', future);
        } else {
            if (result.time_difference.minutes <= 60) {
                if (result.time_difference.minutes == 1) {
                    result.timeago = setText('1 minute', future);
                } else {
                    result.timeago = result.time_difference.minutes + setText(' minutes', future);
                }
            } else {
                if (result.time_difference.hours <= 24) {
                    if (result.time_difference.hours == 1) {
                        result.timeago = setText('an hour', future);
                    } else {
                        result.timeago = result.time_difference.hours + setText(' hours', future);
                    }
                } else {
                    if (result.time_difference.days <= 7) {
                        if (result.time_difference.days == 1) {
                            result.timeago = 'Yesterday';
                        } else {
                            result.timeago = result.time_difference.days + setText(' days', future);
                        }
                    } else {
                        if (result.time_difference.weeks <= 4) {
                            if (result.time_difference.weeks == 1) {
                                result.timeago = setText('1 week');
                            } else {
                                result.timeago = result.time_difference.weeks + setText(' weeks', future);
                            }
                        } else {
                            if (result.time_difference.months <= 12) {
                                if (result.time_difference.months == 1) {
                                    result.timeago = setText('1 month', future);
                                } else {
                                    result.timeago = result.date;
                                }
                            } else {
                                result.timeago = result.date;
                            }
                        }
                    }
                }
            }
        }
        return result;
    };
    DatetimeService.ctors = {
        DI: [
            MONTHS_HALF,
            MONTHS_FULL,
            DAYS_HALF,
            DAYS_FULL
        ]
    };
    return DatetimeService;
}();
var calendarFN = function () {
    'use strict';
    function calendarFN($dateTimeFactory) {
        var defaultConfig = {
            fullYear: !1,
            year: new Date().getFullYear()
        };
        this.config = '';
        this.didInit = function () {
            var config = extend(defaultConfig, this.config);
            this.calendar = $dateTimeFactory.buildFullCalendar(config);
        };
    }
    calendarFN.ctors = {
        selector: 'jx-calendar',
        props: { config: {} },
        DI: [DatetimeService]
    };
    return calendarFN;
}();
var dateTimeFilterFN = function () {
    'use strict';
    function dateTimeFilterFN(dateTimeFactory) {
        this.compile = function (text, replacer) {
            return dateTimeFactory.format(text, replacer);
        };
    }
    dateTimeFilterFN.ctors = {
        name: 'dateTime',
        DI: [DatetimeService]
    };
    return dateTimeFilterFN;
}();
var TimeAgoFilterFn = function () {
    'use strict';
    function TimeAgoFilterFn(dateTimeFactory) {
        this.compile = function (text) {
            return dateTimeFactory.timeConverter(text).timeago;
        };
    }
    TimeAgoFilterFn.ctors = {
        name: 'timeAgo',
        DI: [DatetimeService]
    };
    return TimeAgoFilterFn;
}();
var DateTimeModule = function () {
    'use strict';
    function DateTimeModule() {
    }
    return DateTimeModule;
}();
},
1156 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'FormRepeaterService', () => { return FormRepeaterService;});
__required.r(exports, 'RangeEventBinder', () => { return RangeEventBinder;});
__required.r(exports, 'ResolveRangeBinder', () => { return ResolveRangeBinder;});
__required.r(exports, 'NumberEventBinder', () => { return NumberEventBinder;});
__required.r(exports, 'ResolveNumberBinder', () => { return ResolveNumberBinder;});
__required.r(exports, 'getValueAccessor', () => { return getValueAccessor;});
__required.r(exports, 'ModelDirective', () => { return ModelDirective;});
__required.r(exports, 'OptionDirective', () => { return OptionDirective;});
__required.r(exports, 'SelectEventBinder', () => { return SelectEventBinder;});
__required.r(exports, 'ResolveSelectBinder', () => { return ResolveSelectBinder;});
__required.r(exports, 'RadioEventBinder', () => { return RadioEventBinder;});
__required.r(exports, 'RadioEventContainer', () => { return RadioEventContainer;});
__required.r(exports, 'ResolveRadioBinder', () => { return ResolveRadioBinder;});
__required.r(exports, 'CheckboxEventBinder', () => { return CheckboxEventBinder;});
__required.r(exports, 'ResolveCheckboxBinder', () => { return ResolveCheckboxBinder;});
__required.r(exports, 'DefaultEventBinder', () => { return DefaultEventBinder;});
__required.r(exports, 'ResolveDefaultBinder', () => { return ResolveDefaultBinder;});
__required.r(exports, 'FormFieldDirective', () => { return FormFieldDirective;});
__required.r(exports, 'FormFieldControlService', () => { return FormFieldControlService;});
__required.r(exports, 'AbstractValueAccessor', () => { return AbstractValueAccessor;});
__required.r(exports, 'VALUE_ACCESSOR', () => { return VALUE_ACCESSOR;});
__required.r(exports, 'FormFieldControlDirective', () => { return FormFieldControlDirective;});
__required.r(exports, 'formValidationStack', () => { return formValidationStack;});
__required.r(exports, 'customFormValidator', () => { return customFormValidator;});
__required.r(exports, 'FormValidatorService', () => { return FormValidatorService;});
__required.r(exports, 'FormControlAbstract', () => { return FormControlAbstract;});
__required.r(exports, 'FormControlService', () => { return FormControlService;});
__required.r(exports, 'AbstractFormControl', () => { return AbstractFormControl;});
__required.r(exports, 'FormControlNameDirective', () => { return FormControlNameDirective;});
__required.r(exports, 'FormControlDirective', () => { return FormControlDirective;});
__required.r(exports, 'FormModule', () => { return FormModule;});
var utils = __required(1152);
var extend = utils.extend;
var helpers = __required(1132);
var inarray = helpers.inarray;
var isboolean = helpers.isboolean;
var isnull = helpers.isnull;
var isstring = helpers.isstring;
var isnumber = helpers.isnumber;
var isequal = helpers.isequal;
var isarray = helpers.isarray;
var isfunction = helpers.isfunction;
var isundefined = helpers.isundefined;
var isobject = helpers.isobject;
var isempty = helpers.isempty;
var core = __required(1153);
var ProviderToken = core.ProviderToken;
var AttributeAppender = core.AttributeAppender;
var closureRef = core.closureRef;
var EventEmitter = core.EventEmitter;
var errorBuilder = core.errorBuilder;
var __buildOptions = {};
function AbstractFormControl(changeDetector) {
    this.changeDetector = changeDetector;
    this._registered = false;
    this.formName = '';
    this._formFields = [];
    this.form = null;
}
AbstractFormControl.prototype.addField = function (formFieldInstance) {
    var formControl = this.form.getField(formFieldInstance.name);
    setupControl(formControl, formFieldInstance);
    this.form.updateValueAndStatus({ emitEvent: false });
    this._formFields.push(formFieldInstance);
    return formControl;
};
AbstractFormControl.prototype.removeField = function (formFieldInstance) {
    this._formFields.splice(this._formFields.indexOf(formFieldInstance), 1);
};
AbstractFormControl.prototype.getField = function (fieldName) {
    return this.form.getField(fieldName);
};
AbstractFormControl.prototype.resetForm = function (values) {
    this.form.reset(values);
};
AbstractFormControl.prototype.viewDidDestroy = function () {
    if (this.form) {
        this.form = null;
    }
};
var FormControlDirective = function () {
    'use strict';
    function FormControlDirective(changeDetector) {
        AbstractFormControl.call(this, changeDetector);
        Object.defineProperty(this, 'formControl', {
            set: function (formControl) {
                this.form = formControl;
                _validateAndBindStatus(this);
            }
        });
    }
    FormControlDirective.prototype = Object.create(AbstractFormControl.prototype);
    FormControlDirective.prototype.constructor = FormControlDirective;
    FormControlDirective.ctors = {
        selector: 'formControl',
        props: { formControl: {} },
        DI: [{
                optional: true,
                tokenName: 'changeDetector'
            }]
    };
    return FormControlDirective;
}();
var FormControlNameDirective = function () {
    'use strict';
    function FormControlNameDirective(parentControl, changeDetector) {
        AbstractFormControl.call(this, changeDetector);
        if (!parentControl || !(parentControl instanceof FormControlDirective)) {
            return errorBuilder('Expected instance of FormControlService but got ' + typeof parentControl);
        }
        Object.defineProperty(this, 'formControlName', {
            set: function (formName) {
                this.formName = formName;
                this.form = parentControl.getField(formName);
                _validateAndBindStatus(this);
            }
        });
    }
    FormControlNameDirective.prototype = Object.create(AbstractFormControl.prototype);
    FormControlNameDirective.prototype.constructor = FormControlNameDirective;
    FormControlNameDirective.ctors = {
        selector: 'formControlName',
        props: { formControlName: {} },
        DI: [
            {
                optional: true,
                value: 'formControl',
                tokenName: 'ParentRef'
            },
            {
                optional: true,
                tokenName: 'changeDetector'
            }
        ],
        exportAs: 'formControl'
    };
    return FormControlNameDirective;
}();
function CurrentInstance(next) {
    this.pending = null;
    this.hasAsync = false;
    this.failed = false;
    this.errors = null;
    this.count = 0;
    this.stop = function () {
        next(this.failed ? this.errors : null);
    };
}
CurrentInstance.prototype.add = function (totalValidators) {
    this.count = totalValidators;
    this.errors = {};
    this.failed = false;
    this.hasAsync = false;
    this.resolve = null;
};
CurrentInstance.prototype.rem = function (passed, type) {
    this.count--;
    if (passed !== true) {
        this.failed = true;
        this.errors[type] = true;
    }
    if (!this.count) {
        this.stop();
    }
};
CurrentInstance.prototype.registerAsyncValidator = function (asyncInstance, name) {
    this.hasAsync = true;
    var _this = this;
    var callback = function (value) {
        _this.rem(value, name);
    };
    asyncInstance.then(callback, callback);
};
var formValidationStack = Object.create({
    MINLENGTH: function (value, requiredLength) {
        if (null !== value && undefined !== value)
            return String(value).length >= requiredLength;
        return true;
    },
    MAXLENGTH: function (value, requiredLength) {
        if (value)
            return String(value).length <= requiredLength;
        return true;
    },
    EMAILVALIDATION: function (value) {
        var regExp = '^(([\\w]+(\\.[\\w]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        return formValidationStack.PATTERN(value, regExp);
    },
    ISEMPTY: function (val, def) {
        return def === isempty(val);
    },
    BOOLEAN: function (value, def) {
        return isboolean(value) && isequal(value, def);
    },
    DOMAINVALIDATION: function (domain) {
        return formValidationStack.PATTERN(domain, '[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:.[a-zA-Z]{2,})+');
    },
    MEDIUMPASSWORDSTRENGTH: function (passwd) {
        return formValidationStack.PATTERN(passwd, '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
    },
    STRONGPASSWORDSTRENGTH: function (passwd) {
        return formValidationStack.PATTERN(passwd, '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
    },
    PATTERN: function (value, pattern) {
        return new RegExp(pattern).test(value);
    },
    REQUIRED: function (value, required) {
        if (required) {
            return !isundefined(value) && !isnull(value) && '' !== value;
        }
        return !required;
    },
    REQUIREDTRUE: function (value) {
        return isboolean(value) && value === true;
    },
    MINNUMBER: function (value, minNumber) {
        if (null !== value && undefined !== value) {
            value = Number(value);
            return !isNaN(value) && minNumber <= value;
        }
        return true;
    },
    MAXNUMBER: function (value, maxNumber) {
        if (value) {
            value = Number(value);
            return !isNaN(value) && value <= maxNumber;
        }
        return true;
    }
});
function FormValidatorService(callback, validators) {
    var currentProcess = new CurrentInstance(callback);
    function _throwErrorIfNoValidators(validatorsObj) {
        if (!isobject(validatorsObj)) {
            throw new Error('Validators are required in order to perform validations');
        }
    }
    function _validate(value, criteria) {
        var _criteria = Object.keys(criteria);
        currentProcess.add(_criteria.length);
        for (var i = 0; i < _criteria.length; i++) {
            var validatorName = _criteria[i];
            var passed = false;
            var validatorFn = formValidationStack[validatorName.toUpperCase()];
            if (validatorFn) {
                passed = validatorFn(value, criteria[validatorName]);
            } else if (isfunction(criteria[validatorName])) {
                passed = criteria[validatorName](value);
            }
            if (isequal('async', validatorName)) {
                currentProcess.registerAsyncValidator(passed, validatorName);
            } else {
                currentProcess.rem(passed, validatorName);
                if (!passed) {
                    return currentProcess.stop();
                }
            }
        }
    }
    function _validateObjectTypes(formValues) {
        if (!Object.keys(formValues).length) {
            validationInstance.emptyFormFields = true;
            trigger();
        } else {
            var _fieldsToValidate = Object.keys(validators);
            var err = _fieldsToValidate.reduce(function (ret, key) {
                if (!formValues.hasOwnProperty(key)) {
                    ret++;
                    ErrorHandler(key, ['required']);
                }
                return ret;
            }, 0);
            if (!err) {
                currentProcess.pending.count = _fieldsToValidate.length;
                _fieldsToValidate.forEach(function (field) {
                    _validateField(formValues[field], validators[field], field);
                });
            } else {
                trigger();
            }
        }
    }
    function formValidator(formValue) {
        if (!validators) {
            return callback(null);
        }
        _throwErrorIfNoValidators(validators);
        _validate(formValue, validators);
    }
    formValidator.addValidators = function (newValidators) {
        _throwErrorIfNoValidators(newValidators);
        if (!validators) {
            validators = newValidators;
        } else {
            validators = extend(true, validators, newValidators);
        }
    };
    return formValidator;
}
function customFormValidator(validatorName, validatorFn, override) {
    if (formValidationStack.hasOwnProperty(validatorName.toUpperCase()) && !override) {
        return errorBuilder('[' + validatorName + '] already exists, please pass the override parameter to the validator');
    }
    formValidationStack[validatorName.toUpperCase()] = validatorFn;
}
;
var VALID = 'VALID';
var INVALID = 'INVALID';
var DISABLED = 'DISABLED';
var PENDING = 'PENDING';
function FormControlAbstract(validators) {
    var _this = this;
    this._parent = null;
    this.status = INVALID;
    this.value = null;
    this.error = null;
    this.touched = false;
    this._pendingValue = null;
    this._onDisableEvents = [];
    this._onControlChangeListener = function () {
    };
    this.validator = FormValidatorService(function (errors) {
        _this.setError(errors, true);
    }, validators);
    this.valueChanges = new EventEmitter();
    this.statusChanged = new EventEmitter();
    Object.defineProperties(this, {
        parent: {
            get: function () {
                return this._parent;
            }
        },
        untouched: {
            get: function () {
                return !this.touched;
            }
        },
        invalid: {
            get: function () {
                return isequal(this.status, INVALID);
            }
        },
        enabled: {
            get: function () {
                return !isequal(this.status, DISABLED);
            }
        },
        disabled: {
            get: function () {
                return isequal(this.status, DISABLED);
            }
        },
        valid: {
            get: function () {
                return isequal(this.status, VALID);
            }
        }
    });
}
FormControlAbstract.prototype.setParent = function (context) {
    this._parent = context;
};
FormControlAbstract.prototype._anyFieldHasStatus = function (status) {
    return this._anyControl(function (control) {
        return isequal(control.status, status);
    });
};
FormControlAbstract.prototype._anyControl = function () {
};
FormControlAbstract.prototype.setStatus = function () {
    if (this.disabled)
        return DISABLED;
    if (this.error || this._anyFieldHasStatus(INVALID))
        return INVALID;
    return VALID;
};
FormControlAbstract.prototype.destroy = function () {
    if (this.formFieldControls) {
        this.formFieldControls = null;
    }
    this._parent = null;
    this.valueChanges.destroy();
    this.statusChanged.destroy();
};
FormControlAbstract.prototype.markAsTouched = function (options) {
    options = options || {};
    this.touched = true;
    if (this._parent && !option.self) {
        this._parent.markAsTouched(options);
    }
};
FormControlAbstract.prototype.markAllAsTouched = function () {
    this.markAsTouched({ self: true });
    this.forEachField(function (control) {
        control.markAllAsTouched();
    });
};
FormControlAbstract.prototype.updateValueAndStatus = function (options) {
    options = options || {};
    this._setInitialStatus();
    this._updateValue();
    if (this.enabled) {
        this.error = null;
        this.status = this.setStatus();
        this._runValidators();
    }
    if (!isequal(options.emitEvent, false)) {
        this.valueChanges.emit(this.value);
    }
    if (this._parent && !isequal(options.self, false)) {
        this._parent.updateValueAndStatus(options);
    }
};
FormControlAbstract.prototype.enable = function (options) {
    options = options || {};
    this.status = VALID;
    this.updateValueAndStatus({
        self: true,
        emitEvent: options.emitEvent
    });
    this.forEachField(function (control) {
        control.enable({ self: true });
    });
    this._onDisableEvents.forEach(function (listener) {
        listener(false);
    });
};
FormControlAbstract.prototype.disable = function (options) {
    options = options || {};
    this.status = DISABLED;
    this.forEachField(function (control) {
        control.disable({ self: true });
    });
    this.updateValueAndStatus({
        self: true,
        emitEvent: options.emitEvent
    });
    if (isequal(options.emitEvent, true)) {
        this.valueChanges.emit(this.value);
    }
    this._onDisableEvents.forEach(function (listener) {
        listener(true);
    });
};
FormControlAbstract.prototype.forEachField = function () {
};
FormControlAbstract.prototype._allFieldDisabled = function () {
    return this.disabled;
};
FormControlAbstract.prototype._setInitialStatus = function () {
    this.status = this._allFieldDisabled() ? DISABLED : VALID;
};
FormControlAbstract.prototype._updateValue = function () {
};
FormControlAbstract.prototype.setValidators = function (validator) {
    if (!validator)
        return;
    this.validator.addValidators(validator);
    this._runValidators();
};
FormControlAbstract.prototype._runValidators = function () {
    this.validator(this.value);
};
FormControlAbstract.prototype.markAsUntouched = function (options) {
    options = options || {};
    this.touched = false;
    this.forEachField(function (control) {
        control.markAsUntouched({ self: true });
    });
};
FormControlAbstract.prototype.markAsTouched = function (options) {
    if (this.touched)
        return;
    options = options || {};
    this.touched = true;
    if (this.parent && !options.self) {
        this.parent.markAsTouched(options);
    }
};
FormControlAbstract.prototype.markAllAsUnTouched = function () {
    this.markAsUntouched({ self: true });
    this.forEachField(function (control) {
        control.markAllAsUnTouched();
    });
};
FormControlAbstract.prototype._registerOnControlChangeListener = function (fn) {
    this._onControlChangeListener = fn;
};
FormControlAbstract.prototype.setError = function (errors, emitEvent) {
    this.error = errors;
    this._updateStatusOnError(emitEvent);
};
FormControlAbstract.prototype.getError = function (errorType) {
    return this.error ? this.error[errorType] : null;
};
FormControlAbstract.prototype.hasError = function (errorType) {
    return !!this.getError(errorType);
};
FormControlAbstract.prototype._updateStatusOnError = function (emitEvent) {
    this.status = this.setStatus();
    if (emitEvent) {
        this.statusChanged.emit(this.status);
    }
    if (this._parent) {
        this._parent._updateStatusOnError(emitEvent);
    }
};
FormControlAbstract.prototype.getPath = function (path) {
    return path && path.includes('.') ? path.split('.') : path;
};
function addFields(context, formFields) {
    if (!isobject(formFields))
        return;
    for (var field in formFields) {
        context.addField(field, formFields[field]);
    }
}
var FormControlService = function () {
    'use strict';
    function FormControlService(formFields, validators) {
        FormControlAbstract.call(this, validators);
        this.formFieldControls = {};
        addFields(this, formFields);
        this.updateValueAndStatus();
    }
    FormControlService.prototype = Object.create(FormControlAbstract.prototype);
    FormControlService.prototype.constructor = FormControlAbstract;
    FormControlService.prototype.addField = function (name, fieldControl) {
        if (fieldControl instanceof FormControlService || fieldControl instanceof FormFieldControlService) {
            this.formFieldControls[name] = fieldControl;
        } else {
            this.formFieldControls[name] = new FormFieldControlService(fieldControl);
        }
        this._setupControl(this.formFieldControls[name]);
    };
    FormControlService.prototype.addFields = function (fieldControls) {
        addFields(this, fieldControls);
    };
    FormControlService.prototype.hasField = function (controlName) {
        return this.formFieldControls.hasOwnProperty(controlName);
    };
    FormControlService.prototype.getField = function (controlName) {
        var path = this.getPath(controlName);
        if (isarray(path)) {
            return this.getByPath(path);
        }
        return this.formFieldControls[controlName] || null;
    };
    FormControlService.prototype.getByPath = function (paths) {
        return paths.reduce(function (accum, path) {
            return accum.getField(path);
        }, this);
    };
    FormControlService.prototype._setupControl = function (control) {
        control.setParent(this);
        control._registerOnControlChangeListener(this._onControlChangeListener);
    };
    FormControlService.prototype.patchValue = function (values, options) {
        options = options || {};
        if (isobject(values) || isarray(values)) {
            for (var field in values) {
                if (this.hasField(field) && !options.self) {
                    this.getField(field).patchValue(values[field], {
                        self: options.self,
                        updateView: true
                    });
                }
            }
        }
    };
    FormControlService.prototype.setValue = function (values, options) {
        if (!values)
            return;
        this._allValuePresent(values);
        for (var field in values) {
            this._isControlPresent(field);
            this.formFieldControls[field].setValue(values[field], { self: options && options.self });
        }
    };
    FormControlService.prototype.forEachField = function (callback) {
        var _this = this;
        Object.keys(this.formFieldControls).forEach(function (field) {
            callback(_this.formFieldControls[field], field);
        });
    };
    FormControlService.prototype.reset = function (value, options) {
        options = options || {};
        value = value || {};
        this.forEachField(function (control, name) {
            control.reset(value[name] || null, {
                self: true,
                emitEvent: options.emitEvent
            });
        });
    };
    FormControlService.prototype.setFormFieldValidators = function (fieldValidators) {
        for (var field in fieldValidators) {
            this.setFieldValidator(field, fieldValidators[field]);
        }
    };
    FormControlService.prototype.setFieldValidator = function (field, validator) {
        this.getField(field).setValidators(validator);
        return this;
    };
    FormControlService.prototype.allTouched = function () {
        var alltouched = true;
        this.forEachField(function (control, name) {
            if (!control.touched) {
                alltouched = false;
            }
        });
        return alltouched;
    };
    FormControlService.prototype.removeField = function (name) {
        this.getField(name).destroy();
        delete this.formFieldControls[name];
        delete this.value[name];
        this.valueChanges.emit(this.value);
    };
    FormControlService.prototype.getAllValues = function () {
        return this._collectValues(false);
    };
    FormControlService.prototype._allValuePresent = function (values) {
        this.forEachField(function (control, field) {
            if (isundefined(values[field])) {
                errorBuilder('value for formField(' + field + ') is missing');
            }
        });
    };
    FormControlService.prototype._isControlPresent = function (field) {
        if (!Object.keys(this.formFieldControls).length) {
            errorBuilder('There are no field controls registered to this form');
        }
        if (!this.hasField(field)) {
            errorBuilder('Cannot find field control for ' + field);
        }
    };
    FormControlService.prototype._anyControl = function (callback) {
        for (var field in this.formFieldControls) {
            var found = callback(this.formFieldControls[field]);
            if (found) {
                return found;
            }
        }
        return undefined;
    };
    FormControlService.prototype._allFieldDisabled = function () {
        for (var field in this.formFieldControls) {
            if (this.formFieldControls[field].enabled) {
                return false;
            }
        }
        return Object.keys(this.formFieldControls).length > 0 || this.disabled;
    };
    FormControlService.prototype._updateValue = function () {
        this.value = this._collectValues(true);
    };
    FormControlService.prototype._collectValues = function (enabledOnly) {
        var values = {};
        this.forEachField(function (control, field) {
            if (enabledOnly && control.enabled || !enabledOnly) {
                values[field] = control.value;
            }
        });
        return values;
    };
    FormControlService.prototype._getFieldErrors = function () {
        var errors = {};
        var invalid = false;
        this.forEachField(function (control, field) {
            if (control.error) {
                errors[field] = control.error;
                invalid = true;
            }
        });
        return invalid ? errors : null;
    };
    FormControlService.ctors = {};
    FormControlService.ctors.instance = FormControlService;
    return FormControlService;
}();
var VALUE_ACCESSOR = new ProviderToken('ValueAccessor', true);
function AbstractValueAccessor(elementRef) {
    this.onChange = function () {
    };
    this.onDisable = function () {
    };
    this.onBlur = function () {
    };
    this.element = elementRef;
}
AbstractValueAccessor.prototype.setDisabledState = function (state) {
    AttributeAppender.setProp(this.element.nativeElement, 'disabled', state);
};
AbstractValueAccessor.prototype.registerOnBlur = function (onBlurFn) {
    this.onBlur = onBlurFn;
};
AbstractValueAccessor.prototype.registerOnChange = function (onChangeFn) {
    this.onChange = onChangeFn;
};
AbstractValueAccessor.prototype.registerOnDisable = function (onDisableFn) {
    this.onDisable = onDisableFn;
};
var FormFieldControlDirective = function () {
    'use strict';
    function FormFieldControlDirective(eventBinder, validators) {
        this.eventBinder = getValueAccessor(eventBinder);
        this.control = null;
        this._validators = validators;
        this._warning = false;
        Object.defineProperty(this, 'disabled', {
            set: function () {
                if (!this._warning) {
                    this._warning = true;
                    console.warn('The use of disabled property with a form field control directive will not take effect');
                }
            }
        });
    }
    FormFieldControlDirective.prototype.didInit = function () {
        if (!(this.control instanceof FormFieldControlService)) {
            return errorBuilder('Expected instance of FormFieldControlService but got ' + typeof this.control);
        }
        setupControl(this.control, this);
        if (this.control.disabled && this.eventBinder.setDisabledState) {
            this.eventBinder.setDisabledState(true);
        }
        this.control.updateValueAndStatus({ emitEvent: false });
    };
    FormFieldControlDirective.prototype.modelToViewUpdate = function () {
    };
    FormFieldControlDirective.ctors = {
        selector: 'fieldControl',
        props: {
            control: { value: 'fieldControl' },
            disabled: {}
        },
        DI: [
            VALUE_ACCESSOR,
            {
                optional: true,
                tokenName: 'VALIDATORS'
            }
        ]
    };
    return FormFieldControlDirective;
}();
var FormFieldControlService = function () {
    'use strict';
    function FormFieldControlService(fieldControl) {
        FormControlAbstract.call(this, fieldControl ? fieldControl.validators : null);
        this.eventType = 'default';
        this._onChangeEvents = [];
        this._setInitialState(fieldControl);
        this.updateValueAndStatus({
            self: true,
            emitEvent: false
        });
    }
    FormFieldControlService.prototype = Object.create(FormControlAbstract.prototype);
    FormFieldControlService.prototype.constructor = FormControlAbstract;
    FormFieldControlService.prototype._setInitialState = function (state) {
        if (isobject(state)) {
            this.value = state.value;
            state.disabled ? this.disable({ self: true }) : this.enable({ self: true });
            this.eventType = state.eventType || this.eventType;
        } else {
            this.value = state !== undefined ? state : null;
        }
    };
    FormFieldControlService.prototype.setValue = function (value, options) {
        options = options || {};
        this.value = value;
        if (this._onChangeEvents.length && !isequal(options.emitToView, false)) {
            this._onChangeEvents.length && this._onChangeEvents.forEach(function (eventChange) {
                return eventChange(value, !isequal(options.emitToView, false));
            });
        }
        this.updateValueAndStatus(options);
    };
    FormFieldControlService.prototype.patchValue = function (val, options) {
        if (!options) {
            options = {};
        }
        this.setValue(val, options);
    };
    FormFieldControlService.prototype.reset = function (config, options) {
        this._setInitialState(config);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
    };
    FormFieldControlService.prototype.registerOnChangeListener = function (listener) {
        this._onChangeEvents.push(listener);
    };
    FormFieldControlService.prototype.registerOnDisabledListener = function (listener) {
        this._onDisableEvents.push(listener);
    };
    FormFieldControlService.prototype.clearListeners = function () {
        this._onChangeEvents.length = 0;
        this._onDisableEvents.length = 0;
    };
    FormFieldControlService.ctors = {};
    FormFieldControlService.ctors.instance = FormFieldControlService;
    return FormFieldControlService;
}();
var FormFieldDirective = function () {
    'use strict';
    function FormFieldDirective(parentContainer, eventBinder, validators) {
        this.eventBinder = getValueAccessor(eventBinder);
        this.control = null;
        this._validators = validators;
        this.parent = parentContainer;
    }
    FormFieldDirective.prototype.didInit = function () {
        if (!this.parent) {
            return errorBuilder('[formField=' + this.name + ']: Expected an instance of FormControlDirective but got ' + typeof this.parent);
        }
        this.control = this.parent.addField(this);
        if (this.control.disabled && this.eventBinder.setDisabledState) {
            this.eventBinder.setDisabledState(true);
        }
    };
    FormFieldDirective.prototype.modelToViewUpdate = function () {
    };
    FormFieldDirective.prototype.viewDidDestroy = function () {
        if (this.parent) {
            this.parent.removeField(this);
            this.parent = null;
        }
        this.control = null;
    };
    FormFieldDirective.ctors = {
        selector: 'formField',
        props: { name: { value: 'formField' } },
        DI: [
            {
                optional: true,
                value: 'formControl',
                tokenName: 'ParentRef'
            },
            VALUE_ACCESSOR,
            {
                optional: true,
                tokenName: 'VALIDATORS'
            }
        ]
    };
    return FormFieldDirective;
}();
var ResolveDefaultBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function () {
        return DefaultEventBinder;
    })
};
var DefaultEventBinder = function () {
    'use strict';
    function DefaultEventBinder(elementRef) {
        AbstractValueAccessor.call(this, elementRef);
    }
    DefaultEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
    DefaultEventBinder.prototype.constructor = AbstractValueAccessor;
    DefaultEventBinder.prototype.writeValue = function (value) {
        value = value === null || value === undefined ? '' : value;
        AttributeAppender.setProp(this.element.nativeElement, 'value', value);
    };
    DefaultEventBinder.ctors = {
        selector: 'input:type!=checkbox|radio|number|range:[model|formField|fieldControl],textarea:[model|formField|fieldControl],input:list:[model|formField|fieldControl]',
        events: {
            'input': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'value'
                            ]],
                        fn: 'onChange'
                    }]
            },
            'blur': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        DI: [{
                optional: true,
                tokenName: 'ElementRef'
            }],
        resolve: [ResolveDefaultBinder]
    };
    return DefaultEventBinder;
}();
var ResolveCheckboxBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function () {
        return CheckboxEventBinder;
    })
};
var CheckboxEventBinder = function () {
    'use strict';
    function CheckboxEventBinder(elementRef) {
        AbstractValueAccessor.call(this, elementRef);
    }
    ;
    CheckboxEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
    CheckboxEventBinder.prototype.constructor = AbstractValueAccessor;
    CheckboxEventBinder.prototype.writeValue = function (checked) {
        AttributeAppender.setProp(this.element.nativeElement, 'checked', checked, true);
    };
    CheckboxEventBinder.ctors = {
        selector: 'input:type=checkbox:[model|formField|fieldControl]',
        events: {
            'change': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'checked'
                            ]],
                        fn: 'onChange'
                    }]
            },
            'blur': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        DI: [{
                optional: true,
                tokenName: 'ElementRef'
            }],
        resolve: [ResolveCheckboxBinder]
    };
    return CheckboxEventBinder;
}();
var ResolveRadioBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function () {
        return RadioEventBinder;
    })
};
var RadioEventContainer = function () {
    'use strict';
    function RadioEventContainer() {
        var _registry = [];
        this.register = function (eventBinder) {
            _registry.push(eventBinder);
        };
        this.remove = function (eventBinder) {
            _registry.splice(_registry.indexOf(eventBinder), 1);
        };
        this.selectValue = function (eventBinder) {
            _registry.forEach(function (registeredBinder) {
                if (isSameGroup(registeredBinder, eventBinder) && registeredBinder !== eventBinder) {
                    registeredBinder.writeValue(eventBinder.value);
                }
            });
        };
        function isSameGroup(a, b) {
            return a.name === b.name;
        }
    }
    RadioEventContainer.ctors = {};
    return RadioEventContainer;
}();
var RadioEventBinder = function () {
    'use strict';
    function RadioEventBinder(elementRef, radioEventContainer) {
        AbstractValueAccessor.call(this, elementRef);
        this.radioEventContainer = radioEventContainer;
        this.state = false;
    }
    ;
    RadioEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
    RadioEventBinder.prototype.constructor = AbstractValueAccessor;
    RadioEventBinder.prototype.didInit = function () {
        this._checkFieldName();
        this.radioEventContainer.register(this);
    };
    RadioEventBinder.prototype.didDestroy = function () {
        this.radioEventContainer.remove(this);
    };
    RadioEventBinder.prototype._checkFieldName = function () {
        if (this.name && this.formField && this.formField != this.name) {
            errorBuilder('if you define a name and formField both values must match. <input type=radio name=' + this.name + ' :formField=' + this.formField);
        }
        if (!this.name && this.formField)
            this.name = this.formField;
    };
    RadioEventBinder.prototype.registerOnChange = function (onChangeFn) {
        var _this = this;
        this._onChange = onChangeFn;
        this.onChange = function (value) {
            onChangeFn(_this.value);
            _this.radioEventContainer.selectValue(_this);
        };
    };
    RadioEventBinder.prototype.writeValue = function (value) {
        this.state = value == this.value;
        AttributeAppender.setProp(this.element.nativeElement, 'checked', this.state);
    };
    RadioEventBinder.ctors = {
        selector: 'input:type=radio:[model|formField|fieldControl]',
        events: {
            'change': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'value'
                            ]],
                        fn: 'onChange'
                    }]
            },
            'blur': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        props: {
            name: {},
            formField: {},
            value: {}
        },
        DI: [
            {
                optional: true,
                tokenName: 'ElementRef'
            },
            RadioEventContainer
        ],
        resolve: [ResolveRadioBinder]
    };
    return RadioEventBinder;
}();
var ResolveSelectBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function () {
        return SelectEventBinder;
    })
};
function _buildValueToString(id, value) {
    if (id == null)
        return '' + value;
    if (typeof value === 'object' && id)
        value = 'option:object';
    return id + ':' + value;
}
var SelectEventBinder = function () {
    'use strict';
    function SelectEventBinder(elementRef) {
        this.idIncrement = 0;
        this.selectedValue;
        this._optionValueMap = new Map();
        this._compare = isequal;
        AbstractValueAccessor.call(this, elementRef);
        Object.defineProperty(this, 'compareFn', {
            set: function (fn) {
                if (typeof fn !== 'function') {
                    throw new Error('expected function for comparisonFN but got ' + typeof fn + ' instead.');
                }
                this._compare = fn;
            }
        });
    }
    ;
    SelectEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
    SelectEventBinder.prototype.constructor = AbstractValueAccessor;
    SelectEventBinder.prototype._handleSelection = function (value) {
        this.selectedValue = this._getValue(value);
        this.onChange(this.selectedValue);
    };
    SelectEventBinder.prototype.writeValue = function (value) {
        this.selectedValue = value;
        var _this = this;
        if (!this.element.hasAttribute('multiple')) {
            var optionId = this._getOptionId(value);
            if (optionId === null) {
                AttributeAppender.setProp(this.element.nativeElement, 'selectedIndex', -1);
            }
            AttributeAppender.setProp(this.element.nativeElement, 'value', _buildValueToString(optionId, value));
        } else {
            var markAsSelected = function (opt) {
                AttributeAppender.setProp(opt, 'selected', false);
            };
            if (Array.isArray(value)) {
                var optionIds = value.map(function (v) {
                    return _this._getOptionId(v) || v;
                });
                markAsSelected = function (opt) {
                    AttributeAppender.setProp(opt, 'selected', inarray(opt.value, optionIds));
                };
            }
            this._markAsSelectedMultiple(markAsSelected);
        }
    };
    SelectEventBinder.prototype._getValue = function (valueString) {
        if (this.element.hasAttribute('multiple')) {
            var optionsValue = [];
            for (var i = 0; i < this.element.nativeElement.selectedOptions.length; i++) {
                var value = this._getOptionValue(this.element.nativeElement.selectedOptions[i].value);
                optionsValue.push(value);
            }
            return optionsValue;
        }
        return this._getOptionValue(valueString);
    };
    SelectEventBinder.prototype._getOptionValue = function (valueString) {
        var optionId = valueString.split(':')[0];
        return this._optionValueMap.has(optionId) ? this._optionValueMap.get(optionId) : valueString;
    };
    SelectEventBinder.prototype.genOptionId = function () {
        return (this.idIncrement++).toString();
    };
    SelectEventBinder.prototype._getOptionId = function (value) {
        var keys = this._optionValueMap.keys();
        for (var i in keys) {
            if (this._compare(this._optionValueMap.get(keys[i]), value))
                return keys[i];
        }
        return null;
    };
    SelectEventBinder.prototype._markAsSelectedMultiple = function (callback) {
        if (!this.element.nativeElement)
            return;
        Array.from(this.element.nativeElement.options).forEach(callback);
    };
    SelectEventBinder.ctors = {
        selector: 'select:[model|formField|fieldControl]',
        events: {
            'input': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'value'
                            ]],
                        fn: '_handleSelection'
                    }]
            },
            'blur': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        props: { compareFn: {} },
        DI: [{
                optional: true,
                tokenName: 'ElementRef'
            }],
        resolve: [ResolveSelectBinder]
    };
    return SelectEventBinder;
}();
var OptionDirective = function () {
    'use strict';
    function OptionDirective(selectInstance, elementRef) {
        if (selectInstance)
            this.id = selectInstance.genOptionId();
        Object.defineProperty(this, 'value', {
            set: function (value) {
                this.setValue(value);
                if (selectInstance)
                    selectInstance.writeValue(selectInstance.selectedValue);
            }
        });
        Object.defineProperty(this, 'jValue', {
            set: function (value) {
                if (!selectInstance)
                    return;
                selectInstance._optionValueMap.set(this.id, value);
                this.setValue(_buildValueToString(this.id, value));
                selectInstance.writeValue(selectInstance.selectedValue);
            }
        });
        this.setValue = function (value) {
            AttributeAppender.setProp(elementRef.nativeElement, 'value', value);
        };
        this.viewDidDestroy = function () {
            if (selectInstance) {
                selectInstance._optionValueMap.delete(this.id);
                selectInstance.writeValue(selectInstance.selectedValue);
            }
        };
    }
    OptionDirective.ctors = {
        selector: 'option',
        props: {
            value: {},
            jValue: {}
        },
        DI: [
            {
                optional: true,
                type: '[model|formField|fieldControl]',
                value: 'select',
                tokenName: 'ParentRef'
            },
            {
                optional: true,
                tokenName: 'ElementRef'
            }
        ]
    };
    return OptionDirective;
}();
var ResolveNumberBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function () {
        return NumberEventBinder;
    })
};
var NumberEventBinder = function () {
    'use strict';
    function NumberEventBinder(elementRef) {
        AbstractValueAccessor.call(this, elementRef);
    }
    NumberEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
    NumberEventBinder.prototype.constructor = AbstractValueAccessor;
    NumberEventBinder.prototype.writeValue = function (value) {
        value = value === null || value === undefined ? '' : value;
        AttributeAppender.setProp(this.element.nativeElement, 'value', value);
    };
    NumberEventBinder.prototype.registerOnChange = function (onChangeFn) {
        this.onChange = function (value) {
            onChangeFn(value == '' ? null : parseFloat(value));
        };
    };
    NumberEventBinder.ctors = {
        selector: 'input:type=number:[model|formField|fieldControl]',
        events: {
            'input': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'value'
                            ]],
                        fn: 'onChange'
                    }]
            },
            'blur': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        DI: [{
                optional: true,
                tokenName: 'ElementRef'
            }],
        resolve: [ResolveNumberBinder]
    };
    return NumberEventBinder;
}();
var ResolveRangeBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function () {
        return RangeEventBinder;
    })
};
var RangeEventBinder = function () {
    'use strict';
    function RangeEventBinder(elementRef) {
        AbstractValueAccessor.call(this, elementRef);
    }
    RangeEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
    RangeEventBinder.prototype.constructor = AbstractValueAccessor;
    RangeEventBinder.prototype.writeValue = function (value) {
        value = value === null || value === undefined ? '' : value;
        AttributeAppender.setProp(this.element.nativeElement, 'value', parseFloat(value), true);
    };
    RangeEventBinder.prototype.registerOnChange = function (onChangeFn) {
        this.onChange = function (value) {
            onChangeFn(value == '' ? null : parseFloat(value));
        };
    };
    RangeEventBinder.ctors = {
        selector: 'input:type=range:[model|formField|fieldControl]',
        events: {
            'input': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'value'
                            ]],
                        fn: 'onChange'
                    }]
            },
            'change': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [[
                                '$event',
                                'target',
                                'value'
                            ]],
                        fn: 'onChange'
                    }]
            },
            'blur': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        DI: [{
                optional: true,
                tokenName: 'ElementRef'
            }],
        resolve: [ResolveRangeBinder]
    };
    return RangeEventBinder;
}();
function setupControl(fieldControl, dir) {
    if (!fieldControl)
        return errorBuilder('No field control found for ' + dir.name);
    if (!dir.eventBinder)
        return errorBuilder('No EventBinder defined');
    fieldControl.setValidators(dir._validators);
    dir.eventBinder.writeValue(fieldControl.value);
    setUpViewChangeEvent(fieldControl, dir);
    setupBlurEvent(fieldControl, dir);
    if (dir.eventBinder.setDisabledState) {
        fieldControl.registerOnDisabledListener(function (state) {
            dir.eventBinder.setDisabledState(state);
        });
    }
}
function setUpViewChangeEvent(fieldControl, dir) {
    dir.eventBinder.registerOnChange(function (value) {
        fieldControl._pendingValue = value;
        fieldControl._pendingChange = true;
        if (!isequal(fieldControl.eventType, 'blur')) {
            updateControl(fieldControl, dir);
        }
    });
    fieldControl.registerOnChangeListener(function (value, emitEvent) {
        dir.eventBinder.writeValue(value);
        if (emitEvent) {
            dir.modelToViewUpdate(value);
        }
    });
}
function setupBlurEvent(fieldControl, dir) {
    if (dir.eventBinder.registerOnBlur) {
        dir.eventBinder.registerOnBlur(function () {
            if (isequal(fieldControl.eventType, 'blur') && fieldControl._pendingChange) {
                updateControl(fieldControl, dir);
            }
        });
    }
}
function updateControl(fieldControl, dir) {
    fieldControl.setValue(fieldControl._pendingValue, { emitToView: false });
    dir.modelToViewUpdate(fieldControl._pendingValue);
    fieldControl._pendingChange = false;
    fieldControl.markAsTouched();
}
function _validateAndBindStatus(dir) {
    if (dir._registered)
        return;
    if (!dir.form || !(dir.form instanceof FormControlService)) {
        return errorBuilder((dir.formName ? '[' + dir.formName + ']' : '') + 'Expected instance of FormControlService but got ' + typeof dir.form);
    }
    dir._registered = true;
    dir.form.statusChanged.subscribe(function () {
        dir.changeDetector.detectChanges();
    });
}
var inbuiltAccessor = [
    CheckboxEventBinder,
    DefaultEventBinder,
    RadioEventBinder,
    SelectEventBinder,
    NumberEventBinder,
    RangeEventBinder
];
function getValueAccessor(valueAccessors) {
    var inbuilt = null, custom = null;
    valueAccessors.forEach(function (accessorInstance) {
        if (inbuiltAccessor.includes(accessorInstance.constructor)) {
            if (inbuilt) {
                errorBuilder('found multiple inbuilt valueAccessor instance.');
            }
            inbuilt = accessorInstance;
        } else {
            if (custom) {
                errorBuilder('found multiple custom valueAccessor instance.');
            }
            custom = accessorInstance;
        }
    });
    if (custom) {
        return custom;
    }
    return inbuilt;
}
var ModelDirective = function () {
    'use strict';
    function ModelDirective(eventBinder, parentControl, validators) {
        this.eventBinder = getValueAccessor(eventBinder);
        this.fieldControl = new FormFieldControlService();
        this._parentControl = parentControl;
        this._validators = validators;
        this.modelChange = new EventEmitter();
        this._model = null;
    }
    ModelDirective.prototype.didChange = function (changes) {
        if (this._isViewModelChanged(changes)) {
            this.fieldControl.setValue(changes.model, { emitToView: true });
            this._model = changes.model;
        }
    };
    ModelDirective.prototype.modelToViewUpdate = function (value) {
        this.modelChange.emit(value);
    };
    ModelDirective.prototype.didInit = function () {
        setupControl(this.fieldControl, this);
    };
    ModelDirective.prototype.viewDidDestroy = function () {
        this._control = null;
    };
    ModelDirective.prototype._isViewModelChanged = function (changes) {
        return changes.hasOwnProperty('model') && changes.model !== this._model;
    };
    ModelDirective.ctors = {
        selector: 'model',
        events: { 'modelChange': { type: 'emitter' } },
        props: {
            model: {},
            modelOptions: {},
            name: {}
        },
        DI: [
            VALUE_ACCESSOR,
            {
                optional: true,
                value: 'form',
                tokenName: 'parentControl'
            },
            {
                optional: true,
                tokenName: 'VALIDATORS'
            }
        ],
        exportAs: 'jModel'
    };
    return ModelDirective;
}();
var FormRepeaterService = function () {
    'use strict';
    function FormRepeaterService(fields, autoGenerate, validators) {
        FormControlAbstract.call(this, validators);
        this.formFieldControls = [];
        this._defaultfields = fields;
        this._autoSetup(autoGenerate);
        this.updateValueAndStatus();
    }
    FormRepeaterService.prototype = Object.create(FormControlService.prototype);
    FormRepeaterService.prototype.constructor = FormControlAbstract;
    FormRepeaterService.prototype.addField = function (fieldControl) {
        if (fieldControl instanceof FormControlService || fieldControl instanceof FormFieldControlService) {
            this.formFieldControls.push(fieldControl);
        } else if (this._defaultfields) {
            this.formFieldControls.push(new FormControlService(this._defaultfields));
        } else {
            this.formFieldControls.push(new FormFieldControlService(fieldControl));
        }
        this._setupControl(this.formFieldControls[this.formFieldControls.length - 1]);
    };
    FormRepeaterService.prototype.getField = function (index) {
        return this.formFieldControls[index] || null;
    };
    FormRepeaterService.prototype._collectValues = function (enabledOnly) {
        var values = [];
        this.forEachField(function (control) {
            if (enabledOnly && control.enabled || !enabledOnly) {
                values.push(control.value);
            }
        });
        return values;
    };
    FormRepeaterService.prototype.removeField = function (index) {
        var len = this.formFieldControls.length;
        if (!len || len < index)
            return;
        this.formFieldControls[index].destroy();
        this.value.splice(index, 1);
        this.formFieldControls.splice(index, 1);
        this.valueChanges.emit(this.value);
    };
    FormRepeaterService.prototype._autoSetup = function (autoGenerate) {
        if (autoGenerate) {
            while (autoGenerate--) {
                this.addField();
            }
        }
    };
    FormRepeaterService.ctors = {};
    FormRepeaterService.ctors.instance = FormRepeaterService;
    return FormRepeaterService;
}();
var FormModule = function () {
    'use strict';
    function FormModule() {
    }
    return FormModule;
}();
},
1157 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'CSRFCookieHeaderService', () => { return CSRFCookieHeaderService;});
__required.r(exports, 'csrfCookieConfig', () => { return csrfCookieConfig;});
__required.r(exports, 'HttpCookieManager', () => { return HttpCookieManager;});
__required.r(exports, 'HttpCSRFModule', () => { return HttpCSRFModule;});
__required.r(exports, 'HTTP_INTERCEPTORS', () => { return HTTP_INTERCEPTORS;});
__required.r(exports, 'HttpResponse', () => { return HttpResponse;});
__required.r(exports, 'HttpRequest', () => { return HttpRequest;});
__required.r(exports, 'HttpRequestError', () => { return HttpRequestError;});
__required.r(exports, 'HttpService', () => { return HttpService;});
__required.r(exports, 'HttpModule', () => { return HttpModule;});
var utils = __required(1152);
var serialize = utils.serialize;
var helpers = __required(1132);
var isnull = helpers.isnull;
var isstring = helpers.isstring;
var isundefined = helpers.isundefined;
var isobject = helpers.isobject;
var inarray = helpers.inarray;
var core = __required(1153);
var ProviderToken = core.ProviderToken;
var InterceptorResolver = core.InterceptorResolver;
var Subject = core.Subject;
var ChangeDetector = core.ChangeDetector;
var __buildOptions = {};
function HttpRequestError(message) {
    this.errorType = null;
    this.message = message;
    this.status = 400;
}
HttpRequestError.prototype.setMessage = function (message) {
    this.message = message;
};
HttpRequestError.prototype.setErrorType = function (type) {
    this.errorType = type;
};
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
function HttpRequest(url, options) {
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
HttpRequest.prototype.progress = function (progressCallback) {
    this.xhrInstance.addEventListener('progress', progressCallback, false);
};
HttpRequest.prototype.setHeaders = function (headers) {
    Object.assign(this.headers, headers);
};
HttpRequest.prototype.processRequest = function () {
    this.processData = false;
    if (!isstring(this.data)) {
        if (this.type === 'get') {
            this.data = serialize(this.data);
        } else {
            this.data = JSON.stringify(this.data);
        }
    }
    if (this.type === 'get') {
        if (this.data) {
            this.url += (/\?/.test(this.url) ? '&' : '?') + this.data;
        }
        if (!this.cache) {
            this.url += (/\?/.test(this.url) ? '&' : '?') + '_=' + Date.now();
        }
    }
};
HttpRequest.prototype.processRequestHeaders = function () {
    for (var name in this.headers) {
        if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
            throw new Error('Refused to set unsafe header "' + name + '"');
        }
        this.xhrInstance.setRequestHeader(name, this.headers[name]);
    }
};
function HttpResponse(httpRequest) {
    this.status = httpRequest.xhrInstance.status;
    this.readyState = httpRequest.xhrInstance.readyState;
    this.url = httpRequest.url;
    this.data = null;
    this.success = httpRequest.xhrInstance.status >= 200 && httpRequest.xhrInstance.status < 300 || httpRequest.xhrInstance.status == 304 || httpRequest.xhrInstance.status == 0 && httpRequest.xhrInstance.responseText;
    this.headers = Object({
        getResponseHeader: function (name) {
            if (!isobject(name)) {
                return httpRequest.xhrInstance.getResponseHeader(name);
            } else {
                return name.map(httpRequest.xhrInstance.getResponseHeader);
            }
        }
    });
}
var HTTP_INTERCEPTORS = new ProviderToken('interceptors', true);
function parseJSON(response) {
    var content;
    var tError = !!response;
    try {
        content = JSON.parse(response);
    } catch (e) {
        if (tError) {
            throw new Error(e);
        } else {
            content = response;
        }
    }
    return content;
}
function CoreHttp(url, options, changeDetection) {
    var xhrPromise = new Subject();
    var httpRequest = new HttpRequest(url, options);
    var httpError = new HttpRequestError('');
    InterceptorResolver(HTTP_INTERCEPTORS, httpRequest).then(function (request) {
        if (!request) {
            httpError.setMessage('HTTP: Interceptor should return a value');
            return xhrPromise.error(httpError);
        }
        if (changeDetection) {
            changeDetection();
        }
        if (request.processData) {
            request.processRequest();
        }
        sendRequest();
    });
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
    function sendRequest() {
        attachListener();
        httpRequest.xhrInstance.open(httpRequest.type, httpRequest.url, httpRequest.asynchronous);
        httpRequest.processRequestHeaders();
        var body = null;
        if (inarray(httpRequest.type, [
                'post',
                'put',
                'delete'
            ])) {
            body = httpRequest.data;
        }
        try {
            httpRequest.xhrInstance.send(body);
        } catch (e) {
            httpError.setMessage(e);
            xhrPromise.error(httpError);
        }
    }
    return xhrPromise;
}
var staticMethods = [
    'put',
    'get',
    'post',
    'request',
    'patch',
    'delete'
];
var HttpService = function () {
    'use strict';
    function HttpService(changeDetector) {
        function http(url, options) {
            return CoreHttp(url, options, changeDetector);
        }
        function generateOptionalHTTP(type) {
            http[type] = function (url, data, headers) {
                var options = {};
                options.type = type;
                options.data = data;
                options.headers = headers || {};
                return http(url, options);
            };
        }
        staticMethods.forEach(generateOptionalHTTP);
        return http;
    }
    HttpService.ctors = { DI: [ChangeDetector] };
    return HttpService;
}();
var HttpModule = function () {
    'use strict';
    function HttpModule() {
    }
    return HttpModule;
}();
var HttpCookieManager = function () {
    'use strict';
    function HttpCookieManager() {
        Object.defineProperty(this, 'cookies', {
            get: function () {
                return this._getAll();
            }
        });
    }
    ;
    HttpCookieManager.prototype.set = function (name, value, options) {
        if (!isnull(value) && !isundefined(value)) {
            if (value === null) {
                value = '';
                options.expires = -1;
            }
            var expires = '';
            var isNumberExpires = typeof options.expires === 'number';
            if (options.expires && (isNumberExpires || options.expires.toUTCString)) {
                var date;
                if (isNumberExpires) {
                    date = new Date();
                    date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
                } else {
                    date = options.expires;
                }
                expires = '; expires=' + date.toUTCString();
            }
            var path = options.path ? '; path=' + options.path : '';
            var domain = options.domain ? '; domain=' + options.domain : '';
            var secure = options.secure ? '; secure' : '';
            document.cookie = [
                name,
                '=',
                encodeURIComponent(value),
                expires,
                path,
                domain,
                secure
            ].join('');
        }
    };
    HttpCookieManager.prototype.get = function (name) {
        return this.cookies[name];
    };
    HttpCookieManager.prototype._getAll = function () {
        var cookieValues = {};
        var cookies = (document.cookie || '').split(';');
        if (cookies.length) {
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim().split('=');
                cookieValues[cookie[0]] = cookie[1];
            }
        }
        return cookieValues;
    };
    HttpCookieManager.ctors = {};
    return HttpCookieManager;
}();
var csrfCookieConfig = {
    cookieName: 'X-CSRF-TOKEN',
    headerName: 'X-CSRF-TOKEN'
};
var CSRFCookieHeaderService = function () {
    'use strict';
    function CSRFCookieHeaderService(cookieManager) {
        this.resolve = function (httpRequest, next) {
            var cookie = cookieManager.get(csrfCookieConfig.cookieName);
            if (cookie) {
                var tokenHeader = {};
                tokenHeader[csrfCookieConfig.headerName] = cookie;
                httpRequest.setHeaders(tokenHeader);
            }
            next();
        };
    }
    CSRFCookieHeaderService.ctors = { DI: [HttpCookieManager] };
    return CSRFCookieHeaderService;
}();
var HttpCSRFModule = function () {
    'use strict';
    function HttpCSRFModule() {
    }
    HttpCSRFModule.setCookieValue = function (config) {
        Object.assign(csrfCookieConfig, config);
    };
    HTTP_INTERCEPTORS.register({ useClass: CSRFCookieHeaderService }, true);
    return HttpCSRFModule;
}();
},
1158 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'PathStrategyService', () => { return PathStrategyService;});
__required.r(exports, 'AbstractStrategy', () => { return AbstractStrategy;});
__required.r(exports, 'HashStrategyService', () => { return HashStrategyService;});
__required.r(exports, 'RouterInitService', () => { return RouterInitService;});
__required.r(exports, 'JIntentContainer', () => { return JIntentContainer;});
__required.r(exports, 'ViewIntentService', () => { return ViewIntentService;});
__required.r(exports, 'OpenIntent', () => { return OpenIntent;});
__required.r(exports, 'jViewFn', () => { return jViewFn;});
__required.r(exports, 'RouteInterceptorInstance', () => { return RouteInterceptorInstance;});
__required.r(exports, 'getHref', () => { return getHref;});
__required.r(exports, 'parseUrl', () => { return parseUrl;});
__required.r(exports, 'getRequiredRoute', () => { return getRequiredRoute;});
__required.r(exports, 'getParentRoute', () => { return getParentRoute;});
__required.r(exports, 'ROUTE_EVENT_ENUMS', () => { return ROUTE_EVENT_ENUMS;});
__required.r(exports, 'routeConfig', () => { return routeConfig;});
__required.r(exports, 'staticRoutePrefix', () => { return staticRoutePrefix;});
__required.r(exports, 'ROUTE_LOCATION_STRATEGY', () => { return ROUTE_LOCATION_STRATEGY;});
__required.r(exports, 'ROUTE_INTERCEPTOR', () => { return ROUTE_INTERCEPTOR;});
__required.r(exports, 'ViewHandler', () => { return ViewHandler;});
__required.r(exports, 'LocationService', () => { return LocationService;});
__required.r(exports, 'WebStateService', () => { return WebStateService;});
__required.r(exports, 'GoFn', () => { return GoFn;});
__required.r(exports, 'RouterModule', () => { return RouterModule;});
var utils = __required(1152);
var unserialize = utils.unserialize;
var extend = utils.extend;
var core = __required(1153);
var APP_BOOTSTRAP = core.APP_BOOTSTRAP;
var EventEmitter = core.EventEmitter;
var InterceptorResolver = core.InterceptorResolver;
var EventManager = core.EventManager;
var errorBuilder = core.errorBuilder;
var ProviderToken = core.ProviderToken;
var compileModule = core.compileModule;
var DOMHelper = core.DOMHelper;
var ComponentFactoryResolver = core.ComponentFactoryResolver;
var __buildOptions = {};
var ROUTE_INTERCEPTOR = new ProviderToken('RouteInterceptor', true);
var ROUTE_LOCATION_STRATEGY = new ProviderToken('RouteLocationStrategy', false, { value: HashStrategyService });
var staticRoutePrefix = '^';
var routeConfig = Object({
    isLoaded: false,
    intentFallback: null,
    useHash: true,
    fallback: {
        url: '/',
        name: '.'
    },
    restoreOnRefresh: true,
    delimiter: [
        '!#',
        ''
    ]
});
var ROUTE_EVENT_ENUMS = {
    SUCCESS: '$webRouteSuccess',
    ERROR: '$webRouteError',
    START: '$webRouteStart',
    NOTFOUND: '$webRouteNotFound'
};
var _unregistered = {};
var $stateCollection = {};
var $intentCollection = {};
function createRoute(url) {
    var replacer = '/([\\w-@!.]+)', paramsMapping = [];
    url = url.replace(/([\/]|)([:]|)+(\w+)/g, function (match) {
        if (match.indexOf(':') > -1) {
            paramsMapping.push(match.split(':')[1]);
            return replacer;
        }
        return match;
    });
    return {
        params: {},
        paramsMapping: paramsMapping,
        regexp: new RegExp('(?:' + url.split('?')[0] + ')$')
    };
}
function addViewMatcher(view, route, routeElements) {
    route.views = route.views || {};
    if (!route.views[view]) {
        route.views[view] = null;
    }
    if (route.component) {
        var isStringComp = typeof route.component === 'string';
        if (isStringComp && !routeElements || routeElements && !routeElements.has(route.component)) {
            errorBuilder('Invalid route configuration, missing view component', 0, route);
        }
        route.views[view] = isStringComp ? routeElements.get(route.component) : route.component;
        delete route.component;
    } else if (route.loadModule) {
        route.views[view] = route.loadModule;
        delete route.loadModule;
    }
}
function generateRoute(route, requireParent, routeElements) {
    if (route.isIntent) {
        $intentCollection[route.name] = route;
        return;
    }
    if ($stateCollection[route.name] && !(_unregistered[route.parent] && _unregistered[route.parent].includes(route.name))) {
        console.info('[Route] Duplicate route found: ' + route.name + ', skipping to use existing');
        return;
    }
    if (!route.views && (!route.component || !route.loadModule)) {
        console.info('[Router] missing view configuration for: ' + route.name);
        return;
    }
    route.route = createRoute(route.url || '^');
    var _views = Object.keys(route.views || {});
    if (requireParent) {
        var parentRoute = $stateCollection[route.parent];
        route.views = route.views || {};
        for (var view in parentRoute.views) {
            if (view !== route.targetView) {
                route.views[view] = parentRoute.views[view];
            } else if (!route.views[view]) {
                addViewMatcher(view, route, routeElements);
            }
        }
        if (route.targetView && !route.views[route.targetView]) {
            addViewMatcher(route.targetView, route, routeElements);
        }
        route.route.parent = parentRoute;
        if (!_views.length && !route.abstract) {
            _views = parentRoute.route.$$views;
        }
        parentRoute = null;
        delete route.parent;
    }
    if (!route.url) {
        route.abstract = true;
    }
    if (route.fallback) {
        routeConfig.fallback = {
            name: route.name,
            url: route.url
        };
    }
    route.route.$$views = _views;
    $stateCollection[route.name] = route;
    if (_unregistered.hasOwnProperty(route.name)) {
        _unregistered[route.name].forEach(function (uName) {
            setupRoutes($stateCollection[uName], routeElements);
        });
        delete _unregistered[route.name];
    }
}
function setupRoutes(route, routeElements) {
    var requireParent = route.hasOwnProperty('parent');
    if (!route.name && route.url) {
        route.name = route.url.replace(/[/:]/g, _ => _ == '/' ? '.' : '');
    }
    if (!route.parent) {
        addViewMatcher(route.targetView || staticRoutePrefix, route, routeElements);
    }
    if (requireParent && !$stateCollection.hasOwnProperty(route.parent)) {
        if (!_unregistered.hasOwnProperty(route.parent)) {
            _unregistered[route.parent] = [];
        }
        _unregistered[route.parent].push(route.name);
        $stateCollection[route.name] = route;
        return this;
    }
    generateRoute(route, requireParent, routeElements);
    function addChildren(config) {
        if (config.children) {
            config.children.forEach(function (childConfig) {
                if (childConfig.name) {
                    var name = childConfig.name;
                    childConfig.name = [
                        config.name,
                        name
                    ].join('.');
                    childConfig.url = '/' + config.name + (childConfig.url || '/' + name);
                    childConfig.parent = config.name;
                    generateRoute(childConfig, true, routeElements);
                    addChildren(childConfig);
                } else {
                    errorBuilder('unregistered child route in parent<' + config.name + '>, name is required:' + JSON.stringify(childConfig));
                }
            });
        }
    }
    addChildren(route);
}
function getParentRoute(name) {
    var parent = $stateCollection[name], fnd;
    do {
        if (parent) {
            fnd = parent;
        }
    } while (parent = parent.route.parent);
    return fnd;
}
function getRouteObj(routeName) {
    var queryParam = routeName.split('?');
    for (var prop in $stateCollection) {
        if (!$stateCollection[prop].abstract && $stateCollection[prop].route.regexp.test(queryParam[0])) {
            return $stateCollection[prop];
        }
    }
    return $stateCollection[routeConfig.fallback.name] || null;
}
function getRequiredRoute(routeName, params) {
    var queryParam = routeName.split('?'), foundRoute = getRouteObj(routeName);
    if (foundRoute) {
        foundRoute.route.params = extend({}, foundRoute.params || {}, params || {});
        if (foundRoute.route.paramsMapping.length && !params) {
            foundRoute.route.regexp.exec(queryParam[0]).splice(1).forEach(function (val, inc) {
                var isNumber = Number(val);
                foundRoute.route.params[foundRoute.route.paramsMapping[inc]] = !isNaN(isNumber) ? isNumber : val;
            });
        }
        if (queryParam[1]) {
            foundRoute.route.params = extend(foundRoute.route.params, unserialize(queryParam[1]));
        }
    }
    return foundRoute;
}
function parseUrl(href, params) {
    return href.replace(/\:(\w)+/g, function (index, key) {
        var param = index.split(':')[1];
        return param in params ? params[param] : '';
    });
}
function getHref(stateName, params) {
    var state = $stateCollection[stateName];
    if (state) {
        params = params || state.params;
        if (state.route.paramsMapping.length && !params) {
            throw new Error(stateName + ' requires parameter, but none was provided');
        }
        return parseUrl(state.url, params);
    }
    return routeConfig.fallback.url;
}
function RouteInterceptorInstance(route, path, currentRoute, redirectMethod) {
    this.name = route.name;
    this.path = path;
    this.locals = {};
    Object.defineProperties(this, {
        currentRoute: {
            get: function () {
                return currentRoute;
            }
        },
        originalUrl: {
            get: function () {
                return route.url;
            }
        },
        params: {
            get: function () {
                return route.params;
            }
        },
        data: {
            get: function () {
                return route.data;
            }
        }
    });
    this.redirect = redirectMethod;
}
var ViewHandler = function () {
    'use strict';
    function ViewHandler() {
        this.viewsHolder = new Map();
        this.currentView = staticRoutePrefix;
        this.stateInProgress;
        this.stateQueue = [];
        this.$stateTransitioned = false;
        this.currentState = '';
        this.previousState = '';
        this._pendingViewStack = new Map();
        this._resolvedParents = {};
    }
    ViewHandler.prototype.setViewReference = function (elementRef, ref) {
        this.viewsHolder.set(ref, {
            element: elementRef,
            compiledWith: null
        });
        this.handlePendingView(ref);
    };
    ViewHandler.prototype.getView = function (view, name) {
        var _viewHolder = this.viewsHolder.get(view);
        return name ? _viewHolder[name] : _viewHolder;
    };
    ViewHandler.prototype.compileViewTemplate = function (viewComponent, viewObjectInstance) {
        this.cleanUp(viewObjectInstance);
        if (viewComponent.loadModule) {
            viewComponent.loadModule().then(module => {
                compileModule(module);
                compileComponent(module.rootElement);
            });
        } else {
            compileComponent(viewComponent);
        }
        function compileComponent(componentFactory) {
            ComponentFactoryResolver(componentFactory, viewObjectInstance.element, componentRef => {
                viewObjectInstance.compiledWith = componentRef;
            });
        }
    };
    ViewHandler.prototype.removeViews = function (_views) {
        this.viewsHolder.forEach((view, key) => {
            if (!_views.includes(key)) {
                this.cleanUp(view);
                this.viewsHolder.delete(key);
            }
        });
    };
    ViewHandler.prototype.getCurrentView = function (_route) {
        var _views = [], mView = Object.keys(_route.views).concat();
        this._resolvedParents[_route.name] = true;
        if (_route.route.parent && !this._resolvedParents[_route.route.parent.name]) {
            var parentRoute = getParentRoute(_route.route.parent.name);
            this._resolvedParents[parentRoute.name] = true;
            this._resolvedParents[_route.route.parent.name] = true;
            return mView;
        }
        if (_route.targetView) {
            if (this.viewsHolder.has(_route.targetView)) {
                return _views.concat(_route.targetView);
            }
            return mView;
        }
        _views = _views.concat(_route.route.$$views);
        this.removeViews(_views);
        mView = null;
        return _views;
    };
    ViewHandler.prototype.resolveViews = function (route) {
        var _views = this.getCurrentView(route);
        for (var idx = 0; idx < _views.length; idx++) {
            var view = _views[idx] || staticRoutePrefix;
            var viewObj = route.views ? route.views[view] : route;
            var viewObjectInstance = this.getView(view);
            if (viewObjectInstance) {
                this.compileViewTemplate(viewObj, viewObjectInstance);
            } else {
                this._pendingViewStack.set(view, viewObj);
            }
        }
    };
    ViewHandler.prototype.destroy = function (ref) {
        var viewInstance = this.viewsHolder.get(ref);
        if (!viewInstance)
            return;
        this.cleanUp(viewInstance);
        this.viewsHolder.delete(ref);
        viewInstance = null;
    };
    ViewHandler.prototype.handlePendingView = function (viewName) {
        if (this._pendingViewStack.has(viewName)) {
            this.compileViewTemplate(this._pendingViewStack.get(viewName), this.viewsHolder.get(viewName));
            this._pendingViewStack.delete(viewName);
        }
    };
    ViewHandler.prototype.cleanUp = function (viewInstance) {
        if (viewInstance.compiledWith) {
            DOMHelper.remove(viewInstance.compiledWith);
        } else {
            viewInstance.element.children.forEach(DOMHelper.remove);
        }
    };
    ViewHandler.ctors = { name: 'ViewHandler' };
    return ViewHandler;
}();
var LocationService = function () {
    'use strict';
    function LocationService(viewHandler, locationStrategy) {
        this.viewHandler = viewHandler;
        this.strategy = new locationStrategy(this);
        this.lastVisited = '';
        this.previousState = null;
        this.locationState = null;
        this.previous = null;
        this.currentRoute = Object({ route: { params: {} } });
        this.events = new EventManager((e, route, path) => this._processState(e, route, path));
    }
    LocationService.prototype.changed = function (path) {
        return this.lastVisited !== path;
    };
    LocationService.prototype.replace = function (path) {
        if (!this.locationState && !path)
            return;
        this.locationState = {
            state: 'replaceState',
            path: path || this.locationState.previous,
            previous: this.previousState,
            current: this.lastVisited
        };
        this.previous = this.locationState.path;
    };
    LocationService.prototype.getState = function (state) {
        if (state) {
            this.locationState = state;
            return;
        }
        return this.locationState;
    };
    LocationService.prototype.search = function (query) {
        return window.location.search = query;
    };
    LocationService.prototype.go = function (path, params) {
        if (!path) {
            return false;
        }
        this.viewHandler.previousState = this.viewHandler.currentState;
        this.viewHandler.currentState = path;
        var redirect = (path, params) => {
            path = getHref(path, params);
            if (this.changed(path)) {
                this.go(path, params);
            } else {
                stopped = true;
            }
        };
        if (this.viewHandler.stateInProgress) {
            if (this.viewHandler.currentState === this.viewHandler.previousState) {
                return;
            }
            this.viewHandler.stateQueue.push([
                path,
                params
            ]);
            this.viewHandler.$stateTransitioned = true;
        } else if (this.changed(path)) {
            var route = getRequiredRoute(path, params);
            var stopped = false;
            if (route) {
                this.viewHandler.stateInProgress = true;
                var routeInstance = new RouteInterceptorInstance(route, path, this.currentRoute, redirect);
                InterceptorResolver(ROUTE_INTERCEPTOR, routeInstance).then(() => {
                    if (!stopped) {
                        this.events.dispatch(ROUTE_EVENT_ENUMS.START, route, path);
                    }
                });
            } else {
                this.events.dispatch(ROUTE_EVENT_ENUMS.NOTFOUND, {
                    path: path,
                    params: params,
                    message: 'unable to resolve route'
                });
            }
        }
    };
    LocationService.prototype.getRootUrl = function () {
        var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
        if (document.location.port) {
            rootUrl += ':' + document.location.port;
        }
        return rootUrl;
    };
    LocationService.prototype.getFullPath = function (path) {
        return this.getRootUrl() + this.strategy.path(path);
    };
    LocationService.prototype._processState = function (event, route, path) {
        if (ROUTE_EVENT_ENUMS.START === event.type) {
            var navigatedPath = route.name === routeConfig.fallback.name ? route.url : path;
            var lastTransitionQueue = this.viewHandler.stateQueue.pop();
            if (lastTransitionQueue) {
                navigatedPath = lastTransitionQueue[0];
                route = getRequiredRoute.apply(null, lastTransitionQueue);
                this.viewHandler.stateQueue.length = 0;
            }
            if (this.changed(navigatedPath)) {
                this.events.dispatch(ROUTE_EVENT_ENUMS.SUCCESS, route, this.currentRoute);
                this.currentRoute = route;
                this.strategy.pushState({
                    name: route.name,
                    params: route.params
                }, navigatedPath);
                this.viewHandler.resolveViews(route);
            } else {
                this.events.dispatch(ROUTE_EVENT_ENUMS.ERROR, route);
            }
            this.viewHandler.stateInProgress = false;
            this.lastVisited = navigatedPath;
        }
    };
    LocationService.ctors = {
        DI: [
            ViewHandler,
            ROUTE_LOCATION_STRATEGY
        ]
    };
    return LocationService;
}();
var WebStateService = function () {
    'use strict';
    function WebStateService(locationService) {
        this.onParamsChanged = new EventEmitter();
        this.locationService = locationService;
        Object.defineProperty(this, 'state', {
            get: function () {
                return this.locationService.currentRoute;
            }
        });
    }
    ;
    WebStateService.prototype.go = function (path, params, targetWindow) {
        path = getHref(path, params);
        if (!targetWindow) {
            this.locationService.go(path, params);
        } else {
            window.open(this.locationService.getFullPath(path), targetWindow);
        }
    };
    WebStateService.prototype.href = function (stateName, params) {
        return getHref(stateName, params);
    };
    WebStateService.prototype.getParam = function (name) {
        return this.locationService.currentRoute.route.params[name];
    };
    WebStateService.prototype.setParam = function (name, value) {
        var params = this.locationService.currentRoute.route.params;
        var newParam = {};
        if (typeof name !== 'object') {
            newParam[name] = value;
        } else {
            newParam = name;
        }
        Object.assign(params, newParam);
        this.onParamsChanged.emit(newParam);
        newParam = null;
    };
    WebStateService.prototype.getUrlParams = function () {
        return Object.assign({}, this.locationService.currentRoute.route.params);
    };
    WebStateService.prototype.subscribe = function (eventName, callback) {
        var eventList = Object.values(ROUTE_EVENT_ENUMS);
        if (!eventList.includes(eventName))
            throw new TypeError(eventName + ' does not exist, please use ' + eventList.join('|'));
        return this.locationService.events.add(eventName, callback);
    };
    WebStateService.ctors = { DI: [LocationService] };
    return WebStateService;
}();
var GoFn = function () {
    'use strict';
    function GoFn(webStateService) {
        this.params = {};
        this.clickHandler = function () {
            webStateService.go(this.pathName, this.params);
        };
    }
    GoFn.ctors = {
        selector: 'go',
        events: {
            'click': {
                type: 'event',
                value: [{
                        type: 'call',
                        args: [],
                        fn: 'clickHandler'
                    }]
            }
        },
        props: {
            pathName: { value: 'go' },
            params: {}
        },
        DI: [WebStateService]
    };
    return GoFn;
}();
var jViewFn = function () {
    'use strict';
    function jViewFn(viewHandler, elementRef) {
        this.ref = staticRoutePrefix;
        this.didInit = function () {
            viewHandler.setViewReference(elementRef, this.ref);
        };
        this.viewDidDestroy = function () {
            viewHandler.destroy(this.ref);
        };
    }
    jViewFn.ctors = {
        selector: 'router-view',
        props: { ref: {} },
        DI: [
            ViewHandler,
            {
                optional: true,
                tokenName: 'ElementRef'
            }
        ]
    };
    return jViewFn;
}();
var ViewIntentService = function () {
    'use strict';
    function ViewIntentService() {
        this._currentOpenIntent = new Map();
        this.intentContainer = null;
        this.$currentIntent = '';
    }
    ViewIntentService.prototype.openIntent = function (intentName, params) {
        if (this.$currentIntent === intentName) {
            return;
        }
        var intentConfig = $intentCollection[intentName];
        if (intentConfig) {
            if (!this._currentOpenIntent.has(intentName)) {
                var _this = this;
                this.$currentIntent = intentName;
                this._currentOpenIntent.set(intentName, {
                    element: null,
                    route: {
                        name: intentName,
                        params: params,
                        data: intentConfig.data
                    }
                });
                ComponentFactoryResolver(intentConfig.view.component, this.intentContainer, function (componentRef) {
                    DOMHelper.insertAfter(componentRef, componentRef.nativeElement, _this.intentContainer.nativeElement);
                    var config = _this._currentOpenIntent.get(intentName);
                    config.element = componentRef;
                    componentRef.class.add('view-intent');
                    _this.intentContainer.children.add(componentRef);
                    _this.transitIntent(intentName, intentConfig.transition || 50);
                }, true);
            } else {
                this.transitIntent(intentName, 50);
            }
        }
        ;
    };
    ViewIntentService.prototype.closeIntent = function () {
        var allIntents = [];
        var current = this.$currentIntent;
        this._currentOpenIntent.forEach(function (intent, key) {
            intent.element && intent.element.nativeElement.removeAttribute('style');
            if (current === key) {
                DOMHelper.remove(intent.element);
            } else {
                allIntents.push(key);
            }
        });
        this._currentOpenIntent.delete(current);
        this.$currentIntent = allIntents.pop();
        if (this.$currentIntent) {
            this.transitIntent(this.$currentIntent, 70);
        }
    };
    ViewIntentService.prototype.$destroyAllIntent = function () {
        this._currentOpenIntent.forEach(function (intentView) {
            DOMHelper.remove(intentView.element);
        });
        this.$currentIntent = undefined;
        this._currentOpenIntent.clear();
    };
    ViewIntentService.prototype.animate = function (elementRef, style, timer) {
        var start = null;
        function step(timestamp) {
            if (!start)
                start = timestamp;
            var progress = timestamp - start;
            if (progress < timer) {
                window.requestAnimationFrame(step);
            } else {
                elementRef.style(style);
            }
        }
        if (!elementRef) {
            return;
        }
        window.requestAnimationFrame(step);
    };
    ViewIntentService.prototype.removeIntent = function (intentName) {
        this._currentOpenIntent.remove(intentName);
    };
    ViewIntentService.prototype.transitIntent = function (intentName, timer) {
        var intentView = this._currentOpenIntent.get(intentName);
        if (intentView) {
            this.$currentIntent = intentName;
            this.hideAllIntent();
            this.animate(intentView.element, { transform: 'translateX(0%)' }, timer || 100);
        }
    };
    ViewIntentService.prototype.getIntentView = function (intentName) {
        return this._currentOpenIntent.get(intentName);
    };
    ViewIntentService.prototype.hideAllIntent = function (removeIntent) {
        this._currentOpenIntent.forEach(function (intentView) {
            intentView.element && intentView.element.nativeElement.removeAttribute('style');
        });
    };
    ViewIntentService.prototype.getCurrentIntent = function () {
        return (this.getIntentView(this.$currentIntent) || {}).route;
    };
    ViewIntentService.ctors = { name: 'viewIntent' };
    return ViewIntentService;
}();
var OpenIntent = function () {
    'use strict';
    function OpenIntent(elementRef, viewIntent) {
        this.params = {};
        this._open = null;
        this.clickHandler = function () {
            if (this.splitWhere.length) {
                this.params = elementRef.context.evaluate(this.splitWhere.join(':'));
            }
            viewIntent.openIntent(this.pathName, this.params);
        };
        Object.defineProperty(this, 'open', {
            set: function (value) {
                this.splitWhere = (value || '').split(':');
                this.pathName = this.splitWhere.shift();
                this._open = value;
            },
            get: function () {
                return this._open;
            }
        });
    }
    OpenIntent.ctors = {
        selector: 'open',
        events: {
            'event': {
                type: 'click',
                value: [{
                        type: 'call',
                        args: [],
                        fn: 'clickHandler'
                    }]
            }
        },
        props: {
            open: {},
            params: {}
        },
        DI: [
            {
                optional: true,
                tokenName: 'ElementRef'
            },
            ViewIntentService
        ]
    };
    return OpenIntent;
}();
var JIntentContainer = function () {
    'use strict';
    function JIntentContainer(viewIntent, ElementRef) {
        viewIntent.intentContainer = ElementRef;
        this.viewDidDestroy = function () {
            viewIntent.$destroyAllIntent();
        };
    }
    JIntentContainer.ctors = {
        selector: 'router-intent-container',
        DI: [
            ViewIntentService,
            {
                optional: true,
                tokenName: 'ElementRef'
            }
        ]
    };
    return JIntentContainer;
}();
function RouterInitService(locationService) {
    routeConfig.isLoaded = true;
    var path = '';
    if (routeConfig.restoreOnRefresh) {
        path = locationService.strategy.path();
    }
    locationService.go(path || routeConfig.fallback.url);
}
function AbstractStrategy(locationService) {
    this.originalState = null;
    this.locationService = locationService;
    this.isReplaceState = false;
    this.stateChanged = false;
}
AbstractStrategy.prototype.getBaseHref = function () {
};
AbstractStrategy.prototype.path = function () {
};
AbstractStrategy.prototype.pushState = function (data, path) {
    if (history) {
        history.pushState(data, null, this.path(path));
    }
};
function HashStrategyService(locationService) {
    AbstractStrategy.call(this, locationService);
    this.hashRegEx = new RegExp(routeConfig.delimiter.join('(.*)'));
    window.addEventListener('hashchange', () => {
        var locHash = location.hash;
        if (!locHash.length || !locationService.changed(locHash) || this.isReplaceState) {
            this.isReplaceState = false;
            return;
        }
        locationService.go(locHash);
    }, false);
}
HashStrategyService.prototype = Object.create(AbstractStrategy.prototype);
HashStrategyService.prototype.constructor = AbstractStrategy;
HashStrategyService.prototype.replace = function () {
    var state = this.locationService.getState();
    this.isReplaceState = true;
    if (state.hash !== state.previousHash || stateChanged) {
        location.replace(state.hash);
        this.originalState = state.currentLocation;
    }
};
HashStrategyService.prototype.path = function (path) {
    if (path)
        return routeConfig.delimiter.join(path);
    var execPath = this.hashRegEx.exec(location.hash);
    return execPath ? execPath[1] : '';
};
function PathStrategyService(locationService) {
    AbstractStrategy.call(this, locationService);
}
PathStrategyService.prototype = Object.create(AbstractStrategy.prototype);
PathStrategyService.prototype.constructor = AbstractStrategy;
PathStrategyService.prototype.path = function () {
    return '';
};
var RouterModule = function () {
    'use strict';
    function RouterModule() {
    }
    RouterModule.setRoutes = function (routes, elements) {
        if (Array.isArray(routes)) {
            routes.forEach(function (route) {
                setupRoutes(route, elements);
            });
        } else {
            setupRoutes(routes, elements);
        }
    };
    APP_BOOTSTRAP.register({
        DI: [LocationService],
        factory: RouterInitService
    }, true);
    return RouterModule;
}();
},
1159 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'CalculatorComponent', () => { return CalculatorComponent;});
var core = __required(1153);
/** compiled CalculatorComponent **/
var CalculatorComponent = function(){
"use strict";

function CalculatorComponent() {
    this.clear();
}
CalculatorComponent.prototype.getNumber = function (v) {
    console.log(v);
    if (this.waitForSecondNumber) {
        this.currentNumber = v;
        this.waitForSecondNumber = false;
    } else {
        this.currentNumber === '0' ? this.currentNumber = v : this.currentNumber += v;
    }
};
CalculatorComponent.prototype.getDecimal = function () {
    if (!this.currentNumber.includes('.')) {
        this.currentNumber += '.';
    }
};
CalculatorComponent.prototype.doCalculation = function (op, secondOp) {
    switch (op) {
    case '+':
        return this.firstOperand += secondOp;
    case '-':
        return this.firstOperand -= secondOp;
    case '*':
        return this.firstOperand *= secondOp;
    case '/':
        return this.firstOperand /= secondOp;
    case '=':
        return secondOp;
    }
};
CalculatorComponent.prototype.getOperation = function (op) {
    if (this.firstOperand === null) {
        this.firstOperand = Number(this.currentNumber);
    } else if (this.operator) {
        const result = this.doCalculation(this.operator, Number(this.currentNumber));
        this.currentNumber = String(result);
        this.firstOperand = result;
    }
    this.operator = op;
    this.waitForSecondNumber = true;
};
CalculatorComponent.prototype.clear = function () {
    this.currentNumber = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitForSecondNumber = false;
};

CalculatorComponent.ctors = {
    selector: 'app-calculator',
    exposeView: true
};

CalculatorComponent.view = /** jeli template **/ function(compiler){ 'use strict'; return function(viewRef){  var _GT = function(tid, mtl){ if (mtl && mtl.type){return mtl;} var tmp=$tmpl[tid]; if (mtl){ return Object.assign(mtl, tmp);}  return tmp ? ((typeof tmp ==='object')?tmp : tmp()): null;}; var $tmpl={}; return compiler.compile([{"type":1,"name":"div","index":0,"isc":false,"attr":{"class":"calculator"},"children":[{"type":1,"name":"input","index":1,"isc":false,"attr":{"type":"text","class":"calculator-screen","disabled":""},"attr$":{"value":{"prop":"currentNumber","once":false}}},{"type":1,"name":"div","index":3,"isc":false,"attr":{"class":"calculator-keys"},"children":[{"type":1,"name":"button","index":1,"isc":false,"attr":{"type":"button","class":"operator","value":"+"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"+"}],"fn":"getOperation"}]}],"children":[{"type":3,"ast":["+"]}]},{"type":1,"name":"button","index":3,"isc":false,"attr":{"type":"button","class":"operator","value":"-"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"-"}],"fn":"getOperation"}]}],"children":[{"type":3,"ast":["-"]}]},{"type":1,"name":"button","index":5,"isc":false,"attr":{"type":"button","class":"operator","value":"*"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"*"}],"fn":"getOperation"}]}],"children":[{"type":3,"ast":["×"]}]},{"type":1,"name":"button","index":7,"isc":false,"attr":{"type":"button","class":"operator","value":"/"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"/"}],"fn":"getOperation"}]}],"children":[{"type":3,"ast":["÷"]}]},{"type":1,"name":"button","index":9,"isc":false,"attr":{"type":"button","value":7},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"7"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["7"]}]},{"type":1,"name":"button","index":11,"isc":false,"attr":{"type":"button","value":8},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"8"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["8"]}]},{"type":1,"name":"button","index":13,"isc":false,"attr":{"type":"button","value":9},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"9"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["9"]}]},{"type":1,"name":"button","index":15,"isc":false,"attr":{"type":"button","value":4},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"4"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["4"]}]},{"type":1,"name":"button","index":17,"isc":false,"attr":{"type":"button","value":5},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"5"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["5"]}]},{"type":1,"name":"button","index":19,"isc":false,"attr":{"type":"button","value":6},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"6"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["6"]}]},{"type":1,"name":"button","index":21,"isc":false,"attr":{"type":"button","value":1},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"1"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["1"]}]},{"type":1,"name":"button","index":23,"isc":false,"attr":{"type":"button","value":2},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"2"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["2"]}]},{"type":1,"name":"button","index":25,"isc":false,"attr":{"type":"button","value":3},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"3"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["3"]}]},{"type":1,"name":"button","index":27,"isc":false,"attr":{"type":"button","value":0},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"0"}],"fn":"getNumber"}]}],"children":[{"type":3,"ast":["0"]}]},{"type":1,"name":"button","index":29,"isc":false,"attr":{"type":"button","class":"decimal","value":"."},"events":[{"name":"click","value":[{"type":"call","args":[],"fn":"getDecimal"}]}],"children":[{"type":3,"ast":["."]}]},{"type":1,"name":"button","index":31,"isc":false,"attr":{"type":"button","class":"all-clear","value":"all-clear"},"events":[{"name":"click","value":[{"type":"call","args":[],"fn":"clear"}]}],"children":[{"type":3,"ast":["AC"]}]},{"type":1,"name":"button","index":33,"isc":false,"attr":{"type":"button","class":"equal-sign","value":"="},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"="}],"fn":"getOperation"}]}],"children":[{"type":3,"ast":["="]}]}]}]}], viewRef);}}(new core["ViewParser"].JSONCompiler)/** template loader **/
return CalculatorComponent;
}();

},
1160 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'RouterPageElement', () => { return RouterPageElement;});
var common = __required(1154);
var AppModule = __required(1165);
var core = __required(1153);
var form = __required(1156);
var FormControlService = form.FormControlService;
/** compiled RouterPageElement **/
var RouterPageElement = function(){
"use strict";

function RouterPageElement() {
    this.testForm = new FormControlService({
        radio: {
            value: 1,
            validators: { required: true }
        },
        input: {
            value: undefined,
            disabled: true,
            validators: {
                required: true,
                minlength: 6
            }
        },
        textarea: {
            value: 'Testing the default value',
            disabled: false,
            validators: {
                required: true,
                minLength: 6,
                maxLength: 100
            }
        },
        checkbox: {
            value: true,
            validators: { requiredTrue: true }
        },
        select: {
            value: ['select_2'],
            validators: { required: true }
        },
        file: { validators: { required: true } },
        range: {
            value: 50,
            eventType: 'blur',
            validators: { maxlength: 90 }
        },
        number: { value: 500 },
        country: { value: 'Tuvalu' },
        job: { value: 1 }
    });
}
RouterPageElement.prototype.didInit = function () {
    this.testForm.patchValue({ number: 10 });
    this.testForm.addField('personalInfo', new FormControlService({
        firstName: {
            value: null,
            validators: { required: true }
        },
        lastName: {
            value: null,
            validators: { required: true }
        },
        age: {
            value: null,
            validators: { required: true }
        }
    }));
    console.log(this.testForm);
};

RouterPageElement.ctors = {
    selector: 'router-form-page',
    exposeView: true,
    DI: [
        FormControlService
    ]
};

RouterPageElement.view = /** jeli template **/ function(compiler){ 'use strict'; return function(viewRef){  var _GT = function(tid, mtl){ if (mtl && mtl.type){return mtl;} var tmp=$tmpl[tid]; if (mtl){ return Object.assign(mtl, tmp);}  return tmp ? ((typeof tmp ==='object')?tmp : tmp()): null;}; var $tmpl={}; return compiler.compile([{"type":1,"name":"div","index":0,"isc":false,"props":{"formControl":{"prop":"testForm"}},"providers":[form.FormControlDirective],"children":[{"type":1,"name":"div","index":1,"isc":false,"children":[{"type":1,"name":"input","index":1,"isc":false,"attr":{"type":"radio"},"props":{"formField":"radio","value":1},"providers":[form.RadioEventBinder,form.FormFieldDirective]},{"type":3,"ast":[" Yes"]},{"type":1,"name":"br","index":3,"isc":false},{"type":1,"name":"input","index":5,"isc":false,"attr":{"type":"radio"},"props":{"formField":"radio","value":0},"providers":[form.RadioEventBinder,form.FormFieldDirective]},{"type":3,"ast":[" No"]},{"type":1,"name":"br","index":7,"isc":false},{"type":1,"name":"input","index":9,"isc":false,"attr":{"type":"checkbox"},"props":{"formField":"checkbox"},"providers":[form.CheckboxEventBinder,form.FormFieldDirective]},{"type":1,"name":"br","index":10,"isc":false}]},{"type":1,"name":"textarea","index":3,"isc":false,"props":{"formField":"textarea"},"providers":[form.DefaultEventBinder,form.FormFieldDirective]},{"type":1,"name":"br","index":4,"isc":false},{"type":1,"name":"input","index":6,"isc":false,"attr":{"type":"text","minlength":5,"maxlength":10,"required":true},"props":{"formField":"input"},"providers":[form.DefaultEventBinder,form.FormFieldDirective]},{"type":1,"name":"br","index":7,"isc":false},{"type":1,"name":"input","index":9,"isc":false,"attr":{"type":"file"},"props":{"formField":"file"},"providers":[form.DefaultEventBinder,form.FormFieldDirective]},{"type":1,"name":"br","index":10,"isc":false},{"type":1,"name":"input","index":12,"isc":false,"attr":{"type":"range","id":"a"},"props":{"formField":"range"},"providers":[form.RangeEventBinder,form.FormFieldDirective]},{"type":1,"name":"br","index":13,"isc":false},{"type":1,"name":"input","index":15,"isc":false,"attr":{"type":"number","id":"b"},"props":{"formField":"number"},"providers":[form.NumberEventBinder,form.FormFieldDirective]},{"type":1,"name":"br","index":16,"isc":false},{"type":1,"name":"select","index":18,"isc":false,"props":{"formField":"select"},"providers":[form.SelectEventBinder,form.FormFieldDirective],"attr":{"multiple":""},"children":[{"type":1,"name":"option","index":1,"isc":false,"attr":{"value":"select_1"},"children":[{"type":3,"ast":["Select 1"]}]},{"type":1,"name":"option","index":3,"isc":false,"attr":{"value":"select_2"},"children":[{"type":3,"ast":["Select 2"]}]},{"type":1,"name":"option","index":5,"isc":false,"attr":{"value":"select_3"},"children":[{"type":3,"ast":["Select 3"]}]}]},{"type":1,"name":"div","index":20,"isc":false,"props":{"formControl":{"prop":{"type":"call","args":[{"type":"raw","value":"personalInfo"}],"fn":"getField","namespaces":["testForm"]}}},"providers":[form.FormControlDirective],"children":[{"type":1,"name":"div","index":1,"isc":false,"children":[{"type":1,"name":"input","index":1,"isc":false,"attr":{"type":"text","class":"form-control"},"props":{"formField":"firstName"},"providers":[form.DefaultEventBinder,form.FormFieldDirective]}]},{"type":1,"name":"input","index":3,"isc":false,"attr":{"type":"text","class":"form-control"},"props":{"formField":"lastName"},"providers":[form.DefaultEventBinder,form.FormFieldDirective]},{"type":1,"name":"input","index":5,"isc":false,"attr":{"type":"number","class":"form-control"},"props":{"formField":"age"},"providers":[form.NumberEventBinder,form.FormFieldDirective]}]},{"type":1,"name":"div","index":22,"isc":false,"children":[{"type":1,"name":"button","index":0,"isc":false,"attr$":{"disabled":{"prop":{"type":"bin","left":{"type":"una","ops":"!","args":["testForm","valid"]},"ops":"&&","right":{"type":"raw","value":true}},"once":false}},"attr":{"class":"btn btn-primary"},"children":[{"type":3,"ast":["Submit"]}]}]},{"type":1,"name":"item-list","index":24,"isc":true,"attr":{"value":[1,2,3]},"props":{"formValue":{"prop":["testForm","value"]}},"providers":[AppModule.ItemList],"children":[],"templates":{"place":{"@":[{"type":1,"name":"pre","index":1,"isc":false,"children":[{"type":3,"ast":["${0}",[["${0}",{"prop":"value","args":[],"fns":[common.jsonFilterFn]}]],false]}]}]}}},{"type":1,"name":"pre","index":26,"isc":false,"children":[{"type":3,"ast":["${0}",[["${0}",{"prop":["testForm","value"],"args":[[3]],"fns":[common.jsonFilterFn]}]],false]}]}]}], viewRef);}}(new core["ViewParser"].JSONCompiler)/** template loader **/
return RouterPageElement;
}();

},
1161 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'AppRouteModule', () => { return AppRouteModule;});
__required.r(exports, 'validatorService', () => { return validatorService;});
__required.r(exports, 'InitializeApp', () => { return InitializeApp;});
var RouterPageElement = __required(1160, 'RouterPageElement');
var CalculatorComponent = __required(1159, 'CalculatorComponent');
var core = __required(1153);
var INITIALIZERS = core.INITIALIZERS;
var router = __required(1158);
var WebStateService = router.WebStateService;
var ROUTE_INTERCEPTOR = router.ROUTE_INTERCEPTOR;
var RouterModule = router.RouterModule;
function InitializeApp(webStateService) {
    webStateService.events.listener('$webRouteStart', console.log);
}/** compiled validatorService **/
var validatorService = function(){
"use strict";

function validatorService() {
    this.resolve = function (route, locals, next) {
        next();
    };
}

validatorService.ctors = {};
return validatorService;
}();
/** compiled AppRouteModule **/
var AppRouteModule = function(){
"use strict";

function AppRouteModule() {
    RouterModule.setRoutes([
        {
            name: 'calculator',
            url: '/calculator',
            views: { '@content': CalculatorComponent }
        },
        {
            name: 'welcome',
            url: '/',
            fallback: true,
            views: { '@content': RouterPageElement }
        }
    ]);
}

INITIALIZERS.register({factory: InitializeApp, DI: [WebStateService]}, true);

ROUTE_INTERCEPTOR.register({useClass: validatorService}, true);

AppRouteModule.fac = () =>/** bootstrap module**/[
    RouterModule
].forEach(m => { if(!m.k) return (m.fac && m.fac(), m(), m.k = 1); });
;
return AppRouteModule;
}();

},
1162 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'TestPlaceElement', () => { return TestPlaceElement;});
var common = __required(1154);
var core = __required(1153);
/** compiled TestPlaceElement **/
var TestPlaceElement = function(){
"use strict";

function TestPlaceElement() {
    this.test = false;
    this.html = '';
}

TestPlaceElement.ctors = {
    selector: 'test-place',
    props: {
        options: {}
    }
};

TestPlaceElement.view = /** jeli template **/ function(compiler){ 'use strict'; return function(viewRef){  var _GT = function(tid, mtl){ if (mtl && mtl.type){return mtl;} var tmp=$tmpl[tid]; if (mtl){ return Object.assign(mtl, tmp);}  return tmp ? ((typeof tmp ==='object')?tmp : tmp()): null;}; var $tmpl={}; return compiler.compile([{"type":1,"name":"div","index":0,"isc":false,"children":[{"type":11,"name":"#","index":0,"isc":false,"refId":"modal-body"}]},{"type":8,"name":"##","text":"for","templates":{"for":{"type":1,"name":"div","index":1,"isc":false,"context":{"opt":"$context"},"props":{"jClass":{"prop":["opt","class"]}},"providers":[common.ClassDirective],"children":[{"type":1,"name":"p","index":0,"isc":false,"children":[{"type":3,"ast":["${0}",[["${0}",{"prop":"opt","args":[],"fns":[common.jsonFilterFn]}]],false]}]}]}},"props":{"forIn":{"prop":"options"}},"providers":[common.ForDirective]}], viewRef);}}(new core["ViewParser"].JSONCompiler)/** template loader **/
return TestPlaceElement;
}();

},
1163 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'ItemList', () => { return ItemList;});
var common = __required(1154);
var core = __required(1153);
/** compiled ItemList **/
var ItemList = function(){
"use strict";

function ItemList() {
}

ItemList.ctors = {
    selector: 'item-list',
    props: {
        value: {},
        formValue: {}
    }
};

ItemList.view = /** jeli template **/ function(compiler){ 'use strict'; return function(viewRef){  var _GT = function(tid, mtl){ if (mtl && mtl.type){return mtl;} var tmp=$tmpl[tid]; if (mtl){ return Object.assign(mtl, tmp);}  return tmp ? ((typeof tmp ==='object')?tmp : tmp()): null;}; var $tmpl={}; return compiler.compile([{"type":11,"name":"#","index":0,"isc":false,"refId":"@"},{"type":1,"name":"#","index":1,"isc":false,"props":{"switch":{"prop":["formValue","personalInfo","firstName"]}},"providers":[common.SwitchDirective],"children":[{"type":8,"name":"##","text":"switchDefault","templates":{"switchDefault":{"type":1,"name":"h5","index":1,"isc":false,"children":[{"type":3,"ast":["Invalid form"]}]}},"providers":[common.SwitchDefaultDirective]},{"type":8,"name":"##","text":"switchCase","templates":{"switchCase":{"type":1,"name":"h5","index":3,"isc":false,"children":[{"type":3,"ast":["Valid form"]}]}},"props":{"switchCase":{"prop":{"type":"raw","value":"test"}}},"providers":[common.SwitchCaseDirective]}]}], viewRef);}}(new core["ViewParser"].JSONCompiler)/** template loader **/
return ItemList;
}();

},
1164 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'AppRootElement', () => { return AppRootElement;});
var datetime = __required(1155);
var AppModule = __required(1165);
var common = __required(1154);
var form = __required(1156);
var core = __required(1153);
var http = __required(1157);
var HttpService = http.HttpService;
/** compiled AppRootElement **/
var AppRootElement = function(){
"use strict";

function AppRootElement(http) {
    this.valueBinding = 3;
    this.test = true;
    this.error = false;
    this.keys = [2];
    this.removeKey = function (key) {
        this.keys.splice(key, 1);
    };
    this.selectItemTest = [];
    for (var i = 0; i < 100; i++) {
        this.selectItemTest.push({
            label: 'test_' + i,
            value: i
        });
    }
    this.selectedItem = this.selectItemTest[30];
    this.pageHeading = 'My First Todo App';
    this.todos = [];
    this.removeItemCount = 0;
    this.counter = 0;
    this.todoDescription = '';
    this.range = function (start, end) {
        var value = [];
        while (end > start) {
            value.push(start);
            start++;
        }
        return value;
    };
    this.didInit = function () {
        console.log(this);
    };
    this.print = function (list) {
        console.log(list);
    };
}
AppRootElement.prototype.addTodo = function () {
    if (this.todoDescription) {
        this.todos.push({
            description: this.todoDescription,
            details: '',
            done: false
        });
        this.todoDescription = '';
    }
};
AppRootElement.prototype.removeTodo = function (index) {
    console.log('removing Todo:', index);
    if (this.todos[index]) {
        this.todos.splice(index, 1);
    }
};
AppRootElement.prototype.markAsRemoved = function (done, todo) {
    todo.done = done;
    if (done) {
        this.removeItemCount++;
    } else if (this.removeItemCount > 0) {
        this.removeItemCount--;
    }
};
AppRootElement.prototype.generateMock = function (total) {
    var data = [];
    for (var i = 0; i < total; i++) {
        data.push({
            description: 'Test_From_' + this.counter++,
            done: false,
            details: ''
        });
    }
    this.todos = data;
    data = null;
};

AppRootElement.ctors = {
    selector: 'app-root',
    DI: [
        HttpService
    ]
};

AppRootElement.view = /** jeli template **/ function(compiler){ 'use strict'; return function(viewRef){  var _GT = function(tid, mtl){ if (mtl && mtl.type){return mtl;} var tmp=$tmpl[tid]; if (mtl){ return Object.assign(mtl, tmp);}  return tmp ? ((typeof tmp ==='object')?tmp : tmp()): null;}; var $tmpl={"fallback":{"type":8,"name":"##","text":"for","templates":{"for":{"type":1,"name":"div","index":1,"isc":false,"context":{"i":"$context"},"children":[{"type":3,"ast":["Testing_${0}",[["${0}",{"prop":"i"}]],false]}]}},"props":{"forIn":{"prop":{"type":"raw","value":[0,1,2,3]}}},"providers":[common.ForDirective],"refId":"fallback"}}; return compiler.compile([{"type":1,"name":"nav","index":0,"isc":false,"attr":{"class":"navbar navbar-inverse navbar-static-top"},"children":[{"type":1,"name":"div","index":1,"isc":false,"attr":{"class":"container-fluid"},"children":[{"type":1,"name":"div","index":1,"isc":false,"attr":{"class":"navbar-header"},"children":[{"type":1,"name":"a","index":1,"isc":false,"attr":{"class":"navbar-brand","href":"#"},"children":[{"type":3,"ast":["                Todo Application              "]}]}]}]}]},{"type":1,"name":"input","index":3,"isc":false,"attr":{"type":"checkbox"},"props":{"model":{"prop":"test"}},"providers":[form.CheckboxEventBinder,form.ModelDirective],"events":[{"name":"modelChange","value":[{"type":"asg","left":"test","right":"$event"}],"custom":true}],"attr$":{"checked":{"prop":true,"once":true}},"vc":[{"name":"model","type":"jModel","value":"input"},"app-root"]},{"type":8,"name":"##","text":"if","templates":{"if":{"type":1,"name":"div","index":4,"isc":false,"children":[{"type":3,"ast":["I am Test Condition"]}]},"ifElse":_GT('fallback', null)},"props":{"if":{"prop":"test"},"ifElse":"fallback"},"providers":[common.IfDirective]},{"type":1,"name":"div","index":5,"isc":false,"props":{"jClass":{"prop":{"type":"ite","test":"test","cons":{"type":"raw","value":"visible"},"alt":{"type":"raw","value":"hidden"}}}},"providers":[common.ClassDirective],"children":[{"type":3,"ast":["Class test"]}]},{"type":1,"name":"div","index":7,"isc":false,"props":{"switch":{"prop":{"type":"una","ops":"!","args":"test"}}},"providers":[common.SwitchDirective],"children":[{"type":8,"name":"##","text":"switchCase","templates":{"switchCase":{"type":1,"name":"h5","index":1,"isc":false,"children":[{"type":3,"ast":["I am ${0} case",[["${0}",{"prop":"test"}]],false]}]}},"props":{"switchCase":{"prop":true}},"providers":[common.SwitchCaseDirective]},{"type":8,"name":"##","text":"switchDefault","templates":{"switchDefault":{"type":1,"name":"test-place","index":3,"isc":true,"providers":[AppModule.TestPlaceElement],"children":[]}},"providers":[common.SwitchDefaultDirective]}]},{"type":8,"name":"##","text":"for","templates":{"for":{"type":1,"name":"div","index":8,"isc":false,"context":{"item":"$context"},"attr":{"class":"another"},"children":[{"type":3,"ast":["${0}",[["${0}",{"prop":"item","args":[],"fns":[common.jsonFilterFn]}]],true]}]}},"props":{"forIn":{"prop":{"type":"raw","value":[{"test":2}]},"args":[[{"type":"obj","expr":{"test":2}}]],"fns":[common.FilterPipe]},"forTrackBy":"trackByFn"},"providers":[common.ForDirective]},{"type":3,"ast":["Selected: ${0}",[["${0}",{"prop":"valueBinding"}]],false]},{"type":1,"name":"select","index":10,"isc":false,"props":{"model":{"prop":"valueBinding"}},"providers":[form.SelectEventBinder,form.ModelDirective],"events":[{"name":"modelChange","value":[{"type":"asg","left":"valueBinding","right":"$event"}],"custom":true}],"children":[{"type":8,"name":"##","text":"for","templates":{"for":{"type":1,"name":"option","index":1,"isc":false,"props":{"option":"","value":{"prop":"opt","once":false}},"providers":[form.OptionDirective],"context":{"opt":"$context"},"children":[{"type":3,"ast":["${0}",[["${0}",{"prop":"opt"}]],true]}]}},"props":{"forIn":{"prop":{"type":"raw","value":[1,2,3,4,5,6]}}},"providers":[common.ForDirective]}]},{"type":1,"name":"br","index":12,"isc":false},{"type":3,"ast":[" Selected: ${0}",[["${0}",{"prop":"valueBinding2","args":[],"fns":[common.jsonFilterFn]}]],false]},{"type":1,"name":"select","index":14,"isc":false,"props":{"model":{"prop":"valueBinding2"}},"providers":[form.SelectEventBinder,form.ModelDirective],"events":[{"name":"modelChange","value":[{"type":"asg","left":"valueBinding2","right":"$event"}],"custom":true}],"attr":{"multiple":""},"children":[{"type":1,"name":"option","index":1,"isc":false,"attr":{"value":"select_1"},"children":[{"type":3,"ast":["Select 1"]}]},{"type":1,"name":"option","index":3,"isc":false,"attr":{"value":"select_2"},"children":[{"type":3,"ast":["Select 2"]}]},{"type":1,"name":"option","index":5,"isc":false,"attr":{"value":"select_3"},"children":[{"type":3,"ast":["Select 3"]}]}]},{"type":1,"name":"p","index":16,"isc":false,"children":[{"type":3,"ast":["© ${0} FrontendOnly. All Rights Reserved ",[["${0}",{"prop":{"type":"raw","value":""},"args":[[{"type":"raw","value":"YYYY"}]],"fns":[datetime.dateTimeFilterFN]}]],false]}]}], viewRef);}}(new core["ViewParser"].JSONCompiler)/** template loader **/
return AppRootElement;
}();

},
1165 : (module, exports, __required, global) => {
"use strict";
__required.r(exports, 'ItemList', () => { return ItemList;});
__required.r(exports, 'TestPlaceElement', () => { return TestPlaceElement;});
__required.r(exports, 'AppModule', () => { return AppModule;});
var RouterPageElement = __required(1160, 'RouterPageElement');
var CalculatorComponent = __required(1159, 'CalculatorComponent');
var AppRootElement = __required(1164, 'AppRootElement');
var ItemList = __required(1163, 'ItemList');
var TestPlaceElement = __required(1162, 'TestPlaceElement');
var AppRouteModule = __required(1161, 'AppRouteModule');
var http = __required(1157);
var HttpModule = http.HttpModule;
var form = __required(1156);
var FormModule = form.FormModule;
var datetime = __required(1155);
var DateTimeModule = datetime.DateTimeModule;
var common = __required(1154);
var CommonModule = common.CommonModule;
/** compiled AppModule **/
var AppModule = function(){
"use strict";

function AppModule() {
}

AppModule.rootElement = AppRootElement;

AppModule.fac = () =>/** bootstrap module**/[
    CommonModule,
    DateTimeModule,
    FormModule,
    HttpModule,
    AppRouteModule
].forEach(m => { if(!m.k) return (m.fac && m.fac(), m(), m.k = 1); });
;
return AppModule;
}();

}}, this));