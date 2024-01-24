import { isobject, isstring, inarray } from '@jeli/helpers';
/**
 * 
 * @param {*} nativeElement 
 * @param {*} name 
 * @param {*} value 
 * @param {*} suffix
 */
export function ElementStyle(nativeElement, name, value) {
    if ((name && !value) && isstring(name)) {
        if (!!(window.getComputedStyle)) {
            var ret = window.getComputedStyle(nativeElement)[name];
            return parseInt(ret) || ret;
        }

        return;
    }

    if (isobject(name)) {
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
    if (typeof value === 'number' && ElementStyle.props.WithSuffix.includes(name)) {
        value += suffix || 'px';
    } else if (value && ElementStyle.props.background.includes(name) && value.includes('.') && !value.startsWith('url')) {
        value = 'url(' + value + ')';
    }

    nativeElement.style[name] = value;
};

ElementStyle.props = {
    WithSuffix: 'width|height|top|bottom|left|right|marginTop|marginBottom|marginLeft|marginRight|paddingRight|paddingLeft|paddingTop|paddingBottom|fontSize'.split('|'),
    background: 'backgroundImage'.split('|')
};