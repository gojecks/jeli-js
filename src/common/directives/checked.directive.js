/**
 * @directive :checked
 * checks required element if condition is met.
 */
commonModule
    .directive({
        selector: ':checked',
        DI: ['ElementRef', 'Observables'],
        props: ['binding=:checked']
    }, CheckedDirective);

function CheckedDirective(elementRef, Observables) {
    this.didInit = function() {
        this.unSubscribe = Observables
            .observeForKey(this.binding, function(value) {
                if (value) {
                    elementRef.setAttribute('checked', 'true', true);
                } else {
                    elementRef.removeAttribute('checked');
                }
            });
    };
}