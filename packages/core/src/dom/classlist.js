import { isobject } from '@jeli/helpers';
/**
 * 
 * @param {*} element 
 */
export class ElementClassList {
    static set(nativeElement, classList, type) {
        if (type) {
            nativeElement.classList[type].apply(nativeElement.classList, this.toClass(classList));
        } else if (classList) {
            nativeElement.classList.value = classList
        } else {
            return nativeElement.classList.value;
        }
    }

    /**
     * @param {*} nativeElement
     * @param {*} classList
     */
    static add(nativeElement, classList) {
        if (!classList || !nativeElement) {
            return;
        }

        if (isobject(classList)) {
            for (var className in classList) {
                this.set(nativeElement, className, classList[className] ? 'add':'remove');
            }
        } else {
            this.set(nativeElement, classList, 'add');
        }
    }

    /**
     * 
     * @param {*} nativeElement 
     * @param {*} classList 
     */
    static remove(nativeElement, classList) {
        if (!classList || !nativeElement) {
            return;
        }

        nativeElement.classList.remove.apply(nativeElement.classList, this.toClass(classList));
    }

    static contains(nativeElement, className) {
        return nativeElement.classList.contains(className);
    }

    static toClass(classList) {
        return (classList || '').split(/\s/g).filter(function (k) { return !!k; });
    }
}
