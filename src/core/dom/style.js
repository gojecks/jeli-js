/**
 * 
 * @param {*} nativeElement 
 * @param {*} name 
 * @param {*} value 
 * @param {*} suffix
 */
function ElementStyle(nativeElement, name, value) {
    if ((name && !value) && $isString(name)) {
        if (!!(window.getComputedStyle)) {
            var ret = window.getComputedStyle(nativeElement)[name];
            return parseInt(ret) || ret;
        }

        return;
    }

    if ($isObject(name)) {
        for (var prop in name) {
            //set the style required
            ElementStyle.set(nativeElement, prop, name[prop]);
        }
    } else {
        ElementStyle.set.apply(null, arguments);
    }
};

/**
 * 
 * @param {*} nativeElement 
 * @param {*} name 
 * @param {*} value 
 * @param {*} suffix
 */
ElementStyle.set = function(nativeElement, name, value, suffix) {
    if ($inArray(name, ['width', 'height', 'top', 'bottom', 'left', 'right']) && typeof value === 'number') {
        value += suffix || 'px';
    }

    nativeElement.style[name] = value;
};