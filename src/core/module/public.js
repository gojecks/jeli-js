/**
 * 
 * @param {*} fn 
 * @param {*} options 
 */
function JModule(name, options) {
    var _module = ModuleService.get(name);
    if (!_module && !options) {
        errorBuilder('Module ' + name + ' was not found')
    }

    if ($isCompiled) {
        return null;
    }

    if (!_module) {
        _module = new Function();
        _module.moduleName = name;
        _module.options = options;
        ModuleService['[[entries]]'].push(_module);

        // process Options
        ModuleService.delimiterProcessor(options);
    }

    return new ModuleService(_module);
}
/**
 * Attach static methods
 * dom
 * noop
 * $extend
 * $isUndefined
 * $isDefined
 * $isObject
 * $isString
 * $isNumber
 * $isArray
 * $inArray
 * $isFunction
 * $create
 * $copy
 * $isEmpty
 * $isEqual
 * $initializer
 * $serialize
 * $unSerialize
 * $externalLoader
 * $stringToObject
 * $isJsonString
 * $isNull
 * $jDB
 * version
 * bind
 * forEach
 * buildTime
 */
JModule.app = {
    bootstrapWith: BootStrapApplication,
    externalLoader: new loadExternalScript
};

JModule.noop = function() {
    return noop;
};

JModule.$extend = extend;
JModule.$isUndefined = $isUndefined;
JModule.$isDefined = $isDefined;
JModule.$isObject = $isObject;
JModule.$isString = $isString;
JModule.$isNumber = $isNumber;
JModule.$isBoolean = $isBoolean;
JModule.$isEmptyObject = $isEmptyObject;
JModule.$isDouble = $isDouble;
JModule.$isFloat = $isFloat;
JModule.$isArray = $isArray;
JModule.$inArray = $inArray;
JModule.$isFunction = $isFunction;
JModule.$copy = copy;
JModule.$copyFrom = copyFrom;
JModule.$isEmpty = $isEmpty;
JModule.$isEqual = $isEqual;
JModule.$stringToObject = stringToObject;
JModule.$isJsonString = $isJsonString;
JModule.$isNull = $isNull;
JModule.version = BuildVersion("Elizabeth", "1.0.0");
JModule.buildTime = Date.now();
/*jEli css styleSheet
Appended to the head of the HTML*/
customStyleSheetAppender('.j-hide,.j-cloak{display:none} .j-show{display:""}', document.getElementsByTagName('head')[0]);
window.jeli = JModule;
/**
 * register Listener
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', BootStrapApplication, false);
} else {
    BootStrapApplication();
}