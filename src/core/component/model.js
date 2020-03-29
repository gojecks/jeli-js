// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.

/**
 * 
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};


/**
 * 
 * @param {*} fnData 
 */
function getFunctionsFromString(fnData) {
    return fnData.replace(/\W(;)/g, function(idx, key) {
        return ((idx.length > 1) ? idx.charAt(0) + '|' : '|');
    }).split('|');
}

/*Get and Set the value of a given key to a model*/
/**
 * 
 * @param {*} key 
 * @param {*} model 
 * @param {*} value 
 */
function setModelValue(key, model, value) {
    value = $isString(value) ? removeSingleQuote(value) : value;
    deepArrayChecker(true, $removeWhiteSpace(key), model, value);
    return value;
}