/**
 * 
 * @param {*} fn 
 * @param {*} options 
 */
function JModule(name, options) {
    var _module = ModuleService._factories.has(name);
    if (!_module && !options) {
        errorBuilder('Module ' + name + ' was not found')
    }

    if ($compileTracker.$isCompiled) {
        return null;
    }

    if (!_module) {
        _module = new Function();
        _module._factories = new Map();
        _module.moduleName = name;
        _module.options = options;
        options.requiredModules = options.requiredModules || [];
        options.exports = options.exports || [];
        ModuleService._factories.set(name, _module);

        // process Options
        ModuleService.delimiterProcessor(options);
    }

    return new ModuleService(ModuleService._factories.get(name));
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
JModule.$unSerialize = unSerialize;
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
document.addEventListener('DOMContentLoaded', BootStrapApplication.onDocumentReadyFn, false);