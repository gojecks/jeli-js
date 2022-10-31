var jeliContext = Object.create({
    buildTime: Date.now(),
    version: __buildOptions.version,
    debug: jeliDebugger
});

/**
 * 
 * @param {*} b 
 * @param {*} c 
 * @returns ElementRef | NULL
 */
function jeliQuerySelector(b, c) {
    if ((b.nativeElement || b.nativeNode) === c) {
        return b;
    } else if (b.children) {
        for (var e of b.children._list) {
            const f = jeliQuerySelector(e, c);
            if (f) return f;
        }
    } else {
        return null;
    }
};

/**
 * 
 * @param {*} element 
 */
function jeliDebugger(element) {
    if (element && CoreBootstrapContext.enableDebugger) {
        return element[$elementContext];
    }

    return null;
}
/**
 * expose jeli context for debugging
 */
global.jeli = jeliContext;