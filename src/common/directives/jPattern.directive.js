/**
 * Directive Name:  j-pattern
 * Set a regular expression to be parsed before setting value to an ELEMENT
 * @Usage: ELEMENT OR ATTR
 * Directive doesn't function correctly if jMin or jMax Directive is also binded to element
 **/
commonModule
    .directive({
        selector: ':pattern',
        priority: 10,
        DI: ['ElementRef'],
        props: [{
            name: 'binding',
            value: ':pattern'
        }, {
            name: 'jModelInstance',
            value: 'jModel'
        }]
    }, PatternDirective);

function PatternDirective(elementRef) {
    this.binding = '';
    this.didInit = function() {
        if (!('pattern' in elementRef.nativeElement)) {
            var self = this;
            this
                .jModelInstance
                // bind Listener to jModel
                .$eventListener.register(':input', function(ev, insModel) {
                    insModel.error.pattern = !self.binding.test(insModel.element.nativeElement[isInput ? 'value' : 'innerText']);
                });
        } else {
            elementRef.setProp('pattern', this.binding);
        }
    };
}