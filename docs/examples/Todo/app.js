(function(){
 "use strict";
(function(){
 "use strict";
var trim = ''.trim ? function (s) {
    return s.trim();
} : function (s) {
    return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};
function stringToObject(str, replacerObj) {
    var newObj;
    try {
        newObj = maskedEval(str, replacerObj || {});
    } catch (e) {
        var splitedStr = str.match(new RegExp('\\' + str.charAt(0) + '(.*?)' + '\\' + str.charAt(str.length - 1))), newObj = '{' === str.charAt(0) ? {} : [];
        splitedStr = (splitedStr && splitedStr[1] || '').split(',');
        for (var j in splitedStr) {
            var xSplitedStr = splitedStr[j].split(':'), name = xSplitedStr.shift(), value = maskedEval(xSplitedStr.join(':'), replacerObj || {}) || xSplitedStr[1];
            newObj[name] = value;
        }
    }
    return newObj;
}
function $isObject(obj) {
    return typeof obj === 'object' && obj instanceof Object && Object.prototype.toString.call(obj) === '[object Object]';
}
;
function $isString(str) {
    return typeof str === 'string' && new String(str) instanceof String;
}
function $isJsonString(str) {
    return str && $isString(str) && '{['.indexOf(str.charAt(0)) > -1 && '}]'.indexOf(str.charAt(str.length - 1)) > -1;
}
function noop() {
    return null;
}
function $isEmptyObject(obj) {
    return $isObject(obj) && !$countObject(obj);
}
function $isNumber(n) {
    return Number(n) === n && n % 1 === 0;
}
function $isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
function $isDouble(n) {
    return parseFloat(n) > 0;
}
function $isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
function $isEmptyObject(obj) {
    return obj && !$countObject(obj).length;
}
function $isFunction(fn) {
    return typeof fn === 'function';
}
function $countObject(obj) {
    return Object.keys(obj);
}
function $isBoolean(bool) {
    return Object.prototype.toString.call(bool) === '[object Boolean]';
}
function $isUndefined(val) {
    return typeof val === 'undefined';
}
function $isDefined(val) {
    return typeof val !== 'undefined';
}
function $isNull(val) {
    return null === val;
}
function $isEmpty(val) {
    return val === '';
}
function $isEqual(a, b) {
    return a === b;
}
function $inArray(a, b) {
    return ($isString(b) || $isArray(b)) && b.indexOf(a) > -1;
}
function noDubs(arr) {
    return arr.reduce(function (all, item, index) {
        if (arr.indexOf(arr[index]) === index) {
            all.push(item);
        }
        return all;
    }, []);
}
function jSonParser(str) {
    if ($isJsonString(str)) {
        try {
            str = JSON.parse(str.replace(/[\']/g, '"'));
        } catch (e) {
        }
    }
    return str;
}
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
function extend() {
    var extended = {}, deep = $isBoolean(arguments[0]), i = 0, length = arguments.length;
    if (deep) {
        i++;
        deep = arguments[0];
    }
    if ($isArray(arguments[i])) {
        extended = Array(arguments[i].length);
    }
    var merger = function (source) {
        for (var name in source) {
            if (source.hasOwnProperty(name)) {
                if (deep && $isObject(source[name]) && !$isEmptyObject(source[name])) {
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
function errorBuilder(error) {
    function userException() {
        this.name = 'jEliException';
        this.message = error;
    }
    userException.prototype.toString = function () {
        return this.name + ': "' + this.message + '"';
    };
    if ($isString(error)) {
        throw new userException(error);
    } else {
        console.error(error);
    }
}
function camelCase() {
    return this.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2, offset) {
        if (p2) {
            return p2.toUpperCase();
        }
        return p1.toLowerCase();
    });
}
function findInList(fn) {
    var found = false, checker;
    for (var i in this) {
        checker = fn(i, this[i]);
        if (checker) {
            found = checker;
        }
    }
    return found;
}
function $removeWhiteSpace(str) {
    str = str || '';
    if (/["']/g.test(str)) {
        return str;
    }
    return str.replace(/\s+/g, '');
}
var $isBooleanValue = 'true | false | 1 | 0';
function removeSingleQuote(str) {
    if ($isBooleanValue.indexOf(str) > -1 || $isUndefined(str))
        return str;
    return String(str).replace(/[']/g, '');
}
function $remArrayWhiteSpace(arr, fn) {
    var nArr = [];
    if (arr && arr.length) {
        arr.forEach(function (item, idx) {
            if (item) {
                nArr.push(fn ? fn(item) : $removeWhiteSpace(item));
            }
        });
    }
    return nArr;
}
function $remLastWhiteSpace(str) {
    return trim(str);
}
function removeSingleOperand(str, matcher, replacer, flags) {
    return str.replace(new RegExp(matcher, flags), function (s, n, t) {
        if (t.charAt(n + 1) === s && t.charAt(n - 1) !== s || t.charAt(n + 1) !== s && t.charAt(n - 1) === s) {
            return s;
        } else {
            return replacer;
        }
    });
}
function removeQuotesFromString(str) {
    if (str.charAt(0).match(/['"]/) && str.charAt(str.length - 1).match(/['"]/)) {
        return str.substr(1, str.length - 2);
    }
    return str;
}
function $hashCode(code) {
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
function maskedEval(expression, context) {
    if (/([|<>=()\-!*+&\/\/:])/gi.test(expression)) {
        return new Function('with(this) { try{ return ' + expression + ' }catch(e){ return undefined; } }').call(context || {});
    } else {
        return simpleContextMapper(expression, context);
    }
}
function simpleBooleanParser($boolValue) {
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
function simpleArgumentParser(arg) {
    var booleanMatcher = simpleBooleanParser(arg), isNum = Number(arg);
    if (arg && !isNaN(isNum)) {
        return isNum;
    } else if (!$isUndefined(booleanMatcher)) {
        return booleanMatcher;
    }
    return arg;
}
function generateArrayKeyType(key, model) {
    if (-1 < key.indexOf('[')) {
        model = model || {};
        return key.split('[').map(function (current) {
            if (current.indexOf(']') > -1) {
                var _key = current.split(']')[0];
                return model.hasOwnProperty(_key) ? model[_key] : _key;
            }
            return current;
        }).join('.');
    }
    return key;
}
var isArrayKey = new RegExp(/.*\[(\d+)\]/);
function deepArrayChecker(create, key, model, value) {
    key = generateArrayKeyType(key, model).split('.');
    var end = key.pop(), nModel = matchStringWithArray(key, model, create);
    if (arguments.length > 3) {
        nModel[end] = value;
        return;
    }
    return nModel[end];
}
;
function generateFnFromString(fn) {
    if (fn.match(/^(?:.*?)\((.*?)\)/)) {
        var arg = fn.substring(fn.indexOf('(') + 1, fn.lastIndexOf(')')), namespaces = fn.substring(0, fn.indexOf('(')).split('.');
        function getArgs() {
            return arg ? arg.split(',').map(function (key) {
                if (/'/.test(key)) {
                    return removeSingleQuote(key);
                }
                return generateArrayKeyType(key).split('.');
            }) : [];
        }
        return {
            arg: getArgs(),
            namespaces: namespaces,
            fn: namespaces.pop()
        };
    }
    return null;
}
function generateArguments(args, context, event) {
    return args.map(function (arg) {
        if (arg[0] === '$event') {
            return event;
        } else {
            if ($isString(arg)) {
                return arg;
            }
            arg = arg.join('.');
            var param = resolveValueFromContext(arg, context);
            return !$isUndefined(param) ? param : simpleArgumentParser(arg);
        }
    });
}
function resolveValueFromContext(expression, context) {
    if ($isUndefined(expression) || $isNull(expression) || $isBoolean(expression)) {
        return expression;
    } else if ($isObject(expression)) {
        return parseObjectExpression(expression, context);
    } else if ($isArray(expression)) {
        return expression;
    }
    var value = simpleArgumentParser(expression);
    if ($isEqual(value, expression)) {
        value = maskedEval(expression, context);
    }
    return value;
}
function parseObjectExpression(expression, context) {
    var _localParser_ = {
        ite: function (obj) {
            return maskedEval(obj.test, context) ? obj.cons : obj.alt;
        }
    };
    return Object.keys(expression).reduce(function (accum, key) {
        var obj = expression[key];
        if ($isObject(obj) && obj.test) {
            accum[key] = _localParser_[obj.type](obj);
        } else {
            var value = maskedEval(obj, context);
            accum[key] = $isUndefined(value) ? obj : value;
        }
        return accum;
    }, {});
}
function simpleContextMapper(key, context) {
    key = generateArrayKeyType(key, context).split('.');
    var last = key.pop(), dContext = context;
    if (key.length) {
        dContext = resolveContext(key, context);
    }
    if (dContext) {
        var fnString = generateFnFromString(last);
        if (fnString) {
            var args = generateArguments(fnString.arg, context);
            var fn = context[fnString.fn] || function () {
            };
            return fn.apply(context, args);
        }
        return dContext[last];
    }
    return dContext;
}
function resolveContext(key, context) {
    return key.reduce(function (prev, curr) {
        return prev ? prev[curr] : null;
    }, context || {});
}
function matchStringWithArray(key, model, create) {
    var modelDepth = model, i = 0;
    while (i <= key.length - 1) {
        modelDepth = createNewInstance(modelDepth, key[i], create, !isNaN(Number(key[i + 1])));
        i++;
    }
    return modelDepth;
}
function createNewInstance(model, key, create, nextIsArrayKey) {
    var objectType = nextIsArrayKey ? [] : {};
    if (create && !model[key]) {
        model[key] = objectType;
    }
    return model && model[key] || objectType;
}
function ModelSetterGetter(key, context, create) {
    if (!$isString(key)) {
        return key;
    }
    return deepArrayChecker(create, $removeWhiteSpace(key), context);
}
function matchScopeObject(ckey, fn) {
    var fnd = false;
    for (var i in ckey) {
        if (!$isUndefined(fn)) {
            if (fn.indexOf(ckey[i]) > -1) {
                fnd = ckey[i];
            }
        }
    }
    return fnd;
}
function splitStringCondition(str) {
    return $removeWhiteSpace(str).split(/[&&||]/gi);
}
function copy(item, deep) {
    var type = {};
    if ($isArray(item)) {
        type = [];
    }
    if (item && item.nodeType) {
        return item.cloneNode(true);
    }
    if ($isFunction(item)) {
        return item;
    }
    if (item instanceof Date) {
        return new Date(item.getTime());
    }
    if (item instanceof RegExp) {
        return new RegExp(item);
    }
    if (typeof item !== 'object') {
        return item;
    }
    if (deep) {
        var ret;
        try {
            ret = JSON.parse(JSON.stringify(item));
        } catch (e) {
            ret = extend(type, item);
        }
        return ret;
    }
    return extend(type, item);
}
function Defer(triggerAfterResolve) {
    function DeferProcessComplete(type) {
        if (!this.$$state.pending) {
            this.execute(this.$$state.resolvedWith, this.$$state.value);
        }
    }
    function _coreDefer() {
        this._done = [];
        this._fail = [];
        this.$$state = {
            pending: true,
            value: null,
            resolvedWith: ''
        };
    }
    _coreDefer.prototype.execute = function (type, args) {
        var i = this[type].length, len = 0, deferredFn = this[type];
        args = Array.prototype.slice.call(args);
        while (i > len) {
            deferredFn[len] && deferredFn[len].apply(null, args);
            len++;
        }
        this.$$state.pending = false;
        this.$$state.value = args;
        this.$$state.resolvedWith = type;
        (triggerAfterResolve || function () {
        })();
    };
    _coreDefer.prototype.resolve = function () {
        this.execute('_done', arguments);
    };
    _coreDefer.prototype.reject = function () {
        this.execute('_fail', arguments);
    };
    _coreDefer.prototype.done = function (callback) {
        this._done.push(callback);
        DeferProcessComplete.call(this, 'execute');
        return this;
    };
    _coreDefer.prototype.fail = function (callback) {
        this._fail.push(callback);
        DeferProcessComplete.call(this, 'execute');
        return this;
    };
    return new _coreDefer();
}
function _Promise(triggerAfterResolve) {
    var _untilObserver = [], untilStarted = false;
    function PromiseProcessComplete(type) {
        if (!this.$$state.pending) {
            this[type](this.$$state.resolvedWith, this.$$state.value);
        } else {
            if (_untilObserver.length && !untilStarted) {
                untilStarted = true;
                startUntilObserver(this);
            }
        }
    }
    function startUntilObserver(context) {
        var _interval = setInterval(function () {
            var allPassed = _untilObserver.map(function (fn) {
                return fn();
            }).filter(function (ans) {
                return !!ans;
            }).length;
            if (allPassed === _untilObserver.length) {
                context.resolve();
                _untilObserver.length = 0;
                clearInterval(_interval);
            }
        }, 100);
    }
    function _corePromise() {
        this.pending = [];
        this.resolve = function () {
            this.complete('resolve', arguments);
        };
        this.reject = function (result) {
            this.complete('reject', arguments);
        };
        this.$$state = {
            pending: true,
            value: null,
            resolvedWith: ''
        };
        this.until = function (untilObserver) {
            _untilObserver.push(untilObserver);
            return this;
        };
    }
    _corePromise.prototype.then = function (success, failure) {
        this.pending.push({
            resolve: success || function () {
            },
            reject: failure || function () {
            }
        });
        PromiseProcessComplete.call(this, 'complete');
        return this;
    };
    _corePromise.prototype.catch = function (failure) {
        this.pending.push({
            reject: failure || function () {
            },
            resolve: function () {
            }
        });
        PromiseProcessComplete.call(this, 'complete');
    };
    _corePromise.prototype.complete = function (type, result) {
        while (this.pending[0]) {
            var fn = this.pending.shift()[type];
            fn.apply(null, result);
        }
        this.$$state.pending = false;
        this.$$state.value = result;
        this.$$state.resolvedWith = type;
        (triggerAfterResolve || function () {
        })();
    };
    _corePromise.prototype.all = function (resolve) {
        var slice = [].slice, resolveValues = arguments.length == 1 && $isArray(resolve) ? resolve : slice.call(arguments), length = resolveValues.length, remaining = length, deferred = new Defer(), failed = 0, results = [];
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
            if (cur.$$state) {
                cur.then(updateDefered(i), updateDefered(i, 1));
            } else {
                updateDefered(i)(cur);
            }
        }
        return deferred;
    };
    return new _corePromise();
}
function $EventEmitters() {
    var _events = {};
    function EventEmitter() {
        this.broadcast = function (name, arg) {
            var nextFn = _events[name] || function () {
            };
            nextFn.apply(nextFn, arg);
        };
        this.subscribe = function (name, fn) {
            _events[name] = fn;
            return this;
        };
    }
    EventEmitter.prototype.destroy = function (name) {
        _events[name] = null;
    };
    EventEmitter.prototype.bind = function (fn, arg) {
        return function () {
            fn.apply(fn, arg || []);
        };
    };
    EventEmitter.prototype.stack = stack;
    EventEmitter.prototype.queue = new stack();
    return new EventEmitter();
}
function loadExternalScript(dropZone) {
    this.dropZone = dropZone;
    this.setPath = function (path) {
        this.sourcePath = path;
        return this;
    };
}
loadExternalScript.prototype.js = function (obj, callback) {
    init.call(this, obj, callback, 'js');
};
loadExternalScript.prototype.css = function (obj) {
    init.call(this, obj, null, 'css');
};
loadExternalScript.prototype.jscs = function (obj, callback) {
    for (var type in obj) {
        init.call(this, obj[type], callback, type);
    }
    return this;
};
function init(obj, callback, type) {
    var s, inc = 0, stack = [], self = this;
    if (obj && toString.call(obj) === '[object Array]' && obj.length > 0) {
        var clink = function (n, folder) {
                if ($inArray('//', n)) {
                    return n;
                }
                return [
                    self.sourcePath,
                    n,
                    '.',
                    type
                ].join('');
            }, append = function (ele) {
                (self.dropZone || document.getElementsByTagName('head')[0]).appendChild(ele);
            }, process = function (isCallback) {
                var isProcessing = stack.shift();
                append(isProcessing);
                isProcessing.onreadystatechange = isProcessing.onload = function () {
                    var state = isProcessing.readyState;
                    if (!isCallback.done && (!state || /loaded|complete/.test(state))) {
                        if (stack.length) {
                            process(isCallback);
                        } else {
                            isCallback.done = true;
                            isCallback();
                        }
                    }
                };
            };
        obj.forEach(function (n, i) {
            switch (type) {
            case 'css':
                s = document.createElement('link');
                s.setAttribute('type', 'text/css');
                s.setAttribute('href', clink(n));
                s.setAttribute('rel', 'stylesheet');
                append(s);
                break;
            case 'js':
                s = document.createElement('script');
                s.setAttribute('src', clink(n));
                s.setAttribute('type', 'text/javascript');
                s.async = true;
                stack.push(s);
                break;
            }
            ;
        });
        if ($isEqual(type, 'js') && stack.length) {
            if (typeof callback === 'undefined') {
                callback = function () {
                };
            }
            process(callback);
            inc++;
        }
    }
}
function customStyleSheetAppender(style, dropZone) {
    var jEliStyles = document.createElement('style');
    jEliStyles.setAttribute('type', 'text/css');
    if (jEliStyles.styleSheet) {
        jEliStyles.styleSheet.cssText = style;
    } else {
        jEliStyles.appendChild(document.createTextNode(style));
    }
    (dropZone || document.getElementsByTagName('head')[0]).appendChild(jEliStyles);
    return jEliStyles;
}
var $eUID = 1;
var CoreBootstrapContext = {
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    $isAfterBootStrap: false,
    enableDebugger: true
};
var componentDebugContext = new Map();
var CoreModuleFactory = new Map();
function getUID() {
    return 'jeli:' + +new Date() + ':' + $eUID++;
}
function BuildVersion(name, version) {
    var vSplit = version.split('.'), matchPhase = {
            dot: 0,
            major: 1,
            minor: 2
        };
    for (var n in matchPhase) {
        if (vSplit[matchPhase[n]]) {
            matchPhase[n] = parseInt(vSplit[matchPhase[n]]);
        } else {
            matchPhase[n] = 0;
        }
    }
    matchPhase['name'] = name;
    return matchPhase;
}
;
function bootStrapApplication(moduleToBootStrap) {
    CoreBootstrapContext.compiledModule = moduleToBootStrap;
    InitializeModule(moduleToBootStrap);
    CoreBootstrapContext.$isCompiled = true;
    bootStrapElement();
    function bootStrapElement() {
        if (moduleToBootStrap.annotations.rootElement) {
            var selector = moduleToBootStrap.annotations.rootElement.annotations.selector;
            CoreBootstrapContext.bootStrapComponent = new ElementRef({
                name: selector,
                isc: true,
                type: 'element',
                fromDOM: true
            }, null);
            ElementCompiler(moduleToBootStrap.annotations.rootElement, CoreBootstrapContext.bootStrapComponent, function () {
            });
        }
    }
}
;
function InitializeModule(moduleFn) {
    moduleFn.annotations.initializers.forEach(dependencyInjectorMain);
    if (moduleFn.annotations.requiredModules) {
        moduleFn.annotations.requiredModules.forEach(InitializeModule);
    }
}
function ElementCompiler(ctrl, elementRef, next) {
    var definition = ctrl.annotations, hasTwoWayBinding = elementRef.props && definition.props, lifeCycle;
    function CoreComponentCompiler(componentInstance) {
        if (!elementRef.isc) {
            return;
        }
        var style = null;
        var componentRef = componentDebugContext.get(elementRef.refId);
        componentRef.componentInstance = componentInstance;
        if (hasTwoWayBinding) {
        }
        if (ctrl.style) {
            style = AttachComponentStyles(ctrl.style, elementRef.nativeElement);
        }
        if (ctrl.view) {
            var template = ctrl.view.getView(elementRef);
            try {
                elementRef.appendChild(template);
            } catch (e) {
                errorBuilder(e);
            } finally {
                buildViewChild(componentInstance, elementRef, definition.viewChild);
                lifeCycle.trigger('viewDidLoad');
            }
        }
        elementRef.observer(function () {
            lifeCycle.trigger('viewDidDestroy');
            if (style) {
                style.parentNode.removeChild(style);
            }
            componentRef.destroy();
            lifeCycle = null;
            componentRef = null;
        });
        _MutationObserver(elementRef.nativeNode || elementRef.nativeElement, function () {
            if (elementRef.nativeElement) {
                elementRef.remove();
            }
        });
        componentRef.changeDetector.detectChanges();
    }
    function compileRegistry(componentInstance) {
        if (definition.registry) {
            definition.registry.forEach(_registry);
        }
        function _registry(option) {
            switch (option.type) {
            case 'event':
                var evName = option.name;
                if ($isEqual('default', evName)) {
                    evName = EventHandler.getEventType(elementRef.nativeElement);
                }
                elementRef.events.add({
                    name: evName,
                    handler: ComponentEventHandler(option.value)
                });
                break;
            case 'emitter':
                AttachEventEmitter(option.name);
                break;
            case 'dispatcher':
                AttachEventDispatcher(option);
                break;
            }
        }
        function ComponentEventHandler(handler) {
            return function (event) {
                return EventHandler._executeEventsTriggers(handler, componentInstance, null, event);
            };
        }
        function AttachEventEmitter(eventName) {
            var registeredEvent = elementRef.events.getEvent(eventName.toLowerCase());
            if (registeredEvent && registeredEvent.value) {
                componentInstance[eventName].subscribe(function (value) {
                    EventHandler._executeEventsTriggers(registeredEvent.value, elementRef.parent.componentInstance, null, value);
                    elementRef.parent.changeDetector.detectChanges();
                });
                elementRef.observer(function () {
                    componentInstance[eventName].destroy();
                });
            }
        }
        function AttachEventDispatcher(options) {
            var registeredEvent = elementRef.getEvent(options.name.toLowerCase());
            var context = null;
            if (registeredEvent && registeredEvent.value.length) {
                context = elementRef.context;
                if (elementRef.isc) {
                    context = elementRef.parent.context;
                }
                var methodName = registeredEvent.value[0].fn;
                context[methodName] = function eventHandler(value) {
                    EventHandler._executeEventsTriggers(options.value, componentInstance, null, value);
                    elementRef.parent.changeDetector.detectChanges();
                };
            }
        }
    }
    function registerDirectiveInstance(componentInstance) {
        if (!elementRef.isc) {
            elementRef.nodes.set(definition.selector, componentInstance[ctrl.annotations.exportAs] || componentInstance);
            var unsubscribe = SubscribeObservables(elementRef.hostRef.refId, function () {
                lifeCycle.trigger('willObserve');
            });
            elementRef.observer(function () {
                lifeCycle.trigger('viewDidDestroy');
                elementRef.nodes.delete(definition.selector);
                lifeCycle = null;
                unsubscribe();
            });
        }
    }
    function Linker(componentInstance) {
        var always = false;
        if ($isArray(definition.props) && definition.props.length) {
            always = _updateViewBinding();
            if (always) {
                elementRef.observer(SubscribeObservables(elementRef.parent.refId, _updateViewBinding));
            }
        }
        function _updateViewBinding() {
            var hasBinding = false;
            for (var i = 0; i < definition.props.length; i++) {
                var item = definition.props[i];
                if (elementRef.props && elementRef.props.hasOwnProperty(item.value)) {
                    hasBinding = true;
                    if (item.ignoreChanges) {
                        return;
                    }
                    switch (item.type) {
                    case 'TemplateRef':
                        item.ignoreChanges = true;
                        componentInstance[item.name] = elementRef.getTemplateRef(item.value);
                        break;
                    default:
                        var value = evaluateExpression(elementRef.props[item.value], elementRef.context);
                        componentInstance[item.name] = value;
                        break;
                    }
                } else {
                    if ($isEqual(item.value, 'jModel')) {
                        componentInstance[item.name] = elementRef.nodes.get('model');
                    } else {
                        componentInstance[item.name] = elementRef.getAttribute(item.value);
                    }
                }
            }
            lifeCycle.trigger('willObserve');
            return hasBinding;
        }
    }
    var locals = generatePublicInjectors(ctrl.annotations, elementRef);
    ControllerInitializer(ctrl, locals, function triggerInstance(componentInstance) {
        compileRegistry(componentInstance);
        lifeCycle = new ElementCompiler.LifeCycle(componentInstance);
        Linker(componentInstance);
        registerDirectiveInstance(componentInstance);
        lifeCycle.trigger('didInit');
        next(componentInstance);
        CoreComponentCompiler(componentInstance);
        locals.elementRef = null;
        locals = null;
    });
}
ElementCompiler.LifeCycle = function (componentInstance) {
    var _cycleState = {
        didInit: !!componentInstance.didInit,
        viewDidLoad: !!componentInstance.viewDidLoad,
        viewDidMount: !!componentInstance.viewDidMount,
        viewDidDestroy: !!componentInstance.viewDidDestroy,
        willObserve: !!componentInstance.willObserve,
        didChanged: !!componentInstance.didChanged
    };
    this.trigger = function (cycle) {
        if (this.has(cycle)) {
            componentInstance[cycle]();
        }
    };
    this.has = function (cycle) {
        return _cycleState[cycle] && $isFunction(componentInstance[cycle]);
    };
};
ElementCompiler.resolve = function (node, nextTick) {
    function next() {
        if (!node.isDetachedElem) {
            var customElement = node.customElements.shift();
            if (customElement) {
                try {
                    ElementCompiler(customElement, node, next);
                } catch (e) {
                    errorBuilder(e);
                }
            } else {
                nextTick(node);
            }
        }
    }
    next();
};
function ComponentRef(refId) {
    var _this = this;
    this.componentRefId = refId;
    this.observables = new Subject();
    this.child = [];
    this.parent = null;
    this.changeDetector = new ChangeDetector(tick);
    this.componentInstance = null;
    this._context = null;
    Object.defineProperty(this, 'context', {
        get: function () {
            if (this._context) {
                return this._context;
            }
            return this.componentInstance;
        }
    });
    function tick(ignoreChild, ignoreParent) {
        if (!_this.observables || _this.inProgress) {
            return;
        }
        _this.inProgress = true;
        _this.observables.notifyAllObservers(_this.componentInstance);
        if (!ignoreChild) {
            triggerChild(_this.child, []);
        }
        if (_this.parent && !ignoreParent && componentDebugContext.has(_this.parent)) {
            var parent = componentDebugContext.get(_this.parent);
            parent.changeDetector.detectChanges(true);
            triggerChild(parent.child, [_this.componentRefId]);
        }
        function triggerChild(children, ignore) {
            children.forEach(function (childRef) {
                if (!$inArray(childRef, ignore)) {
                    var child = componentDebugContext.get(childRef);
                    child.changeDetector.detectChanges(false, true);
                }
            });
        }
        _this.inProgress = false;
    }
    ;
}
ComponentRef.prototype.removeChild = function (refId) {
    this.child.slice(this.child.indexOf(refId), 1);
    componentDebugContext.delete(refId);
};
ComponentRef.prototype.updateModel = function (propName, value) {
    setModelValue(propName, this.context, value);
    this.changeDetector.detectChanges(false, true);
    return this;
};
ComponentRef.prototype.new = function (refId) {
    var childInstance = new ComponentRef(refId);
    childInstance.parent = this;
    this.child.push(refId);
    return childInstance;
};
ComponentRef.prototype.destroy = function () {
    componentDebugContext.delete(this.componentRefId);
    this.observables.destroy();
    this.changeDetector = null;
    this.observables = null;
    this.parent = null;
    this.child.length = 0;
    if (this.parent) {
        this.parent.removeChild(this.componentRefId);
    }
};
ComponentRef.create = function (refId, parentId) {
    var componentRef = new ComponentRef(refId);
    if (parentId) {
        componentRef.parent = parentId;
    }
    componentDebugContext.set(refId, componentRef);
    componentRef = null;
};
function ChangeDetector(tick) {
    var _changeDetectorState = 3;
    this.detectChanges = function () {
        tick.apply(null, arguments);
    };
    this.markAsChecked = function () {
        _changeDetectorState = 1;
    };
    this.markAsUnChecked = function () {
        _changeDetectorState = 3;
    };
    this.markAsOnce = function () {
        _changeDetectorState = 2;
    };
    Object.defineProperty(this, 'status', {
        get: function () {
            return _changeDetectorState;
        }
    });
}
function createLocalVariables(localVariables, componentContext) {
    var context = {};
    if (localVariables) {
        for (var propName in localVariables) {
            if (localVariables[propName].match(/\s/)) {
                context[propName] = localVariables[propName];
            } else if (componentContext) {
                context[propName] = evaluateExpression(localVariables[propName], componentContext);
            }
        }
    }
    return context;
}
function SubscribeObservables(refId, fn, attachDestroy) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
        if (attachDestroy) {
            componentRef.observables.on('$destroy', unsubscribe);
        }
    }
    return unsubscribe;
}
ComponentRef.detectChanges = function () {
    CoreBootstrapContext.bootStrapComponent.context.tick();
};
function generatePublicInjectors(annotations, elementRef) {
    var injectors = { ElementRef: elementRef };
    if (annotations.dynamicInjectors) {
        for (var i = 0; i < annotations.DI.length; i++) {
            if (annotations.DI[i].value) {
                _defineProp(i);
            }
        }
    }
    Object.defineProperties(injectors, {
        TemplateRef: {
            get: function () {
                return this.ElementRef.getTemplateRef(annotations.selector);
            }
        },
        changeDetector: {
            get: function () {
                return this.ElementRef.changeDetector;
            }
        },
        ViewRef: {
            get: function () {
                return new ViewRef(this.ElementRef);
            }
        },
        EventBinder: {
            get: function () {
                if (annotations.EventBinders && annotations.EventBinders.length) {
                    var binder = getEventBinder(annotations.EventBinders, this.ElementRef);
                    if (binder) {
                        factory = binder.factory;
                    }
                }
                return DependencyInjectorService.get(factory, this);
            }
        },
        VALIDATORS: {
            get: function () {
                var _this = this;
                return [
                    'required',
                    'pattern',
                    'minlength',
                    'maxlength'
                ].reduce(function (accum, key) {
                    if (_this.ElementRef.hasAttribute(key)) {
                        accum[key] = _this.ElementRef.getAttribute(key);
                    }
                    return accum;
                }, {});
            }
        }
    });
    function _defineProp(idx) {
        Object.defineProperty(injectors, annotations.DI[idx].name, {
            get: function () {
                if (annotations.DI[idx].isdir) {
                    return this.ElementRef.parent.nodes.get(annotations.DI[idx].value);
                } else {
                    return this.ElementRef.parent.componentInstance;
                }
            }
        });
    }
    return injectors;
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
function getFunctionsFromString(fnData) {
    return fnData.replace(/\W(;)/g, function (idx, key) {
        return idx.length > 1 ? idx.charAt(0) + '|' : '|';
    }).split('|');
}
function setModelValue(key, model, value) {
    value = $isString(value) ? removeSingleQuote(value) : value;
    deepArrayChecker(true, $removeWhiteSpace(key), model, value);
    return value;
}
function buildViewChild(componentInstance, elementRef, viewChild) {
    elementRef.viewQuery.render(assignValue);
    function assignValue(item) {
        var option = viewChild[item.key];
        if (option.type) {
            switch (option.type.toLowerCase()) {
            case 'querylist':
                if (!componentInstance.hasOwnProperty(option.name)) {
                    componentInstance[option.name] = new QueryList();
                }
                componentInstance[option.name].add(item.value);
                break;
            case 'jmodel':
                componentInstance[option.name] = item.value.nodes.get(option.value);
                break;
            case 'elementref':
                componentInstance[option.name] = item.value;
                break;
            }
        } else if (option.isdir) {
            componentInstance[option.name] = item.value.nodes.get(option.value);
        } else {
            componentInstance[option.name] = item.value.componentInstance;
        }
    }
}
function DependencyInjectorService(restricted) {
    return {
        get: DependencyInjectorService.get,
        inject: DependencyInjectorService.inject
    };
}
DependencyInjectorService.get = function (factory, resolver, moduleName) {
    if ($isString(factory)) {
        if (resolver && factory in resolver) {
            return resolver[factory];
        }
        if (InternalProviderService.has(factory)) {
            return InternalProviderService.get(factory);
        }
    }
    if ($isFunction(factory)) {
        var dependency = factory.annotations.instance;
        if (!dependency) {
            dependency = DependencyInjectorService.inject(factory, resolver);
            if (!factory.annotations.noSingleton) {
                factory.annotations.instance = dependency;
            }
        }
        return dependency;
    }
    return null;
};
DependencyInjectorService.inject = function (factory, locals, callback) {
    if ($isFunction(factory)) {
        var nArg = [];
        if (factory.annotations.DI) {
            nArg = Object.keys(factory.annotations.DI).map(function (serviceName) {
                var doInject = factory.annotations.DI[serviceName];
                var injectedArgument = null;
                try {
                    injectedArgument = DependencyInjectorService.get(doInject.factory || serviceName, locals, factory.module);
                } catch (e) {
                    console.error(e);
                } finally {
                    if (!injectedArgument && !doInject.optional) {
                        throw new Error('Unable to resolve provider ' + serviceName);
                    }
                }
                return injectedArgument;
            });
        }
        var protos = Object.create(factory.prototype);
        var result = factory.apply(protos, args);
        if ($isFunction(callback)) {
            return callback(result ? result : protos);
        }
        return result ? result : protos;
    }
    return factory;
};
DependencyInjectorService.getRegisteredElement = function (name, type) {
    var dir = [];
    getElement(CoreBootstrapContext.compiledModule);
    if (CoreBootstrapContext.compiledModule.annotations.requiredModules) {
        CoreBootstrapContext.compiledModule.annotations.requiredModules.forEach(function (moduleName) {
            getElement(ModuleService._factories.get(moduleName));
        });
    }
    function getElement(_module) {
        if (_module.annotations[type].has(name)) {
            dir.push(_module.annotations[type].get(name));
        }
    }
    return dir;
};
DependencyInjectorService.binding = function (fn, arg) {
    var Temp = function () {
        return fn.apply(this, arg);
    };
    Temp.prototype = fn.prototype;
    return init;
};
function HtmlDOM() {
    this.createTextNode = function (text) {
        return document.createTextNode(text);
    };
    this.appendChild = function (parent, child) {
        parent.appendChild(child);
    };
}
HtmlDOM.prototype.insertBefore = function (target, newNode) {
    target.parent.insertBefore(newNode, target);
};
HtmlDOM.prototype.asElementRef = function (ele) {
    return new ElementRef(ele);
};
HtmlDOM.prototype.querySelector = function (element, query) {
    return (element.nativeElement || element).querySelector(query);
};
HtmlDOM.prototype.querySelectorAll = function (element, query) {
    return (element.nativeElement || element).querySelectorAll(query);
};
HtmlDOM.prototype.createElement = function (elementName, config) {
    var ele = null, hasCondition = config.hasOwnProperty('condition');
    if (!hasCondition || hasCondition && config.condition) {
        ele = document.createElement(elementName), _this = this;
        if ($isObject(config)) {
            if (config.attributes) {
                for (var prop in config.attributes) {
                    ele.setAttribute(prop, config.attributes[prop]);
                }
            }
            if (config.styles) {
                for (var style in config.styles) {
                    ele.style[style] = config.styles[style];
                }
            }
            if (config.textContent) {
                ele.appendChild(_this.createTextNode(config.textContent));
            } else if (config.innerHTML) {
                ele.innerHTML = config.innerHTML;
            }
            if (config.children) {
                config.children.forEach(function (child) {
                    var childEle = _this.createElement(child.element, child);
                    if (childEle) {
                        ele.appendChild(childEle);
                    }
                });
            }
        }
    }
    return ele;
};
HtmlDOM.createElementByType = function (tag, text, fromDOM) {
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
};
function AttachComponentStyles(style, ele) {
    if (style && ele) {
        if ($isString(style)) {
            return customStyleSheetAppender(style, ele[0]);
        } else {
            var externalLoader = new loadExternalScript(ele[0]);
            return externalLoader.css(style);
        }
    }
}
function AttributeAppender(nativeElement, prop, value) {
    if ($isObject(prop)) {
        for (var name in prop) {
            nativeElement.setAttribute(name, prop[name]);
        }
    } else {
        nativeElement.setAttribute(prop, value);
    }
}
AttributeAppender.style = function (nativeElement, value, template) {
    if ($isObject(value)) {
        ElementStyle(nativeElement, value);
    } else {
        ElementStyle.set(nativeElement, template.props, value, template.suffix);
    }
};
AttributeAppender.innerhtml = function (nativeElement, value) {
    nativeElement.innerHTML = HtmlParser.sce.trustAsHTML(value);
};
AttributeAppender.src = function (nativeElement, value) {
    if (!$isArray(nativeElement.tagName, [
            'IMG',
            'IFRAME'
        ])) {
        errorBuilder('src is not a valid property of ' + nativeElement.tagName);
    }
    nativeElement.setAttribute('src', value);
};
AttributeAppender.href = function (nativeElement, value) {
    if (!$isEqual('A', nativeElement.tagName)) {
        errorBuilder('href is not a valid property of ' + nativeElement.nativeElement.tagName);
    }
    nativeElement.setAttribute('href', value);
};
AttributeAppender.class = function (nativeElement, value) {
    ElementClassList.add(nativeElement, value);
};
AttributeAppender.checked = function (nativeElement, isChecked) {
    _optionalType(nativeElement, isChecked, 'checked');
};
AttributeAppender.selected = function (nativeElement, isChecked) {
    _optionalType(nativeElement, isChecked, 'selected');
};
function _optionalType(nativeElement, isSelected, type) {
    nativeElement[isSelected ? 'setAttribute' : 'removeAttribute'](type, isSelected);
    nativeElement[type] = isSelected;
}
function ElementClassList(nativeElement, classList, type) {
    if (type) {
        nativeElement.classList[type].apply(nativeElement.classList, classList.split(' '));
    } else if (classList) {
        nativeElement.classList.value = classList;
    } else {
        return nativeElement.classList.value;
    }
}
ElementClassList.add = function (nativeElement, classList, removeClass) {
    if (!classList) {
        return;
    }
    if ($isObject(classList)) {
        for (var className in classList) {
            if ($isString(classList[className])) {
                nativeElement.classList.toggle(className, classList[className]);
            }
        }
    } else {
        nativeElement.classList.toggle(classList, removeClass);
    }
};
ElementClassList.contains = function (nativeElement, className) {
    return nativeElement.classList.contains(className);
};
function CommentRef(definition, parent) {
    this.nativeNode = document.createComment(definition.text);
    Object.defineProperties(this, {
        context: {
            get: function () {
                return parent.context;
            }
        },
        parent: {
            get: function () {
                return parent;
            }
        },
        refId: {
            get: function () {
                return definition.refId;
            }
        }
    });
    this.getTemplate = function () {
        if (definition.template) {
            return HtmlParser[definition.template.type](definition.template, this.parent);
        }
    };
}
CommentRef.prototype.cleanup = function () {
};
CommentRef.prototype.remove = function () {
    this.nativeNode.parentNode.removeChild(this.nativeNode);
    this.cleanup();
};
function ElementRef(definition, parent) {
    var viewQuery = null;
    var _this = this;
    definition.events = definition.events || [];
    definition.attr = definition.attr || {};
    this.nativeElement = HtmlDOM.createElementByType(definition.name, definition.text, definition.fromDOM);
    this.refId = getUID();
    this.customElements = [];
    this.$observers = [];
    this.children = new QueryList();
    this._canSetValue = $isEqual('input', EventHandler.getEventType(this.nativeElement));
    this.parent = parent;
    if (definition.isc) {
        ComponentRef.create(this.refId, parent && parent.refId);
        viewQuery = Object.create({
            ϕelements: [],
            add: function (option, element) {
                if (!$isEqual(option[1], _this.tagName)) {
                    return _this.parent && _this.parent.hostRef.viewQuery.add(option, element);
                }
                this.ϕelements.push({
                    key: option[0],
                    value: element
                });
            },
            render: function (callback) {
                while (this.ϕelements.length) {
                    callback(this.ϕelements.pop());
                }
                this.ϕelements.length = 0;
            }
        });
    }
    this.nodes = new Map();
    this.events = new EventHandler(this, definition.events);
    this.getDirective = function (name) {
        return definition.directives && definition.directives.filter(function (dir) {
            return dir.name === name;
        })[0];
    };
    Object.defineProperties(this, {
        index: {
            get: function () {
                return definition.index;
            }
        },
        value: {
            get: function () {
                return ElementRefGetValue(this);
            },
            set: function (value) {
                ElementRefSetValue(this, value);
            }
        },
        nativeNode: {
            get: function () {
                return $isEqual(this.nativeElement.nodeType, 8) ? ele : null;
            }
        },
        type: {
            get: function () {
                return definition.type;
            }
        },
        tagName: {
            get: function () {
                return definition.name.toLowerCase();
            }
        },
        attr: {
            get: function () {
                return definition.attr;
            }
        },
        props: {
            get: function () {
                return definition.props;
            }
        },
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
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).componentInstance;
                }
                return this.parent && this.parent.componentInstance;
            }
        },
        hostRef: {
            get: function () {
                if (definition.isc) {
                    return this;
                }
                return this.parent.hostRef;
            }
        },
        viewQuery: {
            get: function () {
                return viewQuery || this.parent.viewQuery;
            }
        },
        isc: {
            get: function () {
                return definition.isc;
            }
        },
        changeDetector: {
            get: function () {
                if (componentDebugContext.has(this.refId)) {
                    return componentDebugContext.get(this.refId).changeDetector;
                }
                return this.parent && this.parent.changeDetector;
            }
        }
    });
    this.getTemplateRef = function (templateId) {
        return getTemplateRef(definition.templates, templateId);
    };
    if (definition.attrObservers) {
        setupAttributeObservers(this, definition.attrObservers);
    }
}
ElementRef.prototype.getChildByRef = function (refId) {
    return this.children.find(function (element) {
        return $isEqual(element.refId, refId);
    });
};
ElementRef.prototype.nextSibling = function () {
    return this.parent && this.parent.children.findByIndex(this.index + 1);
};
ElementRef.prototype.prevSibling = function () {
    return this.parent && this.parent.children.findByIndex(this.index - 1);
};
ElementRef.prototype.setProp = function (propName, propValue) {
    this.nativeElement[propName] = propValue;
    this.setAttribute.apply(this, arguments);
    return this;
};
ElementRef.prototype.hasAttribute = function (name) {
    return this.attr.hasOwnProperty(name);
};
ElementRef.prototype.getAttribute = function (name) {
    var dir = this.getDirective(name);
    if (dir) {
        return generateArrayKeyType(dir.checker, this.context);
    }
    return this.attr && this.attr[name];
};
ElementRef.prototype.hasAnyAttribute = function (list, force) {
    var found = 0, self = this;
    list.forEach(function (attr) {
        if (self.hasAttribute(attr)) {
            found = simpleArgumentParser(self.getAttribute(attr) || force || true);
        }
    });
    return found;
};
ElementRef.prototype.setAttribute = function (name, value, attachInElement) {
    this.attr[name] = value;
    if (attachInElement && this.nativeElement) {
        this.nativeElement.setAttribute(name, value);
    }
    return this;
};
ElementRef.prototype.removeAttribute = function (name) {
    this.nativeElement && this.nativeElement.removeAttribute(name);
    delete this.attr[name];
};
ElementRef.prototype.appendChild = function (template) {
    var child;
    if ($isFunction(template)) {
        child = template(this);
    } else if (template instanceof ElementRef) {
        HtmlParser.transverse(template);
        child = template.nativeElement;
    } else if (template instanceof HTMLElement || template instanceof DocumentFragment) {
        child = template;
    }
    this.nativeElement.appendChild(child);
    child = null;
};
ElementRef.prototype.insertAfter = function (newNode, targetNode) {
    if (!targetNode.parentNode) {
        return;
    }
    targetNode = targetNode || this.nativeElement;
    if (newNode instanceof ElementRef) {
        this.children.add(newNode);
        HtmlParser.transverse(newNode);
        newNode.changeDetector.detectChanges();
        newNode = newNode.nativeElement;
    } else {
        this.changeDetector.detectChanges();
    }
    targetNode.parentNode.insertBefore(newNode, targetNode.nextSibling);
};
ElementRef.prototype.html = function (content) {
    if (content instanceof ElementRef) {
        HtmlParser.transverse(content);
        content = content.nativeElement;
    } else if ($isString(content)) {
        content = HtmlParser.parseFromString(content);
    }
    this.nativeElement.innerHTML = '';
    this.nativeElement.appendChild(content);
};
ElementRef.prototype.remove = function (removeFromParent) {
    if (this.nativeElement && this.nativeElement.nodeType != 11) {
        this.nativeElement.remove();
    }
    if (removeFromParent && this.parent) {
        this.children.remove(this);
    }
    cleanupElementRef(this);
};
ElementRef.prototype.removeChild = function (element) {
    this.children.remove(element);
    cleanupElementRef(element);
};
ElementRef.prototype.observer = function (onDestroyListener) {
    if (onDestroyListener) {
        this.$observers.push(onDestroyListener);
    }
    return this;
};
ElementRef.prototype.listen = function (listeners) {
    var ele = this.nativeElement;
    Object.keys(listeners).forEach(_listen);
    function _listen(event) {
        if (event in ele) {
            ele[event] = function (ev) {
                listeners[event](ev);
            };
        }
    }
};
function cleanupElementRef(elementRef) {
    elementRef.events.destroy();
    while (elementRef.$observers.length) {
        elementRef.$observers.pop()();
    }
    elementRef.children.destroy();
    elementRef.nativeElement = null;
    elementRef.parent = null;
    elementRef.nodes.clear();
}
;
function setupAttributeObservers(element, attrObservers) {
    element.observer(SubscribeObservables(element.hostRef.refId, observe));
    function observe() {
        for (var propName in attrObservers) {
            attributeEvaluator(propName, attrObservers[propName]);
        }
        function attributeEvaluator(propName, template) {
            compileTemplate(template, element.context, function (value) {
                if (AttributeAppender[propName]) {
                    AttributeAppender[propName](element.nativeElement, value, template);
                } else {
                    element.setProp(propName, value, true);
                }
                if (template.once) {
                    delete attrObservers[propName];
                }
            });
        }
    }
}
function ElementRefSetValue(element, value, force) {
    if (!$isEqual(element.value, value) || force) {
        switch (element.tagName.toLowerCase()) {
        case 'select':
            setSelectOptionsType();
            break;
        case 'input':
            if (element._canSetValue) {
                element.setProp('value', value);
            } else {
                var isChecked = element.value == value;
                if ($isEqual(element.nativeElement.type.toLowerCase(), 'checkbox')) {
                    isChecked = value;
                }
                AttributeAppender.checked(element.nativeElement, isChecked, element.value);
            }
            break;
        default:
            element.setProp('innerHTML', value);
            break;
        }
    }
    function setSelectOptionsType() {
        var isObject = $isObject(value);
        element.children.forEach(setOptionsValue);
        function setOptionsValue(options) {
            var optionValue = options.getAttribute('value'), isSelected;
            if (isObject) {
                isSelected = $isEqual(JSON.stringify(optionValue).toLowerCase(), value);
            } else {
                isSelected = $isEqual(optionValue, value);
            }
            if (isSelected) {
                options.setProp('selected', true);
            }
            return false;
        }
    }
    ;
}
;
function ElementRefGetValue(element) {
    if ($isEqual(element.nativeElement.type, 'checkbox')) {
        return element.nativeElement.checked;
    } else if ($isEqual(element.nativeElement.localName, 'select')) {
        if (!element.children.length || element.nativeElement.options.length > element.children.length) {
            return element.nativeElement.value;
        }
        if (element.hasAttribute('multiple')) {
            var optionsValue = [];
            for (var i = 0; i < element.nativeElement.selectedOptions.length; i++) {
                var option = element.nativeElement.selectedOptions[i];
                var value = element.children.findByIndex(option.index).getAttribute('value');
                optionsValue.push(value);
            }
            return optionsValue;
        }
        return element.children.findByIndex(element.nativeElement.selectedIndex).getAttribute('value');
    } else if (element.nativeElement.type) {
        return simpleArgumentParser(element.nativeElement.value);
    }
}
;
var domEnums = {
    ElementRef: 'ElementRef',
    ViewRef: 'ViewRef',
    TemplateRef: 'TemplateRef',
    $event: '$event'
};
function EventHandler(elementRef, events) {
    this._events = events || [];
    this.add = function (_event) {
        this._events.push(_event);
    };
    this.registeredEvents = [];
    Object.defineProperty(this, 'node', {
        get: function () {
            return elementRef;
        }
    });
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
        if ($inArray(ev.type, [
                'submit',
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
            _this.node.changeDetector.detectChanges();
        }
    }
    function triggerEvents(registeredEvent, mouseEvent) {
        if (registeredEvent.handler) {
            registeredEvent.handler(mouseEvent);
        } else {
            EventHandler._executeEventsTriggers(registeredEvent.value, _this.node.hostRef.componentInstance, _this.node.context, mouseEvent);
        }
    }
    for (var i = 0; i < this._events.length; i++) {
        var event = this._events[i];
        if (!event.custom) {
            event.name.split(' ').forEach(function (eventName) {
                if ($inArray('change', eventName) && !event.handler) {
                    if (!_this.node.getDirective('model')) {
                        errorBuilder('ChangeEventListener requires jModel Directive to perform');
                    }
                }
                if ($isNull(_this.node.nativeElement['on' + eventName])) {
                    _this.registeredEvents.push(eventName);
                    _this.node.nativeElement['on' + eventName] = jEventHandler;
                }
            });
        }
    }
};
EventHandler.prototype.destroy = function () {
    while (this.registeredEvents.length) {
        var event = this.registeredEvents.pop();
        this.node.nativeElement['on' + event] = null;
    }
    this._events.length = [];
};
EventHandler.getEventsByType = function (events, type) {
    return events.filter(function (event) {
        return $inArray(event.name, type);
    });
};
EventHandler._executeEventsTriggers = function (eventTriggers, componentInstance, context, ev) {
    eventTriggers.forEach(_dispatch);
    function _dispatch(event) {
        if (event.key) {
            var value = resolveValueFromContext(event.value, context || componentInstance);
            setModelValue(event.key, context || componentInstance, value);
        } else if (event.fn) {
            var fn = EventHandler.getFnFromContext(event, componentInstance);
            var narg = generateArguments(event.arg, context || componentInstance, ev);
            var ret = fn.apply(fn.context, narg);
            fn.context = null;
            fn = null;
            return ret;
        }
    }
};
EventHandler.getFnFromContext = function (eventInstance, componentInstance) {
    var instance = componentInstance;
    if (eventInstance.namespaces.length > 0) {
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
EventHandler.types = {
    change: [
        'checkbox',
        'radio',
        'select-one',
        'select-multiple',
        'select'
    ],
    input: [
        'text',
        'password',
        'textarea',
        'email',
        'url',
        'week',
        'time',
        'search',
        'tel',
        'range',
        'number',
        'month',
        'datetime-local',
        'date',
        'color'
    ]
};
EventHandler.getEventType = function (el) {
    var type = 'input';
    if ($inArray(el.type, EventHandler.types.input)) {
        type = 'input';
    } else if ($inArray(el.type, EventHandler.types.change)) {
        type = 'change';
    }
    return type;
};
function getTemplateValue(templateModel, instance) {
    var value = resolveValueFromContext(templateModel.prop, instance);
    if (templateModel.fns) {
        value = templateModel.fns.reduce(function (accum, filterName, idx) {
            var filterArgs = (templateModel.args[idx] || []).map(function (key) {
                return resolveValueFromContext(key, instance) || key;
            });
            filterArgs.unshift(accum);
            return filterParser(filterName, filterArgs);
        }, $isDefined(value) ? value : templateModel.prop);
    }
    return value;
}
function getValueFromModel(key) {
    if ($inArray('|', key)) {
        var filteredKey = removeFilters(key);
        return function (model) {
            return getTemplateValue(filteredKey, model);
        };
    } else {
        return function (model) {
            return resolveValueFromContext(key, model);
        };
    }
}
function compileTemplate(definition, context, cb) {
    var value = undefined;
    if (definition.templates) {
        value = definition.templates.reduce(function (accum, options) {
            return accum.replace(options.replace, evaluateExpression(options.exp, context));
        }, definition.rawValue);
    } else {
        value = evaluateExpression(definition, context);
    }
    if (!$isEqual(definition.lastCompiled, value)) {
        definition.lastCompiled = value;
        cb(value);
    }
}
function evaluateExpression(expr, context) {
    if ($isObject(expr)) {
        return getTemplateValue(expr, context);
    } else if (!$isString(expr)) {
        return expr;
    }
    return resolveValueFromContext(expr, context);
}
;
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
QueryList.prototype.add = function (element, emitEvent) {
    this._list.push(element);
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
QueryList.prototype.findByIndex = function (index) {
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
        this._list.pop().remove();
    }
    this.onChanges.destroy();
};
QueryList.prototype.reset = function (newItem, emitEvent) {
    this.destroy();
    if ($isArray(newItem)) {
        for (var i = 0; i < newItem.length; i++) {
            this.add(newItem[i], emitEvent);
        }
    }
};
QueryList.prototype.remove = function (element) {
    var index = this._list.findIndex(function (ele) {
        return ele === element;
    });
    return this.removeByIndex(index);
};
QueryList.prototype.removeByIndex = function (index) {
    var element = this._list.splice(index, 1)[0];
    this.onChanges.next({
        value: element,
        type: 'detached'
    });
    return element;
};
QueryList.prototype.onChanges = new SimpleSubject();
function HtmlParser(transpiledHTML, templates, providers) {
    var _viewContainer = [];
    this.buildView = function (parent) {
        for (var i = 0; i < transpiledHTML.length; i++) {
            var compiled = HtmlParser[transpiledHTML[i].type](transpiledHTML[i], parent, this);
            if (compiled) {
                _viewContainer.push(compiled);
            }
        }
        return HtmlParser.toFragment(_viewContainer, parent);
    };
    this.getProvider = function (provide) {
        return providers[provide];
    };
    this.pushToView = function (element) {
        _viewContainer.push(element);
    };
    this.getTemplate = function (templateRefId) {
        if (templates.hasOwnProperty(templateRefId)) {
            return templates[templateRefId];
        }
        errorBuilder('unable to find template [' + templateRefId + ']');
    };
}
;
HtmlParser.element = function (definition, parent, viewContainer) {
    var elementRef = new ElementRef(parent, copy(definition, true));
    if (definition.isc) {
        elementRef.customElements.push(viewContainer.getProvider(definition.name));
    }
    if (definition.directives) {
        for (var i = 0; i < definition.directives.length; i++) {
            definition.directives[i].providers.forEach(function (dir) {
                elementRef.customElements.push(viewContainer.getProvider(dir));
            });
        }
    }
    if (definition.attr) {
        AttributeAppender(elementRef.nativeElement, definition.attr);
    }
    if (definition.children) {
        for (var i = 0; i < definition.children.length; i++) {
            var child = HtmlParser[definition.children[i].type](definition.children[i], elementRef, viewContainer, true);
            if (child) {
                elementRef.children.add(child);
                elementRef.nativeElement.appendChild(child.nativeElement || child.nativeNode);
            }
        }
    }
    if (definition.vc) {
        elementRef.hostRef.viewQuery.add(definition.vc, elementRef);
    }
    return elementRef;
};
HtmlParser.text = function (definition, parent) {
    return new TextNodeRef(copy(definition, true), parent);
};
HtmlParser.place = function (definition, parent, viewContainer, appendToChild) {
    var hostRef = parent.hostRef;
    var templates = hostRef.getTemplateRef('place');
    if (definition.selector) {
        templates = templates.selector(definition.selector);
    }
    templates.forEach(function (template) {
        var child = HtmlParser[template.type](template, parent, viewContainer);
        if (appendToChild) {
            parent.children.add(child);
            parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
        } else {
            viewContainer.pushToView(child);
        }
    });
    return null;
};
HtmlParser.outlet = function (definition, parent, viewContainer) {
    var template = definition.template;
    if (!template && parent.hostRef) {
        template = parent.hostRef.templates[definition.templateId];
    }
    if (template) {
        var element = HtmlParser.element(template, parent, viewContainer);
        element.context = context;
        return element;
    }
    return null;
};
HtmlParser.comment = function (definition, parent) {
    return new CommentRef(definition, parent);
};
HtmlParser.toFragment = function (compiledTemplate, parent) {
    var fragment = document.createDocumentFragment();
    while (compiledTemplate.length) {
        processCompiler(compiledTemplate.shift());
    }
    function processCompiler(compiled) {
        if (!compiled) {
            return;
        }
        parent.children.add(compiled);
        fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
        HtmlParser.transverse(compiled);
    }
    return fragment;
};
HtmlParser.parseFromString = function (html) {
    return document.createRange().createContextualFragment(html);
};
HtmlParser.sce = function () {
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
HtmlParser.transverse = function (node) {
    if (node instanceof ElementRef) {
        if (node.customElements.length) {
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else if (node instanceof TextNodeRef && node.hasBinding) {
        node.render();
    }
    function proceedWithCompilation(node) {
        node.events.registerListener();
        node.children.forEach(HtmlParser.transverse);
    }
};
function getTemplateRef(templates, templateId) {
    if (!templates || !templates.hasOwnProperty(templateId)) {
        errorBuilder('No templates Defined #' + templateId);
    }
    return {
        createElement: function (parentNode) {
            var template = templates[templateId];
            return HtmlParser[template.type](template, parentNode);
        },
        getContext: function () {
            return templates[templateId].context;
        },
        forEach: function (callback) {
            return templates[templateId].forEach(callback);
        },
        querySelector: function (selector) {
            return templates[templateId].filter(_selector);
            function _selector(template) {
                switch (selector[0]) {
                case 'id':
                case 'class':
                    return template.attr && $inArray(template.attr[selector[0]], selector[1]);
                default:
                    return $isEqual(selector[1], template.name);
                }
            }
        }
    };
}
function ViewRef(elementRef) {
    this._destroyed = false;
    this.createEmbededView = function (templateRef) {
        var compiledElement = templateRef.createElement(elementRef);
        var templateContext = templateRef.getContext();
        var _componentRef = null;
        elementRef.insertAfter(compiledElement, (elementRef.children.last || elementRef).nativeElement);
        return {
            removeView: function () {
                if (templateContext && _componentRef) {
                    _componentRef.destroy();
                    templateContext = null;
                    _componentRef = null;
                }
                compiledElement.remove(true);
                compiledElement = null;
            },
            setContext: function (context) {
                if (templateContext) {
                    var localVariables = createLocalVariables(templateContext, context);
                    ComponentRef.create(compiledElement.refId, compiledElement.parent && compiledElement.parent.refId);
                    _componentRef = componentDebugContext.get(compiledElement.refId);
                    _componentRef._context = localVariables;
                }
                compiledElement.changeDetector.detectChanges();
            },
            updateContext: function (updates) {
                if (templateContext) {
                    var componentRef = componentDebugContext.get(compiledElement.refId);
                    for (var prop in updates) {
                        componentRef.updateModel(prop, updates[prop]);
                    }
                }
                compiledElement.changeDetector.detectChanges();
            }
        };
    };
    this.clearView = function () {
        elementRef.children.destroy();
    };
}
function ElementStyle(nativeElement, name, value) {
    if (name && !value && $isString(name)) {
        if (!!window.getComputedStyle) {
            var ret = window.getComputedStyle(nativeElement)[name];
            return parseInt(ret) || ret;
        }
        return;
    }
    if ($isObject(name)) {
        for (var prop in name) {
            ElementStyle.set(nativeElement, prop, name[prop]);
        }
    } else {
        ElementStyle.set.apply(null, arguments);
    }
}
;
ElementStyle.set = function (nativeElement, name, value, suffix) {
    if ($inArray(name, [
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
function TextNodeRef(definition, parent) {
    var _this = this;
    this.nativeNode = document.createTextNode(definition.ast.rawValue);
    this.type = 'text';
    this.render = function () {
        compileTemplate(definition.ast, parent.context, function (value) {
            _this.nativeNode.nodeValue = value;
        });
    };
    Object.defineProperty(this, 'hasBinding', {
        get: function () {
            return !!definition.ast.templates;
        }
    });
    if (definition.ast._) {
        parent.observer(SubscribeObservables(parent.hostRef.refId, this.render));
    }
    ;
}
TextNodeRef.prototype.remove = function () {
    this.nativeNode.remove();
    this.nativeNode = null;
};
var jeliContext = Object.create({
    buildTime: Date.now(),
    version: BuildVersion('Elizabeth', '1.0.0'),
    debug: jeliDebugger
});
function jeliDebugger(element) {
    if (element && CoreBootstrapContext.enableDebugger) {
        return componentDebugContext.get(element);
    }
    return null;
}
customStyleSheetAppender('.j-hide,.j-cloak{display:none} .j-show{display:""}', document.getElementsByTagName('head')[0]);
window.jeli = jeliContext;
function SimpleEventEmitter() {
    this._listeners = [];
    this.subscribe = function (fn) {
        if ($isFunction(fn)) {
            this._listeners.push(fn);
        }
    };
}
SimpleEventEmitter.prototype.emit = function (args) {
    this._listeners.forEach(function (fn) {
        fn(args);
    });
};
SimpleEventEmitter.prototype.destroy = function () {
    this._listeners.length = 0;
};
var _MutationObserver = function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    var _regsisteredListeners = [], observer, observerStarted = false;
    function isInPage(node) {
        return node === document.body ? false : !document.body.contains(node);
    }
    function triggerRemovedNodes() {
        _regsisteredListeners = _regsisteredListeners.filter(function (event) {
            var removed = isInPage(event.node);
            if (removed) {
                event._callback();
            }
            return !removed;
        });
    }
    function inStack(ele) {
        return _regsisteredListeners.some(function (obj) {
            return obj.node === ele;
        });
    }
    function startObserver() {
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        });
        observerStarted = true;
    }
    if (MutationObserver) {
        observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.removedNodes.length) {
                    triggerRemovedNodes();
                }
            });
        });
        if (document.body) {
            startObserver();
        }
    }
    function ObserverFacade(ele, CB) {
        if (!ele) {
            return;
        }
        if (!observerStarted) {
            startObserver();
        }
        if (!inStack(ele)) {
            _regsisteredListeners.push({
                node: ele,
                _callback: CB || noop
            });
        }
    }
    ;
    return ObserverFacade;
}();
function Observer() {
    this['[[entries]]'] = {};
    this.get = function (id) {
        return this['[[entries]]'][id];
    };
}
Observer.prototype.remove = function (id) {
    this['[[entries]]'][id].emit('$destroy', 1);
    this['[[entries]]'][id] = null;
};
Observer.prototype.add = function (id) {
    if (!this['[[entries]]'].hasOwnProperty(id)) {
        this['[[entries]]'][id] = new Subject(id);
    }
    return this.get(id);
};
Observer.prototype.notify = function (subjectId) {
    if (!$isUndefined(subjectId)) {
        var subject = this.get(subjectId);
        if (subject) {
        }
    }
};
Observer.prototype.notifyAllSubjects = function () {
    for (var subjectId in this['[[entries]]']) {
        this['[[entries]]'][subjectId].notifyAllObservers();
    }
    ;
};
function SimpleSubject() {
    var _subscribers = [];
    function subject() {
        this.subscribe = function (callback) {
            _subscribers.push(callback);
        };
    }
    subject.prototype.next = function (value) {
        _subscribers.forEach(function (callback) {
            callback(value);
        });
    };
    subject.prototype.unsubscribe = function (fn) {
        _subscribers = _subscribers.filter(function (callback) {
            return callback !== fn;
        });
    };
    subject.prototype.destroy = function () {
        _subscribers.length = 0;
    };
    return new subject();
}
function Subject() {
    this.$notifyInProgress = 0;
    this.bindingIdx = 0;
    this.retry = false;
    this._entries = [];
    this._events = {};
    this.get = function (key) {
        return this._entries.filter(function (instance) {
            return instance.binding === key;
        })[0];
    };
    this.on = function (eventName, listener) {
        if (!this._events.hasOwnProperty(eventName)) {
            this._events[eventName] = [];
        }
        this._events[eventName].push(listener);
        return this;
    };
    this.emit = function (eventName) {
        if (this._events.hasOwnProperty(eventName)) {
            var events = this._events[eventName];
            var arg = [].splice.call(arguments);
            arg.shift();
            while (events.length) {
                var fn = this._events[eventName].pop();
                fn.apply(fn, arg);
            }
        }
    };
}
Subject.prototype.unsubscribe = function (bindingIdx) {
    this._entries = this._entries.filter(function (instance) {
        return instance.binding !== bindingIdx;
    });
    if (this.$notifyInProgress) {
        this.$notifyInProgress--;
    }
};
Subject.prototype.subscribe = function (key, fn, core) {
    var self = this, bindingIdx = fn ? key : 'core_' + ++this.bindingIdx;
    this.retry = true;
    this._entries.push({
        watchKey: fn ? getValueFromModel(key) : undefined,
        handler: fn || key,
        state: false,
        core: core,
        binding: bindingIdx
    });
    return function () {
        self.unsubscribe(bindingIdx);
    };
};
Subject.prototype.observeForKey = function (key, fn, core) {
    var keyObserver = this.get(key), index = 0, unsubscribe = null;
    if (!keyObserver) {
        unsubscribe = this.subscribe(key, [fn], core);
    } else {
        index = keyObserver.length;
        keyObserver.handler.push(fn);
    }
    return function () {
        if (!index) {
            unsubscribe();
        } else {
            keyObserver.handler.splice(index, 1);
        }
    };
};
Subject.prototype.observeForCollection = function (key, fn) {
    var keyObserver = this.get(key), index = 0, unsubscribe;
    if (!keyObserver) {
        var snapshot = new IterableProfiler(), handler = function () {
                var value = snapshot.getProfiling();
                handler.watches.forEach(function (_callback) {
                    _callback(value);
                });
            };
        handler.watches = [fn];
        unsubscribe = this.subscribe(key, handler, function (collection) {
            return snapshot.hasChanges(collection);
        });
    } else {
        index = keyObserver.handler.watches.length;
        keyObserver.handler.watches.push(fn);
    }
    return function () {
        if (!keyObserver) {
            unsubscribe();
        } else {
            keyObserver.handler.watches.splice(index, 1);
        }
    };
};
Subject.prototype.notifyAllObservers = function (model, ignoreCheck) {
    if (this.$notifyInProgress) {
        this.retry = true;
        return;
    }
    var _self = this;
    function _consume(observer, idx) {
        if (!_self.$notifyInProgress) {
            return;
        }
        if (observer.watchKey) {
            if (model) {
                var value;
                if ($isFunction(observer.watchKey)) {
                    value = observer.watchKey(model);
                } else {
                    value = resolveValueFromContext(observer.watchKey, model);
                }
                if (observer.core && $isFunction(observer.core)) {
                    if (observer.core(value)) {
                        _trigger(observer.handler, value);
                    }
                } else if (ignoreCheck || _comparison(value, observer)) {
                    _trigger(observer.handler, value);
                }
            }
        } else {
            observer.handler(model);
        }
        if ($isEqual(idx + 1, _self.$notifyInProgress)) {
            _self.$notifyInProgress = 0;
            if (_self.retry) {
                _self.retry = false;
                _self.notifyAllObservers(model);
            }
        }
    }
    function _trigger(handlers, value) {
        if (typeof handlers === 'object') {
            handlers.forEach(function (cb) {
                cb(value);
            });
        } else {
            handlers(value);
        }
    }
    function _comparison(value, subject) {
        if ($isObject(value)) {
            value = $hashCode(JSON.stringify(value));
        }
        var noChanges = !$isEqual(value, subject.lastValue);
        subject.lastValue = value;
        return noChanges;
    }
    this.$notifyInProgress = this._entries.length;
    for (var i = 0; i < this.$notifyInProgress; i++) {
        _consume(this._entries[i], i);
    }
};
Subject.prototype.destroy = function (value) {
    this._entries.length = 0;
    this.emit('$destroy', value);
    this.notifyAllObservers = 0;
    this.retry = false;
    this._events = null;
};
function ComponentFactoryResolver(selector, element, callback) {
    var component, controller;
    if (!CoreBootstrapContext.compiledModule.annotations.exports.has(selector)) {
        CoreBootstrapContext.compiledModule.requiredModules.forEach(function (moduleName) {
            var _module = ModuleService._factories.get(moduleName);
            if (_module.annotations.exports.has(selector)) {
                controller = _module.annotations.exports.get(selector);
            }
        });
    } else {
        controller = CoreBootstrapContext.compiledModule.annotations.exports.get(selector);
    }
    if (controller && element) {
        component = new ElementRef(document.createElement(selector), element, {
            name: selector,
            type: 'element',
            isc: true
        });
        ElementCompiler(controller, component, function (componentInstance) {
            component.parent.children.add(component);
            callback(component, componentInstance);
        });
    } else {
        throw new Error('Unable to resolve component: ' + selector);
    }
}
function ControllerInitializer(ctrl, locals, CB) {
    locals = locals || {};
    if (ctrl.resolvers) {
        ControllerResolvers(ctrl.resolvers, locals).then(initialize);
    } else {
        initialize(locals);
    }
    function initialize(locals) {
        DependencyInjectorService.inject(ctrl, locals, function (instance) {
            try {
                CB(instance);
            } catch (e) {
                errorBuilder(e);
            }
        });
    }
}
;
function ControllerResolvers(resolvers, locals) {
    var promise = new _Promise(), promiseResolvers = [], resolversKey = Object.keys(resolvers);
    resolversKey.forEach(function (resolve) {
        promiseResolvers.push(resolvers[resolve].resolve());
    });
    promise.all(promiseResolvers).done(function (results) {
        results.forEach(function (res, idx) {
            locals[resolversKey[idx]] = res;
        });
        promise.resolve(locals);
    }).fail(promise.reject);
    return promise;
}
;
function CustomEventHandler(type, defaultFn, eventExtension) {
    if (!type) {
        type = 'on';
    }
    ;
    if (typeof eventExtension !== 'function') {
        eventExtension = function (obj) {
            return obj;
        };
    }
    var registered = +new Date(), _eventsQueue = {}, _eventsObj = function () {
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
        }, _defaultFn = defaultFn || function () {
        };
    this[type] = function (name, fn) {
        if (!_eventsQueue[name]) {
            _eventsQueue[name] = [];
        }
        _eventsQueue[name].push(fn);
        return _eventsQueue[name].length - 1;
    };
    this.$broadcast = function (name) {
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
    this.$removeOne = function (eventName, index) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            _eventsQueue[eventName].splice(1, index);
        }
    };
    this.$destroy = function (name) {
        if (name && _eventsQueue[name]) {
            delete _eventsQueue[name];
        }
    };
    this.getOne = function (eventName, idx) {
        if (_eventsQueue[eventName] && _eventsQueue[eventName].length) {
            return _eventsQueue[eventName][idx];
        }
    };
}
function filterParser(type, context) {
    var filterFn = DependencyInjectorService.get(type);
    if (!filterFn) {
        errorBuilder(type + 'Provider was not found in FilterProvider');
    }
    return filterFn.compile.apply(filterFn, context);
}
;
var InternalProviderService = new Map();
InternalProviderService.set('$promise', _Promise);
InternalProviderService.set('$defer', Defer);
InternalProviderService.set('changeDetector', ComponentRef.detectChanges);
InternalProviderService.set('EventEmitter', function () {
    return new $EventEmitter();
});
InternalProviderService.set('Event', CustomEventHandler);
InternalProviderService.set('$localStorage', window.localStorage);
InternalProviderService.set('$sessionStorage', window.sessionStorage);
InternalProviderService.set('$injector', new DependencyInjectorService());
InternalProviderService.set('$sce', HtmlParser.sce);
InternalProviderService.set('$Observer', Observer);
InternalProviderService.set('$resolve', ControllerResolvers);
InternalProviderService.set('jDebugProvider', { $disableDebugMode: false });
InternalProviderService.set('ComponentResolver', ComponentFactoryResolver);
InternalProviderService.set('dom', new HtmlDOM());
function ProviderToken(tokenName) {
    InternalProviderService.set(tokenName);
}

var ForDirective = function () {
    'use strict';
    function ForDirective(viewRef, TemplateRef) {
        this.iterable = new IterableProfiler();
        this._forIn = null;
        this.trackBy;
        this.queryList = new Map();
        this._listenerFn = function () {
            var _this = this;
            this.iterable.forEachDeleted(function (index) {
                var viewRef = _this.queryList.get(index);
                if (viewRef) {
                    viewRef.removeView();
                }
            });
            this.iterable.forEachChanges(function (key) {
                var cacheElementRef = _this.queryList.get(key);
                if (cacheElementRef) {
                    cacheElementRef.updateContext({
                        index: key,
                        count: _this._forIn.length
                    });
                }
            });
            this.iterable.forEachInserted(function (item) {
                var context = new jForRow(item, null);
                var view = viewRef.createEmbededView(TemplateRef);
                view.setContext(context);
                _this.queryList.set(item.idx, view);
            });
        };
        Object.defineProperties(this, {
            forIn: {
                set: function (value) {
                    this._forIn = value;
                }
            }
        });
    }
    ForDirective.prototype.willObserve = function () {
        var changes = this.iterable.diff(this._forIn);
        if (changes) {
            this._listenerFn();
        }
    };
    ForDirective.prototype.viewDidDestroy = function () {
        this.queryList.forEach(function (viewRef) {
            viewRef.removeView();
        });
        this._forIn = null;
        this.queryList.clear();
        this.iterable.destroy();
    };
    ForDirective.annotations = {
        selector: 'for',
        DI: {
            ViewRef: { optional: true },
            TemplateRef: { optional: true }
        },
        props: {
            forIn: {},
            trackBy: {}
        },
        module: 'CommonModule'
    };
    return ForDirective;
}();
function jForRow(context, count) {
    this.count = count;
    this.index = context.idx;
    Object.defineProperties(this, {
        $context: {
            get: function () {
                return context.value;
            }
        },
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
var IncludeDirective = function () {
    'use strict';
    function IncludeDirective(viewRef, $sce) {
        this._jInclude = undefined;
        this.compileView = function () {
            if (this._jInclude) {
                if (!this._isCompiled) {
                    if ($isFunction(this._jInclude)) {
                        template = content(elementRef);
                    } else {
                        template = HtmlParser.parseFromString(content);
                    }
                    elementRef.parent.insertAfter(template, elementRef.nativeNode);
                }
            }
        };
        this.resetIncludeTemplate = function () {
            if (this.compiledElem) {
                this.compiledElem.remove();
            }
        };
        this.process = function (value) {
            if (!value) {
                return;
            }
            this.resetIncludeTemplate();
            this.compileHtml(value);
        };
        Object.defineProperties(this, {
            include: {
                set: function () {
                    this._jInclude = value;
                    this.compileView();
                }
            }
        });
    }
    IncludeDirective.annotations = {
        selector: 'include',
        props: {
            include: {},
            template: { type: 'TemplateRef' }
        },
        DI: {
            ViewRef: { optional: true },
            $sce: { optional: true }
        },
        module: 'CommonModule'
    };
    return IncludeDirective;
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
var ModelDirective = function () {
    'use strict';
    function ModelDirective(eventBinder, parentControl, validators) {
        this.eventBinder = eventBinder;
        this.fieldControl = new FormFieldControlService();
        this._parentControl = parentControl;
        this._validators = validators;
        this.unSubscription = null;
        this.modelChange = new SimpleEventEmitter();
    }
    ModelDirective.prototype.modelToViewUpdate = function (value) {
        this.model = value;
        this.modelChange.emit(value);
    };
    ModelDirective.prototype.didInit = function () {
        setUpControl(this.fieldControl, this);
    };
    ModelDirective.prototype.viewDidDestroy = function () {
        this.unSubscription();
        this._control = null;
    };
    ModelDirective.annotations = {
        selector: 'model',
        DI: {
            VALUE_ACCESSOR: { optional: true },
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
        registry: { modelChange: { type: 'emitter' } },
        exportAs: 'jModel',
        dynamicInjectors: true,
        module: 'CommonModule'
    };
    return ModelDirective;
}();
var SelectDirective = function () {
    'use strict';
    function SelectDirective(elementRef) {
        var valueRef, valueKey, select, groupBy, labelAs;
        this.cacheValue = [];
        this.optionsLabel = null;
        this.optionsData = [];
        this.didInit = function () {
            this.createSelectOptions();
        };
        this.createSelectOptions = function () {
            var fragment = document.createDocumentFragment(), nCollection = new Map(), _this = this;
            function createCollection(value, key) {
                var nModel = {};
                nModel[valueRef] = value;
                if (valueKey) {
                    nModel[valueKey] = key;
                }
                var optValue = ModelSetterGetter(select, nModel), label = ModelSetterGetter(labelAs, nModel);
                if (_this.optionsLabel) {
                    label = _this.optionsLabel[label];
                }
                var opt = new ElementRef(document.createElement('option'), elementRef, {});
                opt.setProp('value', optValue);
                opt.text(label);
                if (groupBy) {
                    var ref = ModelSetterGetter(groupBy, nModel);
                    if (!nCollection.has(ref)) {
                        var optgroup = document.createElement('optgroup');
                        optgroup.innerText = ref;
                        nCollection.set('ref', optgroup);
                        fragment.appendChild(optgroup);
                    }
                    nCollection.get(ref).appendChild(opt);
                } else {
                    fragment.appendChild(opt.nativeElement);
                }
                elementRef.children.add(opt);
            }
            this.optionsData.forEach(createCollection);
            elementRef.html(fragment);
            nCollection = null;
        };
        Object.defineProperties(this, {
            select: {
                set: function (binding) {
                    var collectionExp = binding.match(/^\s*(.+)\s+for+\s+(.*?)\s+in\s+(.*?)\s*(\s+track\s+by\s+(.+)\s*)?$/);
                    if ($isUndefined(collectionExp[3])) {
                        errorBuilder('invalid condition received in select, expecting _item_ in iteratable or (_idx_, _item_) in iteratable');
                    }
                    var _spltValue = collectionExp[2].split(/\W/g).filter(function (key) {
                        return key.length > 1;
                    });
                    valueRef = _spltValue.pop();
                    valueKey = _spltValue.pop();
                    select = collectionExp[1];
                    groupBy;
                    labelAs;
                    if ($inArray('group by', collectionExp[1])) {
                        var gby = collectionExp[1].split(/\s+group+\s+by+\s/);
                        collectionExp[1] = gby.shift();
                        select = collectionExp[1];
                        groupBy = gby.pop();
                    }
                    if ($inArray(' as ', collectionExp[1])) {
                        var lAs = collectionExp[1].split(/\s+as+\s/);
                        labelAs = lAs.pop();
                        select = lAs.pop();
                    } else {
                        labelAs = select;
                    }
                    this.optionsData = elementRef.context.evaluate(collectionExp[3]);
                }
            }
        });
    }
    SelectDirective.annotations = {
        selector: 'select',
        DI: { ElementRef: { optional: true } },
        props: {
            select: {},
            optionsLabel: {}
        },
        module: 'CommonModule'
    };
    return SelectDirective;
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
                if ($isEqual(this._caseCount, 0)) {
                    this._compileDefaultView(true);
                }
            }
        });
    }
    SwitchDirective.prototype._compileDefaultView = function (isDefaultCase) {
        if (this.defaultViews && !$isEqual(this._isDefaultCase, isDefaultCase)) {
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
        var matched = $isEqual(this._jSwitch, caseValue);
        this._lastCaseMatched = this._lastCaseMatched || matched;
        this._lastCaseCheckIndex++;
        if ($isEqual(this._lastCaseCheckIndex, this._caseCount)) {
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
            jSwitch: {
                optional: true,
                type: 'SwitchDirective'
            }
        },
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
            jSwitch: {
                optional: true,
                type: 'SwitchDirective'
            }
        },
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
            if ($isObject(this._jClass)) {
                ElementClassList.add(elementRef.nativeElement, this._jClass);
            } else {
                ElementClassList.add(elementRef.nativeElement, this.lastAddedClass, false);
                if (this._jClass) {
                    ElementClassList.add(elementRef.nativeElement, this._jClass, true);
                    this.lastAddedClass = this._jClass;
                }
            }
        };
        Object.defineProperty(this, 'class', {
            set: function (value) {
                this._jClass = value;
                this._changeClass();
            }
        });
    }
    ClassDirective.annotations = {
        selector: 'class',
        DI: { ElementRef: { optional: true } },
        props: { class: {} },
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
    capitalizeFilter.annotations = { name: 'capitalize' };
    return capitalizeFilter;
}();
var CurrencyFilter = function () {
    'use strict';
    function CurrencyFilter($number) {
        this.compile = function (value, style) {
            if (!!window.Intl) {
                var currencyFormat = new Intl.NumberFormat(window.navigator.language, style);
                return currencyFormat.format(value);
            } else {
                return (style && style.currency) + $number(value);
            }
        };
    }
    CurrencyFilter.annotations = {
        name: 'currency',
        DI: { number: { factory: NumberFilter } }
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
    jsonFilterFn.annotations = { name: 'json' };
    return jsonFilterFn;
}();
var lowerCaseFilter = function () {
    'use strict';
    function lowerCaseFilter() {
        this.compile = function (value) {
            return value.toLowerCase();
        };
    }
    lowerCaseFilter.annotations = { name: 'lowercase' };
    return lowerCaseFilter;
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
            if (!$isArray(factoRize)) {
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
    NumberFilter.annotations = { name: 'number' };
    return NumberFilter;
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
    orderByFilterFn.annotations = { name: 'orderBy' };
    return orderByFilterFn;
}();
var upperCaseFilter = function () {
    'use strict';
    function upperCaseFilter() {
        this.compile = function (value) {
            return value.toUpperCase();
        };
    }
    upperCaseFilter.annotations = { name: 'uppercase' };
    return upperCaseFilter;
}();
var whereFilterFn = function () {
    'use strict';
    function whereFilterFn() {
        this.compile = function (model, query) {
            return new $query(model).where(query);
        };
    }
    whereFilterFn.annotations = { name: 'where' };
    return whereFilterFn;
}();
var IterableProfiler = function () {
    'use strict';
    function IterableProfiler() {
        this._destroyed = false;
        var cacheHash = [];
        var out = null;
        function generateHash(_source, out) {
            _source.forEach(function (val, key) {
                cacheHash.push(getHash(val));
                out.insert.push({
                    value: val,
                    key: key
                });
            });
        }
        function getHash(item, key) {
            if (item && typeof item === 'object') {
                item = JSON.stringify(item);
            }
            return $hashCode(item);
        }
        function _profiler(source) {
            if (source && !(source instanceof Array)) {
                throw new Error('Collection should be an array');
            }
            out = {
                deleted: [],
                insert: [],
                moved: [],
                changes: []
            };
            if ((!source || !source.length) && (!cacheHash || !cacheHash.length)) {
                return out;
            }
            if (!cacheHash.length && source.length) {
                generateHash(source, out);
                return out;
            }
            if (!source.length && cacheHash.length) {
                out.deleted = cacheHash.map(function (_, key) {
                    return key;
                });
                cacheHash.length = 0;
                return out;
            }
            var len = source.length;
            for (var inc = 0; inc < len; inc++) {
                var item = source[inc], hash = getHash(item, inc);
                if (cacheHash.hasOwnProperty(inc)) {
                    if (cacheHash[inc] !== hash) {
                        var index = cacheHash.indexOf(hash);
                        if (index > -1) {
                            cacheHash[index] = cacheHash[inc];
                        }
                        out.changes.push(inc);
                    }
                } else {
                    out.insert.push({
                        value: item,
                        key: inc
                    });
                }
                cacheHash[inc] = hash;
            }
            if (cacheHash.length > source.length) {
                out.deleted.push.apply(out.deleted, Object.keys(cacheHash).splice(source.length, cacheHash.length).map(function (key) {
                    return parseInt(key);
                }));
                cacheHash.splice(source.length, cacheHash.length);
            }
            return out;
        }
        this.forEachChanges = function (callback) {
            out.changes.forEach(callback);
        };
        this.forEachDeleted = function (callback) {
            out.deleted.forEach(callback);
        };
        this.forEachInserted = function (callback) {
            out.insert.forEach(callback);
        };
        this.forEachInsertedAsync = function (callback, afterMapCallback) {
            out.insert.map(callback).forEach(afterMapCallback);
        };
        this.forEachChangesAsync = function (callback, afterMapCallback) {
            out.changes.map(callback).forEach(afterMapCallback);
        };
        this.forEachDeletedAsync = function (callback, afterMapCallback) {
            out.deleted.map(callback).forEach(afterMapCallback);
        };
        this.diff = function (source) {
            if (this._destroyed) {
                return false;
            }
            _profiler(source);
            return (out.changes.length || out.deleted.length || out.insert.length) > 0;
        };
        this.checkDuplicateRepeater = function (repeater) {
            if (repeater && $isArray(repeater)) {
                if (noDubs(repeater).length < repeater.length) {
                    errorBuilder('Duplicate values are not allowed in repeaters. Use \'track by\' expression to specify unique keys');
                }
            }
        };
        this.destroy = function () {
            this._destroyed = true;
            cacheHash.length = 0;
            out = null;
        };
    }
    IterableProfiler.annotations = {
        name: 'iterableProfiler',
        static: true
    };
    IterableProfiler.annotations.instance = IterableProfiler;
    return IterableProfiler;
}();
var QueryFactory = function () {
    'use strict';
    function QueryFactory(data) {
        this.sortBy = function () {
            var sortArguments = arguments;
            if ($isArray(data) && $isObject(data[0])) {
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
    QueryFactory.annotations = { name: 'query' };
    return QueryFactory;
}();
;
var nativeTimeout = window.setTimeout;
var nativeClearTimeout = window.clearTimeout;
var nativeInterval = window.setInterval;
var nativeClearInterval = window.clearInterval;
window.setTimeout = function (fn, timer, detectChanges) {
    return nativeTimeout(trigger(fn, detectChanges), timer);
};
window.clearTimeout = function (timeoutID) {
    nativeClearTimeout(timeoutID);
};
window.clearInterval = function (intervalID) {
    nativeClearInterval(intervalID);
};
window.setInterval = function (fn, interval, detectChanges) {
    return nativeInterval(trigger(fn, detectChanges), interval);
};
function trigger(fn, detectChanges) {
    return function () {
        fn();
        if (detectChanges) {
            CoreBootstrapContext.detectChanges();
        }
    };
}
;
var TimeoutService = function () {
    'use strict';
    function TimeoutService() {
        return function (cb, timer) {
            var timeout = nativeTimeout(trigger(cb, true), timer);
            return function () {
                clearTimeout(timeout);
            };
        };
    }
    TimeoutService.annotations = { name: '$timeout' };
    return TimeoutService;
}();
var IntervalService = function () {
    'use strict';
    function IntervalService() {
        return function (cb, timer) {
            var interval = nativeInterval(trigger(cb, true), timer);
            return function () {
                clearInterval(interval);
            };
        };
    }
    IntervalService.annotations = { name: '$interval' };
    return IntervalService;
}();
var CommonModule = function () {
    'use strict';
    function CommonModule() {
    }
    CommonModule.annotations = {
        services: [
            NumberFilter,
            capitalizeFilter,
            jsonFilterFn,
            upperCaseFilter,
            lowerCaseFilter,
            orderByFilterFn,
            whereFilterFn,
            CurrencyFilter,
            TimeoutService,
            IntervalService,
            QueryFactory,
            IterableProfiler
        ],
        selectors: [
            ForDirective,
            IncludeDirective,
            IfDirective,
            ModelDirective,
            SelectDirective,
            ClassDirective,
            SwitchDirective,
            SwitchCaseDirective,
            SwitchDefaultDirective
        ],
        initializers: [CommonModule]
    };
    CommonModule._name = 'CommonModule';
    return CommonModule;
}();
var FormControlDirective = function () {
    'use strict';
    function FormControlDirective() {
        this.$context = null;
        Object.defineProperty(this, 'formControl', {
            set: function (formControl) {
                this.$context = formControl;
                if (!formControl) {
                    errorBuilder('FormController instance is required to use this directive');
                }
            }
        });
    }
    FormControlDirective.prototype.onSubmitHandler = function (event) {
        event.preventDefault();
    };
    FormControlDirective.prototype.viewDidDestroy = function () {
        if (this.$context) {
            this.$context.destroy();
            this.$context = null;
        }
    };
    FormControlDirective.annotations = {
        selector: 'formControl',
        props: { formControl: {} },
        registry: {
            submit: {
                type: 'event',
                value: [{
                        args: ['$event'],
                        fn: 'onSubmitHandler'
                    }]
            }
        },
        exportAs: 'formControl',
        module: 'jEliFormModule'
    };
    return FormControlDirective;
}();
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
    this._eventType = 'default';
    this._onDisableEvents = [];
    this._onControlChangeListener = function () {
    };
    this.validator = FormValidatorService(function (validatorInstance) {
        _this.error = validatorInstance.failedValidation[_this.name];
        if (!validatorInstance.validationFailed) {
            _this.valueChanges.emit(_this.value);
        }
    }, validators);
    this.valueChanges = new SimpleEventEmitter();
    this.statusChanged = new SimpleEventEmitter();
    Object.defineProperty(this, 'parent', {
        get: function () {
            return this._parent;
        }
    });
    Object.defineProperties(this, {
        untouched: {
            get: function () {
                return !this.touched;
            }
        },
        'invalid': {
            get: function () {
                return $isEqual(this.status, INVALID);
            }
        },
        'enabled': {
            get: function () {
                return !$isEqual(this.status, DISABLED);
            }
        },
        'disabled': {
            get: function () {
                return $isEqual(this.status, DISABLED);
            }
        },
        'valid': {
            get: function () {
                return $isEqual(this.status, VALID);
            }
        }
    });
}
FormControlAbstract.prototype.setParent = function (context) {
    this._parent = context;
};
FormControlAbstract.prototype._anyFieldHasStatus = function (status) {
    return this._anyControl(function (control) {
        return $isEqual(control.status, status);
    });
};
FormControlAbstract.prototype._anyControl = function () {
};
FormControlAbstract.prototype.setStatus = function () {
    if (this.disabled)
        return DISABLED;
    if (this.error)
        return INVALID;
    if (this._anyFieldHasStatus(INVALID))
        return INVALID;
    return VALID;
};
FormControlAbstract.prototype.destroy = function () {
    if (this.formFieldControls) {
        this.formFieldControls = null;
    }
    this._parent = null;
    this.valueChanges.destroy();
    this.valueChanges.destroy();
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
    if (!$isEqual(options.emitEvent, false)) {
        this.valueChanges.emit(this.value);
    }
    if (this._parent && !$isEqual(options.self, false)) {
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
    if ($isEqual(options.emitEvent, true)) {
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
    this.validator.addValidators(validator);
    this.validator();
};
FormControlAbstract.prototype._runValidators = function () {
    this.validator(this.value, this.name);
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
var FormControlService = function () {
    'use strict';
    function FormControlService(formFields, validators) {
        FormControlAbstract.call(this, validators);
        this.formFieldControls = {};
        if (!$isEmptyObject(formFields)) {
            for (var field in formFields) {
                this.addField(field, formFields[field]);
            }
        }
        this.updateValueAndStatus();
    }
    FormControlService.prototype = Object.create(FormControlAbstract.prototype);
    FormControlService.prototype.constructor = FormControlAbstract;
    FormControlService.prototype.addField = function (name, fieldControl) {
        if (fieldControl instanceof FormControlService) {
            this.formFieldControls[name] = fieldControl;
        } else {
            this.formFieldControls[name] = new FormFieldControlService(name, fieldControl);
        }
        this._setupControl(this.formFieldControls[name]);
    };
    FormControlService.prototype.hasField = function (controlName) {
        return this.formFieldControls.hasOwnProperty(controlName);
    };
    FormControlService.prototype.getField = function (controlName) {
        return this.formFieldControls[controlName] || null;
    };
    FormControlService.prototype._setupControl = function (control) {
        control.setParent(this);
        control._registerOnControlChangeListener(this._onControlChangeListener);
    };
    FormControlService.prototype.patchValue = function (values, options) {
        options = options || {};
        if ($isObject(values)) {
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
            if (!$isUndefined(values[field])) {
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
        name: 'formControlService',
        static: true
    };
    FormControlService.annotations.instance = FormControlService;
    return FormControlService;
}();
var FormFieldControlDirective = function () {
    'use strict';
    function FormFieldControlDirective(elementRef, formControl) {
        this.control = null;
        this.didInit = function () {
            this.control.attachView({
                element: elementRef,
                canSetValue: $isEqual('input', EventHandler.getEventType(elementRef.nativeElement)),
                viewRef: -1
            });
        };
        Object.defineProperty(this, 'control', {
            get: function (control) {
                if (!(control instanceof FormFieldControlService)) {
                    errorBuilder(new TypeError('Invalid field control'));
                }
                if (formControl && formControl instanceof FormControlDirective) {
                    errorBuilder('use a {:form-field} directive instead.');
                }
                this.control = control;
            }
        });
    }
    FormFieldControlDirective.annotations = {
        selector: 'fieldControl',
        DI: {
            ElementRef: { optional: true },
            formControl: {
                optional: true,
                value: 'formControl',
                isdir: true
            }
        },
        props: { control: { value: 'fieldControl' } },
        registry: {
            default: {
                type: 'event',
                value: [{
                        args: ['$event'],
                        fn: 'eventListener'
                    }]
            }
        },
        dynamicInjectors: true,
        module: 'jEliFormModule'
    };
    return FormFieldControlDirective;
}();
var FormFieldControlService = function () {
    'use strict';
    function FormFieldControlService(checker, fieldControl) {
        FormControlAbstract.call(this, fieldControl ? fieldControl.validators : null);
        this._onChangeEvents = [];
        this.name = checker;
        this._setInitialState(fieldControl);
        this.updateValueAndStatus({
            self: true,
            emitEvent: false
        });
    }
    FormFieldControlService.prototype = Object.create(FormControlAbstract.prototype);
    FormFieldControlService.prototype.constructor = FormControlAbstract;
    FormFieldControlService.prototype._setInitialState = function (state) {
        if ($isObject(state)) {
            this.value = state.value;
            state.disabled ? this.disable({ self: true }) : this.enable({ self: true });
        } else {
            this.value = state;
        }
    };
    FormFieldControlService.prototype.setValue = function (value, options) {
        options = options || {};
        this.value = value;
        if (this._onChangeEvents.length && !$isEqual(options.emitToView, false)) {
            this._onChangeEvents.length && this._onChangeEvents.forEach(function (eventChange) {
                return eventChange(value, !$isEqual(options.emitToView, false));
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
        name: 'formFieldService',
        static: true
    };
    FormFieldControlService.annotations.instance = FormFieldControlService;
    return FormFieldControlService;
}();
var FormFieldDirective = function () {
    'use strict';
    function FormFieldDirective(elementRef, parentControl) {
        Object.defineProperties(this, {
            formField: {
                set: function (formFieldName) {
                    this._fieldName = formFieldName;
                    if (parentControl) {
                        this._control = parentControl.getField(formFieldName);
                    }
                    this._setUpControl();
                }
            }
        });
    }
    FormFieldDirective.prototype._setUpControl = function () {
        this._attachView();
        this._control.registerOnChangeListener(function (value, emitToView) {
            console.log('value changed:', value, emitToView);
        });
    };
    FormFieldDirective.prototype.viewDidDestroy = function () {
        if (this._parentControl) {
            this._parentControl.removeField(this._fieldName);
            this._parentControl = null;
        }
        this._control = null;
        this._viewInstance = null;
    };
    FormFieldDirective.annotations = {
        selector: 'formField',
        DI: {
            ElementRef: { optional: true },
            parentControl: {
                optional: true,
                value: 'formControl',
                isdir: true
            }
        },
        props: { formField: {} },
        dynamicInjectors: true,
        module: 'jEliFormModule'
    };
    return FormFieldDirective;
}();
function CurrentInstance(successHandler, errorHandler) {
    this.pending = {
        count: 0,
        fields: {}
    };
    this.hasAjax = false;
    this.add = function (field, len) {
        this.pending.fields[field] = {
            count: len,
            failed: []
        };
        this.pending.count++;
    };
    this.rem = function (passed, field, type) {
        this.pending.fields[field].count--;
        if (!passed) {
            this.pending.fields[field].failed.push(type);
        }
        if (!this.pending.fields[field].count) {
            if (this.pending.fields[field].failed.length) {
                errorHandler(field, this.pending.fields[field].failed);
            }
            this.pending.count--;
        }
        if (!this.pending.count && successHandler) {
            successHandler();
        }
    };
}
CurrentInstance.prototype.clean = function () {
    this.pending = {
        count: 0,
        fields: {}
    };
    this.hasAjax = false;
    this.resolve = null;
};
CurrentInstance.prototype.registerAjax = function (AjaxInstance, Request, field, name) {
    this.hasAjax = true;
    var _this = this;
    AjaxInstance.then(function (res) {
        _this.rem((Request.onsuccess || function () {
            return true;
        })(res), field, name);
    }, function (res) {
        _this.rem((Request.onerror || function () {
            return false;
        })(res), field, name);
    });
};
var formValidationStack = Object.create({
    minlength: function (value, requiredLength) {
        if (!$isNumber(value) && !$isString(value)) {
            return false;
        }
        return String(value).length >= requiredLength;
    },
    maxlength: function (value, requiredLength) {
        if (!$isNumber(value) && !$isString(value)) {
            return false;
        }
        return String(value).length <= requiredLength;
    },
    emailvalidation: function (val) {
        var regExp = /^\w+([\.-]?\w+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regExp.test(val);
    },
    isempty: function (val, def) {
        return def === $isEmpty(val);
    },
    boolean: function (bool, val) {
        return bool === val;
    },
    domainvalidation: function (domain) {
        return /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(domain);
    },
    mediumpasswordstrength: function (passwd) {
        return new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})').test(passwd);
    },
    strongpasswordstrength: function (passwd) {
        return new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})').test(passwd);
    },
    pattern: function (value, pattern) {
        return new RegExp(pattern).test(value);
    },
    $ajax: function (val, def) {
        if (!$isObject(def) || !$isFunction(def.resolve)) {
            return false;
        }
        return def.resolve(val);
    },
    required: function (value, required) {
        if (required) {
            return !$isUndefined(value) && !$isNull(value) && !$isEmpty(value);
        }
        return !required;
    }
});
var FormValidatorService = function () {
    'use strict';
    function FormValidatorService(callback, validators) {
        var currentProcess = new CurrentInstance(trigger, ErrorHandler);
        var validationInstance = null;
        function ErrorHandler(key, validations) {
            validationInstance.failedValidation[key] = validations;
            validationInstance.validationFailed = true;
        }
        function trigger() {
            callback(validationInstance);
        }
        function setValidationInstance() {
            validationInstance = {
                requiresValidation: false,
                emptyFormFields: false,
                failedValidation: {},
                validationFailed: false
            };
        }
        function _throwErrorIfNoValidators(validatorsObj) {
            if (!$isObject(validatorsObj)) {
                throw new Error('Validators are required in other to perform validations');
            }
        }
        function _validateField(value, criteria, field) {
            var _criteria = Object.keys(criteria);
            currentProcess.add(field, _criteria.length);
            for (var i = 0; i < _criteria.length; i++) {
                var validatorName = _criteria[i];
                var passed = false, validatorFn = formValidationStack[validatorName];
                if (validatorFn) {
                    passed = validatorFn(value, criteria[validatorName]);
                } else if ($isFunction(criteria[validatorName])) {
                    passed = criteria[validatorName](value);
                }
                if ($isObject(passed) && $isEqual('$ajax', validatorName)) {
                    return currentProcess.registerAjax(passed, criteria[validatorName], field, validatorName);
                }
                currentProcess.rem(passed, field, validatorName);
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
        function formValidator(formValue, field) {
            if (!validators) {
                return trigger();
            }
            _throwErrorIfNoValidators(validators);
            currentProcess.clean();
            setValidationInstance();
            if ($isObject(formValue)) {
                _validateObjectTypes(formValue);
            } else {
                _validateField(formValue, validators, field);
            }
        }
        formValidator.addValidators = function (newValidators) {
            _throwErrorIfNoValidators(newValidators);
            if (!validators) {
                validators = newValidators;
            } else {
                validators = extend(true, validators, newValidators);
            }
        };
        setValidationInstance();
        return formValidator;
    }
    FormValidatorService.annotations = {
        name: 'formValidator',
        static: true
    };
    FormValidatorService.annotations.instance = FormValidatorService;
    return FormValidatorService;
}();
var DefaultEventBinder = function () {
    'use strict';
    function DefaultEventBinder(elementRef) {
        this.onChange = function () {
        };
        this.onDisable = function () {
        };
        this.onBlur = function () {
        };
        Object.defineProperty(this, 'element', {
            get: function () {
                return elementRef;
            }
        });
    }
    DefaultEventBinder.prototype._handleInput = function (event) {
        this.onChange(event.target.value);
    };
    DefaultEventBinder.prototype.registerOnChange = function (onChangeFn) {
        this.onChange = onChangeFn;
    };
    DefaultEventBinder.prototype.registerOnDisable = function (onDisableFn) {
        this.onDisable = onDisableFn;
    };
    DefaultEventBinder.prototype._registerOnBlur = function (onBlurFn) {
        this.onBlurFn = onBlurFn;
    };
    DefaultEventBinder.prototype.writeValue = function (value) {
        this.element.setProp('value', value, true);
    };
    DefaultEventBinder.prototype.setDisableState = function (state) {
        this.element.setProp('disabled', state);
    };
    DefaultEventBinder.annotations = {
        selector: 'input:type!=checkbox|radio:model,input:type!=checkbox|radio:formField,textarea:model,textarea:formField',
        registry: {
            input: {
                type: 'event',
                value: [{
                        args: ['$event'],
                        fn: '_handleInput'
                    }]
            },
            blur: {
                type: 'event',
                value: [{
                        args: ['$event'],
                        fn: 'onBlur'
                    }]
            }
        },
        DI: { ElementRef: { optional: true } },
        VALUE_ACCESSOR: true,
        module: 'jEliFormModule'
    };
    return DefaultEventBinder;
}();
function setUpControl(fieldControl, dir) {
    if (!fieldControl)
        errorBuilder('No field control found for ' + dir._fieldName);
    if (!dir.eventBinder)
        errorBuilder('No EventBinder defined');
    fieldControl.setValidators(dir._validators);
    dir.eventBinder.writeValue(fieldControl.value);
    setUpViewChangeEvent(fieldControl, dir);
    setupBlurEvent(fieldControl, dir);
    if (dir.eventBinder.setUpDisableState) {
        fieldControl.registerOnDisabledListener(function (state) {
            dir.eventBinder.setUpDisableState(state);
        });
    }
}
function setUpViewChangeEvent(fieldControl, dir) {
    dir.eventBinder.registerOnChange(function (value) {
        fieldControl._pendingValue = value;
        fieldControl._pendingChange = true;
        if (!$isEqual(fieldControl.eventType, 'blur')) {
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
            if ($isEqual(fieldControl.eventType, 'blur') && fieldControl._pendingChange) {
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
function getEventBinder(binders, elementRef) {
    return (binders.filter(function (config) {
        if (config.selector) {
            return config.selector.some(function (selector) {
                var isTag = $isEqual(selector.name, elementRef.tagName.toLowerCase());
                return isTag && selector.type && $inArray(elementRef.getAttribute(selector.type), selector.value) || isTag;
            });
        }
    })[0] || {}).factory;
}
var jEliFormModule = function () {
    'use strict';
    function jEliFormModule() {
    }
    jEliFormModule.annotations = {
        services: [
            FormControlService,
            FormFieldControlService,
            FormValidatorService
        ],
        selectors: [
            FormControlDirective,
            FormFieldControlDirective,
            FormFieldDirective,
            DefaultEventBinder
        ],
        initializers: [jEliFormModule]
    };
    jEliFormModule._name = 'jEliFormModule';
    return jEliFormModule;
}();
function serialize(obj) {
    if (!obj)
        return;
    var param = [];
    function buildParams(prefix, dn) {
        if ($isArray(dn)) {
            dn.forEach(function (n, i) {
                if (/\[\]$/.test(prefix)) {
                    add(prefix, n);
                } else {
                    buildParams(prefix + '[' + ($isObject(n) ? prefix : '') + ']', n);
                }
            });
        } else if ($isObject(dn)) {
            for (var name in dn) {
                buildParams(prefix + '[' + name + ']', dn[name]);
            }
        } else {
            add(prefix, dn);
        }
    }
    function add(key, value) {
        value = $isFunction(value) ? value() : $isEmpty(value) ? '' : value;
        param[param.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
    }
    ;
    if ($isArray(obj)) {
        obj.forEach(function (n, i) {
            add(i, n);
        });
    } else {
        for (var name in obj) {
            buildParams(name, obj[name]);
        }
    }
    return param.join('&').replace(/%20/g, '+');
}
function unSerialize(par) {
    var ret = {};
    if (!$isUndefined(par) && $isString(par)) {
        par.split('&').forEach(function (val, key) {
            if (val) {
                var splitPairs = val.split('=');
                ret[splitPairs[0]] = jSonParser(splitPairs[1]);
            }
        });
    }
    return ret;
}
function makeUID(e) {
    var h = '';
    var f = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var g = 0; g < e; g++) {
        h += f.charAt(Math.floor(Math.random() * f.length));
    }
    return h;
}
function $cookie(name, value, options) {
    if (typeof value != 'undefined') {
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
    } else {
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
}
;
function AjaxSetup(interceptor, changeDetection, support) {
    var defaultOptions = {
            url: '',
            type: 'GET',
            processData: true,
            contentType: true,
            headers: { 'Accept': 'text/javascript, application/json, text/html, application/xml, text/xml, */*' },
            asynchronous: true,
            data: '',
            xhr: null,
            getResponseHeader: null
        }, unsafeHeaders = {
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
    support = support || [
        'put',
        'get',
        'post',
        'request',
        'head',
        'patch',
        'delete'
    ];
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
        if ($isSupport.DOMParser) {
            return new DOMParser().parseFromString(text, 'text/xml');
        } else {
            var xml = new ActiveXObject('Microsoft.XMLDOM');
            xml.async = 'false';
            xml.loadXML(text);
            return xml;
        }
    }
    support.forEach(generateOptionalHTTP);
    function generateOptionalHTTP(type) {
        _Ajax[type] = function (url, data, headers) {
            var options = {};
            options.type = type;
            options.data = data;
            options.headers = headers || {};
            return _Ajax(url, options);
        };
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
    return _Ajax;
    function _Ajax(url, options) {
        var xhrPromise = new Defer(changeDetection), response = {}, chain = {};
        if (typeof options === 'undefined' && $isObject(url)) {
            options = url;
        }
        options = extend(true, defaultOptions, options);
        options.url = options.url || url;
        options.type = options.type.toLowerCase();
        var request = options.xhr || xhr();
        if (interceptor) {
            options = interceptor.resolveInterceptor('request', options);
            if (!options) {
                throw new Error('$HTTP: Interceptor should return a value');
            }
            if (changeDetection) {
                changeDetection();
            }
        }
        function respondToReadyState(readyState) {
            var data;
            if (request.readyState == 4) {
                response.contentType = options.dataType || request.mimeType || request.getResponseHeader('content-type') || '';
                response.status = request.status;
                chain.readyState = request.readyState;
                response.path = options.url;
                if (request.responseText) {
                    if (/json/.test(response.contentType)) {
                        data = parseJSON(request.responseText, true);
                    } else if (/xml/.test(response.contentType)) {
                        data = parseXML(request.responseText);
                    } else {
                        data = request.responseText || '';
                        if ($isJsonString(request.responseText)) {
                            data = parseJSON(data, false);
                        }
                    }
                }
                response.success = request.status >= 200 && request.status < 300 || request.status == 304 || request.status == 0 && request.responseText;
                response.data = data;
                if (interceptor) {
                    interceptor.resolveInterceptor(response.success ? 'responseSuccess' : 'responseError', response);
                }
                if (options.getResponseHeader) {
                    options.getResponseHeader.apply(options.getResponseHeader, [getResponseHeaders]);
                }
                if (options.callback) {
                    return options.callback(response, request);
                }
                if (response.success) {
                    xhrPromise.resolve(data);
                } else {
                    xhrPromise.reject(response);
                }
            }
        }
        function getResponseHeaders(name) {
            if (!$isObject(name)) {
                return request.getResponseHeader(name);
            } else {
                for (var i in name) {
                    name[i] = request.getResponseHeader(name[i]);
                }
                return name;
            }
        }
        function setHeaders() {
            for (var name in options.headers) {
                if (unsafeHeaders[name] || /^(Sec-|Proxy-)/.test(name)) {
                    throw new Error('Refused to set unsafe header "' + name + '"');
                }
                request.setRequestHeader(name, options.headers[name]);
            }
        }
        if (options.success) {
            xhrPromise.done(options.success);
        }
        if (options.error) {
            xhrPromise.fail(options.error);
        }
        function processRequest() {
            if (options.xhrFields && options.xhrFields.withCredentials) {
                request.withCredentials = true;
            }
            if (options.contentType && !options.headers['Content-Type']) {
                options.headers['Content-Type'] = 'application/json';
            }
            if (!$isString(options.data)) {
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
            request.onreadystatechange = respondToReadyState;
            request.open(options.type, options.url, options.asynchronous);
            if (options.beforeSend && $isFunction(options.beforeSend)) {
                options.beforeSend.apply(options.beforeSend, [request]);
            }
            setHeaders();
            var body = null;
            if ($inArray(options.type, [
                    'post',
                    'put',
                    'delete'
                ])) {
                body = options.data;
            }
            try {
                request.send(body);
            } catch (e) {
                if (options.error) {
                    options.error();
                }
            }
        }
        if (options.processData) {
            processRequest();
        }
        sendRequest();
        xhrPromise.then = function (done, fail) {
            this.done(done);
            this.fail(fail);
            return this;
        };
        return xhrPromise;
    }
}
var RegisterInterceptors = function () {
    'use strict';
    function RegisterInterceptors(httpInterceptors) {
        httpInterceptors.register();
    }
    RegisterInterceptors.annotations = { DI: { __httpInterceptor__: { factory: HttpInterceptor } } };
    return RegisterInterceptors;
}();
var HttpInterceptor = function () {
    'use strict';
    function HttpInterceptor(interceptors) {
        this.resolveInterceptor = function (state, options) {
            if (interceptors.length) {
                interceptors.forEach(function (interceptorInstance) {
                    options = interceptorInstance[state].apply(interceptorInstance, [options]);
                });
            }
            return options;
        };
        this.register = function () {
            interceptors = interceptors.map(function (interceptorFactory) {
                if ($isString(interceptorFactory)) {
                    return DependencyInjectorService.get(interceptorFactory);
                } else {
                    return DependencyInjectorService.inject(interceptorFactory);
                }
            });
        };
    }
    HttpInterceptor.annotations = {
        name: '__httpInterceptor__',
        DI: {
            interceptors: {
                optional: true,
                type: 'Token?'
            }
        }
    };
    return HttpInterceptor;
}();
var HttpService = function () {
    'use strict';
    function HttpService(interceptor, changeDetector) {
        return AjaxSetup(interceptor, changeDetector);
    }
    HttpService.annotations = {
        name: '$http',
        DI: {
            __httpInterceptor__: { factory: HttpInterceptor },
            changeDetector: { optional: true }
        }
    };
    return HttpService;
}();
var INTERCEPTORS = new ProviderToken('interceptors');
var jEliHttpModule = function () {
    'use strict';
    function jEliHttpModule() {
    }
    jEliHttpModule.annotations = {
        services: [
            HttpInterceptor,
            HttpService
        ],
        initializers: [
            RegisterInterceptors,
            jEliHttpModule
        ]
    };
    jEliHttpModule._name = 'jEliHttpModule';
    return jEliHttpModule;
}();
/** compiled TestPlaceElement **/
var TestPlaceElement = (function(){
"use strict";

function TestPlaceElement(elementRef) {
}

TestPlaceElement.annotations = {
   selector: 'test-place',
   DI: {
      ElementRef: {
         optional: true
      }
   },
   module: 'AppModule'
};

TestPlaceElement.view = /** jeli template **/ new HtmlParser([{"type":"place","name":"#fragment","index":0,"isc":false}], {}, {}) /** template loader **/;
return TestPlaceElement;
})();

/** compiled ItemList **/
var ItemList = (function(){
"use strict";

function ItemList() {
}

ItemList.annotations = {
   selector: 'item-list',
   props: {
      value: {}
   },
   module: 'AppModule'
};

ItemList.view = /** jeli template **/ new HtmlParser([{"type":"place","name":"#fragment","index":0,"isc":false}], {}, {}) /** template loader **/;
return ItemList;
})();

/** compiled AppRootElement **/
var AppRootElement = (function(){
"use strict";

function AppRootElement(formControlService) {
    this.testForm = new formControlService({
        radio: {
            value: 1,
            required: true
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
                minlength: 6,
                maxlength: 100
            }
        },
        checkbox: {
            value: true,
            validators: { required: true }
        },
        select: {
            value: 'select_2',
            validators: { required: true }
        },
        file: { validators: { required: true } },
        range: {
            value: 0,
            validators: { maxlength: 90 }
        },
        number: { value: 500 }
    });
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
        this.generateMock(1);
        this.testForm.patchValue({ number: 10 });
        this.testForm.addField('personalInfo', new formControlService({
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
}
AppRootElement.prototype.addTodo = function () {
    if (this.todoDescription) {
        this.todos.push({
            description: this.todoDescription,
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
AppRootElement.prototype.markAsRemoved = function (done) {
    if (done) {
        this.removeItemCount++;
    } else {
        this.removeItemCount--;
    }
};
AppRootElement.prototype.generateMock = function (total) {
    var data = [];
    for (var i = 0; i < total; i++) {
        data.push({
            description: 'Test_From_' + this.counter++,
            done: false
        });
    }
    this.todos = data;
    data = null;
};

AppRootElement.annotations = {
   selector: 'app-root',
   DI: {
      formControlService: {
         factory: FormControlService
      }
   },
   viewChild: {
      testPlace: {
         value: '#testPlace'
      },
      model: {
         value: 'model',
         isdir: true
      }
   },
   module: 'AppModule'
};

AppRootElement.view = /** jeli template **/ new HtmlParser([{"type":"element","name":"nav","index":0,"isc":false,"attr":{"class":"navbar navbar-inverse navbar-static-top"},"children":[{"type":"element","name":"div","index":0,"isc":false,"attr":{"class":"container-fluid"},"children":[{"type":"element","name":"div","index":0,"isc":false,"attr":{"class":"navbar-header"},"children":[{"type":"element","name":"a","index":0,"isc":false,"attr":{"class":"navbar-brand","href":"#"},"children":[{"type":"text","ast":{"rawValue":" Todo Application "}}]}]}]}]},{"type":"element","name":"div","index":4,"isc":false,"children":[{"type":"element","name":"h5","index":0,"isc":false,"children":[{"type":"text","ast":{"rawValue":"Attr-Selected"}}]},{"type":"element","name":"select","index":1,"isc":false,"children":[{"type":"element","name":"#comment","text":"for","directives":[{"name":"for","providers":["ForDirective"]}],"templates":{"for":{"type":"element","name":"option","index":0,"isc":false,"context":{"i":"$context"},"attr":{"for":null},"attrObservers":{"selected":{"prop":"i===1","once":true}},"children":[{"type":"text","ast":{"rawValue":"${0}","_":1,"templates":[{"replace":"${0}","exp":{"prop":"i"}}]}}]}},"props":{"forIn":[0,1,2,4]}}]}]},{"type":"element","name":"test-place","index":6,"isc":true,"refId":"testPlace","children":[],"templates":{"place":[{"type":"element","name":"input","index":0,"isc":false,"attr":{"type":"checkbox","model":null,"checked":true},"directives":[{"name":"model","checker":"test","providers":["ModelDirective"]}]},{"type":"element","name":"div","index":1,"isc":false,"children":[{"type":"element","name":"h5","index":0,"isc":false,"children":[{"type":"text","ast":{"rawValue":"Attr-Value"}}]},{"type":"element","name":"input","index":1,"isc":false,"attr":{"type":"text"},"attrObservers":{"value":{"prop":"test"},"readonly":{"prop":true,"once":true}}}]},{"type":"element","name":"h5","index":2,"isc":false,"children":[{"type":"text","ast":{"rawValue":"Attr-Style (background & display)"}}]},{"type":"element","name":"div","index":3,"isc":false,"attrObservers":{"style":{"prop":{"display":{"type":"ite","test":"test","cons":"block","alt":"none"},"background":"#000"}}},"children":[{"type":"text","ast":{"rawValue":"I am a test"}}]},{"type":"element","name":"div","index":4,"isc":false,"children":[{"type":"element","name":"h5","index":0,"isc":false,"children":[{"type":"text","ast":{"rawValue":"Attr-innerHTML"}}]},{"type":"element","name":"textarea","index":1,"isc":false,"directives":[{"name":"model","checker":"html","providers":["ModelDirective","DefaultEventBinder"]}],"attr":{"model":null}},{"type":"element","name":"div","index":2,"isc":false,"attrObservers":{"innerhtml":{"prop":"html"}}}]},{"type":"element","name":"div","index":5,"isc":false,"directives":[{"name":"switch","providers":["SwitchDirective"]}],"props":{"switch":"test"},"attr":{"switch":null},"children":[{"type":"element","name":"#comment","text":"switchCase","directives":[{"name":"switchCase","providers":["SwitchCaseDirective"]}],"templates":{"switchCase":{"type":"element","name":"h5","index":0,"isc":false,"attr":{"switchCase":null},"children":[{"type":"text","ast":{"rawValue":"I am ${0} case","_":1,"templates":[{"replace":"${0}","exp":{"prop":"test"}}]}}]}},"props":{"switchCase":{"prop":true}}},{"type":"element","name":"#comment","text":"switchDefault","directives":[{"name":"switchDefault","providers":["SwitchDefaultDirective"]}],"templates":{"switchDefault":{"type":"element","name":"h4","index":1,"isc":false,"attr":{"switchDefault":null},"children":[{"type":"text","ast":{"rawValue":"I am default switch element"}}]}}}]}]}},{"type":"element","name":"input","index":8,"isc":false,"attr":{"type":"checkbox","model":null},"directives":[{"name":"model","checker":"test","providers":["ModelDirective"]}],"attrObservers":{"checked":{"prop":true,"once":true}}},{"type":"element","name":"#comment","text":"if","directives":[{"name":"if","providers":["IfDirective"]}],"templates":{"if":{"type":"element","name":"div","index":10,"isc":false,"attr":{"if":null},"children":[{"type":"text","ast":{"rawValue":"I am Test Condition"}}]},"ifElse":{"refId":"fallback","type":"element","name":"#fragment","index":12,"isc":false,"children":[{"type":"element","name":"#comment","text":"for","directives":[{"name":"for","providers":["ForDirective"]}],"templates":{"for":{"type":"element","name":"div","index":0,"isc":false,"context":{"i":"$context"},"attr":{"for":null},"children":[{"type":"text","ast":{"rawValue":"Testing_${0}","_":1,"templates":[{"replace":"${0}","exp":{"prop":"i"}}]}}]}},"props":{"forIn":[0,1,2,3]}}]}},"props":{"if":{"prop":"test"},"ifElse":"fallback"}},{"type":"element","name":"div","index":14,"isc":false,"directives":[{"name":"class","providers":["ClassDirective"]}],"props":{"class":"test?'visible':'hidden'"},"attr":{"class":null},"children":[{"type":"text","ast":{"rawValue":"Class test"}}]}], {}, {
   'ForDirective': ForDirective,
   'test-place': TestPlaceElement,
   'ModelDirective': ModelDirective,
   'DefaultEventBinder': DefaultEventBinder,
   'SwitchDirective': SwitchDirective,
   'SwitchCaseDirective': SwitchCaseDirective,
   'SwitchDefaultDirective': SwitchDefaultDirective,
   'IfDirective': IfDirective,
   'ClassDirective': ClassDirective
}) /** template loader **/;
return AppRootElement;
})();

/** compiled AppModule **/
var AppModule = (function(){
"use strict";

function AppModule() {
    console.log('triggered');
}

AppModule.annotations = {
   requiredModules: [
      CommonModule,
      jEliFormModule,
      jEliHttpModule
   ],
   rootElement: AppRootElement,
   selectors: [
      AppRootElement,
      TestPlaceElement,
      ItemList
   ],
   initializers: [
      AppModule
   ]
};

AppModule._name = 'AppModule';
return AppModule;
})();

bootStrapApplication(AppModule);
})();
})();