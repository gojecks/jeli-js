import { isobject, isequal, isboolean, isundefined, isnull, isstring, isarray, isnumber, isfunction } from 'js-helpers/helpers';
import { simpleBooleanParser } from 'js-helpers/utils';
import { errorBuilder } from '../utils/errorLogger';
import { Inject } from '../dependency.injector';
/**
 * 
 * @param {*} type 
 * @param {*} context 
 */
function filterParser(filterClass, context) {
    var filterInstance = Inject(filterClass);
    if (!filterInstance) {
        errorBuilder(filterClass + 'Provider was not found in FilterProvider');
    }
    return filterInstance.compile.apply(filterInstance, context);
};

/**
 * 
 * @param {*} templateModel 
 * @param {*} context 
 * @param {*} componentInstance 
 */
function getFilteredTemplateValue(templateModel, context, componentInstance) {
    var value = resolveValueFromContext(templateModel.prop, context, componentInstance);
    if (templateModel.fns) {
        value = templateModel.fns.reduce(function(accum, filterClass, idx) {
            var filterArgs = generateArguments(templateModel.args[idx], context, value);
            /**
             * add the value to args
             */
            filterArgs.unshift(accum);
            return filterParser(filterClass, filterArgs);
        }, value);
    }

    return value;
}

/**
 * used for interpolation ${this...} or {atttr-} binding
 * @param {*} definition 
 * @param {*} context 
 * @param {*} componentInstance 
 * @param {*} cb 
 */
function compileTemplate(definition, context, componentInstance, cb) {
    var value = undefined;
    if (definition.templates) {
        value = definition.templates.reduce(function(accum, options) {
            return accum.replace(options[0], evaluateExpression(options[1], context, componentInstance));
        }, definition.rawValue);
    } else {
        value = getFilteredTemplateValue(definition, context, componentInstance);
    }

    cb(value);
}

/**
 * 
 * @param {*} expr 
 * @param {*} context 
 * @param {*} componentInstance 
 */
function evaluateExpression(expr, context, componentInstance) {
    /**
     * expression with filter
     */
    if (isobject(expr) && expr.hasOwnProperty('prop')) {
        return getFilteredTemplateValue(expr, context, componentInstance);
    }

    return resolveValueFromContext(expr, context, componentInstance);
};

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
    return args.map(argumentMapper);

    /**
     * 
     * @param {*} arg 
     */
    function argumentMapper(arg) {
        if (isarray(arg)) {
            if (!arg.length) return arg;
            var isEvent = isequal(arg[0], '$event');
            return resolveContext(arg.slice(isEvent ? 1 : 0), isEvent ? event : context);
        } else if (isstring(arg)) {
            return isequal(arg, '$event') ? event : context.hasOwnProperty(arg) ? context[arg] : arg;
        }

        return resolveValueFromContext(arg, context, null, event);
    }
}

/**
 * 
 * @param {*} expression 
 * @param {*} context 
 * @param {*} componentInstance 
 * @param {*} event 
 */
function resolveValueFromContext(expression, context, componentInstance) {
    if (isundefined(expression) || isnull(expression) || isboolean(expression) || isnumber(expression) || /(#|rgb)/.test(expression)) {
        return expression;
    } else if (isobject(expression)) {
        return parseObjectExpression.apply(null, arguments);
    } else if (isarray(expression)) {
        return resolveContext(expression, context, componentInstance);
    } else if (expression === '$this') {
        return componentInstance;
    }

    return context && (expression in context) ? context[expression] : null;
}

/**
 * 
 * @param {*} expression 
 * @param {*} context 
 * @param {*} componentInstance 
 * @param {*} event 
 */
function parseObjectExpression(expression, context, componentInstance, event) {
    var internalParser = {
        /**
         * ConditionalExpression Method
         * a ? a : b ? b : c
         */
        ite: function() {
            return (
                resolveValueFromContext(expression.test, context, componentInstance) ?
                resolveValueFromContext(expression.cons, context, componentInstance) :
                resolveValueFromContext(expression.alt, context, componentInstance)
            );
        },
        /**
         * CallExpression Method
         * a.b.c(args) || a(1)
         */
        call: function() {
            var dcontext = context;
            if (expression.namespaces) {
                dcontext = resolveContext(expression.namespaces, context, componentInstance);
            }
            if (dcontext && isfunction(dcontext[expression.fn])) {
                var args = generateArguments(expression.args, context, event);
                return dcontext[expression.fn].apply(dcontext, args);
            }

            return null;
        },
        /**
         * ObjectExpression Method
         */
        obj: function() {
            if (expression.expr) {
                return Object.keys(expression.expr).reduce(function(accum, key) {
                    accum[key] = resolveValueFromContext(expression.expr[key], context, componentInstance);
                    return accum;
                }, {});
            }
        },
        /**
         * ASSIGNMENTExpression Method
         * a = b
         */
        asg: function() {
            var value = generateArguments([expression.right], context, event)[0];
            return setModelValue(expression.left, context, value);
        },
        /**
         * UnaryExpression Method
         */
        una: function() {
            var val = resolveValueFromContext(expression.args, context, componentInstance, event);
            if (expression.ops === '+') return +val
            if (expression.ops === '-') return -val
            if (expression.ops === '~') return ~val
            if (expression.ops === '!') return !val
        },
        /**
         * BinaryExpression Method
         */
        bin: function() {
            if (expression.ops === '&&') {
                var l = resolveValueFromContext(expression.left, context, componentInstance, event);
                if (!l) return l;
                return resolveValueFromContext(expression.right, context, componentInstance, event);
            } else if (expression.ops === '||') {
                var l = resolveValueFromContext(expression.left, context, componentInstance, event);
                if (l) return l;
                return resolveValueFromContext(expression.right, context, componentInstance, event);
            }

            var l = resolveValueFromContext(expression.left, context, componentInstance, event);
            var r = resolveValueFromContext(expression.right, context, componentInstance, event);
            if (expression.ops === '==') return l == r;
            if (expression.ops === '===') return l === r;
            if (expression.ops === '!=') return l != r;
            if (expression.ops === '!==') return l !== r;
            if (expression.ops === '+') return l + r;
            if (expression.ops === '-') return l - r;
            if (expression.ops === '*') return l * r;
            if (expression.ops === '/') return l / r;
            if (expression.ops === '%') return l % r;
            if (expression.ops === '<') return l < r;
            if (expression.ops === '<=') return l <= r;
            if (expression.ops === '>') return l > r;
            if (expression.ops === '>=') return l >= r;
            if (expression.ops === '|') return l | r;
            if (expression.ops === '&') return l & r;
            if (expression.ops === '^') return l ^ r;
        },
        new: function() {
            errorBuilder('NewExpression not allowed in template interpolation -> (new ' + expression.fn + ') ')
        },
        raw: function() {
            return expression.value;
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
        model = resolveContext(key.slice(0, key.length - 1), model);
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
 * @param {*} componentInstance 
 */
function resolveContext(key, context, componentInstance) {
    var isEventType = context instanceof Event;
    return key.reduce(function(accum, property) {
        if (isEventType) {
            return accum[property];
        }

        return resolveValueFromContext(property, accum, componentInstance);
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