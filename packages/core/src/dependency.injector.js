import { isfunction, isstring, isobject } from 'js-helpers/helpers';
import { resolveClosureRef } from './utils/closure';

/**
 * @internal
 * used to store instance that reference using existing reference
 */
var existingInstance = new Map();

/**
 * 
 * @param {*} tokenName 
 * @param {*} multiple 
 * @param {*} provide 
 */
export function ProviderToken(tokenName, multiple, provide) {
    var tokenValue;
    this.tokenName = tokenName;
    this.register = function(value) {
        if (multiple) {
            if (!tokenValue) {
                tokenValue = [];
            }
            tokenValue.push(value);
        } else {
            tokenValue = value;
        }
    };

    this.resolve = function() {
        var token;
        try {
            if (multiple) {
                token = (tokenValue || []).map(function(token) {
                    return AutoWire(token);
                });
            } else {
                token = AutoWire(tokenValue);
            }
        } catch (e) {
            errorBuilder('error while resolving ' + tokenName);
        }

        // reset registries
        tokenValue = null;
        return token;
    };

    /**
     * default provide was set
     */
    if (provide) {
        this.register(provide);
    }
}

/**
 * 
 * @param {*} factory 
 * @param {*} localInjector 
 */
export function Inject(factory, localInjector) {
    if (localInjector && localInjector.has(factory)) {
        return localInjector.get(factory);
    } else if (isfunction(factory)) {
        /**
         * static factory
         */
        if (!factory.annotations) {
            return resolveClosureRef(factory);
        }

        var instance = factory.annotations.instance;
        if (!instance) {
            instance = AutoWire(resolveClosureRef(factory), localInjector);
            if (!factory.annotations.noSingleton) {
                factory.annotations.instance = instance;
            }
        }

        return instance;
    } else if (factory instanceof ProviderToken) {
        return factory.resolve();
    }


    return null;
};

/**
 * 
 * @param {*} factory 
 * @param {*} locals 
 * @param {*} callback 
 */
export function AutoWire(factory, localInjector, callback) {
    if (isfunction(factory)) {
        var deps = resolveDeps(factory, localInjector);
        //initialize the defined function
        //only initializes when its defined
        var protos = Object.create(factory.prototype);
        var result = factory.apply(protos, deps) || protos;

        /**
         * set the instance for reference providerToken to pick up
         */
        if (existingInstance.has(factory)) {
            existingInstance.set(factory, result);
        }
        /**
         * trigger callback if passed
         */
        if (isfunction(callback)) {
            return callback(result);
        }

        return result;
    }

    factory = resolveTokenBase(factory, localInjector);
    return factory;
};

/**
 * 
 * @param {*} deps 
 * @param {*} localInjector 
 */
export function wireResolvers(deps, localInjector) {
    if (deps) {
        for (var i = 0; i < deps.length; i++) {
            var token = deps[i];
            var tokenValue = resolveTokenBase(token, localInjector);
            if (token.name instanceof ProviderToken) {
                token.name.register(tokenValue);
            } else if (isfunction(token.name)) {
                console.log(token, tokenValue);
            }
        }
    }
}

/**
 * 
 * @param {*} token
 * @param {*} localInjector 
 */
function resolveTokenBase(token, localInjector) {
    var tokenValue;
    if (token.factory) {
        var args = (token.DI || []).map(function(dep) {
            return Inject(dep, localInjector);
        });
        tokenValue = function() {
            return resolveClosureRef(token.factory).apply(null, args);
        };
    } else if (token.useClass) {
        tokenValue = Inject(token.useClass, localInjector);
    } else if (token.reference) {
        var reference = Inject(token.reference, localInjector);
        tokenValue = resolveReference(reference, localInjector);
    } else if (token.value) {
        tokenValue = token.value;
    }

    return tokenValue;
}

/**
 * 
 * @param {*} factory 
 * @param {*} localInjector 
 */
function resolveDeps(factory, localInjector) {
    var deps = [];
    if (factory.annotations && factory.annotations.DI) {
        for (var serviceName in factory.annotations.DI) {
            var doInject = factory.annotations.DI[serviceName];
            var injectableParam = null;
            var err = false;
            //Try and catch injectors
            try {
                injectableParam = Inject(doInject.factory || serviceName, localInjector, factory.module);
            } catch (e) { err = true; } finally {
                if (err && !doInject.optional) {
                    throw new Error('Unable to resolve provider ' + serviceName);
                }
            }

            deps.push(injectableParam);
        }
    }

    return deps;
}

function resolveReference(reference, localInjector) {
    if (isfunction(reference)) {
        if (reference.instance)
            return reference.instance;
        else if (localInjector.has(reference))
            return localInjector.get(reference);
        /**
         * at this stage the reference is not resolve
         * cases apply to directive and component or services that re not registered to a module
         */
        else if (reference.annotations) {
            existingInstance.set(reference, 'PENDING');
            return function() {
                return existingInstance.get(reference);
            };
        }


        return AutoWire(reference);
    } else {
        return reference;
    }
}

export function AbstractInjectorInstance() {
    this.injectors = {};
    this.get = function(injectorToken) {
        return this.injectors[injectorToken];
    };

    this.has = function(injectorToken) {
        return this.injectors.hasOwnProperty(injectorToken);
    };

    this.set = function(tokenName, value) {
        this.injectors[tokenName] = value;
    };
}

AbstractInjectorInstance.prototype.destroy = function() {
    this.injectors = null;
};