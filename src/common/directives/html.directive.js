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
        DI: ['ElementRef', 'Observables', '$sce'],
        props: [{
            name: 'binding',
            value: ':html'
        }]
    }, HtmlDirective);

function HtmlDirective(elementRef, Observables, $sce) {
    this.binding;
    this.lastValue = "";
    this.isPlainHtml = "";
    this.trustAsHTML = "";
    this.didInit = function() {
        this.isPlainHtml = $sce.isPlainHtml.test(this.binding);
        this.trustAsHTML = elementRef.hasAttribute('trustHtml');
        if (this.isPlainHtml) {
            this.lastValue = this.binding;
            this.process();
        }
    };

    this.willObserve = function() {
        if (!this.isPlainHtml) {
            var value = elementRef.context.evaluate(this.binding);
            if (!$isEqual(this.lastValue, value)) {
                this.lastValue = value;
                this.process();
            }
        }
    };

    this.process = function() {
        var html = $sce[this.trustAsHTML ? 'trustAsHTML' : 'escapeHTML'](this.lastValue);
        elementRef.nativeElement.innerHTML = html;
    }
}