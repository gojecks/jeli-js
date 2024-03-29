import { isfunction, isequal } from '@jeli/helpers';

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
    return function(value, next) {
        next(callback(value));
    }
};

export function rxUntilChanged(){
    var oldValue = null;
    return function(value, next) {
        var noChanges = !isequal(value, oldValue);
        oldValue = value;
        next(noChanges);
    }
}

export function rxWait(){ }

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
            if (isfunction(subscription.watchKey)) {
                value = subscription.watchKey(model);
            } else {
                value = resolveValueFromContext(subscription.watchKey, model);
            }

            if (subscription.core && isfunction(subscription.core)) {
                if (subscription.core(value)) {
                    _trigger(subscription.handler, value);
                }
            } else if (ignoreCheck || _valueComparison(value, subscription)) {
                _trigger(subscription.handler, value);
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

function _valueComparison(value, suscription) {
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
    var passed = true;

    function next() {
        if (operators.length > inc) {
            var fn = operators[inc];
            fn(args, function(value) {
                if (!value) {
                    passed = false;
                }
                inc++;
                next();
            });
        } else {
            callback(passed);
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