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
 * returns random ID
 */
function getUID() {
    return 'jeli:' + +new Date + ":" + $eUID++;
}