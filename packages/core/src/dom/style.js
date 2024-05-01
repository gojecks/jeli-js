import { isobject, isstring } from '@jeli/helpers';
/**
 * 
 * @param {*} nativeElement 
 * @param {*} name 
 * @param {*} value 
 * @param {*} suffix
 */
export function ElementStyle(nativeElement, name, value) {
    var isObjectName = isobject(name);
    if ((name && !value) && !isObjectName) {
        if (!!(window.getComputedStyle)) {
            var ret = window.getComputedStyle(nativeElement)[name];
            return parseInt(ret) || ret;
        }

        return null;
    }

    if (isObjectName) {
        for (var prop in name) {
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
   value = ElementStyle.fixValue(value, name, suffix);
    nativeElement.style[name] = value;
};

ElementStyle.props = {
    WithSuffix: 'width|height|top|bottom|left|right|marginTop|marginBottom|marginLeft|marginRight|paddingRight|paddingLeft|paddingTop|paddingBottom|fontSize'.split('|'),
    background: 'backgroundImage'.split('|')
};

ElementStyle.fixValue = function(value, name, suffix) {
    if (typeof value == 'number' && ElementStyle.props.WithSuffix.includes(name)) {
        value += suffix || 'px';
    } else if (value && ElementStyle.props.background.includes(name) && value.includes('.') && !value.startsWith('url')) {
        value = 'url(' + value + ')';
    }

    return value;
}