var jeliContext = Object.create({
    buildTime: Date.now(),
    version: BuildVersion("Elizabeth", "1.0.0"),
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