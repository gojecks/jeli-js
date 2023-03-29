import { isobject } from '@jeli/helpers';
import { ElementClassList } from '@jeli/core';
/**
 * @Directive :style | :class
 * adds a class or style based on logic provided
 * @param {*} type 
 */
Directive({
    selector: 'jClass',
    DI: ['ElementRef?'],
    props: ['class=jClass']
})

export function ClassDirective(elementRef) {
    this._jClass = undefined;
    this.lastAddedClass = '';

    this._changeClass = function() {
        if (isobject(this._jClass)) {
            ElementClassList.add(elementRef.nativeElement, this._jClass);
        } else {
            if (this.lastAddedClass == this._jClass) return;
            ElementClassList.remove(elementRef.nativeElement, this.lastAddedClass);
            if (this._jClass) {
                ElementClassList.add(elementRef.nativeElement, this._jClass);
            }
            this.lastAddedClass = this._jClass;
        }
    };

    Object.defineProperty(this, 'class', {
        set: function(value) {
            this._jClass = value;
            this._changeClass();
        },
        get: function() {
            return this._jClass;
        }
    });
}