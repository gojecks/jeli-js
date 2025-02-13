import { isobject, isequal, isboolean, isundefined, isnull, isstring, isarray, isnumber, isfunction } from '@jeli/helpers';
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
        value = templateModel.fns.reduce(function (accum, filterClass, idx) {
            if (!filterClass) return accum;
            var filterArgs = [];
            if (templateModel.args[idx])
                filterArgs = generateArguments(templateModel.args[idx], context, componentInstance);
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
 */
function compileTemplate(definition, context, componentInstance) {
    var value = undefined;
    if (definition.length > 1)
        value = definition[1].reduce(function (accum, options) {
            return accum.replace(options[0], evaluateExpression(options[1], context, componentInstance));
        }, definition[0]);
    else
        value = getFilteredTemplateValue(definition, context, componentInstance);

    return ([null, undefined, 'null'].includes(value) ? '' : value);
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
    if (isobject(expr) && expr.prop) {
        return getFilteredTemplateValue(expr, context, componentInstance);
    }

    return resolveValueFromContext(expr, context, componentInstance);
};



/**
 * 
 * @param {*} args 
 * @param {*} context 
 * @param {*} event 
 */
function generateArguments(args, context, componentInstance, event) {
    return args.map(argumentMapper);

    /**
     * 
     * @param {*} arg 
     */
    function argumentMapper(node) {
        if (isarray(node)) {
            if (!node.length) return node;
            var isEvent = isequal(node[0], '$event');
            return resolveContext(node.slice(isEvent ? 1 : 0), isEvent ? event : context, componentInstance, isEvent);
        } else if (isobject(node) && node.arg)
            return generateArguments(node.arg, context, componentInstance, event);
        else if (isstring(node))
            return isequal(node, '$event') ? event : (context.hasOwnProperty(node) ? context[node] : componentInstance.hasOwnProperty(node) ? componentInstance[node] : node);

        return resolveValueFromContext(node, context, componentInstance, event);
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
    if (isundefined(expression) || isnull(expression) || isboolean(expression) || isnumber(expression) || /(#|rgb)/.test(expression))
        return expression;
    else if (isobject(expression))
        return parseObjectExpression(expression, context, componentInstance);
    else if (isarray(expression))
        return resolveContext(expression, context, componentInstance);
    else if (expression === '$this')
        return componentInstance;

    else if (isobject(context) && (expression in context))
        return context[expression];
    else if (isobject(componentInstance) && (expression in componentInstance))
        return componentInstance[expression];

    /**
     * string type matcher
     * example are .length
     */
    return context && context.hasOwnProperty(expression) ? context[expression] : null;
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
        ite: function () {
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
        call: function () {
            var dcontext = context;
            if (expression.namespaces) {
                dcontext = resolveContext(expression.namespaces, context, componentInstance);
            } else {
                dcontext = (dcontext && (expression.fn in dcontext) ? context : componentInstance);
            }

            if (dcontext && isfunction(dcontext[expression.fn])) {
                var args = generateArguments(expression.args, context, componentInstance, event);
                return dcontext[expression.fn].apply(dcontext, args);
            }

            return null;
        },
        /**
         * ObjectExpression Method
         */
        obj: function () {
            if (expression.expr) {
                return Object.keys(expression.expr).reduce(function (accum, key) {
                    accum[key] = resolveValueFromContext(expression.expr[key], context, componentInstance);
                    return accum;
                }, {});
            }
        },
        /**
         * ASSIGNMENTExpression Method
         * a = b
         */
        asg: function () {
            var value = generateArguments([expression.right], context, componentInstance, event)[0];
            return setModelValue(expression.left, context, componentInstance, value);
        },
        /**
         * UnaryExpression Method
         */
        una: function () {
            var val = resolveValueFromContext(expression.args, context, componentInstance, event);
            if (expression.ops === '+') return +val
            if (expression.ops === '-') return -val
            if (expression.ops === '~') return ~val
            if (expression.ops === '!') return !val
        },
        /**
         * BinaryExpression Method
         */
        bin: function () {
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
        new: function () {
            errorBuilder('NewExpression not allowed in template interpolation -> (new ' + expression.fn + ') ')
        },
        raw: function () {
            return expression.value;
        },
        /**
         * Member expressionf
         */
        mem: function () {
            return resolveValueFromContext(expression.list, context, componentInstance, event);
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
function setModelValue(key, context, componentInstance, value) {
    var modelContext = {};
    if (isarray(key)) {
        modelContext = resolveContext(key.slice(0, key.length - 1), context, componentInstance);
        key = key[key.length - 1];
    } else {
        modelContext = (key in context) ? context : componentInstance;
    }

    if (modelContext) {
        if (Array.isArray(key)) {
            key = resolveContext(key, context, componentInstance);
        }
        modelContext[key] = value;
    }

    // free memory
    modelContext = null;

    return value;
}


/**
 * 
 * @param {*} key 
 * @param {*} context 
 * @param {*} componentInstance 
 */
function resolveContext(key, context, componentInstance, isEventType) {
    return key.reduce(function (accum, property, idx) {
        if (isEventType) {
            return accum[property];
        }

        var componentEntry = idx ? null : componentInstance;
        if (Array.isArray(property)) {
            var value = resolveValueFromContext(property, context, componentEntry);
            return accum && accum[value];
        }
        return resolveValueFromContext(property, accum, componentEntry);
    }, context || {});
}

/**
 * 
 * @param {*} delimiterRegExp 
 * @param {*} str 
 * @param {*} replacerData 
 * @returns str
 */
export function interpolationHelper(delimiterRegExp, str, replacerData) {
    if (typeof str === 'object' || isboolean(str) || isnumber(str)) return str;
    return str.replace(delimiterRegExp, function (_, key) {
        return resolveContext(key.split('.'), replacerData);
    });
}