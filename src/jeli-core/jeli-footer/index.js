var __a = {},
    objectCreate = (function() {
        function Temp() {}

        var hasOwn = Object.prototype.hasOwnProperty;
        return function(O) {
            if (Object.create) {
                return Object.create(O);
            }
            if (typeof O != 'object') {
                throw TypeError('Object prototype may only be an Object or null');
            }

            Temp.prototype = O;
            var obj = new Temp();
            Temp.prototype = null;

            if (arguments.length > 1) {
                var Properties = Object(arguments[1]);
                for (var prop in Properties) {
                    if (hasOwn.call(Properties, prop)) {
                        obj[prop] = Properties[prop];
                    }
                }
            }
            return obj;
        };
    })(),
    BuildVersion = function(name, version) {
        var vSplit = version.split('.'),
            matchPhase = { dot: 0, major: 1, minor: 2 };

        for (var n in matchPhase) {
            if (vSplit[matchPhase[n]]) {
                matchPhase[n] = parseInt(vSplit[matchPhase[n]]);
            } else {
                matchPhase[n] = 0;
            }
        }

        matchPhase['name'] = name;

        return matchPhase;
    };
/*

  jEli Public Apis
  jModule
  dom
  noop
  $extend
  $isUndefined
  $isDefined
  $isObject
  $isString
  $isNumber
  $isArray
  $inArray
  $isFunction
  $create
  $copy
  $isEmpty
  $isEqual
  $initializer
  $parseJSON
  $parseXML
  $serialize
  $unSerialize
  $externalLoader
  $stringToObject
  $isJsonString
  $isNull
  $jDB
  version
  bind
  forEach
  buildTime
*/
__a = {
    jModule: $jModule,
    dom: (window.jQuery) ? jQuery : element,
    noop: function() { return noop; },
    $extend: extend,
    $isUndefined: $isUndefined,
    $isDefined: $isDefined,
    $isObject: $isObject,
    $isString: $isString,
    $isNumber: $isNumber,
    $isBoolean: $isBoolean,
    $isEmptyObject: $isEmptyObject,
    $isDouble: $isDouble,
    $isFloat: $isFloat,
    $isArray: $isArray,
    $inArray: $inArray,
    $isFunction: $isFunction,
    $create: objectCreate,
    $copy: copy,
    $copyFrom: copyFrom,
    $isEmpty: $isEmpty,
    $isEqual: $isEqual,
    $initializer: $eliInitializer,
    $parseJSON: parseJSON,
    $parseXML: parseXML,
    $serialize: serialize,
    $unSerialize: unSerialize,
    $externalLoader: new loadExternalScript,
    $stringToObject: stringToObject,
    $isJsonString: $isJsonString,
    $isNull: $isNull,
    jdb: jEliDB,
    version: BuildVersion("Elizabeth", "1.0.0"),
    bind: binding,
    forEach: domElementProvider.each,
    buildTime: Date.now()
};

if ($isSupport.sqlite) {
    __a.jSqlite = sqliteStorage;
}

window.jEli = __a;
element(document).ready(function() {
    $isDomLoaded = true;
    var elementToBootStrap = element('[j-module]');
    if (!$isUndefined(elementToBootStrap) && elementToBootStrap.length) {
        var moduleName = [hasAnyAttribute(elementToBootStrap[0], ['j-module', ':app'])];
        $eliInitializer(elementToBootStrap, moduleName);
    }
});

/*jEli css styleSheet
Appended to the head of the HTML*/
customStyleSheetAppender('.j-hide,.j-cloak{display:none} .j-show{display:""}', document.getElementsByTagName('head')[0]);