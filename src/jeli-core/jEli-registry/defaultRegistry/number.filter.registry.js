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
function numberFilter(){
	function format(n, x, s, c) {
        if($isSupport.intl){
            var numFormat = new Intl.NumberFormat(navigator.language);
            return numFormat.format(this);
        }else{
            var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
            num = this.toFixed(Math.max(0, ~~n));

            return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
        }
	}

    return function(value, factoRize){
    	if(!$isArray(factoRize)){
    		factoRize = [factoRize, 3, ',', '.']
    	}

      return format.apply(value || 0, factoRize);
    }
}

_defaultRegistry('j-eli', '$jFilterProvider', 'number')(numberFilter);