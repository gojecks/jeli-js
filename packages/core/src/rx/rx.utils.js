import { hashcode } from 'js-helpers/utils';
import { isobject, isfunction, isequal } from 'js-helpers/helpers';

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param {*} func 
 * @param {*} wait 
 * @param {*} immediate 
 */
export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
};

/**
 * 
 * @param {*} wait 
 * @param {*} immediate 
 * @returns 
 */
export function rxDebounceTime(timeout, immediate) {
    return debounce(function(value, listener) {
        listener(true);
    }, timeout, immediate)
};

/**
 * 
 * @param {*} callback 
 * @returns 
 */
export function rxWhile(callback) {
    return function(value, listener) {
        listener(callback(value));
    }
};

/**
 * 
 * @param {*} subscription 
 * @param {*} model 
 * @param {*} ignoreCheck 
 */
function rxNotify(subscription, model, ignoreCheck) {
    if (subscription.watchKey) {
        if (model) {
            var value;
            if (isfunction(suscription.watchKey)) {
                value = suscription.watchKey(model);
            } else {
                value = resolveValueFromContext(suscription.watchKey, model);
            }

            if (suscription.core && isfunction(suscription.core)) {
                if (suscription.core(value)) {
                    _trigger(suscription.handler, value);
                }
            } else if (ignoreCheck || _comparison(value, suscription)) {
                _trigger(suscription.handler, value);
            }
        }
    } else {
        subscription.handler(model);
    }
}

/**
 * 
 * @param {*} handlers 
 * @param {*} value 
 */
function _trigger(handlers, value) {
    if (Array.isArray(handlers)) {
        handlers.forEach(function(cb) {
            cb(value);
        });
    } else {
        handlers(value);
    }
}

function _comparison(value, suscription) {
    if (isobject(value)) {
        value = hashcode(JSON.stringify(value));
    }
    var noChanges = !isequal(value, suscription.lastValue);
    suscription.lastValue = value;
    return noChanges;
}

/**
 * 
 * @param {*} operators 
 * @param {*} args 
 * @param {*} callback 
 * @returns 
 */
function triggerWhen(operators, args, callback) {
    if (!operators || !operators.length) {
        return callback(true);
    }

    var inc = 0;
    var failed = false;

    function next() {
        var fn = operators[inc];
        if (fn) {
            fn(args, function(value) {
                if (!value) {
                    failed = true;
                }
                inc++;
                next();
            });
        } else {
            callback(!failed);
        }
    }

    next();
}

/**
 * 
 * @param {*} context 
 * @param {*} value 
 */
function _eventRxTrigger(context, value) {
    triggerWhen(context._hooks, value, function(allPassed) {
        if (allPassed) {
            context._listeners.forEach(function(fn) {
                fn(value);
            });
        }
    });
}