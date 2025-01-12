import { isfunction } from '@jeli/helpers';
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

resolveClosureRef.factory = function(token, localInjector) {
    var args = resolveDeps(token.DI, localInjector);
    return function() {
        return resolveClosureRef(token.factory).apply(null, args);
    }
};

export function noop(callback) {
    return (callback || function() {});
};