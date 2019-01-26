//@Directive <j-html>
// overwrites the element contents with the required binding result.
/*  
  works same as the <j-html> directive
  as attr <any j-html="html">

  cannot be used in class list
*/
commonModule
    .directive({
        selector: ':html',
        priority: 10,
        DI: ['ElementRef', 'Observables', '$sce'],
        props: [{
            name: 'binding',
            value: ':html'
        }]
    }, HtmlDirective);

function HtmlDirective(elementRef, Observables, $sce) {
    this.binding;
    this.didInit = function() {
        var trustAsHTML = elementRef.hasAttribute('trustHtml');
        if ($sce.isPlainHtml.test(this.binding)) {
            process(this.binding);
        } else {
            Observables
                .observeForKey(this.binding, process);
        }

        /**
         * 
         * @param {*} html 
         */
        function process(html) {
            html = $sce[trustAsHTML ? 'trustAsHTML' : 'escapeHTML'](html);
            elementRef.nativeElement.innerHTML = html;
        }
    };
}