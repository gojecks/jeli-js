/**
 * Directive Name:  j-pattern
 * Set a regular expression to be parsed before setting value to an ELEMENT
 * @Usage: ELEMENT OR ATTR
 * Directive doesn't function correctly if jMin or jMax Directive is also binded to element
 **/
commonModule
    .directive({
        selector: ':pattern',
        DI: ['ElementRef'],
        props: ['binding=:pattern']
    }, PatternDirective);

function PatternDirective(elementRef) {
    this.binding = '';
    this.didInit = function() {
        /**
         * Attach validityCheck to Element if not exists
         */
        if (!'checkValidity' in elementRef.nativeElement) {
            elementRef.nativeElement.checkValidity = function() {
                return !this.pattern.test(this.value);
            }
        }

        elementRef.setProp('pattern', this.binding);
    };
}