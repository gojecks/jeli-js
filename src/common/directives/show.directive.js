//@Directive <j-show>
// shows required element if condition is met or hide element.
/*  
  works like j-hide directive
  as attr <any j-show="(1==1 || (model[1] === 1))">

  cannot be used in class list
*/
commonModule
    .directive({
        selector: ':show',
        DI: ['ElementRef', 'Observables'],
        props: ['binding=:show']
    }, ShowDirective);

function ShowDirective(elementRef, Observables) {
    this.binding;
    this.lastValue;
    this.process = function(show) {
        elementRef.nativeElement.style.display = show ? 'block' : 'none';
    };

    this.willObserve = function() {
        var value = elementRef.context.evaluate(this.binding);
        if (!$isEqual(value, this.lastValue)) {
            this.process(value);
            this.lastValue = value;
        }
    };
}