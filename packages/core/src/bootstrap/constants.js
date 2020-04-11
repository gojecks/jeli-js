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