//@Directive <j-selected>
// checks required element if condition is met.
/*  
    as attr <any j-checked="(1==1 || (model[1] === 1))">

    cannot be used in class list
*/
commonModule
    .directive({
        selector: ':selected',
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':selected'
        }],
        priority: 100
    }, SelectedDirective);

function SelectedDirective(elementRef, Observables) {
    this.binding = '';
    this.didInit = function() {
        Observables
            .observeForKey(this.binding, function(isSelected) {
                if (isSelected) {
                    elementRef.setAttribute('selected', true, true);
                } else {
                    elementRef.removeAttribute('selected');
                }
            });
    };
}