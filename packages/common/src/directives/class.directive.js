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

export class ClassDirective {
    constructor(elementRef) {
        this._jClass = undefined;
        this.lastAddedClass = '';
        this.elementRef = elementRef
    }

    _changeClass() {
        if (isobject(this._jClass)) {
            ElementClassList.add(this.elementRef.nativeElement, this._jClass);
        } else {
            if (this.lastAddedClass == this._jClass) return;

            ElementClassList.remove(this.elementRef.nativeElement, this.lastAddedClass);
            if (this._jClass) {
                ElementClassList.add(this.elementRef.nativeElement, this._jClass);
            }
            this.lastAddedClass = this._jClass;
        }
    }

    get class() {
        return this._jClass
    }

    set class(value) {
        this._jClass = value;
        this._changeClass();
    }

    viewDidDestroy(){
        this.elementRef = null;
        this._jClass = null;
        this.lastAddedClass = null;
    }
}