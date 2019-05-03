//@Directive <j-disabled>
// disables required element if condition is met.
/*  
    as attr <any j-disabled="(1==1 || (model[1] === 1))">

    cannot be used in class list
*/
commonModule
    .directive({
        selector: ':disabled',
        DI: ['ElementRef', 'Observables'],
        props: ['binding=:disabled']
    }, DisabledDirective);

function DisabledDirective(elementRef, Observables) {
    this.binding = '';
    this.didInit = function() {
        Observables
            .observeForKey(this.binding, function(value) {
                if (value) {
                    elementRef.setAttribute('disabled', true, true);
                } else {
                    elementRef.removeAttribute('disabled');
                }
            });
    };
}