import { hashcode } from 'js-helpers/utils';
import { isobject, isfunction, isequal } from 'js-helpers/helpers';

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