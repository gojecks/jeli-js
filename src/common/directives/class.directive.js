/**
 * @Directive :style | :class
 * adds a class or style based on logic provided
 * @param {*} type 
 */
Directive({
    selector: 'class',
    DI: ['ElementRef?'],
    props: ['class']
}, ClassDirective);

function ClassDirective(elementRef) {
    this._jClass = undefined;
    this.lastAddedClass = '';

    this._changeClass = function() {
        if ($isObject(this._jClass)) {
            ElementClassList.add(elementRef.nativeElement, this._jClass);
        } else {
            ElementClassList.add(elementRef.nativeElement, this.lastAddedClass, false);
            if (this._jClass) {
                ElementClassList.add(elementRef.nativeElement, this._jClass, true);
                this.lastAddedClass = this._jClass;
            }
        }
    };

    Object.defineProperty(this, 'class', {
        set: function(value) {
            this._jClass = value;
            this._changeClass();
        }
    });
}