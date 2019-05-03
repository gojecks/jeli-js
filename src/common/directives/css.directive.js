/**
 * @Directive :style | :class
 * adds a class or style based on logic provided
 * @param {*} type 
 */
commonModule
    .directive({
        selector: ':class',
        DI: ['ElementRef'],
        props: ['binding=:class']
    }, ClassDirective);

function ClassDirective(elementRef) {
    this.binding = '';
    this.lastAddedClass = '';
    this.match;
    this.didInit = function() {
        this.match = attrExpr.test(this.binding);
    };

    this.updateClass = function(name, value) {
        if (name) {
            elementRef.nativeElement.classList[value ? 'add' : 'remove'](removeSingleQuote(name));
        }
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
        if (elementRef.context) {
            var value = elementRef.context.evaluate(this.binding);
            if (!$isEqual(this.lastAddedClass, value)) {
                this.updateClass(this.lastAddedClass, false);
                if (value) {
                    this.updateClass(value, true);
                }

                this.lastAddedClass = value;
            }
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