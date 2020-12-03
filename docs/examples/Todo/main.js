!function(factory, __required){
'use strict'; 
 /** trigged factory **/
factory(__required);
}(function(__required){
var core = __required('dist/core/bundles/jeli-core-module.js');
var bootStrapApplication = core['bootStrapApplication'];
var AppModule = __required('viewers/Todo/src/app/app.module.js', 'AppModule');

bootStrapApplication(AppModule);
}, (function(__JELI__DEPENDENCY__HUB__, __resolved__){ 'use strict';
return function __required(deps, property){
  if(__resolved__[deps]) return getProp();
/** create a new ref **/__resolved__[deps] = {exports:true};
__JELI__DEPENDENCY__HUB__[deps](__resolved__[deps], __resolved__[deps], __required); return getProp();
 function getProp(){ return property ? __resolved__[deps][property]: __resolved__[deps]; }
};
})(/** JELI DEPENDECY HUB **/{
'node_modules/js-helpers/fns/isstring.js': function(module, exports, __required){
exports.default = function (str) {
    return typeof str === 'string' && new String(str) instanceof String;
};
},
'node_modules/js-helpers/fns/isarray.js': function(module, exports, __required){
exports.default = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
},
'node_modules/js-helpers/fns/inarray.js': function(module, exports, __required){
var isarray = __required('node_modules/js-helpers/fns/isarray.js', 'default');
var isstring = __required('node_modules/js-helpers/fns/isstring.js', 'default');
exports.default = function (needle, haystack) {
    return (isstring(haystack) || isarray(haystack)) && haystack.indexOf(needle) > -1;
};
},
'node_modules/js-helpers/fns/isboolean.js': function(module, exports, __required){
exports.default = function (bool) {
    return Object.prototype.toString.call(bool) === '[object Boolean]';
};
},
'node_modules/js-helpers/fns/isdefined.js': function(module, exports, __required){
exports.default = function (val) {
    return typeof val !== 'undefined';
};
},
'node_modules/js-helpers/fns/isdouble.js': function(module, exports, __required){
exports.default = function (n) {
    return parseFloat(n) > 0;
};
},
'node_modules/js-helpers/fns/isempty.js': function(module, exports, __required){
exports.default = function (val) {
    if (val && typeof val === 'object') {
        return Object.values(val).length < 1;
    }
    return !val || val === '';
};
},
'node_modules/js-helpers/fns/isequal.js': function(module, exports, __required){
exports.default = function (a, b) {
    return a === b;
};
},
'node_modules/js-helpers/fns/isfloat.js': function(module, exports, __required){
exports.default = function (n) {
    return Number(n) === n && n % 1 !== 0;
};
},
'node_modules/js-helpers/fns/isfunction.js': function(module, exports, __required){
exports.default = function (fn) {
    return typeof fn === 'function';
};
},
'node_modules/js-helpers/fns/isjsonstring.js': function(module, exports, __required){
exports.default = function (str) {
    return str && typeof str === 'string' && '{['.indexOf(str.charAt(0)) > -1 && '}]'.indexOf(str.charAt(str.length - 1)) > -1;
};
},
'node_modules/js-helpers/fns/isnull.js': function(module, exports, __required){
exports.default = function (val) {
    return null === val;
};
},
'node_modules/js-helpers/fns/isnumber.js': function(module, exports, __required){
exports.default = function (n) {
    return Number(n) === n && n % 1 === 0;
};
},
'node_modules/js-helpers/fns/isobject.js': function(module, exports, __required){
exports.default = function (obj) {
    return typeof obj === 'object' && obj instanceof Object && Object.prototype.toString.call(obj) === '[object Object]';
}
;;
},
'node_modules/js-helpers/fns/isundefined.js': function(module, exports, __required){
exports.default = function (val) {
    return typeof val === 'undefined';
};
},
'node_modules/js-helpers/fns/addToarray.js': function(module, exports, __required){
exports.default = function (list, item, index) {
    if (index >= list.length) {
        list.push(item);
    } else {
        list.splice(index, 0, item);
    }
};
},
'node_modules/js-helpers/fns/removeFromArray.js': function(module, exports, __required){
exports.default = function (list, index) {
    if (index >= list.length - 1) {
        return list.pop();
    } else {
        return list.splice(index, 1)[0];
    }
};
},
'node_modules/js-helpers/helpers.js': function(module, exports, __required){

exports.inarray = __required('node_modules/js-helpers/fns/inarray.js', 'default');
exports.isarray = __required('node_modules/js-helpers/fns/isarray.js', 'default');
exports.isboolean = __required('node_modules/js-helpers/fns/isboolean.js', 'default');
exports.isdefined = __required('node_modules/js-helpers/fns/isdefined.js', 'default');
exports.isdouble = __required('node_modules/js-helpers/fns/isdouble.js', 'default');
exports.isempty = __required('node_modules/js-helpers/fns/isempty.js', 'default');
exports.isequal = __required('node_modules/js-helpers/fns/isequal.js', 'default');
exports.isfloat = __required('node_modules/js-helpers/fns/isfloat.js', 'default');
exports.isfunction = __required('node_modules/js-helpers/fns/isfunction.js', 'default');
exports.isjsonstring = __required('node_modules/js-helpers/fns/isjsonstring.js', 'default');
exports.isnull = __required('node_modules/js-helpers/fns/isnull.js', 'default');
exports.isnumber = __required('node_modules/js-helpers/fns/isnumber.js', 'default');
exports.isobject = __required('node_modules/js-helpers/fns/isobject.js', 'default');
exports.isstring = __required('node_modules/js-helpers/fns/isstring.js', 'default');
exports.isundefined = __required('node_modules/js-helpers/fns/isundefined.js', 'default');
exports.addToArray = __required('node_modules/js-helpers/fns/addToarray.js', 'default');
exports.removeFromArray = __required('node_modules/js-helpers/fns/removeFromArray.js', 'default');
},
'node_modules/js-helpers/fns/base64.js': function(module, exports, __required){
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
};
},
'node_modules/js-helpers/fns/camelcase.js': function(module, exports, __required){
exports.default = function (str) {
    return str(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (p2) {
            return p2.toUpperCase();
        }
        return p1.toLowerCase();
    });
};
},
'node_modules/js-helpers/fns/cookie.js': function(module, exports, __required){
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
};
},
'node_modules/js-helpers/fns/extend.js': function(module, exports, __required){
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
exports.default = extend;
},
'node_modules/js-helpers/fns/copy.js': function(module, exports, __required){
var extend = __required('node_modules/js-helpers/fns/extend.js', 'default');
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
};
},
'node_modules/js-helpers/fns/copyfrom.js': function(module, exports, __required){
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
exports.default = copyFrom;
},
'node_modules/js-helpers/fns/count.js': function(module, exports, __required){
exports.default = function (obj) {
    return Object.keys(obj).length;
};
},
'node_modules/js-helpers/fns/expect.js': function(module, exports, __required){
var isobject = __required('node_modules/js-helpers/fns/isobject.js', 'default');
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
};
},
'node_modules/js-helpers/fns/hashcode.js': function(module, exports, __required){
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
};
},
'node_modules/js-helpers/fns/logger.js': function(module, exports, __required){
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
exports.default = logger;
},
'node_modules/js-helpers/fns/makeuid.js': function(module, exports, __required){
exports.default = function (e) {
    var uid = '';
    var f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var g = 0; g < e; g++) {
        uid += f.charAt(Math.floor(Math.random() * f.length));
    }
    return uid;
};
},
'node_modules/js-helpers/fns/nodubs.js': function(module, exports, __required){
exports.default = function (arr) {
    return arr.reduce(function (all, item, index) {
        if (arr.indexOf(arr[index]) === index) {
            all.push(item);
        }
        return all;
    }, []);
};
},
'node_modules/js-helpers/fns/serializer.js': function(module, exports, __required){
var isFunction = __required('node_modules/js-helpers/fns/isfunction.js', 'default');
var isObject = __required('node_modules/js-helpers/fns/isobject.js', 'default');
var isArray = __required('node_modules/js-helpers/fns/isarray.js', 'default');
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
exports.default = serialize;
},
'node_modules/js-helpers/fns/splitntrim.js': function(module, exports, __required){
exports.default = function (str, regexp) {
    return (str || '').split(regexp).map(function (val) {
        return val.trim();
    });
};
},
'node_modules/js-helpers/fns/toobject.js': function(module, exports, __required){
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
};
},
'node_modules/js-helpers/fns/unserialize.js': function(module, exports, __required){
exports.default = function (par) {
    return (par || '').split('&').reduce(function (accum, val) {
        if (val) {
            var splitPairs = val.split('=');
            accum[splitPairs[0]] = parseJSON(splitPairs[1]);
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
};
},
'node_modules/js-helpers/fns/simpleBooleanParser.js': function(module, exports, __required){
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
};
},
'node_modules/js-helpers/utils.js': function(module, exports, __required){

exports.base64 = __required('node_modules/js-helpers/fns/base64.js', 'default');
exports.cookie = __required('node_modules/js-helpers/fns/cookie.js', 'default');
exports.copy = __required('node_modules/js-helpers/fns/copy.js', 'default');
exports.copyfrom = __required('node_modules/js-helpers/fns/copyfrom.js', 'default');
exports.count = __required('node_modules/js-helpers/fns/count.js', 'default');
exports.expect = __required('node_modules/js-helpers/fns/expect.js', 'default');
exports.extend = __required('node_modules/js-helpers/fns/extend.js', 'default');
exports.hashcode = __required('node_modules/js-helpers/fns/hashcode.js', 'default');
exports.logger = __required('node_modules/js-helpers/fns/logger.js', 'default');
exports.makeuid = __required('node_modules/js-helpers/fns/makeuid.js', 'default');
exports.nodubs = __required('node_modules/js-helpers/fns/nodubs.js', 'default');
exports.serialize = __required('node_modules/js-helpers/fns/serializer.js', 'default');
exports.splitntrim = __required('node_modules/js-helpers/fns/splitntrim.js', 'default');
exports.toobject = __required('node_modules/js-helpers/fns/toobject.js', 'default');
exports.unserialize = __required('node_modules/js-helpers/fns/unserialize.js', 'default');
exports.camelcase = __required('node_modules/js-helpers/fns/camelcase.js', 'default');
exports.simpleBooleanParser = __required('node_modules/js-helpers/fns/simpleBooleanParser.js', 'default');
},
'dist/core/bundles/jeli-core-module.js': function(module, exports, __required){
var utils = __required('node_modules/js-helpers/utils.js');
var hashcode = utils['hashcode'];
var simpleBooleanParser = utils['simpleBooleanParser'];
var copy = utils['copy'];
var helpers = __required('node_modules/js-helpers/helpers.js');
var isnumber = helpers['isnumber'];
var isarray = helpers['isarray'];
var isnull = helpers['isnull'];
var isundefined = helpers['isundefined'];
var isboolean = helpers['isboolean'];
var isempty = helpers['isempty'];
var isstring = helpers['isstring'];
var addToArray = helpers['addToArray'];
var removeFromArray = helpers['removeFromArray'];
var inarray = helpers['inarray'];
var isequal = helpers['isequal'];
var isobject = helpers['isobject'];
var isfunction = helpers['isfunction'];
function errorBuilder(error, logLevel) {
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
    }
    userException.prototype.toString = function () {
        return this.name + ': "' + this.message + '"';
    };
    if (typeof error == 'string') {
        error = new userException(error);
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
var existingInstance = new Map();
function ProviderToken(tokenName, multiple, provide) {
    var tokenRecords = [];
    var persists = false;
    this.tokenName = tokenName;
    this.register = function (value, wireInstant) {
        value = wireInstant ? AutoWire(value) : value;
        if (multiple) {
            tokenRecords.push(value);
        } else {
            tokenRecords = value;
        }
        persists = wireInstant;
    };
    this.resolve = function () {
        var token;
        try {
            if (multiple) {
                token = tokenRecords.map(getToken);
            } else {
                token = getToken(tokenRecords);
            }
        } catch (e) {
            errorBuilder('error while resolving ' + tokenName);
        }
        if (!persists)
            tokenRecords = [];
        return token;
    };
    if (provide) {
        this.register(provide, true);
    }
    function getToken(token) {
        return persists ? token : AutoWire(token);
    }
}
function Inject(factory, localInjector) {
    if (localInjector && localInjector.has(factory)) {
        return localInjector.get(factory);
    } else if (isfunction(factory)) {
        if (!factory.annotations) {
            return resolveClosureRef(factory);
        }
        var instance = factory.annotations.instance;
        if (!instance) {
            instance = AutoWire(resolveClosureRef(factory), localInjector);
            if (!factory.annotations.noSingleton) {
                factory.annotations.instance = instance;
            }
        }
        return instance;
    } else if (factory instanceof ProviderToken) {
        return factory.resolve();
    }
    return null;
}
;
function AutoWire(factory, localInjector, callback) {
    if (isfunction(factory)) {
        var deps = resolveDeps(factory.annotations && factory.annotations.DI, localInjector);
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
                token.name.register(tokenValue);
            } else if (isfunction(token.name)) {
                console.log(token, tokenValue);
            }
        }
    }
}
function resolveTokenBase(token, localInjector) {
    var tokenValue;
    if (token.factory) {
        var args = resolveDeps(token.DI, localInjector);
        tokenValue = function () {
            return resolveClosureRef(token.factory).apply(null, args);
        };
    } else if (token.useClass) {
        tokenValue = Inject(token.useClass, localInjector);
    } else if (token.reference) {
        tokenValue = resolveReference(Inject(token.reference, localInjector), localInjector);
    } else if (token.value) {
        tokenValue = token.value;
    }
    return tokenValue;
}
function resolveDeps(DI, localInjector) {
    var deps = [];
    if (DI) {
        for (var serviceName in DI) {
            var doInject = DI[serviceName];
            var injectableParam = null;
            var err = false;
            try {
                injectableParam = Inject(doInject.factory || serviceName, localInjector);
            } catch (e) {
                err = true;
            } finally {
                if (err && !doInject.optional) {
                    throw new Error('Unable to resolve provider ' + serviceName);
                }
            }
            deps.push(injectableParam);
        }
    }
    return deps;
}
function resolveReference(reference, localInjector) {
    if (isfunction(reference)) {
        if (reference.instance)
            return reference.instance;
        else if (localInjector.has(reference))
            return localInjector.get(reference);
        else if (reference.annotations) {
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
function LifeCycle(componentInstance) {
    var _cycleState = {
        didInit: !!componentInstance.didInit,
        viewDidLoad: !!componentInstance.viewDidLoad,
        viewDidMount: !!componentInstance.viewDidMount,
        viewDidDestroy: !!componentInstance.viewDidDestroy,
        willObserve: !!componentInstance.willObserve,
        didChange: !!componentInstance.didChange
    };
    this.has = function (cycle) {
        return _cycleState[cycle] && isfunction(componentInstance[cycle]);
    };
    this.trigger = function (cycle, args) {
        if (this.has(cycle)) {
            componentInstance[cycle](args);
        }
    };
}
;
var staticInjectionToken = {
    ElementRef: 'ElementRef',
    TemplateRef: 'TemplateRef',
    changeDetector: 'changeDetector',
    ViewRef: 'ViewRef',
    ParentRef: 'ParentRef',
    VALIDATORS: 'VALIDATORS',
    QueryList: 'QueryList',
    Function: 'Function'
};
function ComponentInjectors(elementRef) {
    AbstractInjectorInstance.call(this, elementRef);
    this.injectors.ElementRef = elementRef;
    this.currentClassAnnotations = {};
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
ComponentInjectors.prototype.get = function (tokenName) {
    if (this.injectors.hasOwnProperty(tokenName))
        return this.injectors[tokenName];
    else if (staticInjectionToken[tokenName])
        return _ComponentInjectionToken(tokenName, this);
};
function _ComponentInjectionToken(tokenName, context) {
    switch (tokenName) {
    case staticInjectionToken.TemplateRef:
        return context.injectors.ElementRef.getTemplateRef(context.currentClassAnnotations.selector);
    case staticInjectionToken.changeDetector:
        return context.injectors.ElementRef.changeDetector;
    case staticInjectionToken.ViewRef:
        return new ViewRef(context.injectors.ElementRef);
    case staticInjectionToken.ParentRef: {
            if (context.currentClassAnnotations.DI.ParentRef.value) {
                return findParentRef(context.injectors.ElementRef.parent, context.currentClassAnnotations.DI.ParentRef);
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
    if (parentRef && !parentRef.nodes.has(selector)) {
        return findParentRef(parentRef.parent, refInstance);
    }
    if (!parentRef) {
        return null;
    }
    return parentRef.nodes.get(selector);
}
function ϕjeliLinker(componentInstance, elementRef, lifeCycle, definition) {
    lifeCycle.trigger('willObserve');
    var propChanges = null;
    var registeredProperty = [];
    var always = false;
    if (definition.props) {
        always = _updateViewBinding();
    }
    function _updateViewBinding() {
        var hasBinding = false;
        for (var prop in definition.props) {
            var item = definition.props[prop];
            var name = item.value || prop;
            var value;
            if (elementRef.props && elementRef.props.hasOwnProperty(name)) {
                try {
                    if (isobject(elementRef.props[name])) {
                        hasBinding = true;
                        value = getFilteredTemplateValue(elementRef.props[name], (isequal(elementRef.parent.type, 'comment') && !elementRef.isc ? elementRef : elementRef.parent).context, elementRef.parent.componentInstance);
                    } else {
                        value = getPrimitiveValue(item.type, name, elementRef.props[name]);
                    }
                    setValue(prop, value);
                } catch (e) {
                    console.error(e);
                }
            } else if (elementRef.hasAttribute(name)) {
                setValue(prop, elementRef.attr[name]);
            }
        }
        if (propChanges) {
            lifeCycle.trigger('didChange', propChanges);
            propChanges = null;
        }
        return hasBinding;
    }
    function setValue(property, value) {
        if (isequal(componentInstance[property], value) && registeredProperty.includes(property)) {
            return;
        }
        if (propChanges === null) {
            propChanges = {};
        }
        if (!registeredProperty.includes(property)) {
            registeredProperty.push(property);
        }
        propChanges[property] = value;
        componentInstance[property] = value;
    }
    function getPrimitiveValue(type, name, value) {
        switch (type) {
        case staticInjectionToken.TemplateRef:
            return elementRef.getTemplateRef(name);
        case staticInjectionToken.Function:
            return elementRef.parent.componentInstance[value];
        default:
            return value;
        }
    }
    var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, function () {
        if (always)
            _updateViewBinding();
        lifeCycle.trigger('willObserve');
    });
    elementRef.observer(function () {
        unsubscribe();
        registeredProperty = [];
    });
}
function SubscribeObservables(refId, fn) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
    }
    return unsubscribe;
}
function ElementCompiler(ctrl, elementRef, componentInjectors, next) {
    var definition = ctrl.annotations, lifeCycle;
    function CoreComponentCompiler(componentInstance) {
        if (!elementRef.isc) {
            return;
        }
        var componentRef = componentDebugContext.get(elementRef.refId);
        componentRef.componentInstance = componentInstance;
        if (ctrl.view) {
            try {
                var template = ctrl.view.getView(elementRef);
                elementRef.mutationObserver(function (mutaionList, observer) {
                    lifeCycle.trigger('viewDidLoad');
                    observer.disconnect();
                });
                elementRef.appendChild(template);
                buildViewChild(componentInstance, elementRef, definition.viewChild);
            } catch (e) {
                errorBuilder(e);
            }
        }
        elementRef.observer(function () {
            lifeCycle.trigger('viewDidDestroy');
            componentRef.destroy();
            lifeCycle = null;
            componentRef = null;
        });
        componentRef.changeDetector.detectChanges(true, true);
    }
    function compileEventsRegistry(componentInstance) {
        if (definition.events) {
            Object.keys(definition.events).forEach(_registry);
        }
        function _registry(evName) {
            switch (definition.events[evName].type) {
            case 'event':
                elementRef.events.attachEventHandler(evName, definition.events[evName].value, componentInstance);
                break;
            case 'emitter':
                elementRef.events.attachEventEmitter(evName, componentInstance);
                break;
            case 'dispatcher':
                elementRef.events.attachEventDispatcher(evName, componentInstance);
                break;
            }
        }
    }
    function registerDirectiveInstance(componentInstance) {
        if (!elementRef.isc) {
            elementRef.nodes.set(ctrl.annotations.exportAs || definition.selector, componentInstance);
            elementRef.observer(function () {
                lifeCycle.trigger('viewDidDestroy');
                elementRef.nodes.delete(definition.selector);
            });
        }
    }
    ComponentFactoryInitializer(ctrl, componentInjectors, function triggerInstance(componentInstance) {
        compileEventsRegistry(componentInstance);
        lifeCycle = new LifeCycle(componentInstance);
        ϕjeliLinker(componentInstance, elementRef, lifeCycle, definition);
        registerDirectiveInstance(componentInstance);
        lifeCycle.trigger('didInit');
        next(componentInstance);
        CoreComponentCompiler(componentInstance);
    });
}
ElementCompiler.resolve = function (node, nextTick) {
    var inc = 0;
    function next() {
        var factory = node.providers[inc];
        var componentInjectors = new ComponentInjectors(node);
        inc++;
        if (factory) {
            try {
                componentInjectors.currentClassAnnotations = factory.annotations;
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
function ComponentFactoryInitializer(ctrl, injectorInstance, CB) {
    wireResolvers(ctrl.annotations.resolve, injectorInstance);
    AutoWire(ctrl, injectorInstance, function (instance) {
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
function ComponentRef(refId) {
    this.componentRefId = refId;
    this.observables = new Observer();
    this.child = [];
    this.parent = null;
    this.changeDetector = new InternalChangeDetector(this);
    this._componentInstance = null;
    this._context = null;
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
                if (!this._componentInstance && this.parent) {
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
ComponentRef.create = function (refId, parentId) {
    var componentRef = new ComponentRef(refId);
    componentDebugContext.set(refId, componentRef);
    if (parentId && componentDebugContext.has(parentId)) {
        componentRef.parent = parentId;
        componentDebugContext.get(parentId).child.push(refId);
    }
    componentRef = null;
};
function ChangeDetector() {
    if (!CoreBootstrapContext.bootStrapComponent)
        return;
    CoreBootstrapContext.bootStrapComponent.changeDetector.detectChanges();
}
;
function buildViewChild(componentInstance, elementRef, viewChild) {
    elementRef.viewQuery.forEach(assignValue);
    function assignValue(viewElement, property) {
        var option = viewChild[property];
        switch (option.type) {
        case staticInjectionToken.QueryList:
            if (!componentInstance.hasOwnProperty(property)) {
                componentInstance[property] = new QueryList();
            }
            componentInstance[property].add(viewElement);
            break;
        case staticInjectionToken.ElementRef:
            componentInstance[property] = viewElement;
            break;
        default:
            componentInstance[property] = viewElement.nodes.has(option.type) ? viewElement.nodes.get(option.type) : viewElement.context;
            break;
        }
    }
    elementRef.viewQuery.clear();
}
function CorePromiseHandler(triggerAfterResolve) {
    var _untilObserver = [];
    var untilStarted = false;
    var state = {
        pending: true,
        value: null,
        resolvedWith: ''
    };
    var _pending = [];
    function checkPendingState() {
        if (!state.pending) {
            _complete(state.resolvedWith, state.value);
        } else if (_untilObserver.length && !untilStarted) {
            untilStarted = true;
            startUntilObserver();
        }
    }
    function startUntilObserver() {
        var _interval = setInterval(function () {
            var allPassed = _untilObserver.map(function (fn) {
                return fn();
            }).filter(function (ans) {
                return !!ans;
            }).length;
            if (allPassed === _untilObserver.length) {
                _complete('resolve');
                _untilObserver.length = 0;
                clearInterval(_interval);
            }
        }, 100);
    }
    function _complete(type, result) {
        while (_pending[0]) {
            var fn = _pending.shift()[type];
            fn.apply(null, result);
        }
        state.pending = false;
        state.value = result;
        state.resolvedWith = type;
        (triggerAfterResolve || function () {
        })();
    }
    ;
    function _registerListener(listeners) {
        _pending.push(listeners);
        checkPendingState();
    }
    return {
        complete: _complete,
        checkPendingState: checkPendingState,
        startUntilObserver: startUntilObserver,
        until: _untilObserver,
        registerListener: _registerListener
    };
}
function Defer(triggerAfterResolve) {
    var core = CorePromiseHandler(triggerAfterResolve);
    this.resolve = function () {
        core.complete('done', arguments);
    };
    this.reject = function () {
        core.complete('fail', arguments);
    };
    this.done = function (callback) {
        core.registerListener({ done: callback });
        return this;
    };
    this.fail = function (callback) {
        core.registerListener({ fail: callback });
        return this;
    };
}
function _Promise(triggerAfterResolve) {
    var core = CorePromiseHandler(triggerAfterResolve);
    this.resolve = function () {
        core.complete('resolve', arguments);
    };
    this.reject = function (result) {
        core.complete('reject', arguments);
    };
    this.until = function (untilObserver) {
        core.until.push(untilObserver);
        return this;
    };
    this.then = function (success, failure) {
        core.registerListener({
            resolve: success || function () {
            },
            reject: failure || function () {
            }
        });
        return this;
    };
    this.catch = function (failure) {
        core.registerListener({
            reject: failure || function () {
            }
        });
    };
}
_Promise.all = function (resolve) {
    var slice = [].slice;
    var resolveValues = arguments.length == 1 && resolve.length ? resolve : slice.call(arguments);
    var length = resolveValues.length;
    var remaining = length;
    var deferred = new Defer();
    var failed = 0;
    var results = [];
    function updateDefered(idx, err) {
        return function (res) {
            results[idx] = res;
            if (err) {
                ++failed;
            }
            if (!--remaining) {
                deferred[failed ? 'reject' : 'resolve'](results);
            }
        };
    }
    for (var i = 0; i < length; i++) {
        var cur = resolveValues[i];
        if (cur instanceof _Promise || cur instanceof Promise) {
            cur.then(updateDefered(i), updateDefered(i, true));
        } else {
            updateDefered(i)(cur);
        }
    }
    return deferred;
};
var $eUID = 1;
var CoreBootstrapContext = {
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    injector: null,
    enableDebugger: true
};
var INITIALIZERS = new ProviderToken('AppInitializers', true);
function bootStrapApplication(moduleToBootStrap) {
    CoreBootstrapContext.compiledModule = moduleToBootStrap;
    CoreBootstrapContext.injector = new AbstractInjectorInstance();
    moduleToBootStrap();
    _Promise.all(Inject(INITIALIZERS, CoreBootstrapContext.injector).map(function (callback) {
        return callback();
    })).done(function () {
        CoreBootstrapContext.$isCompiled = true;
        bootStrapElement();
    }, function (err) {
        console.error(err);
    });
    function bootStrapElement() {
        if (moduleToBootStrap.rootElement) {
            var selector = moduleToBootStrap.rootElement.annotations.selector;
            CoreBootstrapContext.bootStrapComponent = new ElementRef({
                name: selector,
                isc: true,
                type: 'element',
                fromDOM: true
            }, null);
            ElementCompiler(moduleToBootStrap.rootElement, CoreBootstrapContext.bootStrapComponent, CoreBootstrapContext.injector, function () {
            });
        }
    }
}
;
function ViewParser(transpiledHTML) {
    var _viewContainer = [];
    this.getView = function (parent) {
        for (var i = 0; i < transpiledHTML.length; i++) {
            var compiled = ViewParserHelper[transpiledHTML[i].type](transpiledHTML[i], parent, this);
            if (compiled) {
                _viewContainer.push(compiled);
            }
        }
        return toFragment(_viewContainer, parent);
    };
    this.pushToView = function (element) {
        _viewContainer.push(element);
    };
}
;
function element(definition, parent, viewContainer) {
    var elementRef = new ElementRef(definition, parent);
    if (definition.attr) {
        AttributeAppender(elementRef.nativeElement, definition.attr);
    }
    if (definition.children) {
        for (var i = 0; i < definition.children.length; i++) {
            var child = ViewParserHelper[definition.children[i].type](definition.children[i], elementRef, viewContainer, true);
            if (child) {
                elementRef.children.add(child);
                elementRef.nativeElement.appendChild(child.nativeElement || child.nativeNode);
            }
        }
    }
    if (definition.vc) {
        elementRef.hostRef.addViewQuery(definition.vc, elementRef);
    }
    return elementRef;
}
;
function comment(definition, parent, viewContainer) {
    return new AbstractElementRef(definition, parent);
}
function text(definition, parent) {
    return new TextNodeRef(copy(definition), parent);
}
;
function place(definition, parent, viewContainer, appendToChild) {
    var hostRef = parent.hostRef;
    var templates = hostRef.getTemplateRef('place');
    templates.forEach(definition.selector, function (template) {
        var child = ViewParserHelper[template.type](template, parent.hostRef.parent, viewContainer);
        if (appendToChild) {
            parent.children.add(child);
            parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
        } else {
            viewContainer.pushToView(child);
        }
    });
    return null;
}
;
function outlet(definition, parent, viewContainer) {
    var template = definition.template;
    if (!template && parent.hostRef) {
        template = parent.hostRef.templates[definition.templateId];
    }
    if (template) {
        var element = ViewParserHelper.element(template, parent, viewContainer);
        element.context = context;
        return element;
    }
    return null;
}
;
function toFragment(compiledTemplate, parent) {
    var fragment = document.createDocumentFragment();
    while (compiledTemplate.length) {
        processCompiler(compiledTemplate.shift());
    }
    function processCompiler(compiled) {
        parent.children.add(compiled);
        fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
        transverse(compiled);
    }
    return fragment;
}
;
function transverse(node) {
    if (node instanceof AbstractElementRef) {
        if (node.providers && node.providers.length) {
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else if (node instanceof TextNodeRef && node.hasBinding) {
        node.registerObserver();
    }
    function proceedWithCompilation(node) {
        if (isequal(node.nativeElement.nodeType, 8)) {
            return;
        }
        ;
        node.events.registerListener();
        node.children.forEach(transverse);
    }
}
var ViewParserHelper = {
    element: element,
    text: text,
    place: place,
    outlet: outlet,
    comment: comment
};
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
function AbstractElementRef(definition, parentRef) {
    this.nativeElement = createElementByType(definition.name, definition.text, definition.fromDOM);
    this.refId = 'jeli:' + +new Date() + ':' + $eUID++;
    this.$observers = [];
    this.children = new QueryList();
    this.parent = parentRef;
    this.type = definition.type;
    this.tagName = definition.name.toLowerCase();
    this.isc = definition.isc;
    this.providers = definition.providers;
    this.index = definition.index;
    this.attr = definition.attr;
    this.props = definition.props;
    this.nativeNode = this.nativeElement.nodeType === 8 ? this.nativeElement : null;
    this.nodes = new Map();
    this._viewQuery = null;
    this.getTemplateRef = function (templateId) {
        if (!definition.templates || !definition.templates.hasOwnProperty(templateId)) {
            errorBuilder('No templates Defined #' + templateId);
        }
        return new TemplateRef(definition.templates[templateId]);
    };
    Object.defineProperties(this, {
        context: {
            get: function () {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).context;
                }
                return this.parent.context;
            }
        },
        componentInstance: {
            get: function () {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).componentInstance;
                }
                return this.hostRef.componentInstance;
            }
        },
        changeDetector: {
            get: function () {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).changeDetector;
                }
                return this.hostRef.changeDetector;
            }
        },
        hostRef: {
            get: function () {
                if (this.isc) {
                    return this;
                }
                return this.parent.hostRef;
            }
        }
    });
}
AbstractElementRef.prototype.getAttribute = function (name) {
    return this.attr && name in this.attr ? this.attr[name] : this.nativeElement.getAttribute(name);
};
AbstractElementRef.prototype.insertAfter = function (newNode, targetNode) {
    if (!targetNode.parentNode)
        return;
    targetNode = targetNode || this.nativeElement;
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
    this.changeDetector.detectChanges();
};
AbstractElementRef.prototype.remove = function (removeFromParent) {
    if (this.nativeElement && this.nativeElement.nodeType != 11) {
        this.nativeElement.remove();
    }
    if (removeFromParent && this.parent) {
        this.parent.children.remove(this);
    }
    cleanupElementRef(this);
};
AbstractElementRef.prototype.hasAttribute = function (name) {
    return this.attr && this.attr.hasOwnProperty(name);
};
AbstractElementRef.prototype.removeChild = function (element) {
    this.children.remove(element);
    cleanupElementRef(element);
};
AbstractElementRef.prototype.observer = function (onDestroyListener) {
    if (onDestroyListener) {
        this.$observers.push(onDestroyListener);
    }
};
function cleanupElementRef(elementRef) {
    elementRef.events && elementRef.events.destroy();
    while (elementRef.$observers.length) {
        elementRef.$observers.pop()();
    }
    elementRef.children.destroy();
    elementRef.nativeElement = null;
    elementRef.parent = null;
    elementRef.providers = null;
    elementRef._viewQuery = null;
    elementRef.nodes.clear();
}
;
function createElementByType(tag, text, fromDOM) {
    if (fromDOM) {
        return document.querySelector(tag);
    }
    switch (tag) {
    case '#comment':
        return document.createComment(text);
    case '#fragment':
        return document.createDocumentFragment();
    default:
        return document.createElement(tag);
    }
}
;
function TemplateRef(templates) {
    this.hasContext = !!templates.context;
    this.createElement = function (parentNode) {
        return ViewParserHelper[templates.type](templates, parentNode);
    };
    this.getContext = function () {
        return templates.context;
    };
    this.forEach = function (selector, callback) {
        function _selectable(template) {
            if (!selector) {
                return true;
            } else if (inarray(selector[0], [
                    'id',
                    'class'
                ])) {
                return template.attr && inarray(template.attr[selector[0]], selector[1]);
            } else if (isequal(selector[0], 'attr')) {
                return template.attr && template.attr.hasOwnProperty(selector[1]);
            } else {
                return isequal(selector[1], template.name);
            }
        }
        for (var i = 0; i < templates.length; i++) {
            var template = templates[i];
            if (_selectable(template)) {
                if (isequal(template.name, '#fragment'))
                    template.children.forEach(callback);
                else
                    callback(template);
            }
        }
    };
}
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
function ViewRef(elementRef) {
    this._viewRefs = [];
    this._destroyed = false;
    this.get = function (index) {
        return this._viewRefs[index];
    };
    this.createEmbededView = function (templateRef, context, index) {
        var view = new EmbededViewContext(elementRef, templateRef, context);
        view.renderView(index);
        addToArray(this._viewRefs, view, index);
        return view;
    };
    Object.defineProperty(this, 'length', {
        get: function () {
            return this._viewRefs.length;
        }
    });
}
ViewRef.prototype.move = function (prev, curr) {
    var view = this.get(prev);
    scheduler.schedule(function () {
        if (view) {
            var parent = view.compiledElement.parent;
            var targetNode = parent.children.getByIndex(curr - 1);
            if (targetNode) {
                parent.insertAfter(view.compiledElement.nativeElement, targetNode.nativeElement);
            }
        }
    });
};
ViewRef.prototype.remove = function (index) {
    var view = removeFromArray(this._viewRefs, index);
    if (view) {
        view._destroyed_view = true;
        view.destroy();
    }
    view = null;
};
ViewRef.prototype.clearView = function () {
    while (this._viewRefs.length) {
        var view = this._viewRefs.shift();
        view.destroy();
    }
};
function EmbededViewContext(parentRef, templateRef, context) {
    var _componentRef = null;
    this.compiledElement = templateRef.createElement(parentRef);
    this.context = context;
    this.unsubscribeScheduler;
    if (templateRef.hasContext) {
        ComponentRef.create(this.compiledElement.refId, parentRef.hostRef.refId);
        _componentRef = componentDebugContext.get(this.compiledElement.refId);
        _componentRef._context = createLocalVariables(templateRef.getContext(), this);
    }
    this.renderView = function (index) {
        var _this = this;
        this.unsubscribeScheduler = scheduler.schedule(function () {
            var targetNode = (parentRef.children.last || parentRef).nativeElement;
            if (index !== undefined && parentRef.children.hasIndex(index - 1)) {
                targetNode = parentRef.children.getByIndex(index - 1).nativeElement;
            }
            transverse(_this.compiledElement);
            parentRef.insertAfter(_this.compiledElement.nativeElement, targetNode);
            parentRef.children.add(_this.compiledElement, index);
            _this.compiledElement.changeDetector.detectChanges();
        });
    };
    this.destroy = function () {
        this.unsubscribeScheduler();
        if (_componentRef && !this.compiledElement.isc) {
            _componentRef.destroy();
            _componentRef = null;
        }
        this.compiledElement.remove(true);
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
function createLocalVariables(localVariables, viewContext) {
    var context = {};
    if (localVariables) {
        for (var propName in localVariables) {
            if (localVariables[propName].match(/\s/)) {
                context[propName] = localVariables[propName];
            } else {
                writePropertyBinding(propName);
            }
        }
    }
    function writePropertyBinding(propName) {
        Object.defineProperty(context, propName, {
            get: function () {
                if (!viewContext.context)
                    return;
                return viewContext.context[localVariables[propName]];
            }
        });
    }
    return context;
}
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
    if (inarray(name, [
            'width',
            'height',
            'top',
            'bottom',
            'left',
            'right'
        ]) && typeof value === 'number') {
        value += suffix || 'px';
    }
    nativeElement.style[name] = value;
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
            if (isstring(classList[className])) {
                nativeElement.classList.toggle(className, classList[className]);
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
    if (Node.DOCUMENT_FRAGMENT_NODE === nativeElement.nodeType)
        return;
    if (isobject(prop)) {
        for (var name in prop) {
            nativeElement.setAttribute(name, prop[name]);
        }
    } else {
        nativeElement.setAttribute(prop, value);
    }
}
AttributeAppender.style = function (nativeElement, value, template) {
    if (isobject(value)) {
        ElementStyle(nativeElement, value);
    } else {
        ElementStyle.set(nativeElement, template.props, value, template.suffix);
    }
};
AttributeAppender.innerhtml = function (nativeElement, value) {
    nativeElement.innerHTML = sce.trustAsHTML(value);
};
AttributeAppender.src = function (nativeElement, value) {
    if (![
            'IMG',
            'IFRAME'
        ].includes(nativeElement.tagName)) {
        errorBuilder('src is not a valid property of ' + nativeElement.tagName);
    }
    nativeElement.setAttribute('src', value);
};
AttributeAppender.href = function (nativeElement, value) {
    if (!isequal('A', nativeElement.tagName)) {
        errorBuilder('href is not a valid property of ' + nativeElement.nativeElement.tagName);
    }
    nativeElement.setAttribute('href', value);
};
AttributeAppender.class = function (nativeElement, value) {
    ElementClassList.add(nativeElement, value);
};
AttributeAppender.setProp = function (nativeElement, propName, propValue) {
    if (propValue === undefined || !nativeElement)
        return;
    nativeElement[propName] = propValue;
};
function ElementRef(definition, parent) {
    AbstractElementRef.call(this, definition, parent);
    if (definition.isc) {
        ComponentRef.create(this.refId, parent && parent.hostRef.refId);
        this._viewQuery = new Map();
    }
    this.events = new EventHandler(this, definition.events);
    Object.defineProperties(this, {
        viewQuery: {
            get: function () {
                return this._viewQuery || this.parent._viewQuery;
            }
        }
    });
    if (definition.attrObservers) {
        setupAttributeObservers(this, definition.attrObservers);
    }
}
ElementRef.prototype = Object.create(AbstractElementRef.prototype);
ElementRef.prototype.constructor = AbstractElementRef;
ElementRef.prototype.setProp = function (propName, propValue) {
    AttributeAppender.setProp(this.nativeElement, propName, propValue);
    return this;
};
ElementRef.prototype.mutationObserver = function (callback) {
    var observer = new MutationObserver(function (mutationsList, observer) {
        if (mutationsList.length) {
            callback.apply(null, arguments);
        }
    });
    observer.observe(this.nativeElement, {
        attributes: false,
        childList: true,
        subtree: true
    });
};
ElementRef.prototype.setAttribute = function (name, value, attachInElement) {
    this.attr[name] = value;
    if (attachInElement && this.nativeElement) {
        AttributeAppender[name](this.nativeElement, value);
    }
    return this;
};
ElementRef.prototype.removeAttribute = function (name) {
    this.nativeElement && this.nativeElement.removeAttribute(name);
    delete this.attr[name];
};
ElementRef.prototype.appendChild = function (template) {
    this.nativeElement.appendChild(template);
    this.changeDetector.detectChanges();
};
ElementRef.prototype.addViewQuery = function (option, element) {
    if (!isequal(option[1], this.tagName)) {
        return this.parent && this.parent.hostRef.addViewQuery(option, element);
    }
    this._viewQuery.set(option[0], element);
};
function setupAttributeObservers(element, attrObservers) {
    var observerStarted = false;
    element.observer(SubscribeObservables(element.hostRef.refId, observe));
    function observe() {
        for (var propName in attrObservers) {
            if (attrObservers[propName].once && observerStarted) {
                break;
            }
            attributeEvaluator(propName, attrObservers[propName]);
        }
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, element.componentInstance, function (value) {
                try {
                    if (AttributeAppender[propName])
                        AttributeAppender[propName](element.nativeElement, value, template);
                    else
                        AttributeAppender.setProp(element.nativeElement, propName, value);
                } catch (e) {
                    console.error(e);
                }
            });
        }
        observerStarted = true;
    }
}
function TextNodeRef(definition, parent) {
    var _this = this;
    this.nativeNode = document.createTextNode(definition.ast.text);
    this.type = 'text';
    this.hasBinding = !!definition.ast.templates;
    this.render = function () {
        compileTemplate(definition.ast, parent.context, parent.componentInstance, function (value) {
            if (_this.nativeNode.nodeValue === value)
                return;
            _this.nativeNode.nodeValue = value;
        });
    };
    this.registerObserver = function () {
        this.render();
        if (!definition.ast.once) {
            parent.observer(SubscribeObservables(parent.hostRef.refId, this.render));
        }
        ;
    };
}
TextNodeRef.prototype.remove = function () {
    this.nativeNode.remove();
    this.nativeNode = null;
};
function EventHandler(elementRef, events) {
    this._events = (events || []).slice();
    this.add = function (_event) {
        this._events.push(_event);
    };
    this.registeredEvents = new Map();
    this.element = elementRef;
}
EventHandler.prototype.getEvent = function (eventName) {
    return EventHandler.getEventsByType(this._events, eventName)[0];
};
EventHandler.prototype.registerListener = function () {
    if (!this._events.length) {
        return;
    }
    var _this = this;
    function jEventHandler(ev) {
        if (inarray(ev.type, [
                'touchstart',
                'touchend',
                'touchmove'
            ])) {
            ev.preventDefault();
        }
        try {
            EventHandler.getEventsByType(_this._events, ev.type).forEach(function (event) {
                triggerEvents(event, ev);
            });
        } catch (e) {
            errorBuilder(e);
        } finally {
            _this.element && _this.element.changeDetector.detectChanges();
        }
    }
    function triggerEvents(registeredEvent, mouseEvent) {
        if (registeredEvent.handler) {
            registeredEvent.handler(mouseEvent);
        } else {
            EventHandler._executeEventsTriggers(registeredEvent.value, _this.element.hostRef.componentInstance, _this.element.context, mouseEvent);
        }
    }
    function registerEvent(eventName) {
        if (!_this.registeredEvents.has(eventName)) {
            _this.element.nativeElement.addEventListener(eventName, jEventHandler, false);
            _this.registeredEvents.set(eventName, function () {
                _this.element.nativeElement.removeEventListener(eventName, jEventHandler);
            });
        }
    }
    for (var i = 0; i < this._events.length; i++) {
        var event = this._events[i];
        if (!event.custom) {
            event.name.split(' ').forEach(registerEvent);
        }
    }
};
EventHandler.prototype.attachEventHandler = function (eventName, eventValue, componentInstance) {
    this.add({
        name: eventName,
        handler: function ($event) {
            return EventHandler._executeEventsTriggers(eventValue, componentInstance, null, $event);
        }
    });
};
EventHandler.prototype.attachEventEmitter = function (eventName, componentInstance) {
    var _this = this;
    var registeredEvent = this.getEvent(eventName);
    if (registeredEvent && registeredEvent.value) {
        var unSubscribe = componentInstance[eventName].subscribe(function (value) {
            EventHandler._executeEventsTriggers(registeredEvent.value, _this.element.parent.componentInstance, _this.element.context, value);
            _this.element.parent.changeDetector.detectChanges();
        });
        this.registeredEvents.set(eventName, unSubscribe);
    }
};
EventHandler.prototype.attachEventDispatcher = function (eventName, componentInstance) {
    var registeredEvent = this.getEvent(eventName);
    var context = null;
    if (registeredEvent && registeredEvent.value.length) {
        context = this.element.context;
        if (this.element.isc) {
            context = this.element.parent.context;
        }
    }
};
EventHandler.prototype.destroy = function () {
    this.registeredEvents.forEach(function (removeListenerFn) {
        removeListenerFn();
    });
    this.registeredEvents.clear();
    this._events = [];
    this.element = null;
};
EventHandler.getEventsByType = function (events, type) {
    return events.filter(function (event) {
        return event.name.split(/\s/g).includes(type);
    });
};
EventHandler._executeEventsTriggers = function (eventTriggers, componentInstance, context, ev) {
    eventTriggers.forEach(_dispatch);
    function _dispatch(event) {
        if (event.left) {
            parseObjectExpression(event, context, componentInstance, ev);
        } else if (event.fn) {
            var fn = EventHandler.getFnFromContext(event, componentInstance);
            var narg = generateArguments(event.args, context || componentInstance, null, ev);
            var ret = fn.apply(fn.context, narg);
            fn.context = null;
            fn = null;
            return ret;
        }
    }
};
EventHandler.getFnFromContext = function (eventInstance, componentInstance) {
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
};
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
            var filterArgs = [];
            if (templateModel.args[idx])
                filterArgs = generateArguments(templateModel.args[idx], context, value);
            filterArgs.unshift(accum);
            return filterParser(filterClass, filterArgs);
        }, value);
    }
    return value;
}
function compileTemplate(definition, context, componentInstance, cb) {
    var value = undefined;
    if (definition.templates) {
        value = definition.templates.reduce(function (accum, options) {
            return accum.replace(options[0], evaluateExpression(options[1], context, componentInstance));
        }, definition.text);
    } else {
        value = getFilteredTemplateValue(definition, context, componentInstance);
    }
    cb(value);
}
function evaluateExpression(expr, context, componentInstance) {
    if (isobject(expr) && expr.hasOwnProperty('prop')) {
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
        return parseObjectExpression.apply(null, arguments);
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
                dcontext = expression.fn in dcontext ? context : componentInstance;
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
    if (isarray(key)) {
        context = resolveContext(key.slice(0, key.length - 1), context, componentInstance);
        key = key[key.length - 1];
    } else {
        context = key in context ? context : componentInstance;
    }
    if (context) {
        context[key] = value;
    }
    return value;
}
function resolveContext(key, context, componentInstance) {
    var isEventType = context instanceof Event;
    return key.reduce(function (accum, property) {
        if (isEventType) {
            return accum[property];
        }
        if (Array.isArray(property)) {
            var value = resolveValueFromContext(property, context, componentInstance);
            return accum[value];
        }
        return resolveValueFromContext(property, accum, componentInstance);
    }, context || {});
}
function Subscription(replayOnSubscription) {
    var subscriptions = [];
    var state = {
        pending: false,
        value: null,
        resolveWith: ''
    };
    this.add = function (success, error, completed) {
        if (isobject(success)) {
            subscriptions.push(success);
        } else {
            subscriptions.push({
                onSuccess: success,
                onError: error,
                onCompleted: completed
            });
        }
        if (replayOnSubscription) {
        }
        return this;
    };
    this.notify = function (type, args) {
        if (state.resolveWith === 'completed') {
            return;
        }
        subscriptions.forEach(function (subscription) {
            if (subscription[type] && isfunction(subscription[type])) {
                subscription[type](args);
            }
        });
        state.pending = subscriptions.length < 1;
        state.resolveWith = type;
        state.value = args;
    };
    this.destroy = function () {
        subscriptions.length = 0;
        state = null;
    };
}
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
        subscription.notify('onSuccess', value);
    });
};
AbstractObserver.prototype.error = function (errorObject) {
    this._forEach(function (subscription) {
        subscription.notify('onError', errorObject);
    });
};
AbstractObserver.prototype.completed = function () {
    this._forEach(function (subscription) {
        subscription.notify('onCompleted');
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
    this.subscribe = function (success, error, completed) {
        var subscription = new Subscription(false);
        subscription.add(success, error, completed);
        this._observer.add(subscription);
        return subscription;
    };
    Subject.prototype.destroy = function () {
        this._observer.destroy();
    };
}
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
    this._list = [];
    Object.defineProperties(this, {
        length: {
            get: function () {
                return this._list.length;
            }
        },
        first: {
            get: function () {
                return this._list[0];
            }
        },
        last: {
            get: function () {
                return this._list[this.length - 1];
            }
        }
    });
}
QueryList.prototype.add = function (element, index, emitEvent) {
    addToArray(this._list, element, index);
    if (emitEvent) {
        this.onChanges.next({
            value: element,
            type: 'add'
        });
    }
};
QueryList.prototype.get = function (element) {
    if (element) {
        return this._list.find(function (ele) {
            return ele === element;
        });
    }
    return this._list;
};
QueryList.prototype.filter = function (callback) {
    this._list.filter(callback);
};
QueryList.prototype.forEach = function (callback) {
    this._list.forEach(callback);
};
QueryList.prototype.reduce = function (callback, accumulator) {
    return this._list.reduce(callback, accumulator);
};
QueryList.prototype.some = function (callback) {
    return this._list.some(callback);
};
QueryList.prototype.map = function (callback) {
    return this._list.map(callback);
};
QueryList.prototype.getByIndex = function (index) {
    return this._list[index];
};
QueryList.prototype.find = function (callback) {
    return this._list.find(callback);
};
QueryList.prototype.toString = function () {
    return JSON.stringify(this._list);
};
QueryList.prototype.destroy = function () {
    while (this._list.length) {
        var element = this._list.pop();
        if (element)
            element.remove();
    }
    this.onChanges.destroy();
};
QueryList.prototype.remove = function (element) {
    var index = this._list.findIndex(function (ele) {
        return ele === element;
    });
    return this.removeByIndex(index);
};
QueryList.prototype.hasIndex = function (index) {
    return this._list.length - 1 > index;
};
QueryList.prototype.removeByIndex = function (index) {
    var element = removeFromArray(this._list, index);
    this.onChanges.next({
        value: element,
        type: 'detached'
    });
    return element;
};
QueryList.prototype.onChanges = new Subject();
function EventEmitter() {
    this._listeners = [];
}
EventEmitter.prototype.subscribe = function (fn) {
    var index = this._listeners.length;
    var _this = this;
    if (isfunction(fn)) {
        this._listeners.push(fn);
    }
    return function () {
        _this._listeners.slice(index, 1);
    };
};
EventEmitter.prototype.emit = function (args) {
    this._listeners.forEach(function (fn) {
        fn(args);
    });
};
EventEmitter.prototype.destroy = function () {
    this._listeners.length = 0;
};
function CustomEventHandler(type, defaultFn, eventExtension) {
    if (!type) {
        type = 'register';
    }
    ;
    if (typeof eventExtension !== 'function') {
        eventExtension = function (obj) {
            return obj;
        };
    }
    var registered = +new Date();
    var _eventsQueue = {};
    var _eventsObj = function () {
        return eventExtension({
            type: '',
            registered: registered,
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
    var _defaultFn = defaultFn || function () {
    };
    function CustomEvent() {
        this[type] = function (name, fn) {
            if (!_eventsQueue[name]) {
                _eventsQueue[name] = [];
            }
            _eventsQueue[name].push(fn);
            return _eventsQueue[name].length - 1;
        };
    }
    CustomEvent.prototype.dispatch = function (name) {
        var _events = _eventsObj();
        _events.type = name;
        _events.timestamp = +new Date();
        var arg = [_events].concat(Array.prototype.slice.call(arguments, 1, arguments.length));
        if (_eventsQueue[name]) {
            _eventsQueue[name].forEach(function (fn) {
                fn.apply(fn, arg);
            });
        }
        if (!_events.defaultPrevented) {
            _defaultFn.apply(_defaultFn, arg);
        }
    };
    CustomEvent.prototype.unlink = function (eventName, index) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            _eventsQueue[eventName].splice(1, index);
        }
    };
    CustomEvent.prototype.destroy = function (name) {
        if (name && _eventsQueue[name]) {
            delete _eventsQueue[name];
        }
    };
    CustomEvent.prototype.one = function (eventName, idx) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            return _eventsQueue[eventName][idx];
        }
    };
    return new CustomEvent();
}
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
function rxNotify(subscription, model, ignoreCheck) {
    if (subscription.watchKey) {
        if (model) {
            var value;
            if (isfunction(suscription.watchKey)) {
                value = suscription.watchKey(model);
            } else {
                value = resolveValueFromContext(suscription.watchKey, model);
            }
            if (suscription.core && isfunction(suscription.core)) {
                if (suscription.core(value)) {
                    _trigger(suscription.handler, value);
                }
            } else if (ignoreCheck || _comparison(value, suscription)) {
                _trigger(suscription.handler, value);
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
    if (isobject(value)) {
        value = hashcode(JSON.stringify(value));
    }
    var noChanges = !isequal(value, suscription.lastValue);
    suscription.lastValue = value;
    return noChanges;
}
function ComponentFactoryResolver(componentFactory, viewComponent, callback) {
    if (!componentFactory || !componentFactory.annotations.exposeView) {
        errorBuilder('No exported factory found for <' + componentFactory.annotations.selector + '> in ' + componentFactory.annotations.module);
    }
    if (!viewComponent) {
        throw new Error('Unable to determine viewRef');
    }
    var viewDefinition = {
        name: componentFactory.annotations.selector,
        type: 'element',
        isc: true,
        providers: [componentFactory]
    };
    var component = new ElementRef(viewDefinition, viewComponent);
    var localInjectors = new ComponentInjectors(component);
    ElementCompiler(componentFactory, component, localInjectors, function (componentInstance) {
        viewComponent.insertAfter(component.nativeElement, viewComponent.nativeElement);
        callback(component, componentInstance);
    });
    localInjectors = null;
    viewDefinition = null;
}
function IterableProfiler(trackBy) {
    this._destroyed = false;
    this.cacheHash = [];
    this.out = null;
    this.trackBy = trackBy || function (item, index) {
        return item;
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
    if ((!source || !source.length) && (!this.cacheHash || !this.cacheHash.length)) {
        return false;
    }
    if (!source.length && this.cacheHash.length) {
        this.out.deleted = Object.keys(this.cacheHash).map(Number);
        this.cacheHash.length = 0;
        return true;
    }
    var len = source.length;
    var newCacheHash = [];
    var operationOrder = new Array(len);
    var isDirty = false;
    for (var inc = 0; inc < len; inc++) {
        var item = source[inc];
        var hash = this.trackBy(item, inc);
        if (this.cacheHash.includes(hash)) {
            if (!Object.is(this.cacheHash[inc], hash)) {
                isDirty = true;
                var prevIndex = this.cacheHash.indexOf(hash);
                var operationOrderAtIndex = operationOrder[inc];
                if (operationOrderAtIndex && operationOrderAtIndex.state !== 'create') {
                    operationOrder[inc] = {
                        prevIndex: prevIndex,
                        state: 'move'
                    };
                }
            }
        } else {
            isDirty = true;
            operationOrder[inc] = {
                index: inc,
                state: 'create'
            };
        }
        newCacheHash.push(hash);
    }
    if (this.cacheHash.length > newCacheHash.length) {
        for (var i = 0; i < this.cacheHash.length; i++) {
            if (!newCacheHash.includes(this.cacheHash[i])) {
                isDirty = true;
                this.out.deleted.push(i - this.out.deleted.length);
            }
        }
    }
    this.cacheHash = newCacheHash;
    this.out.order = operationOrder;
    newCacheHash = null;
    operationOrder = null;
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
var nativeTimeout = window.setTimeout;
var nativeClearTimeout = window.clearTimeout;
var nativeInterval = window.setInterval;
var nativeClearInterval = window.clearInterval;
window.setTimeout = function (fn, timer, trigerDetector) {
    return nativeTimeout(trigger(fn, trigerDetector), timer);
};
window.clearTimeout = function (timeoutID) {
    nativeClearTimeout(timeoutID);
};
window.clearInterval = function (intervalID) {
    nativeClearInterval(intervalID);
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
exports.errorBuilder = errorBuilder;
exports.ProviderToken = ProviderToken;
exports.Inject = Inject;
exports.AutoWire = AutoWire;
exports.wireResolvers = wireResolvers;
exports.AbstractInjectorInstance = AbstractInjectorInstance;
exports.closureRef = closureRef;
exports.resolveClosureRef = resolveClosureRef;
exports.LifeCycle = LifeCycle;
exports.ϕjeliLinker = ϕjeliLinker;
exports.staticInjectionToken = staticInjectionToken;
exports.ChangeDetector = ChangeDetector;
exports.Observer = Observer;
exports.INITIALIZERS = INITIALIZERS;
exports.bootStrapApplication = bootStrapApplication;
exports._Promise = _Promise;
exports.CorePromiseHandler = CorePromiseHandler;
exports.Defer = Defer;
exports.ViewParser = ViewParser;
exports.sce = sce;
exports.TemplateRef = TemplateRef;
exports.ViewRef = ViewRef;
exports.scheduler = scheduler;
exports.ElementRef = ElementRef;
exports.AttributeAppender = AttributeAppender;
exports.ElementStyle = ElementStyle;
exports.ElementClassList = ElementClassList;
exports.Subject = Subject;
exports.Subscription = Subscription;
exports.Observable = Observable;
exports.AbstractObserver = AbstractObserver;
exports.EventEmitter = EventEmitter;
exports.CustomEventHandler = CustomEventHandler;
exports.debounce = debounce;
exports.ComponentFactoryResolver = ComponentFactoryResolver;
exports.IterableProfiler = IterableProfiler;
exports.LazyLoader = LazyLoader;
},
'dist/common/bundles/jeli-common-module.js': function(module, exports, __required){
var helpers = __required('node_modules/js-helpers/helpers.js');
var isundefined = helpers['isundefined'];
var isfunction = helpers['isfunction'];
var isarray = helpers['isarray'];
var isobject = helpers['isobject'];
var isequal = helpers['isequal'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var errorBuilder = core['errorBuilder'];
var ElementClassList = core['ElementClassList'];
var IterableProfiler = core['IterableProfiler'];
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
        this._forIn = null;
        Object.defineProperties(this, {
            forIn: {
                set: function (value) {
                    this._forIn = value;
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
        this.iterable.forEachOperation(function (item, idx) {
            switch (item.state) {
            case 'create':
                var context = new jForRow(_this._forIn[idx], idx, null);
                _this.viewRef.createEmbededView(_this.templateRef, context, idx);
                break;
            case 'move':
                _this.viewRef.move(item.prevIndex, idx);
                break;
            }
        });
        for (var i = 0; i < this.viewRef.length; i++) {
            var view = _this.viewRef.get(i);
            view.updateContext({
                index: i,
                count: _this._forIn.length
            });
        }
    };
    ForDirective.prototype.willObserve = function () {
        var changes = this.iterable.diff(this._forIn);
        if (changes)
            this._listenerFn();
    };
    ForDirective.prototype.viewDidDestroy = function () {
        this.viewRef.clearView();
        this.iterable.destroy();
        this.viewRef = null;
        this.templateRef = null;
    };
    ForDirective.annotations = {
        selector: 'for',
        DI: {
            ViewRef: { optional: true },
            TemplateRef: { optional: true }
        },
        props: {
            forIn: {},
            forTrackBy: { type: 'Function' }
        },
        module: 'CommonModule'
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
    IfDirective.annotations = {
        selector: 'if',
        DI: {
            ViewRef: { optional: true },
            TemplateRef: { optional: true }
        },
        props: {
            if: {},
            ifElse: { type: 'TemplateRef' },
            ifThen: { type: 'TemplateRef' }
        },
        module: 'CommonModule'
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
    SwitchDirective.annotations = {
        selector: 'switch',
        props: { switch: {} },
        module: 'CommonModule'
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
    SwitchCaseDirective.annotations = {
        selector: 'switchCase',
        props: { switchCase: {} },
        DI: {
            ViewRef: { optional: true },
            TemplateRef: { optional: true },
            ParentRef: {
                optional: true,
                value: 'switch'
            }
        },
        dynamicInjectors: true,
        module: 'CommonModule'
    };
    return SwitchCaseDirective;
}();
var SwitchDefaultDirective = function () {
    'use strict';
    function SwitchDefaultDirective(viewRef, templateRef, jSwitch) {
        jSwitch._addDefaultView(new SwitchViewContext(viewRef, templateRef));
    }
    SwitchDefaultDirective.annotations = {
        selector: 'switchDefault',
        DI: {
            ViewRef: { optional: true },
            TemplateRef: { optional: true },
            ParentRef: {
                optional: true,
                value: 'switch'
            }
        },
        dynamicInjectors: true,
        module: 'CommonModule'
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
    ClassDirective.annotations = {
        selector: 'jClass',
        DI: { ElementRef: { optional: true } },
        props: { class: { value: 'jClass' } },
        module: 'CommonModule'
    };
    return ClassDirective;
}();
var capitalizeFilter = function () {
    'use strict';
    function capitalizeFilter() {
        this.compile = function (value) {
            return value.charAt(0).toUpperCase() + value.substr(1, value.length);
        };
    }
    capitalizeFilter.annotations = {
        name: 'capitalize',
        module: 'CommonModule'
    };
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
    NumberFilter.annotations = {
        name: 'number',
        module: 'CommonModule'
    };
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
    CurrencyFilter.annotations = {
        name: 'currency',
        DI: { NumberFilter: { factory: NumberFilter } },
        module: 'CommonModule'
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
    jsonFilterFn.annotations = {
        name: 'json',
        module: 'CommonModule'
    };
    return jsonFilterFn;
}();
var lowerCaseFilter = function () {
    'use strict';
    function lowerCaseFilter() {
        this.compile = function (value) {
            return value.toLowerCase();
        };
    }
    lowerCaseFilter.annotations = {
        name: 'lowercase',
        module: 'CommonModule'
    };
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
    QueryFactory.annotations = { module: 'CommonModule' };
    return QueryFactory;
}();
var orderByFilterFn = function () {
    'use strict';
    function orderByFilterFn() {
        this.compile = function (value, propertyName) {
            if (value.length < 2) {
                return value;
            }
            var _queryApi = new QueryFactory(value), newList;
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
    orderByFilterFn.annotations = {
        name: 'orderBy',
        module: 'CommonModule'
    };
    return orderByFilterFn;
}();
var upperCaseFilter = function () {
    'use strict';
    function upperCaseFilter() {
        this.compile = function (value) {
            return value.toUpperCase();
        };
    }
    upperCaseFilter.annotations = {
        name: 'uppercase',
        module: 'CommonModule'
    };
    return upperCaseFilter;
}();
var whereFilterFn = function () {
    'use strict';
    function whereFilterFn() {
        this.compile = function (model, query) {
            return new QueryFactory(model).where(query);
        };
    }
    whereFilterFn.annotations = {
        name: 'whereFilter',
        module: 'CommonModule'
    };
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
    FilterPipe.annotations = {
        name: 'filter',
        module: 'CommonModule'
    };
    return FilterPipe;
}();
var CommonModule = function () {
    'use strict';
    function CommonModule() {
    }
    return CommonModule;
}();
exports.CommonModule = CommonModule;
exports.ForDirective = ForDirective;
exports.IfDirective = IfDirective;
exports.SwitchDirective = SwitchDirective;
exports.SwitchCaseDirective = SwitchCaseDirective;
exports.SwitchDefaultDirective = SwitchDefaultDirective;
exports.ClassDirective = ClassDirective;
exports.capitalizeFilter = capitalizeFilter;
exports.CurrencyFilter = CurrencyFilter;
exports.NumberFilter = NumberFilter;
exports.jsonFilterFn = jsonFilterFn;
exports.lowerCaseFilter = lowerCaseFilter;
exports.orderByFilterFn = orderByFilterFn;
exports.QueryFactory = QueryFactory;
exports.upperCaseFilter = upperCaseFilter;
exports.whereFilterFn = whereFilterFn;
exports.FilterPipe = FilterPipe;
},
'dist/common/bundles/jeli-common-datetime-module.js': function(module, exports, __required){
var core = __required('dist/core/bundles/jeli-core-module.js');
var ProviderToken = core['ProviderToken'];
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
    DatetimeService.annotations = {
        DI: {
            MONTHS_HALF: { factory: MONTHS_HALF },
            MONTHS_FULL: { factory: MONTHS_FULL },
            DAYS_HALF: { factory: DAYS_HALF },
            DAYS_FULL: { factory: DAYS_FULL }
        },
        module: 'DateTimeModule'
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
    calendarFN.annotations = {
        selector: 'jx-calendar',
        DI: { DatetimeService: { factory: DatetimeService } },
        props: { config: {} },
        module: 'DateTimeModule'
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
    dateTimeFilterFN.annotations = {
        name: 'dateTime',
        DI: { DatetimeService: { factory: DatetimeService } },
        module: 'DateTimeModule'
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
    TimeAgoFilterFn.annotations = {
        name: 'timeAgo',
        DI: { DatetimeService: { factory: DatetimeService } },
        module: 'DateTimeModule'
    };
    return TimeAgoFilterFn;
}();
var DateTimeModule = function () {
    'use strict';
    function DateTimeModule() {
    }
    return DateTimeModule;
}();
exports.DateTimeModule = DateTimeModule;
exports.calendarFN = calendarFN;
exports.DatetimeService = DatetimeService;
exports.leapYear = leapYear;
exports.getDays = getDays;
exports.DateStringConverter = DateStringConverter;
exports.setText = setText;
exports.CalendarService = CalendarService;
exports.MONTHS_HALF = MONTHS_HALF;
exports.MONTHS_FULL = MONTHS_FULL;
exports.DAYS_HALF = DAYS_HALF;
exports.DAYS_FULL = DAYS_FULL;
exports.dateTimeFilterFN = dateTimeFilterFN;
exports.TimeAgoFilterFn = TimeAgoFilterFn;
},
'dist/form/bundles/jeli-form-module.js': function(module, exports, __required){
var utils = __required('node_modules/js-helpers/utils.js');
var extend = utils['extend'];
var helpers = __required('node_modules/js-helpers/helpers.js');
var inarray = helpers['inarray'];
var isboolean = helpers['isboolean'];
var isnull = helpers['isnull'];
var isstring = helpers['isstring'];
var isnumber = helpers['isnumber'];
var isequal = helpers['isequal'];
var isarray = helpers['isarray'];
var isfunction = helpers['isfunction'];
var isundefined = helpers['isundefined'];
var isobject = helpers['isobject'];
var isempty = helpers['isempty'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var ProviderToken = core['ProviderToken'];
var AttributeAppender = core['AttributeAppender'];
var closureRef = core['closureRef'];
var EventEmitter = core['EventEmitter'];
var errorBuilder = core['errorBuilder'];
var FormControlDirective = function () {
    'use strict';
    function FormControlDirective() {
        this._formFields = [];
        this.form = null;
        Object.defineProperty(this, 'formControl', {
            set: function (formControl) {
                this.form = formControl;
                if (!formControl || !(formControl instanceof FormControlService)) {
                    errorBuilder('Expected instance of FormControlService but got ' + typeof formControl);
                }
            }
        });
    }
    FormControlDirective.prototype.addField = function (formFieldInstance) {
        var formControl = this.form.getField(formFieldInstance.name);
        setupControl(formControl, formFieldInstance);
        this.form.updateValueAndStatus({ emitEvent: false });
        this._formFields.push(formFieldInstance);
        return formControl;
    };
    FormControlDirective.prototype.removeField = function (formFieldInstance) {
        this._formFields.splice(this._formFields.indexOf(formFieldInstance), 1);
    };
    FormControlDirective.prototype.getField = function (fieldName) {
        return this.formControl.getField(fieldName);
    };
    FormControlDirective.prototype.resetForm = function (values) {
        this.form.reset(values);
    };
    FormControlDirective.prototype.viewDidDestroy = function () {
        if (this.form) {
            this.form = null;
        }
    };
    FormControlDirective.annotations = {
        selector: 'formControl',
        props: { formControl: {} },
        module: 'FormModule'
    };
    return FormControlDirective;
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
    if (!passed) {
        this.failed = true;
        this.errors[type] = true;
    }
    if (!this.count) {
        this.stop();
    }
};
CurrentInstance.prototype.registerAsyncValidator = function (asyncInstance, Request, name) {
    this.hasAsync = true;
    var _this = this;
    var callback = function (type, ret) {
        return function (response) {
            _this.rem(Request[type] ? Request[type](response) : ret, name);
        };
    };
    asyncInstance.then(callback('onsuccess', true), callback('onerror', false));
};
var formValidationStack = Object.create({
    MINLENGTH: function (value, requiredLength) {
        if (isnumber(value) || isstring(value))
            return String(value).length >= requiredLength;
        return false;
    },
    MAXLENGTH: function (value, requiredLength) {
        if (isnumber(value) || isstring(value))
            return String(value).length <= requiredLength;
        return false;
    },
    EMAILVALIDATION: function (val) {
        var regExp = /^\w+([\.-]?\w+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regExp.test(val);
    },
    ISEMPTY: function (val, def) {
        return def === isempty(val);
    },
    BOOLEAN: function (value, def) {
        return isboolean(value) && isequal(value, def);
    },
    DOMAINVALIDATION: function (domain) {
        return /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(domain);
    },
    MEDIUMPASSWORDSTRENGTH: function (passwd) {
        return new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})').test(passwd);
    },
    STRONGPASSWORDSTRENGTH: function (passwd) {
        return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})').test(passwd);
    },
    PATTERN: function (value, pattern) {
        return new RegExp(pattern).test(value);
    },
    ASYNC: function (val, def) {
        if (!isobject(def) || !isfunction(def.resolve)) {
            return false;
        }
        return def.resolve(val);
    },
    REQUIRED: function (value, required) {
        if (required) {
            return !isundefined(value) && !isnull(value) && !isempty(value);
        }
        return !required;
    },
    REQUIREDTRUE: function (value) {
        return isboolean(value) && value === true;
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
            var passed = false, validatorFn = formValidationStack[validatorName.toUpperCase()];
            if (validatorFn) {
                passed = validatorFn(value, criteria[validatorName]);
            } else if (isfunction(criteria[validatorName])) {
                passed = criteria[validatorName](value);
            }
            if (isobject(passed) && isequal('async', validatorName)) {
                currentProcess.registerAsyncValidator(passed, criteria[validatorName], validatorName);
                break;
            }
            currentProcess.rem(passed, validatorName);
            if (!passed) {
                return currentProcess.stop();
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
        _this.setError(errors);
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
    this._updateValue();
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
var FormControlService = function () {
    'use strict';
    function FormControlService(formFields, validators) {
        FormControlAbstract.call(this, validators);
        this.formFieldControls = {};
        if (!isempty(formFields)) {
            for (var field in formFields) {
                this.addField(field, formFields[field]);
            }
        }
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
    FormControlService.prototype.hasField = function (controlName) {
        return this.formFieldControls.hasOwnProperty(controlName);
    };
    FormControlService.prototype.getField = function (controlName) {
        if (isarray(controlName)) {
            return controlName.reduce(function (accum, path) {
                return accum.getField(path);
            }, this);
        }
        return this.formFieldControls[controlName] || null;
    };
    FormControlService.prototype._setupControl = function (control) {
        control.setParent(this);
        control._registerOnControlChangeListener(this._onControlChangeListener);
    };
    FormControlService.prototype.patchValue = function (values, options) {
        options = options || {};
        if (isobject(values)) {
            for (var field in values) {
                if (this.hasField(field) && !options.self) {
                    this.getField(field).patchValue(values[field], {
                        self: true,
                        updateView: true
                    });
                }
            }
        }
    };
    FormControlService.prototype.setValue = function (values, options) {
        this._allValuePresent(values);
        for (var field in values) {
            this._isControlPresent(field);
            this.formFieldControls[field].setValue(values[key], { self: options && options.self });
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
        this.forEachField(function (control, name) {
            control.reset(value[name], {
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
    FormControlService.prototype.removeField = function (name) {
        this.getField(name).destroy();
        delete this.values[name];
        this.valueChanges.next(this.values);
    };
    FormControlService.prototype._allValuePresent = function (values) {
        this.forEachField(function (control, field) {
            if (!isundefined(values[field])) {
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
        this.value = this._collectValues();
    };
    FormControlService.prototype._collectValues = function () {
        var values = {};
        this.forEachField(function (control, field) {
            if (control.enabled) {
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
    FormControlService.annotations = {
        static: true,
        module: 'FormModule'
    };
    FormControlService.annotations.instance = FormControlService;
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
    this.element.setProp('disabled', state);
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
            errorBuilder('Expected instance of FormFieldControlService but got ' + typeof this.control);
        }
        setupControl(this.control, this);
        if (this.control.disabled && this.eventBinder.setDisabledState) {
            this.eventBinder.setDisabledState(true);
        }
        this.control.updateValueAndStatus({ emitEvent: false });
    };
    FormFieldControlDirective.prototype.modelToViewUpdate = function () {
    };
    FormFieldControlDirective.annotations = {
        selector: 'fieldControl',
        DI: {
            VALUE_ACCESSOR: { factory: VALUE_ACCESSOR },
            VALIDATORS: { optional: true }
        },
        props: {
            control: { value: 'fieldControl' },
            disabled: {}
        },
        module: 'FormModule'
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
            this.value = state;
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
    FormFieldControlService.annotations = {
        static: true,
        module: 'FormModule'
    };
    FormFieldControlService.annotations.instance = FormFieldControlService;
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
        if (!(this.parent instanceof FormControlDirective)) {
            errorBuilder('Expected an instance of FormControlDirective but got ' + typeof this.parent);
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
    FormFieldDirective.annotations = {
        selector: 'formField',
        DI: {
            ParentRef: {
                optional: true,
                value: 'formControl'
            },
            VALUE_ACCESSOR: { factory: VALUE_ACCESSOR },
            VALIDATORS: { optional: true }
        },
        props: { name: { value: 'formField' } },
        dynamicInjectors: true,
        module: 'FormModule'
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
        this.element.setProp('value', value, true);
    };
    DefaultEventBinder.annotations = {
        selector: 'input:type!=checkbox|radio|number|range:[model|formField|fieldControl],textarea:[model|formField|fieldControl]',
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
        resolve: [ResolveDefaultBinder],
        DI: { ElementRef: { optional: true } },
        module: 'FormModule'
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
        this.element.setProp('checked', checked, true);
    };
    CheckboxEventBinder.annotations = {
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
        resolve: [ResolveCheckboxBinder],
        DI: { ElementRef: { optional: true } },
        module: 'FormModule'
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
    RadioEventContainer.annotations = { module: 'FormModule' };
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
        if (this.name && this.formField && this.formField !== this.name) {
            errorBuilder('if you define a name and formField both values must match. <input type=radio name=radio :form-field=radio');
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
        this.element.setProp('checked', this.state, true);
    };
    RadioEventBinder.annotations = {
        selector: 'input:type=radio:[model|formField|fieldControl]',
        props: {
            name: {},
            formField: {},
            value: {}
        },
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
        resolve: [ResolveRadioBinder],
        DI: {
            ElementRef: { optional: true },
            RadioEventContainer: { factory: RadioEventContainer }
        },
        module: 'FormModule'
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
                this.element.setProp('selectedIndex', -1);
            }
            this.element.setProp('value', _buildValueToString(optionId, value));
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
        Array.from(this.element.nativeElement.options).forEach(callback);
    };
    SelectEventBinder.annotations = {
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
        resolve: [ResolveSelectBinder],
        DI: { ElementRef: { optional: true } },
        module: 'FormModule'
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
            elementRef.setProp('value', value);
        };
        this.viewDidDestroy = function () {
            if (selectInstance) {
                selectInstance._optionValueMap.delete(this.id);
                selectInstance.writeValue(selectInstance.selectedValue);
            }
        };
    }
    OptionDirective.annotations = {
        selector: 'option',
        DI: {
            ParentRef: {
                optional: true,
                type: '[model|formField|fieldControl]',
                value: 'select'
            },
            ElementRef: { optional: true }
        },
        props: {
            value: {},
            jValue: {}
        },
        dynamicInjectors: true,
        module: 'FormModule'
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
        this.element.setProp('value', value, true);
    };
    NumberEventBinder.prototype.registerOnChange = function (onChangeFn) {
        this.onChange = function (value) {
            onChangeFn(value == '' ? null : parseFloat(value));
        };
    };
    NumberEventBinder.annotations = {
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
        resolve: [ResolveNumberBinder],
        DI: { ElementRef: { optional: true } },
        module: 'FormModule'
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
        this.element.setProp('value', parseFloat(value), true);
    };
    RangeEventBinder.prototype.registerOnChange = function (onChangeFn) {
        this.onChange = function (value) {
            onChangeFn(value == '' ? null : parseFloat(value));
        };
    };
    RangeEventBinder.annotations = {
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
        resolve: [ResolveRangeBinder],
        DI: { ElementRef: { optional: true } },
        module: 'FormModule'
    };
    return RangeEventBinder;
}();
function setupControl(fieldControl, dir) {
    if (!fieldControl)
        errorBuilder('No field control found for ' + dir.name);
    if (!dir.eventBinder)
        errorBuilder('No EventBinder defined');
    fieldControl.setValidators(dir._validators);
    dir.eventBinder.writeValue(fieldControl.value);
    setUpViewChangeEvent(fieldControl, dir);
    setupBlurEvent(fieldControl, dir);
    if (dir.eventBinder.setUpDisableState) {
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
    ModelDirective.annotations = {
        selector: 'model',
        DI: {
            VALUE_ACCESSOR: { factory: VALUE_ACCESSOR },
            parentControl: {
                optional: true,
                value: 'form'
            },
            VALIDATORS: { optional: true }
        },
        props: {
            model: {},
            modelOptions: {},
            name: {}
        },
        events: { 'modelChange': { type: 'emitter' } },
        exportAs: 'jModel',
        dynamicInjectors: true,
        module: 'FormModule'
    };
    return ModelDirective;
}();
var FormModule = function () {
    'use strict';
    function FormModule() {
    }
    return FormModule;
}();
exports.FormModule = FormModule;
exports.FormControlDirective = FormControlDirective;
exports.FormControlService = FormControlService;
exports.FormControlAbstract = FormControlAbstract;
exports.FormValidatorService = FormValidatorService;
exports.formValidationStack = formValidationStack;
exports.FormFieldControlDirective = FormFieldControlDirective;
exports.VALUE_ACCESSOR = VALUE_ACCESSOR;
exports.AbstractValueAccessor = AbstractValueAccessor;
exports.FormFieldControlService = FormFieldControlService;
exports.FormFieldDirective = FormFieldDirective;
exports.ResolveDefaultBinder = ResolveDefaultBinder;
exports.DefaultEventBinder = DefaultEventBinder;
exports.ResolveCheckboxBinder = ResolveCheckboxBinder;
exports.CheckboxEventBinder = CheckboxEventBinder;
exports.ResolveRadioBinder = ResolveRadioBinder;
exports.RadioEventContainer = RadioEventContainer;
exports.RadioEventBinder = RadioEventBinder;
exports.ResolveSelectBinder = ResolveSelectBinder;
exports.SelectEventBinder = SelectEventBinder;
exports.OptionDirective = OptionDirective;
exports.ModelDirective = ModelDirective;
exports.getValueAccessor = getValueAccessor;
exports.ResolveNumberBinder = ResolveNumberBinder;
exports.NumberEventBinder = NumberEventBinder;
exports.ResolveRangeBinder = ResolveRangeBinder;
exports.RangeEventBinder = RangeEventBinder;
},
'dist/http/bundles/jeli-http-module.js': function(module, exports, __required){
var utils = __required('node_modules/js-helpers/utils.js');
var serialize = utils['serialize'];
var extend = utils['extend'];
var helpers = __required('node_modules/js-helpers/helpers.js');
var inarray = helpers['inarray'];
var isstring = helpers['isstring'];
var isobject = helpers['isobject'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var Subject = core['Subject'];
var ChangeDetector = core['ChangeDetector'];
var Inject = core['Inject'];
var ProviderToken = core['ProviderToken'];
var HTTP_INTERCEPTORS = new ProviderToken('interceptors', true);
var HttpInterceptor = function () {
    'use strict';
    function HttpInterceptor() {
        this.resolveInterceptor = function (options, callback) {
            var interceptors = Inject(HTTP_INTERCEPTORS);
            if (!interceptors || !interceptors.length) {
                return callback(options);
            }
            var len = 0;
            function next() {
                var interceptor = interceptors[len];
                len++;
                if (interceptor) {
                    interceptor.resolve(options, callback);
                } else {
                    callback(options);
                }
            }
            next();
        };
    }
    HttpInterceptor.annotations = { module: 'HttpModule' };
    return HttpInterceptor;
}();
var defaultOptions = {
    url: '',
    type: 'GET',
    processData: true,
    headers: { 'Accept': 'text/javascript, application/json, text/html, application/xml, text/xml, */*' },
    asynchronous: true,
    data: '',
    xhr: null,
    getResponseHeader: null,
    cache: true
};
var staticMethods = [
    'put',
    'get',
    'post',
    'request',
    'head',
    'patch',
    'delete'
];
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
function xhr() {
    if (typeof XMLHttpRequest !== 'undefined' && !window.ActiveXObject) {
        return new XMLHttpRequest();
    } else {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.6.0');
        } catch (e) {
        }
        try {
            return new ActiveXObject('Msxml2.XMLHTTP.3.0');
        } catch (e) {
        }
        try {
            return new ActiveXObject('Msxml2.XMLHTTP');
        } catch (e) {
        }
    }
    return false;
}
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
    return content;
}
function HttpResponse(status, readyState, url) {
    this.status = status;
    this.readyState = readyState;
    this.url = url;
    this.data = null;
    this.success = false;
}
function CoreHttp(url, options, interceptor, changeDetection) {
    var xhrPromise = new Subject();
    if (!options && isobject(url)) {
        options = url;
    }
    options = extend(true, defaultOptions, options);
    options.url = options.url || url;
    options.type = options.type.toLowerCase();
    var xhrInstance = xhr();
    interceptor.resolveInterceptor(options, function (request) {
        if (!request) {
            throw new Error('HTTP: Interceptor should return a value');
        }
        if (changeDetection) {
            changeDetection();
        }
        if (options.processData) {
            processRequest();
        }
        sendRequest();
        return xhrPromise;
    });
    function respondToReadyState(readyState) {
        var response = new HttpResponse(xhrInstance.status, xhrInstance.readyState, options.url);
        if (xhrInstance.readyState == 4) {
            try {
                var data = parseJSON(xhrInstance.responseText, !!xhrInstance.responseText);
                response.success = xhrInstance.status >= 200 && xhrInstance.status < 300 || xhrInstance.status == 304 || xhrInstance.status == 0 && xhrInstance.responseText;
                xhrPromise.next(data, response);
            } catch (e) {
                xhrPromise.error(e);
            }
            xhrPromise.completed();
            changeDetection();
        }
    }
    function getResponseHeaders(name) {
        if (!isobject(name)) {
            return xhrInstance.getResponseHeader(name);
        } else {
            for (var i in name) {
                name[i] = xhrInstance.getResponseHeader(name[i]);
            }
            return name;
        }
    }
    function setHeaders() {
        for (var name in options.headers) {
            if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
                throw new Error('Refused to set unsafe header "' + name + '"');
            }
            xhrInstance.setRequestHeader(name, options.headers[name]);
        }
    }
    function processRequest() {
        if (options.xhrFields && options.xhrFields.withCredentials) {
            xhrInstance.withCredentials = true;
        }
        if (!options.headers['Content-Type'] && options.data) {
            options.headers['Content-Type'] = 'application/json';
        }
        if (!isstring(options.data)) {
            switch (options.type) {
            case 'get':
                options.data = serialize(options.data);
                break;
            default:
                options.data = JSON.stringify(options.data);
                break;
            }
        }
        if (options.type === 'get') {
            if (options.data) {
                options.url += (/\?/.test(options.url) ? '&' : '?') + options.data;
            }
            if (!options.cache) {
                options.url += (/\?/.test(options.url) ? '&' : '?') + '_=' + new Date().getTime();
            }
        }
    }
    function sendRequest() {
        xhrInstance.onreadystatechange = respondToReadyState;
        xhrInstance.open(options.type, options.url, options.asynchronous);
        if (options.beforeSend && isfunction(options.beforeSend)) {
            options.beforeSend.apply(options.beforeSend, [xhrInstance]);
        }
        setHeaders();
        var body = null;
        if (inarray(options.type, [
                'post',
                'put',
                'delete'
            ])) {
            body = options.data;
        }
        try {
            xhrInstance.send(body);
        } catch (e) {
            triggerError(e);
        }
    }
    return xhrPromise;
}
var HttpService = function () {
    'use strict';
    function HttpService(interceptor, changeDetector) {
        function http(url, options) {
            return CoreHttp(url, options, interceptor, changeDetector);
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
    HttpService.annotations = {
        DI: {
            HttpInterceptor: { factory: HttpInterceptor },
            ChangeDetector: { factory: ChangeDetector }
        },
        module: 'HttpModule'
    };
    return HttpService;
}();
var HttpModule = function () {
    'use strict';
    function HttpModule() {
    }
    return HttpModule;
}();
exports.HttpModule = HttpModule;
exports.HTTP_INTERCEPTORS = HTTP_INTERCEPTORS;
exports.HttpInterceptor = HttpInterceptor;
exports.HttpService = HttpService;
exports.unsafeHeaders = unsafeHeaders;
exports.HttpResponse = HttpResponse;
},
'dist/router/bundles/jeli-router-module.js': function(module, exports, __required){
var utils = __required('node_modules/js-helpers/utils.js');
var unserialize = utils['unserialize'];
var extend = utils['extend'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var INITIALIZERS = core['INITIALIZERS'];
var errorBuilder = core['errorBuilder'];
var Inject = core['Inject'];
var _Promise = core['_Promise'];
var ProviderToken = core['ProviderToken'];
var ComponentFactoryResolver = core['ComponentFactoryResolver'];
var CustomEventHandler = core['CustomEventHandler'];
var helpers = __required('node_modules/js-helpers/helpers.js');
var isequal = helpers['isequal'];
var WebStateProvider = function () {
    'use strict';
    function WebStateProvider() {
        this.routeTrial = 0;
        this.isLoaded = false;
        this.intentFallback = null;
        this.fallback = null;
        this.html5Mode = false;
    }
    WebStateProvider.prototype.getRouteObj = function (name) {
        return $stateCollection[name];
    };
    WebStateProvider.prototype.getParentRoute = function (name) {
        var parent = $stateCollection[name], fnd;
        do {
            if (parent) {
                fnd = parent;
            }
        } while (parent = parent.route.parent);
        return fnd;
    };
    WebStateProvider.prototype.getIntent = function (intentName) {
        return $intentCollection[intentName];
    };
    WebStateProvider.prototype.getRoute = function (route, params) {
        if (this.routeTrial > 2) {
            this.routeTrial = 0;
            return false;
        }
        var webRoutes = getRequiredRoute(route).checkParams(params);
        if (webRoutes) {
            return webRoutes;
        }
        if (this.fallback) {
            location.hash = '#' + this.fallback;
        }
    };
    WebStateProvider.annotations = { module: 'RouterModule' };
    return WebStateProvider;
}();
var ViewHandler = function () {
    'use strict';
    function ViewHandler(webStateProvider, componentResolver) {
        this.viewsHolder = new Map();
        this.currentView = '@';
        this.stateInProgress;
        this.stateQueue = [];
        this.$stateTransitioned = false;
        this.currentState = '';
        this.previousState = '';
        this._pendingViewStack = new Map();
        this._resolvedParents = {};
        this.webStateProvider = webStateProvider;
        this.componentResolver = componentResolver;
    }
    ViewHandler.prototype.setViewReference = function (elementRef, ref) {
        this.viewsHolder.set(ref, {
            element: elementRef,
            cleanUp: function () {
                if (this.compiledWith) {
                    this.compiledWith.remove();
                } else {
                    this.element.children.forEach(function (child) {
                        child.remove();
                    });
                }
            }
        });
        return this;
    };
    ViewHandler.prototype.getView = function (view, name) {
        var _viewHolder = this.viewsHolder.get(view);
        return name ? _viewHolder[name] : _viewHolder;
    };
    ViewHandler.prototype.compileViewTemplate = function (viewComponent, viewObjectInstance) {
        viewObjectInstance.cleanUp();
        if (viewComponent) {
            this.componentResolver(viewComponent, viewObjectInstance.element, function (component, componentInstance) {
                viewObjectInstance.compiledWith = component;
            });
        }
    };
    ViewHandler.prototype.removeViews = function (_views) {
        var _this = this;
        this.viewsHolder.forEach(function (view, key) {
            if (!_views.includes(key)) {
                view.cleanUp();
                _this.viewsHolder.delete(key);
            }
        });
    };
    ViewHandler.prototype.getCurrentView = function (_route, currentRoute) {
        var _views = [], mView = Object.keys(_route.views).concat();
        this._resolvedParents[_route.name] = true;
        if (_route.route.parent && !this._resolvedParents[_route.route.parent.name]) {
            this._resolvedParents[this.webStateProvider.getParentRoute(_route.route.parent.name).name] = true;
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
    ViewHandler.prototype.resolveViews = function (route, currentRoute) {
        var _views = this.getCurrentView(route, currentRoute);
        for (var idx = 0; idx < _views.length; idx++) {
            var view = _views[idx] || '@';
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
        this.viewsHolder.delete(ref);
    };
    ViewHandler.annotations = {
        name: 'ViewHandler',
        DI: {
            WebStateProvider: { factory: WebStateProvider },
            ComponentFactoryResolver: { factory: ComponentFactoryResolver }
        },
        module: 'RouterModule'
    };
    return ViewHandler;
}();
var ROUTE_INTERCEPTOR = new ProviderToken('RouteInterceptor', true);
var _unregistered = {};
var $stateCollection = {};
var $intentCollection = {};
function createRoute(url) {
    var replacer = '/([\\w-]+)', paramsMapping = [];
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
function generateRoute(routeConfig, requireParent) {
    function addViewMatcher(view) {
        if (routeConfig.component) {
            if (!routeConfig.views[view]) {
                routeConfig.views[view] = {};
            }
            routeConfig.views[view] = routeConfig.component;
            delete routeConfig.component;
        }
    }
    if (routeConfig.isIntent) {
        $intentCollection[routeConfig.name] = routeConfig;
        return;
    }
    routeConfig.route = createRoute(routeConfig.url || '^');
    var _views = Object.keys(routeConfig.views || {});
    if (requireParent) {
        var parentRoute = $stateCollection[routeConfig.parent];
        routeConfig.views = routeConfig.views || {};
        for (var view in parentRoute.views) {
            if (view !== routeConfig.targetView) {
                routeConfig.views[view] = parentRoute.views[view];
            } else if (!routeConfig.views[view]) {
                addViewMatcher(view);
            }
        }
        if (routeConfig.targetView && !routeConfig.views[routeConfig.targetView]) {
            addViewMatcher(routeConfig.targetView);
        }
        routeConfig.route.parent = parentRoute;
        if (!_views.length && !routeConfig.abstract) {
            _views = parentRoute.route.$$views;
        }
        parentRoute = null;
        delete routeConfig.parent;
    }
    if (!routeConfig.url) {
        routeConfig.abstract = true;
    }
    routeConfig.route.$$views = _views;
    $stateCollection[routeConfig.name] = routeConfig;
    if (_unregistered.hasOwnProperty(routeConfig.name)) {
        _unregistered[routeConfig.name].forEach(function (uName) {
            setupRoutes(uName, $stateCollection[uName]);
        });
        delete _unregistered[routeConfig.name];
    }
}
function setupRoutes(routeConfig) {
    var requireParent = routeConfig.hasOwnProperty('parent');
    if (requireParent && !$stateCollection.hasOwnProperty(routeConfig.parent)) {
        if (!_unregistered.hasOwnProperty(routeConfig.parent)) {
            _unregistered[routeConfig.parent] = [];
        }
        _unregistered[routeConfig.parent].push(routeConfig.name);
        $stateCollection[routeConfig.name] = routeConfig;
        return this;
    }
    generateRoute(routeConfig, requireParent);
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
                    generateRoute(childConfig, true);
                    addChildren(childConfig);
                } else {
                    errorBuilder('unregistered child route in parent<' + config.name + '>, name is required:' + JSON.stringify(childConfig));
                }
            });
        }
    }
    addChildren(routeConfig);
}
function getRequiredRoute(routeName) {
    var queryParam = routeName.split('?'), foundRoute = function () {
            for (var prop in $stateCollection) {
                if (!$stateCollection[prop].abstract && $stateCollection[prop].route.regexp.test(queryParam[0])) {
                    return $stateCollection[prop];
                }
            }
        }();
    return {
        get: function () {
            return foundRoute;
        },
        checkParams: function (params) {
            if (foundRoute) {
                foundRoute.route.params = extend({}, foundRoute.params || {}, params || {});
                if (foundRoute.route.paramsMapping.length && !params) {
                    foundRoute.route.regexp.exec(queryParam[0]).splice(1).forEach(function (val, inc) {
                        var isNumber = parseInt(val);
                        foundRoute.route.params[foundRoute.route.paramsMapping[inc]] = !isNaN(isNumber) ? isNumber : val;
                    });
                }
                if (queryParam[1]) {
                    foundRoute.route.params = extend(foundRoute.route.params, unserialize(queryParam[1]));
                }
            }
            return foundRoute;
        }
    };
}
function ResolveRouteInterceptor(route, callback) {
    var interceptors = Inject(ROUTE_INTERCEPTOR);
    var locals = {};
    if (!interceptors || !interceptors.length) {
        return callback(locals);
    }
    var len = 0;
    function next() {
        var interceptor = interceptors[len];
        len++;
        if (interceptor) {
            interceptor.resolve(route, locals, next);
        } else {
            callback(locals);
        }
    }
    next();
}
;
var WebStateService = function () {
    'use strict';
    function WebStateService(webStateProvider, viewHandler, customEventHandler) {
        var _this = this;
        this.locationStates = null;
        this.lastState = null;
        this.isReplaceState = false;
        this.state = { route: { params: {} } };
        this.webStateProvider = webStateProvider;
        this.viewHandler = viewHandler;
        function _routeEventListener(e, route, path) {
            if (isequal('$webRouteStart', e.type)) {
                _this.$$baseUrl = path;
                ResolveRouteInterceptor({
                    name: route.name,
                    path: path,
                    url: route.url
                }, function () {
                    var lastTransitionQueue = viewHandler.stateQueue.pop();
                    if (lastTransitionQueue) {
                        _this.$$baseUrl = lastTransitionQueue.path;
                        route = getRequiredRoute(lastTransitionQueue.path).checkParams(lastTransitionQueue.params);
                        viewHandler.stateQueue.length = 0;
                    }
                    if (!isequal(_this.$$baseUrl, _this.state.url)) {
                        _this.events.dispatch('$webRouteSuccess', route, _this.state.route);
                        _this.state = route;
                        viewHandler.resolveViews(route, _this.state);
                    } else {
                        _this.events.dispatch('$webRouteError', route);
                    }
                    viewHandler.stateInProgress = false;
                    location.hash = _this.$$baseUrl;
                });
            }
        }
        this.events = new customEventHandler('listener', _routeEventListener);
        this.events.listener('replaceState', function (ev) {
            _this.isReplaceState = true;
        });
        this.events.listener('view.render', function (ev, viewName) {
            if (viewHandler._pendingViewStack.has(viewName)) {
                viewHandler.compileViewTemplate(viewHandler._pendingViewStack.get(viewName), viewHandler.viewsHolder.get(viewName));
                viewHandler._pendingViewStack.delete(viewName);
            }
        });
    }
    ;
    WebStateService.prototype._gotoState = function (ev, path, params) {
        if (!path) {
            return false;
        }
        this.viewHandler.previousState = this.viewHandler.currentState;
        this.viewHandler.currentState = path;
        if (this.viewHandler.stateInProgress) {
            if (isequal(this.viewHandler.currentState, this.viewHandler.previousState)) {
                return;
            }
            this.viewHandler.stateQueue.push({
                path: path,
                param: params
            });
            this.viewHandler.$stateTransitioned = true;
        } else {
            var route = this.webStateProvider.getRoute(path, params);
            if (route) {
                this.viewHandler.stateInProgress = true;
                this.events.dispatch('$webRouteStart', route, path);
            }
        }
    };
    WebStateService.prototype.go = function (path, params) {
        path = this.$href(path, params);
        if (this._stateChanged(path)) {
            this._gotoState(null, path, params);
        }
        return this;
    };
    WebStateService.prototype.$href = function (stateName, params) {
        var state = this.webStateProvider.getRouteObj(stateName);
        if (state) {
            if (state.route.paramsMapping.length && !params) {
                throw new Error(stateName + ' requires parameter, but none was provided');
            }
            var href = state.url.replace(/\:(\w)+/g, function (index, key) {
                var param = index.split(':')[1];
                return param in params ? params[param] : index;
            });
            return href;
        }
        return this.webStateProvider.fallback;
    };
    WebStateService.prototype.replaceWebState = function (hash) {
        if (!this.locationStates && !hash)
            return;
        this.locationStates = {
            state: 'replaceState',
            hash: '#' + (hash || this.locationStates.previousHash).replace(/^#/, ''),
            previousHash: this.lastState,
            currentLocation: location.hash
        };
        this.lastState = this.locationStates.hash;
    };
    WebStateService.prototype.currentState = function (state) {
        if (state) {
            this.locationStates = state;
            return;
        }
        return this.locationStates;
    };
    WebStateService.prototype.search = function (query) {
        return window.location.search = query;
    };
    WebStateService.prototype.getParam = function (name) {
        return this.state.route.params[name];
    };
    WebStateService.prototype.getUrlParams = function () {
        return Object(this.state.route.params);
    };
    WebStateService.prototype._stateChanged = function (path) {
        return !isequal(this.$$baseUrl, path);
    };
    WebStateService.prototype.getRootUrl = function () {
        var rootUrl = document.location.protocol + '//' + (document.location.hostname || document.location.host);
        if (document.location.port || false) {
            rootUrl += ':' + document.location.port;
        }
        rootUrl += '/';
        return rootUrl;
    };
    WebStateService.annotations = {
        DI: {
            WebStateProvider: { factory: WebStateProvider },
            ViewHandler: { factory: ViewHandler },
            CustomEventHandler: { factory: CustomEventHandler }
        },
        module: 'RouterModule'
    };
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
    GoFn.annotations = {
        selector: 'go',
        DI: { WebStateService: { factory: WebStateService } },
        props: {
            pathName: { value: 'go' },
            params: {}
        },
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
        module: 'RouterModule'
    };
    return GoFn;
}();
var jViewFn = function () {
    'use strict';
    function jViewFn(viewHandler, webStateService, elementRef) {
        this.didInit = function () {
            this._ref = '@' + this.ref;
            viewHandler.setViewReference(elementRef, this._ref);
            webStateService.events.dispatch('view.render', this._ref);
        };
        this.viewDidDestroy = function () {
            viewHandler.destroy(this._ref);
        };
    }
    jViewFn.annotations = {
        selector: 'j-view',
        DI: {
            ViewHandler: { factory: ViewHandler },
            WebStateService: { factory: WebStateService },
            ElementRef: { optional: true }
        },
        props: { ref: {} },
        module: 'RouterModule'
    };
    return jViewFn;
}();
var ViewIntentService = function () {
    'use strict';
    function ViewIntentService(webStateProvider, componentResolver) {
        this._currentOpenIntent = new Map();
        this.intentContainer = null;
        this.$currentIntent = '';
        this.openIntent = function (intentName, params) {
            if (this.$currentIntent === intentName) {
                return;
            }
            var intentConfig = webStateProvider.getIntent(intentName);
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
                    componentResolver(intentConfig.view.component, this.intentContainer, function (elementRef, componentInstance) {
                        elementRef.insertAfter(elementRef.nativeElement, _this.intentContainer.nativeElement);
                        var config = _this._currentOpenIntent.get(intentName);
                        config.element = elementRef;
                        elementRef.class.add('view-intent');
                        _this.transitIntent(intentName, intentConfig.transition || 50);
                    });
                } else {
                    this.transitIntent(intentName, 50);
                }
            }
            ;
        };
    }
    ViewIntentService.prototype.closeIntent = function () {
        var allIntents = [];
        var current = this.$currentIntent;
        this._currentOpenIntent.forEach(function (intent, key) {
            intent.element && intent.element.removeAttribute('style');
            if (current === key) {
                intent.element && intent.element.remove();
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
            intentView.element && intentView.element.remove();
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
            intentView.element && intentView.element.removeAttribute('style');
        });
    };
    ViewIntentService.prototype.getCurrentIntent = function () {
        return (this.getIntentView(this.$currentIntent) || {}).route;
    };
    ViewIntentService.annotations = {
        name: 'viewIntent',
        DI: {
            WebStateProvider: { factory: WebStateProvider },
            ComponentFactoryResolver: { factory: ComponentFactoryResolver }
        },
        module: 'RouterModule'
    };
    return ViewIntentService;
}();
var OpenIntent = function () {
    'use strict';
    function OpenIntent(elementRef, viewIntent) {
        this.params = {};
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
            }
        });
    }
    OpenIntent.annotations = {
        selector: 'open',
        DI: {
            ElementRef: { optional: true },
            ViewIntentService: { factory: ViewIntentService }
        },
        props: {
            open: {},
            params: {}
        },
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
        module: 'RouterModule'
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
    JIntentContainer.annotations = {
        selector: 'j-intent-container',
        DI: {
            ViewIntentService: { factory: ViewIntentService },
            ElementRef: { optional: true }
        },
        module: 'RouterModule'
    };
    return JIntentContainer;
}();
function ViewInit(jeliWebProvider, webStateService) {
    var originalState = location.hash;
    var stateChanged = false;
    jeliWebProvider.isLoaded = true;
    if ('onhashchange' in window) {
        window.addEventListener('$locationReplaceState', locationReplaceState);
        window.addEventListener('hashchange', webRouteChangedFn);
    }
    function locationReplaceState(e) {
        var state = webStateService.currentState();
        webStateService.isReplaceState = true;
        if (state.hash !== state.previousHash || stateChanged) {
            location.replace(state.hash);
            originalState = state.currentLocation;
        }
    }
    function webRouteChangedFn(e) {
        var locHash = refineHash();
        if (!location.hash.length || !webStateService._stateChanged(locHash) || webStateService.isReplaceState) {
            webStateService.isReplaceState = false;
            return;
        }
        webStateService._gotoState(null, locHash);
    }
    function refineHash() {
        return (location.hash || '').replace('#', '');
    }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            if (!originalState) {
                location.hash = refineHash() || jeliWebProvider.fallback;
            } else {
                webStateService._gotoState(null, refineHash());
            }
            resolve(true);
        }, 0);
    });
}
var RouterModule = function () {
    'use strict';
    function RouterModule() {
    }
    RouterModule.setRoutes = function (routes) {
        if (Array.isArray(routes)) {
            routes.forEach(setupRoutes);
        } else {
            setupRoutes(routes);
        }
    };
    INITIALIZERS.register({
        DI: {
            WebStateProvider: { factory: WebStateProvider },
            WebStateService: { factory: WebStateService }
        },
        factory: ViewInit
    }, true);
    return RouterModule;
}();
exports.RouterModule = RouterModule;
exports.GoFn = GoFn;
exports.WebStateService = WebStateService;
exports.WebStateProvider = WebStateProvider;
exports.ViewHandler = ViewHandler;
exports.ROUTE_INTERCEPTOR = ROUTE_INTERCEPTOR;
exports.ResolveRouteInterceptor = ResolveRouteInterceptor;
exports.jViewFn = jViewFn;
exports.OpenIntent = OpenIntent;
exports.ViewIntentService = ViewIntentService;
exports.JIntentContainer = JIntentContainer;
exports.ViewInit = ViewInit;
},
'viewers/Todo/src/app/components/calculator/calculator.js': function(module, exports, __required){
var core = __required('dist/core/bundles/jeli-core-module.js');
var ViewParser = core['ViewParser'];
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

CalculatorComponent.annotations = {
    selector: 'app-calculator',
    exposeView: true,
    module: 'AppModule'
};

CalculatorComponent.view = /** jeli template **/ new ViewParser([{"type":"element","name":"div","index":0,"isc":false,"attr":{"class":"calculator"},"children":[{"type":"element","name":"input","index":0,"isc":false,"attr":{"type":"text","class":"calculator-screen","disabled":""},"attrObservers":{"value":{"prop":"currentNumber","once":false}}},{"type":"element","name":"div","index":1,"isc":false,"attr":{"class":"calculator-keys"},"children":[{"type":"element","name":"button","index":0,"isc":false,"attr":{"type":"button","class":"operator","value":"+"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"+"}],"fn":"getOperation"}]}],"children":[{"type":"text","ast":{"text":"+"}}]},{"type":"element","name":"button","index":1,"isc":false,"attr":{"type":"button","class":"operator","value":"-"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"-"}],"fn":"getOperation"}]}],"children":[{"type":"text","ast":{"text":"-"}}]},{"type":"element","name":"button","index":2,"isc":false,"attr":{"type":"button","class":"operator","value":"*"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"*"}],"fn":"getOperation"}]}],"children":[{"type":"text","ast":{"text":"×"}}]},{"type":"element","name":"button","index":3,"isc":false,"attr":{"type":"button","class":"operator","value":"/"},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"/"}],"fn":"getOperation"}]}],"children":[{"type":"text","ast":{"text":"÷"}}]},{"type":"element","name":"button","index":4,"isc":false,"attr":{"type":"button","value":7},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"7"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"7"}}]},{"type":"element","name":"button","index":5,"isc":false,"attr":{"type":"button","value":8},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"8"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"8"}}]},{"type":"element","name":"button","index":6,"isc":false,"attr":{"type":"button","value":9},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"9"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"9"}}]},{"type":"element","name":"button","index":7,"isc":false,"attr":{"type":"button","value":4},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"4"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"4"}}]},{"type":"element","name":"button","index":8,"isc":false,"attr":{"type":"button","value":5},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"5"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"5"}}]},{"type":"element","name":"button","index":9,"isc":false,"attr":{"type":"button","value":6},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"6"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"6"}}]},{"type":"element","name":"button","index":10,"isc":false,"attr":{"type":"button","value":1},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"1"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"1"}}]},{"type":"element","name":"button","index":11,"isc":false,"attr":{"type":"button","value":2},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"2"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"2"}}]},{"type":"element","name":"button","index":12,"isc":false,"attr":{"type":"button","value":3},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"3"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"3"}}]},{"type":"element","name":"button","index":13,"isc":false,"attr":{"type":"button","value":0},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"0"}],"fn":"getNumber"}]}],"children":[{"type":"text","ast":{"text":"0"}}]},{"type":"element","name":"button","index":14,"isc":false,"attr":{"type":"button","class":"decimal","value":"."},"events":[{"name":"click","value":[{"type":"call","args":[],"fn":"getDecimal"}]}],"children":[{"type":"text","ast":{"text":"."}}]},{"type":"element","name":"button","index":15,"isc":false,"attr":{"type":"button","class":"all-clear","value":"all-clear"},"events":[{"name":"click","value":[{"type":"call","args":[],"fn":"clear"}]}],"children":[{"type":"text","ast":{"text":"AC"}}]},{"type":"element","name":"button","index":16,"isc":false,"attr":{"type":"button","class":"equal-sign","value":"="},"events":[{"name":"click","value":[{"type":"call","args":[{"type":"raw","value":"="}],"fn":"getOperation"}]}],"children":[{"type":"text","ast":{"text":"="}}]}]}]}], {}) /** template loader **/;
return CalculatorComponent;
}();

exports.CalculatorComponent = CalculatorComponent;
},
'viewers/Todo/src/app/components/route-form-page/route-form-page.element.js': function(module, exports, __required){
var common = __required('dist/common/bundles/jeli-common-module.js');
var jsonFilterFn = common['jsonFilterFn'];
var ItemList = __required('viewers/Todo/src/app/components/item-list/item-list.js', 'ItemList');
var core = __required('dist/core/bundles/jeli-core-module.js');
var ViewParser = core['ViewParser'];
var form = __required('dist/form/bundles/jeli-form-module.js');
var SelectEventBinder = form['SelectEventBinder'];
var NumberEventBinder = form['NumberEventBinder'];
var RangeEventBinder = form['RangeEventBinder'];
var DefaultEventBinder = form['DefaultEventBinder'];
var CheckboxEventBinder = form['CheckboxEventBinder'];
var FormFieldDirective = form['FormFieldDirective'];
var RadioEventBinder = form['RadioEventBinder'];
var FormControlDirective = form['FormControlDirective'];
var FormControlService = form['FormControlService'];
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

RouterPageElement.annotations = {
    selector: 'router-form-page',
    DI: {
        FormControlService: {
            factory: FormControlService
        }
    },
    exposeView: true,
    module: 'AppModule'
};

RouterPageElement.view = /** jeli template **/ new ViewParser([{"type":"element","name":"div","index":0,"isc":false,"props":{"formControl":{"prop":"testForm"}},"providers":[FormControlDirective],"children":[{"type":"element","name":"div","index":0,"isc":false,"children":[{"type":"element","name":"input","index":0,"isc":false,"attr":{"type":"radio"},"props":{"formField":"radio","value":1},"providers":[RadioEventBinder,FormFieldDirective]},{"type":"text","ast":{"text":" Yes"}},{"type":"element","name":"br","index":2,"isc":false},{"type":"element","name":"input","index":3,"isc":false,"attr":{"type":"radio"},"props":{"formField":"radio","value":0},"providers":[RadioEventBinder,FormFieldDirective]},{"type":"text","ast":{"text":" No"}},{"type":"element","name":"br","index":5,"isc":false},{"type":"element","name":"input","index":6,"isc":false,"attr":{"type":"checkbox"},"props":{"formField":"checkbox"},"providers":[CheckboxEventBinder,FormFieldDirective]},{"type":"element","name":"br","index":7,"isc":false}]},{"type":"element","name":"textarea","index":1,"isc":false,"props":{"formField":"textarea"},"providers":[DefaultEventBinder,FormFieldDirective]},{"type":"element","name":"br","index":2,"isc":false},{"type":"element","name":"input","index":3,"isc":false,"attr":{"type":"text","minlength":5,"maxlength":10,"required":true},"props":{"formField":"input"},"providers":[DefaultEventBinder,FormFieldDirective]},{"type":"element","name":"br","index":4,"isc":false},{"type":"element","name":"input","index":5,"isc":false,"attr":{"type":"file"},"props":{"formField":"file"},"providers":[DefaultEventBinder,FormFieldDirective]},{"type":"element","name":"br","index":6,"isc":false},{"type":"element","name":"input","index":7,"isc":false,"attr":{"type":"range","id":"a"},"props":{"formField":"range"},"providers":[RangeEventBinder,FormFieldDirective]},{"type":"element","name":"br","index":8,"isc":false},{"type":"element","name":"input","index":9,"isc":false,"attr":{"type":"number","id":"b"},"props":{"formField":"number"},"providers":[NumberEventBinder,FormFieldDirective]},{"type":"element","name":"br","index":10,"isc":false},{"type":"element","name":"select","index":11,"isc":false,"props":{"formField":"select"},"providers":[SelectEventBinder,FormFieldDirective],"attr":{"multiple":""},"children":[{"type":"element","name":"option","index":0,"isc":false,"attr":{"value":"select_1"},"children":[{"type":"text","ast":{"text":"Select 1"}}]},{"type":"element","name":"option","index":1,"isc":false,"attr":{"value":"select_2"},"children":[{"type":"text","ast":{"text":"Select 2"}}]},{"type":"element","name":"option","index":2,"isc":false,"attr":{"value":"select_3"},"children":[{"type":"text","ast":{"text":"Select 3"}}]}]},{"type":"element","name":"div","index":12,"isc":false,"props":{"formControl":{"prop":{"type":"call","args":[{"type":"raw","value":"personalInfo"}],"fn":"getField","namespaces":["testForm"]}}},"providers":[FormControlDirective],"children":[{"type":"element","name":"div","index":0,"isc":false,"children":[{"type":"element","name":"input","index":0,"isc":false,"attr":{"type":"text","class":"form-control"},"props":{"formField":"firstName"},"providers":[DefaultEventBinder,FormFieldDirective]}]},{"type":"element","name":"input","index":1,"isc":false,"attr":{"type":"text","class":"form-control"},"props":{"formField":"lastName"},"providers":[DefaultEventBinder,FormFieldDirective]},{"type":"element","name":"input","index":2,"isc":false,"attr":{"type":"number","class":"form-control"},"props":{"formField":"age"},"providers":[NumberEventBinder,FormFieldDirective]}]},{"type":"element","name":"div","index":13,"isc":false,"children":[{"type":"element","name":"button","index":0,"isc":false,"attrObservers":{"disabled":{"prop":{"type":"bin","left":{"type":"una","ops":"!","args":["testForm","valid"]},"ops":"&&","right":{"type":"raw","value":true}},"once":false}},"attr":{"class":"btn btn-primary"},"children":[{"type":"text","ast":{"text":"Submit"}}]}]},{"type":"element","name":"item-list","index":14,"isc":true,"attr":{"value":[1,2,3]},"props":{"formValue":{"prop":["testForm","value"]}},"providers":[ItemList],"children":[],"templates":{"place":[{"type":"element","name":"pre","index":0,"isc":false,"children":[{"type":"text","ast":{"text":"${0}","once":false,"templates":[["${0}",{"prop":"value","args":[],"fns":[jsonFilterFn]}]]}}]}]}},{"type":"element","name":"pre","index":15,"isc":false,"children":[{"type":"text","ast":{"text":"${0}","once":false,"templates":[["${0}",{"prop":["testForm","value"],"args":[[3]],"fns":[jsonFilterFn]}]]}}]}]}], {}) /** template loader **/;
return RouterPageElement;
}();

exports.RouterPageElement = RouterPageElement;
},
'viewers/Todo/src/app/app.routes.js': function(module, exports, __required){
var RouterPageElement = __required('viewers/Todo/src/app/components/route-form-page/route-form-page.element.js', 'RouterPageElement');
var CalculatorComponent = __required('viewers/Todo/src/app/components/calculator/calculator.js', 'CalculatorComponent');
var core = __required('dist/core/bundles/jeli-core-module.js');
var INITIALIZERS = core['INITIALIZERS'];
var router = __required('dist/router/bundles/jeli-router-module.js');
var WebStateService = router['WebStateService'];
var WebStateProvider = router['WebStateProvider'];
var ROUTE_INTERCEPTOR = router['ROUTE_INTERCEPTOR'];
var RouterModule = router['RouterModule'];
function configureWebState(webStateProvider) {
    webStateProvider.fallback = '/';
}
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

validatorService.annotations = {};
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
            views: { '@content': RouterPageElement }
        }
    ]);
}

INITIALIZERS.register({factory : configureWebState, DI : {WebStateProvider : {factory: WebStateProvider}}}, true);

INITIALIZERS.register({factory : InitializeApp, DI : {WebStateService : {factory: WebStateService}}}, true);

ROUTE_INTERCEPTOR.register({useClass : validatorService}, true);

!function(){/** bootstrap module**/[
    RouterModule
].forEach(function(_module){ _module()});
}();
return AppRouteModule;
}();

exports.configureWebState = configureWebState;
exports.InitializeApp = InitializeApp;
exports.validatorService = validatorService;
exports.AppRouteModule = AppRouteModule;
},
'viewers/Todo/src/app/components/test-place.js': function(module, exports, __required){
var common = __required('dist/common/bundles/jeli-common-module.js');
var ForDirective = common['ForDirective'];
var jsonFilterFn = common['jsonFilterFn'];
var ClassDirective = common['ClassDirective'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var ViewParser = core['ViewParser'];
/** compiled TestPlaceElement **/
var TestPlaceElement = function(){
"use strict";

function TestPlaceElement() {
    this.test = false;
    this.html = '';
}

TestPlaceElement.annotations = {
    selector: 'test-place',
    props: {
        options: {}
    },
    module: 'AppModule'
};

TestPlaceElement.view = /** jeli template **/ new ViewParser([{"type":"element","name":"div","index":0,"isc":false,"children":[{"type":"place","name":"#fragment","index":0,"isc":false,"selector":["attr","modal-body"]}]},{"type":"comment","name":"#comment","text":"for","templates":{"for":{"type":"element","name":"div","index":1,"isc":false,"context":{"opt":"$context"},"props":{"jClass":{"prop":["opt","class"]}},"providers":[ClassDirective],"children":[{"type":"element","name":"p","index":0,"isc":false,"children":[{"type":"text","ast":{"text":"${0}","once":false,"templates":[["${0}",{"prop":"opt","args":[],"fns":[jsonFilterFn]}]]}}]}]}},"props":{"forIn":{"prop":"options"}},"providers":[ForDirective]}], {}) /** template loader **/;
return TestPlaceElement;
}();

exports.TestPlaceElement = TestPlaceElement;
},
'viewers/Todo/src/app/components/item-list/item-list.js': function(module, exports, __required){
var common = __required('dist/common/bundles/jeli-common-module.js');
var SwitchCaseDirective = common['SwitchCaseDirective'];
var SwitchDefaultDirective = common['SwitchDefaultDirective'];
var SwitchDirective = common['SwitchDirective'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var ViewParser = core['ViewParser'];
/** compiled ItemList **/
var ItemList = function(){
"use strict";

function ItemList() {
}

ItemList.annotations = {
    selector: 'item-list',
    props: {
        value: {},
        formValue: {}
    },
    module: 'AppModule'
};

ItemList.view = /** jeli template **/ new ViewParser([{"type":"place","name":"#fragment","index":0,"isc":false},{"type":"element","name":"#fragment","index":1,"isc":false,"props":{"switch":{"prop":["formValue","personalInfo","firstName"]}},"providers":[SwitchDirective],"children":[{"type":"comment","name":"#comment","text":"switchDefault","templates":{"switchDefault":{"type":"element","name":"h5","index":0,"isc":false,"children":[{"type":"text","ast":{"text":"Invalid form"}}]}},"providers":[SwitchDefaultDirective]},{"type":"comment","name":"#comment","text":"switchCase","templates":{"switchCase":{"type":"element","name":"h5","index":1,"isc":false,"children":[{"type":"text","ast":{"text":"Valid form"}}]}},"props":{"switchCase":{"prop":{"type":"raw","value":"test"}}},"providers":[SwitchCaseDirective]}]}], {}) /** template loader **/;
return ItemList;
}();

exports.ItemList = ItemList;
},
'viewers/Todo/src/app/app.component.js': function(module, exports, __required){
var datetime = __required('dist/common/bundles/jeli-common-datetime-module.js');
var dateTimeFilterFN = datetime['dateTimeFilterFN'];
var TestPlaceElement = __required('viewers/Todo/src/app/components/test-place.js', 'TestPlaceElement');
var common = __required('dist/common/bundles/jeli-common-module.js');
var jsonFilterFn = common['jsonFilterFn'];
var FilterPipe = common['FilterPipe'];
var SwitchDefaultDirective = common['SwitchDefaultDirective'];
var SwitchCaseDirective = common['SwitchCaseDirective'];
var SwitchDirective = common['SwitchDirective'];
var ForDirective = common['ForDirective'];
var ClassDirective = common['ClassDirective'];
var IfDirective = common['IfDirective'];
var form = __required('dist/form/bundles/jeli-form-module.js');
var OptionDirective = form['OptionDirective'];
var SelectEventBinder = form['SelectEventBinder'];
var ModelDirective = form['ModelDirective'];
var CheckboxEventBinder = form['CheckboxEventBinder'];
var core = __required('dist/core/bundles/jeli-core-module.js');
var ViewParser = core['ViewParser'];
var http = __required('dist/http/bundles/jeli-http-module.js');
var HttpService = http['HttpService'];
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

AppRootElement.annotations = {
    selector: 'app-root',
    viewChild: {
        testPlace: {
            value: 'testPlace'
        },
        model: {
            type: 'jModel',
            value: 'input'
        }
    },
    DI: {
        HttpService: {
            factory: HttpService
        }
    },
    module: 'AppModule'
};

AppRootElement.view = /** jeli template **/ new ViewParser([{"type":"element","name":"nav","index":0,"isc":false,"attr":{"class":"navbar navbar-inverse navbar-static-top"},"children":[{"type":"element","name":"div","index":0,"isc":false,"attr":{"class":"container-fluid"},"children":[{"type":"element","name":"div","index":0,"isc":false,"attr":{"class":"navbar-header"},"children":[{"type":"element","name":"a","index":0,"isc":false,"attr":{"class":"navbar-brand","href":"#"},"children":[{"type":"text","ast":{"text":" Todo Application "}}]}]}]}]},{"type":"element","name":"input","index":3,"isc":false,"attr":{"type":"checkbox"},"props":{"model":{"prop":"test"}},"providers":[CheckboxEventBinder,ModelDirective],"events":[{"name":"modelChange","value":[{"type":"asg","left":"test","right":"$event"}],"custom":true}],"attrObservers":{"checked":{"prop":true,"once":true}},"vc":["model","app-root"]},{"type":"comment","name":"#comment","text":"if","templates":{"if":{"type":"element","name":"div","index":4,"isc":false,"children":[{"type":"text","ast":{"text":"I am Test Condition"}}]},"ifElse":{"refId":"fallback","type":"element","name":"#fragment","index":6,"isc":false,"children":[{"type":"comment","name":"#comment","text":"for","templates":{"for":{"type":"element","name":"div","index":0,"isc":false,"context":{"i":"$context"},"children":[{"type":"text","ast":{"text":"Testing_${0}","once":false,"templates":[["${0}",{"prop":"i"}]]}}]}},"props":{"forIn":{"prop":{"type":"raw","value":[0,1,2,3]}}},"providers":[ForDirective]}]}},"props":{"if":{"prop":"test"},"ifElse":"fallback"},"providers":[IfDirective]},{"type":"element","name":"div","index":5,"isc":false,"props":{"jClass":{"prop":{"type":"ite","test":"test","cons":{"type":"raw","value":"visible"},"alt":{"type":"raw","value":"hidden"}}}},"providers":[ClassDirective],"children":[{"type":"text","ast":{"text":"Class test"}}]},{"type":"element","name":"div","index":7,"isc":false,"props":{"switch":{"prop":{"type":"una","ops":"!","args":"test"}}},"providers":[SwitchDirective],"children":[{"type":"comment","name":"#comment","text":"switchCase","templates":{"switchCase":{"type":"element","name":"h5","index":0,"isc":false,"children":[{"type":"text","ast":{"text":"I am ${0} case","once":false,"templates":[["${0}",{"prop":"test"}]]}}]}},"props":{"switchCase":{"prop":true}},"providers":[SwitchCaseDirective]},{"type":"comment","name":"#comment","text":"switchDefault","templates":{"switchDefault":{"type":"element","name":"test-place","index":1,"isc":true,"providers":[TestPlaceElement],"children":[],"templates":{"place":[{"type":"text","ast":{"text":"I am default switch element"}}]}}},"providers":[SwitchDefaultDirective]}]},{"type":"comment","name":"#comment","text":"for","templates":{"for":{"type":"element","name":"div","index":8,"isc":false,"context":{"item":"$context"},"attr":{"class":"annother"},"children":[{"type":"text","ast":{"text":"${0}","once":true,"templates":[["${0}",{"prop":"item","args":[],"fns":[jsonFilterFn]}]]}}]}},"props":{"forIn":{"prop":{"type":"raw","value":[{"test":2}]},"args":[[{"type":"obj","expr":{"test":2}}]],"fns":[FilterPipe]},"forTrackBy":"trackByFn"},"providers":[ForDirective]},{"type":"text","ast":{"text":"Selected: ${0}","once":false,"templates":[["${0}",{"prop":"valueBinding"}]]}},{"type":"element","name":"select","index":10,"isc":false,"props":{"model":{"prop":"valueBinding"}},"providers":[SelectEventBinder,ModelDirective],"events":[{"name":"modelChange","value":[{"type":"asg","left":"valueBinding","right":"$event"}],"custom":true}],"children":[{"type":"comment","name":"#comment","text":"for","templates":{"for":{"type":"element","name":"option","index":0,"isc":false,"props":{"option":"","value":{"prop":"opt","once":false}},"providers":[OptionDirective],"context":{"opt":"$context"},"children":[{"type":"text","ast":{"text":"${0}","once":true,"templates":[["${0}",{"prop":"opt"}]]}}]}},"props":{"forIn":{"prop":{"type":"raw","value":[1,2,3,4,5,6]}}},"providers":[ForDirective]}]},{"type":"element","name":"br","index":12,"isc":false},{"type":"text","ast":{"text":" Selected: ${0}","once":false,"templates":[["${0}",{"prop":"valueBinding2","args":[],"fns":[jsonFilterFn]}]]}},{"type":"element","name":"select","index":14,"isc":false,"props":{"model":{"prop":"valueBinding2"}},"providers":[SelectEventBinder,ModelDirective],"events":[{"name":"modelChange","value":[{"type":"asg","left":"valueBinding2","right":"$event"}],"custom":true}],"attr":{"multiple":""},"children":[{"type":"element","name":"option","index":0,"isc":false,"attr":{"value":"select_1"},"children":[{"type":"text","ast":{"text":"Select 1"}}]},{"type":"element","name":"option","index":1,"isc":false,"attr":{"value":"select_2"},"children":[{"type":"text","ast":{"text":"Select 2"}}]},{"type":"element","name":"option","index":2,"isc":false,"attr":{"value":"select_3"},"children":[{"type":"text","ast":{"text":"Select 3"}}]}]},{"type":"element","name":"p","index":16,"isc":false,"children":[{"type":"text","ast":{"text":"© ${0} FrontendOnly. All Rights Reserved ","once":false,"templates":[["${0}",{"prop":{"type":"raw","value":""},"args":[[{"type":"raw","value":"YYYY"}]],"fns":[dateTimeFilterFN]}]]}}]}], {}) /** template loader **/;
return AppRootElement;
}();

exports.AppRootElement = AppRootElement;
},
'viewers/Todo/src/app/app.module.js': function(module, exports, __required){
var RouterPageElement = __required('viewers/Todo/src/app/components/route-form-page/route-form-page.element.js', 'RouterPageElement');
var CalculatorComponent = __required('viewers/Todo/src/app/components/calculator/calculator.js', 'CalculatorComponent');
var AppRootElement = __required('viewers/Todo/src/app/app.component.js', 'AppRootElement');
var ItemList = __required('viewers/Todo/src/app/components/item-list/item-list.js', 'ItemList');
var TestPlaceElement = __required('viewers/Todo/src/app/components/test-place.js', 'TestPlaceElement');
var AppRouteModule = __required('viewers/Todo/src/app/app.routes.js', 'AppRouteModule');
var http = __required('dist/http/bundles/jeli-http-module.js');
var HttpModule = http['HttpModule'];
var form = __required('dist/form/bundles/jeli-form-module.js');
var FormModule = form['FormModule'];
var datetime = __required('dist/common/bundles/jeli-common-datetime-module.js');
var DateTimeModule = datetime['DateTimeModule'];
var common = __required('dist/common/bundles/jeli-common-module.js');
var CommonModule = common['CommonModule'];
/** compiled AppModule **/
var AppModule = function(){
"use strict";

function AppModule() {
}

AppModule.rootElement = AppRootElement;

!function(){/** bootstrap module**/[
    CommonModule,
    DateTimeModule,
    FormModule,
    HttpModule,
    AppRouteModule
].forEach(function(_module){ _module()});
}();
return AppModule;
}();

exports.AppModule = AppModule;
}
}, {}));