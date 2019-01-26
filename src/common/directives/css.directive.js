/**
 * @Directive :style | :class
 * adds a class or style based on logic provided
 * @param {*} type 
 */
commonModule
    .directive({
        selector: ':class',
        DI: ['ElementRef'],
        props: [{
            name: 'binding',
            value: ':class'
        }]
    }, ClassDirective)
    .directive({
        selector: ':style',
        DI: ['ElementRef'],
        props: [{
            name: 'binding',
            value: ':style'
        }]
    }, StyleDirective);

function ClassDirective(elementRef) {
    this.binding = '';
    this.lastAddedClass = '';
    this.match;
    this.didInit = function() {
        this.match = attrExpr.test(this.binding);
    };

    this.updateClass = function(name, value) {
        elementRef.nativeElement.classList[value ? 'add' : 'remove'](removeSingleQuote(name));
        this.lastAddedClass = name;
    };

    this.processObjectWatch = function() {
        var cmatch = stringToObject(this.binding, elementRef.context.context);
        var newHash = $hashCode(JSON.stringify(cmatch));
        // return when lastProcessed are equal
        if ($isEqual(this.lastProcessed, newHash)) {
            return;
        }

        for (var prop in cmatch) {
            this.updateClass(prop, cmatch[prop]);
        }

        this.lastProcessed = newHash;
    };

    this.processStringWatch = function() {
        this.class(this.lastAddedClass, false);
        var value = elementRef.context.evaluate(this.binding);
        if (value && !$isEqual(this.lastAddedClass, value)) {
            this.class(value, true);
        }
    };

    this.willObserve = function() {
        if (this.match) {
            this.processObjectWatch();
        } else {
            this.processStringWatch();
        }
    };
}

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