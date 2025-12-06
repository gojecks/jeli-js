import { NumberFilter } from './number.filter';
/**
 * Currency Formatting
 *
 * @param: value: STRING, style: OBJECT { style: "currency", currency: "USD" }
 * @return formated value
 */
Service({
    name: 'currency',
    DI: [NumberFilter]
})
export class CurrencyFilter {
    constructor(numberFilter) {
        this.numberFilter = numberFilter;
    }

    compile(value, style) {
        if (!!window.Intl) {
            var currencyFormat = new Intl.NumberFormat(window.navigator.language, style);
            return currencyFormat.format(value);
        } else {
            return `${(style && style.currency)} ${this.numberFilter.format(value)}`;
        }
    }
}