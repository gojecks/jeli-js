Service({
    name: 'currency',
    DI: ['number']
}, CurrencyFilter);
/**
 * Currency Formatting
 *
 * @param: value: STRING, style: OBJECT { style: "currency", currency: "USD" }
 * @return formated value
 */
function CurrencyFilter($number) {
    this.compile = function(value, style) {
        if (!!window.Intl) {
            var currencyFormat = new Intl.NumberFormat(window.navigator.language, style);
            return currencyFormat.format(value);
        } else {
            return (style && style.currency) + $number(value);
        }
    }
}