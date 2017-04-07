/**
 * Currency Formatting
 *
 * @param: value: STRING, style: OBJECT { style: "currency", currency: "USD" }
 * @return formated value
 */
function currencyFilter(){
    return function(value, style){
        if($isSupport.intl){
            var currencyFormat = new Intl.NumberFormat(window.navigator.language, style);
            return currencyFormat.format(value);
        }else{
           return (style && style.currency) + numberFilter()(value);
        }
    }
}

_defaultRegistry('j-eli', '$jFilterProvider', 'currency')(currencyFilter);