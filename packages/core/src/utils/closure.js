import { isfunction } from 'js-helpers/helpers';
/**
 * 
 * @param {*} closureRefFn 
 */
export function closureRef(closureRefFn) {
    if (isfunction(closureRefFn)) {
        closureRefFn.__ref__ = closureRef;
    }

    return closureRefFn;
}

/**
 * 
 * @param {*} ref 
 */
export function resolveClosureRef(ref) {
    if (isfunction(ref) && ref.__ref__ === closureRef) {
        return ref();
    } else {
        return ref;
    }
};

export function noop(callback) {
    return (callback || function() {});
};