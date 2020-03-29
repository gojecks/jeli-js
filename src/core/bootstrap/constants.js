/**
 * JELI LOCAL VARIABLES
 */
var $eUID = 1;
var CoreBootstrapContext = ({
    bootStrapComponent: null,
    compiledModule: null,
    $isCompiled: false,
    $isAfterBootStrap: false,
    enableDebugger: true
});
/**
 * Variable for holding Component Context
 */
var componentDebugContext = new Map();
var CoreModuleFactory = new Map();

/**
 * returns random ID
 */
function getUID() {
    return 'jeli:' + +new Date + ":" + $eUID++;
}

/**
 * 
 * @param {*} name 
 * @param {*} version 
 */
function BuildVersion(name, version) {
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