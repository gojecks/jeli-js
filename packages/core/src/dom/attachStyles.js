import { isstring } from 'js.helpers/helpers';
/**
 * 
 * @param {*} style 
 * @param {*} ele 
 */
function AttachComponentStyles(style, ele) {
    if (style && ele) {
        if (isstring(style)) {
            return customStyleSheetAppender(style, ele[0]);
        } else {
            var externalLoader = new loadExternalScript(ele[0]);
            return externalLoader.css(style);
        }
    }
}