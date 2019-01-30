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
        props: [{
            name: 'binding',
            value: ':show'
        }]
    }, ShowDirective);

function ShowDirective(elementRef, Observables) {
    this.binding;
    this.didInit = function() {
        Observables
            .observeForKey(this.binding, function(show) {
                elementRef.nativeElement.style.display = show ? 'block' : 'none';
            });
    };
}