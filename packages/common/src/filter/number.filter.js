import { isarray } from '@jeli/helpers';
/**
 * Number format(n, x, s, c)
 * 
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 *
 * credit to VisioN: http://stackoverflow.com/users/1249581
 */
Service({
    name: 'number'
})

export class NumberFilter {
    constructor() { }

    compile(value, factoRize) {
        if (!isarray(factoRize)) {
            factoRize = [factoRize, 3, ',', '.'];
        }

        return this._format.apply(value || 0, factoRize);
    }

    _format(n, x, s, c) {
        if (!!window.Intl) {
            var numFormat = new Intl.NumberFormat(navigator.language);
            return numFormat.format(this);
        } else {
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')', num = this.toFixed(Math.max(0, ~~n));
            return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
        }
    }
}