var $0 = null,
    $$0 = null;
var noop = {
    get: function() {
        return {}
    },
    set: function(name, value) {
        this[name] = value;
    }
};

var OBJ_REF = '$object:ref',
    eliBindedClass = 'j-binded';
// jEli WatchBinding holders
var $watchBlockList = new watchBinding(),
    $directivesProviderWatchList = new watchBinding(),
    $modelObserverList = new watchBinding(),
    $modelChildReferenceList = new watchBinding(),
    $attrWatchList = new watchBinding(),
    $modelMapping = new watchBinding(),
    module = { $get: function(name) { return this[name] || errorBuilder('Module ' + name + ' was not found'); } },
    $provider = { $isExternalLoader: { status: false }, jDebugProvider: { $disableDebugMode: false } },
    $compileTracker = { lastCompiledWith: null, compiledModule: null, injectors: new watchBinding() },
    domElementProvider = {};

// jEli Constant
var COMMENT_NODE = 8,
    TEXT_NODE = 3,
    $isCompiled = false,
    $isDomLoaded = false,
    $isAfterBootStrap = false,
    _defaultTemplateExp = /\{\%(.*?)\%\}/g,
    $eUID = 0;