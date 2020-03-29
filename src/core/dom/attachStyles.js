/**
 * 
 * @param {*} style 
 * @param {*} ele 
 */
function AttachComponentStyles(style, ele) {
    if (style && ele) {
        if ($isString(style)) {
            return customStyleSheetAppender(style, ele[0]);
        } else {
            var externalLoader = new loadExternalScript(ele[0]);
            return externalLoader.css(style);
        }
    }
}