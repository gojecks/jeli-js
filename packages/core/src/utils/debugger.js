var jeliContext = Object.create({
    buildTime: Date.now(),
    version: __buildOptions.version,
    debug: jeliDebugger
});

/**
 * 
 * @param {*} element 
 */
function jeliDebugger(element) {
    if (element && CoreBootstrapContext.enableDebugger) {
        return CoreBootstrapContext.bootStrapComponent;
        // return false; // componentDebugContext.get(element.getAttribute('jeli-ref'));
    }

    return null;
}
/**
 * expose jeli context for debugging
 */
global.jeli = jeliContext;