commonModule
    .directive({
        selector: 'j-switch',
        DI: ['ElementRef', 'Observables'],
        props: ['binding=on'],
        transplace: 'element'
    }, SwitchDirective);

function SwitchDirective(elementRef, Observables) {
    this.getCase = function(value) {
        return elementRef.children.filter(function(node) {
            return (node.type == 'element' && node.hasAnyAttribute(['.case'], 0) == value);
        })[0];
    };

    this.binding = '';
    this.compiledWith = null;
    this.didInit = function() {
        Observables
            .observeForKey(this.binding, this.process.bind(this));
    };
    /**
     * 
     * @param {*} value 
     */
    this.process = function(value) {
        if (this.compiledWith) {
            this.compiledWith.remove();
        }
        // only process when the lastProcess !== value
        // loop through the elem
        var compiledWith = this.getCase(value);
        // if No match found in the case
        // fallback to default if defined
        if (compiledWith) {
            this.compiledWith = compiledWith.clone(null, compiledWith.parent);
            //empty the elem
            elementRef.appendChild(this.compiledWith);
        }
    }
}