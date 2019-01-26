/**
 * JELI LOCAL VARIABLES
 */
var OBJ_REF = '$object:ref',
    eliBindedClass = 'j-binded',
    // jEli WatchBinding holders
    $compileTracker = { bootStrapComponent: null, compiledModule: null },
    // jEli Constant
    COMMENT_NODE = 8,
    TEXT_NODE = 3,
    $isCompiled = $isDomLoaded = $isAfterBootStrap = false,
    _defaultTemplateExp = /\{\%(.*?)\%\}/g,
    attrExpr = /\{(.*?)\}/,
    $eUID = 1,
    $mUID = 1,
    getUID = function() {
        return 'jeli:' + +new Date + ":" + $eUID++;
    },
    domElementProvider = {},
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