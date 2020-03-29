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
/*jEli css styleSheet
Appended to the head of the HTML*/
customStyleSheetAppender('.j-hide,.j-cloak{display:none} .j-show{display:""}', document.getElementsByTagName('head')[0]);
window.jeli = jeliContext;