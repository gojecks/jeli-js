import { isstring, isobject } from 'js-helpers/helpers';
/**
 * 
 * @param {*} element 
 */
export function ElementClassList(nativeElement, classList, type) {
    if (type) {
        nativeElement.classList[type].apply(nativeElement.classList, classList.split(" "));
    } else if (classList) {
        nativeElement.classList.value = classList
    } else {
        return nativeElement.classList.value;
    }
}

/**
 * @param {*} nativeElement
 * @param {*} classList
 * @param {*} removeClass
 */
ElementClassList.add = function(nativeElement, classList, removeClass) {
    if (!classList || !nativeElement) {
        return;
    }

    if (isobject(classList)) {
        for (var className in classList) {
            if (isstring(classList[className])) {
                nativeElement.classList.toggle(className, classList[className]);
            }
        }
    } else {
        nativeElement.classList.add.apply(nativeElement.classList, classList.split(/\s/g));
    }
};

/**
 * 
 * @param {*} nativeElement 
 * @param {*} classList 
 */
ElementClassList.remove = function(nativeElement, classList) {
    if (!classList || !nativeElement) {
        return;
    }

    nativeElement.classList.remove.apply(nativeElement.classList, classList.split(/\s/g));
}

ElementClassList.contains = function(nativeElement, className) {
    return nativeElement.classList.contains(className);
};