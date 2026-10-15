import { isobject, isequal, isboolean, isundefined, isnull, isstring, isarray, isnumber, isfunction } from '@jeli/helpers';
import { errorBuilder } from '../utils/errorLogger';
import { Inject } from '../dependency.injector';
import { SCOPE_PARENT, LOCAL_SCOPE_TAG } from './renderer/utils';
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
            // `in` doesn't walk SCOPE_PARENT, so use resolveIdentifier instead
            return isequal(node, '$event') ? event : resolveIdentifier(node, context, componentInstance, node);

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

    return resolveIdentifier(expression, context, componentInstance);
}

/**
 * Resolves a bare identifier: walks context's own props, then SCOPE_PARENT chain, then componentInstance. See catalogue [[jeli-js]] "*for row click-assignment".
 * @param {string} name
 * @param {*} context
 * @param {*} componentInstance
 */
export function resolveIdentifier(name, context, componentInstance, notFoundValue = null) {
    var scope = context;
    // walk only genuine *for/*if row scopes (own-properties-only by design) via their explicit parent
    while (scope !== null && typeof scope === 'object' && scope[LOCAL_SCOPE_TAG]) {
        if (Object.prototype.hasOwnProperty.call(scope, name)) {
            return scope[name];
        }
        scope = scope[SCOPE_PARENT];
    }

    // chain exhausted, or scope was never a local scope (componentInstance itself, or a
    // resolved namespace segment) - normal `in` semantics, so a prototype getter is found too
    if (scope !== null && typeof scope === 'object' && (name in scope)) {
        return scope[name];
    }

    return (isobject(componentInstance) && (name in componentInstance)) ? componentInstance[name] : notFoundValue;
}

/**
 * Resolves and invokes a no-namespace call by name. See .claude/notes catalogue [[jeli-js]] "Compiled event bindings".
 * @param {string} name
 * @param {Array} args
 * @param {*} context
 * @param {*} componentInstance
 */
export function resolveCall(name, args, context, componentInstance) {
    var dcontext = (context && (name in context)) ? context : componentInstance;
    var hasContext = !isnull(dcontext) && !isundefined(dcontext);
    if (hasContext && isfunction(dcontext[name])) {
        return dcontext[name].apply(dcontext, args);
    }

    return null;
}

/**
 * Resolves and invokes a namespaced call (`a.b.fn(args)`). See catalogue [[jeli-js]] "Compiled event bindings".
 * @param {Array<string>} namespaces
 * @param {string} name
 * @param {Array} args
 * @param {*} context
 * @param {*} componentInstance
 */
export function resolveNamespacedCall(namespaces, name, args, context, componentInstance) {
    var dcontext = resolveContext(namespaces, context, componentInstance);
    var hasContext = !isnull(dcontext) && !isundefined(dcontext);
    if (hasContext && isfunction(dcontext[name])) {
        return dcontext[name].apply(dcontext, args);
    }

    return null;
}

/**
 * Resolves a call whose namespace root is `$event` (`$event.stopPropagation()`). See catalogue [[jeli-js]] "$event in compiled event bodies".
 * @param {Array<string>} remainingNamespaces
 * @param {string} name
 * @param {Array} args
 * @param {*} event
 */
export function resolveEventNamespacedCall(remainingNamespaces, name, args, event) {
    var dcontext = remainingNamespaces.reduce(function (accum, property) {
        return isnull(accum) || isundefined(accum) ? accum : accum[property];
    }, event);
    var hasContext = !isnull(dcontext) && !isundefined(dcontext);
    if (hasContext && isfunction(dcontext[name])) {
        return dcontext[name].apply(dcontext, args);
    }

    return null;
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
        ite: ()  =>(
                resolveValueFromContext(expression.test, context, componentInstance) ?
                    resolveValueFromContext(expression.cons, context, componentInstance) :
                    resolveValueFromContext(expression.alt, context, componentInstance)
        ),
        /**
         * CallExpression Method
         * a.b.c(args) || a(1)
         */
        call: function () {
            if (expression.namespaces) {
                var namespacedArgs = generateArguments(expression.args, context, componentInstance, event);
                return resolveNamespacedCall(expression.namespaces, expression.fn, namespacedArgs, context, componentInstance);
            }

            var dcontext = (context && (expression.fn in context) ? context : componentInstance);
            // dcontext can be a valid falsy primitive (0/''/false), so only null/undefined excludes it
            var hasContext = !isnull(dcontext) && !isundefined(dcontext);
            if (hasContext && isfunction(dcontext[expression.fn])) {
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
            const value = generateArguments([expression.right], context, componentInstance, event)[0];
            return setModelValue(expression.left, context, componentInstance, value);
        },
        /**
         * UnaryExpression Method
         */
        una: function () {
            let val = resolveValueFromContext(expression.args, context, componentInstance, event);
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
        new: () => errorBuilder('NewExpression not allowed in template interpolation -> (new ' + expression.fn + ') '),
        raw: () => expression.value,
        /**
         * Member expressionf
         */
        mem: () => resolveValueFromContext(expression.list, context, componentInstance, event)
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
    const entries = !isarray(key) ? key.split('.') : key.concat();
    let modelContext = (Object.is(context, componentInstance) ? componentInstance : (entries[0] in context ? context : componentInstance));
    let property = entries.pop();
    // array mapped key e.g test.key[idx]
    if (isarray(property)){
        property = resolveContext(property, context, componentInstance);
    }

    if(key.length){
        modelContext = entries.reduce((accum, k) => {
            if(!accum.hasOwnProperty(k)){
                accum[k] = {};
            }

            return accum[k];
        }, modelContext);
    }

    // set the value
    if (modelContext){
         modelContext[property] = value;
    }
    
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
            const value = resolveValueFromContext(property, context, componentEntry);
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