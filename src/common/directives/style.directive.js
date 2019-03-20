commonModule
    .directive({
        selector: ':style',
        DI: ['ElementRef'],
        props: [{
            name: 'binding',
            value: ':style'
        }]
    }, StyleDirective);
/**
 * 
 * @param {*} elementRef 
 */
function StyleDirective(elementRef) {
    this.binding = '';
    this.didInit = function() {
        this.match = attrExpr.test(this.binding);
    };

    this.updateStyle = function(name, value) {
        elementRef.nativeElement.style[name] = value;
    };

    this.processObjectWatch = function() {
        var cmatch = stringToObject(this.binding, elementRef.context.context);
        var newHash = $hashCode(JSON.stringify(cmatch));
        // return when lastProcessed are equal
        if ($isEqual(this.lastProcessed, newHash)) {
            return;
        }

        for (var prop in cmatch) {
            this.updateStyle(prop, cmatch[prop]);
        }

        this.lastProcessed = newHash;
    };

    this.willObserve = function() {
        if (this.match) {
            this.processObjectWatch();
        }
    };
}