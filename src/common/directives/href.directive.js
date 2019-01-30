commonModule
    .directive({
        selector: ':href',
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':href'
        }]
    }, HrefDirective);

function HrefDirective(elementRef, Observables) {
    var validProtocol = ['http', 'https'];
    this.binding = '';
    this.didInit = function() {
        if (!$isEqual('A', elementRef.nativeElement.tagName)) {
            errorBuilder("jHref directive can only be used on ANCHOR element");
        }

        if (!validateLink(this.binding)) {
            Observables
                .observeForKey(this.binding, process);
        } else {
            process(this.binding, true);
        }
    };
    /**
     * 
     * @param {*} value 
     * @param {*} isProcessed 
     */
    function process(value, isProcessed) {
        if (isProcessed || validateLink(value)) {
            elementRef.setProp('href', value);
        }
    }

    /**
     * 
     * @param {*} link 
     */
    function validateLink(link) {
        return $inArray(link.split(':')[0], validProtocol);
    }
}