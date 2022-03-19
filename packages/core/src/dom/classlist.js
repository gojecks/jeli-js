import { isobject } from 'js-helpers/helpers';
/**
 * 
 * @param {*} element 
 */
export function ElementClassList(nativeElement, classList, type) {
    if (type) {
        nativeElement.classList[type].apply(nativeElement.classList, toClass(classList));
    } else if (classList) {
        nativeElement.classList.value = classList
    } else {
        return nativeElement.classList.value;
    }
}

function toClass(classList) {
    return classList.split(/\s/g).filter(function(k) { return !!k; });
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
            nativeElement.classList[classList[className] ? 'add' : 'remove'](className);
        }
    } else {
        nativeElement.classList.add.apply(nativeElement.classList, toClass(classList));
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

    nativeElement.classList.remove.apply(nativeElement.classList, toClass(classList));
}

ElementClassList.contains = function(nativeElement, className) {
    return nativeElement.classList.contains(className);
};