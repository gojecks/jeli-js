var jeliContext = Object.create({
    buildTime: Date.now(),
    version: "%VERSION%",
    debug: jeliDebugger
});

/**
 * 
 * @param {*} element 
 */
function jeliDebugger(element) {
    if (element && CoreBootstrapContext.enableDebugger) {
        return componentDebugContext.get(element);
    }

    return null;
}
/**
 * expose jeli context for debugging
 */
global.jeli = jeliContext;