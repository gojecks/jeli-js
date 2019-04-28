//@Directive <j-if>
// Compiles the required element based on the logic provided
//elements are removed from the DOM if condition is not met
/*@Usage :
    allowed type Attirbute and Element
*/
commonModule
    .directive({
        selector: ':if',
        transplace: 'element',
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':if'
        }]
    }, IfDirective);

function IfDirective(elementRef, Observables) {
    this.binding = '';
    this.compiledElement = null;
    this.didInit = function() {
        if ($isString(this.binding)) {
            Observables
                .observeForKey(this.binding, this.process.bind(this));
        } else {
            this.process(this.binding);
        }
    };

    this.process = function(changes) {
        if (!changes) {
            this.compiledElement && this.compiledElement.remove(true);
            this.compiledElement = null;
        } else {
            this.compiledElement = elementRef.clone(null, elementRef.parent);
            elementRef.parent.insertAfter(this.compiledElement, elementRef.nativeNode, true);
        }
    };
}