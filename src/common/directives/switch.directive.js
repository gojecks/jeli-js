commonModule
    .directive({
        selector: ':switch',
        DI: ['ElementRef', 'Observables'],
        props: [{
            name: 'binding',
            value: ':switch'
        }],
        transplace: true
    }, SwitchDirective);

function SwitchDirective(elementRef, Observables) {
    this.getCase = function(value) {
        return elementRef.children.filter(function(node) {
            return (node.type == 'element' && node.hasAnyAttribute(['.case'], 0) == value);
        })[0];
    };

    this.binding = '';
    this.didInit = function() {
        Observables
            .observeForKey(this.binding, this.process.bind(this));
    };
    /**
     * 
     * @param {*} value 
     */
    this.process = function(value) {
        // only process when the lastProcess !== value
        // loop through the elem
        var compiledWith = this.getCase(value);
        // if No match found in the case
        // fallback to default if defined
        if (compiledWith) {
            //empty the elem
            elementRef.nativeElement.innerHTML = "";
            elementRef.appendChild(compiledWith);
            compiledWith = null;
        }
    }
}