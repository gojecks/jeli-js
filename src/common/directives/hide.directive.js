/**
 * @Directive :hide
 * shows required element if condition is met.
 * unlike the j-if directive that removes element from DOM
 * :hide directive sets the element display to none if condition is met.
 */
commonModule
    .directive({
        selector: ':hide',
        priority: 10,
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':hide'
        }]
    }, HideDirective);

function HideDirective(elementRef, Observables) {
    this.binding = '';
    this.didInit = function() {
        Observables
            .observeForKey(this.binding, function(value) {
                elementRef.nativeElement.style.display = value ? 'none' : '';
            });
    };
}