import { isobject, isequal, isboolean, isundefined, isnull, isstring, isarray, isnumber } from 'js-helpers/helpers';
import { simpleBooleanParser } from 'js-helpers/utils';
import { filterParser } from '../providers/filter.provider';
/**
 * 
 * @param {*} templateModel 
 * @param {*} instance 
 */
function getTemplateValue(templateModel, instance) {
    var value = resolveValueFromContext(templateModel.prop, instance);
    if (templateModel.fns) {
        value = templateModel.fns.reduce(function(accum, filterName, idx) {
            var filterArgs = (templateModel.args[idx] || []).map(function(key) {
                return resolveValueFromContext(key, instance) || key;
            });
            /**
             * add the value to args
             */
            filterArgs.unshift(accum);

            return filterParser(filterName, filterArgs);
        }, (!isundefined(value) ? value : templateModel.prop));
    }

    return value;
}

/**
 * 
 * @param {*} key 
 */
function getValueFromModel(key) {
    if ($inArray('|', key)) {
        var filteredKey = removeFilters(key);
        return function(model) {
            return getTemplateValue(filteredKey, model);
        }
    } else {
        return function(model) {
            return resolveValueFromContext(key, model)
        };
    }
}

/**
 * 
 * @param {*} definition 
 * @param {*} context 
 * @param {*} cb 
 */
function compileTemplate(definition, context, cb) {
    var value = undefined;
    if (definition.templates) {
        value = definition.templates.reduce(function(accum, options) {
            return accum.replace(options.replace, evaluateExpression(options.exp, context));
        }, definition.rawValue);
    } else {
        value = getTemplateValue(definition, context);
    }

    cb(value);
}

/**
 * 
 * @param {*} expr 
 * @param {*} context 
 */
function evaluateExpression(expr, context) {
    /**
     * expression with filter
     */
    if (isobject(expr) && expr.hasOwnProperty('prop')) {
        return getTemplateValue(expr, context);
    }

    return resolveValueFromContext(expr, context);
};

/**
 * 
 * @param {*} expression 
 * @param {*} context 
 */
function maskedEval(expression, context) {
    if ((/([|<>=()\-!*+&\/\/:])/gi).test(expression)) {
        // execute script in private context
        return (new Function("with(this) { try{ return " + expression + " }catch(e){ return undefined; } }")).call(context || {})
    } else {
        return simpleContextMapper(expression, context);
    }
}

/**
 * 
 * @param {*} arg 
 * @param {*} sub 
 */
function simpleArgumentParser(arg) {
    var booleanMatcher = simpleBooleanParser(arg),
        isNum = Number(arg);
    if (arg && !isNaN(isNum)) {
        return isNum;
    } else if (!isundefined(booleanMatcher)) {
        return booleanMatcher;
    }

    return arg;
}


/**
 * 
 * @param {*} args 
 * @param {*} context 
 * @param {*} event 
 */
function generateArguments(args, context, event) {
    return args.map(function(arg) {
        if (isarray(arg)) {
            var isEvent = isequal(arg[0], '$event');
            return resolveContext(arg.slice(isEvent ? 1 : 0), isEvent ? event : context);
        } else {
            if (isstring(arg)) {
                return isequal(arg, '$event') ? event : arg;
            }

            arg = arg.join('.');
            var param = resolveValueFromContext(arg, context);
            return !isundefined(param) ? param : simpleArgumentParser(arg);
        }
    });
}

/**
 * 
 * @param {*} expression 
 * @param {*} context 
 * @param {*} event 
 */
function resolveValueFromContext(expression, context) {
    if (isundefined(expression) || isnull(expression) || isboolean(expression) || isnumber(expression) || /(#|rgb)/.test(expression)) {
        return expression;
    } else if (isobject(expression)) {
        return parseObjectExpression.apply(null, arguments);
    } else if (isarray(expression)) {
        return expression;
    }

    return resolveContext(generateArrayKeyType(expression, context).split("."), context);
}

/**
 * 
 * @param {*} expression 
 * @param {*} context 
 */
function parseObjectExpression(expression, context, event) {
    var internalParser = {
        ite: function() {
            return resolveValueFromContext(expression.test, context) ? expression.cons : expression.alt;
        },
        call: function() {
            var dcontext = context;
            if (expression.namespaces) {
                dcontext = resolveContext(expression.namespaces, context);
            }

            if (dcontext && dcontext[expression.fn]) {
                var args = generateArguments(expression.args, context, event);
                return dcontext[expression.fn].apply(dcontext, args);
            }

            return null;
        },
        obj: function() {
            if (expression.expr) {
                return Object.keys(expression.expr).reduce(function(accum, key) {
                    accum[key] = resolveValueFromContext(expression.expr[key], context);
                    return accum;
                }, {});
            }
        },
        ant: function() {
            var value = generateArguments([expression.right], context, event)[0];
            return setModelValue(expression.left, context, value);
        }
    };

    return internalParser[expression.type] && internalParser[expression.type]();
}

/**
 * Get and Set the value of a given key to a model
 * @param {*} key 
 * @param {*} model 
 * @param {*} value 
 */
function setModelValue(key, model, value) {
    if (isarray(key)) {
        model = resolveContext(key.slice(1, key.length - 1), model);
        key = key[key.length - 1];
    }

    if (model) {
        model[key] = value;
    }

    return value;
}


/**
 * 
 * @param {*} key 
 * @param {*} context 
 */
function resolveContext(key, context) {
    return key.reduce(function(prev, curr) {
        return prev ? prev[curr] : null;
    }, context || {});
}

/**
 * match key with array type
 * @param {*} key 
 * @param {*} model 
 * @param {*} create 
 */
function matchStringWithArray(key, model, create) {
    var modelDepth = model,
        i = 0;
    while (i <= key.length - 1) {
        modelDepth = createNewInstance(modelDepth, key[i], create, !isNaN(Number(key[i + 1])));
        i++;
    }

    return modelDepth;
}

/**
 * 
 * @param {*} model 
 * @param {*} key 
 * @param {*} create 
 */
function createNewInstance(model, key, create, nextIsArrayKey) {
    var objectType = nextIsArrayKey ? [] : {};
    if (create && !model[key]) {
        model[key] = objectType
    }

    return model && model[key] || objectType;
}

/**
 * 
 * @param {*} key 
 * @param {*} model 
 */
function generateArrayKeyType(key, model) {
    if (-1 < key.indexOf("[")) {
        model = model || {};
        return key.split('[').map(function(current) {
            if (current.indexOf(']') > -1) {
                var _key = current.split(']')[0];
                return ((model.hasOwnProperty(_key)) ? model[_key] : _key);
            }

            return current;
        }).join('.');
    }

    return key
}