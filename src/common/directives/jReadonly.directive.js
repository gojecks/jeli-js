/*
    @Directive <j-readonly>
    set ELEMENT to readOnly if condition is met
    @Usage :
    allowed type Attirbute
*/
commonModule
    .directive({
        selector: ':readonly',
        priority: 10,
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':readonly'
        }]
    }, ReadonlyDirective);

function ReadonlyDirective(elementRef, Observables) {
    this.binding = '';
    this.didInit = function() {
        Observables
            .observerForKey(this.binding, function(changes) {
                if (changes) {
                    elementRef.setAttribute('readonly', true, true);
                } else {
                    elementRef.removeAttribute('readonly');
                }
            });
    };
}