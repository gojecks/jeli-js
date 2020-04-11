import { isobject, isequal, isundefined, isnull, isstring } from 'js.helpers/helpers';
import { simpleBooleanParser } from 'js.helpers/utils';
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
        value = evaluateExpression(definition, context);
    }

    if (!isequal(definition.lastCompiled, value)) {
        definition.lastCompiled = value;
        cb(value);
    }
}

function evaluateExpression(expr, context) {
    if (isobject(expr)) {
        return getTemplateValue(expr, context);
    } else if (isstring(expr)) {
        return expr;
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
        if (arg[0] === "$event") {
            return event;
        } else {
            if (isstring(arg)) {
                return arg;
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
 */
function resolveValueFromContext(expression, context) {
    if (isundefined(expression) || isnull(expression) || isboolean(expression)) {
        return expression;
    } else if (isobject(expression)) {
        return parseObjectExpression(expression, context);
    } else if (isarray(expression)) {
        return expression;
    }

    var value = simpleArgumentParser(expression);
    if (isequal(value, expression)) {
        value = maskedEval(expression, context);
    }

    return value;
}

/**
 * 
 * @param {*} expression 
 * @param {*} context 
 */
function parseObjectExpression(expression, context) {
    var _localParser_ = {
        ite: function(obj) {
            return maskedEval(obj.test, context) ? obj.cons : obj.alt;
        }
    };


    return Object.keys(expression).reduce(function(accum, key) {
        var obj = expression[key];
        /**
         * itenary type
         */
        if (isobject(obj) && obj.test) {
            accum[key] = _localParser_[obj.type](obj);
        } else {
            var value = maskedEval(obj, context);
            accum[key] = isundefined(value) ? obj : value;
        }
        return accum;
    }, {});
}

/**
 * 
 * @param {*} key 
 * @param {*} context 
 */
function simpleContextMapper(key, context) {
    key = generateArrayKeyType(key, context).split(".");
    var last = key.pop(),
        dContext = context;

    if (key.length) {
        dContext = resolveContext(key, context);
    }

    if (dContext) {
        var fnString = generateFnFromString(last);
        if (fnString) {
            var args = generateArguments(fnString.arg, context);
            var fn = context[fnString.fn] || function() {};
            return fn.apply(context, args);
        }
        return dContext[last];
    }

    return dContext;
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