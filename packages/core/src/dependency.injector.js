import { isfunction } from 'js-helpers/helpers';
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
    var tokenRecords = [];
    var persists = false;
    this.tokenName = tokenName;
    /**
     * 
     * @param {*} value 
     * @param {*} wireInstant 
     */
    this.register = function(value, wireInstant) {
        value = wireInstant ? AutoWire(value) : value;
        if (multiple) {
            tokenRecords.push(value);
        } else {
            tokenRecords = value;
        }
        persists = wireInstant;
    };

    this.resolve = function() {
        var token;
        try {
            if (multiple) {
                token = tokenRecords.map(getToken);
            } else {
                token = getToken(tokenRecords);
            }
        } catch (e) {
            errorBuilder('error while resolving ' + tokenName);
        }

        if (!persists) tokenRecords = [];

        return token;
    };

    /**
     * default provide was set
     */
    if (provide) {
        this.register(provide, true);
    }

    /**
     * 
     * @param {*} token 
     */
    function getToken(token) {
        return persists ? token : AutoWire(token);
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
        var deps = resolveDeps(factory.annotations && factory.annotations.DI, localInjector);
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
        var args = resolveDeps(token.DI, localInjector);
        tokenValue = function() {
            return resolveClosureRef(token.factory).apply(null, args);
        };
    } else if (token.useClass) {
        tokenValue = Inject(token.useClass, localInjector);
    } else if (token.reference) {
        tokenValue = resolveReference(Inject(token.reference, localInjector), localInjector);
    } else if (token.value) {
        tokenValue = token.value;
    }

    return tokenValue;
}

/**
 * 
 * @param {*} DI 
 * @param {*} localInjector 
 */
function resolveDeps(DI, localInjector) {
    var deps = [];
    if (DI) {
        for (var serviceName in DI) {
            var doInject = DI[serviceName];
            var injectableParam = null;
            var err = false;
            //Try and catch injectors
            try {
                injectableParam = Inject(doInject.factory || serviceName, localInjector);
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

/**
 * 
 * @param {*} reference 
 * @param {*} localInjector 
 */
function resolveReference(reference, localInjector) {
    if (isfunction(reference)) {
        if (reference.instance)
            return reference.instance;
        else if (localInjector.has(reference))
            return localInjector.get(reference);
        /**
         * at this stage the reference is not resolved
         * cases apply to directive and component or services that re not registered to a module
         */
        else if (reference.annotations) {
            existingInstance.set(reference, null);
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
    this.has = function(injectorToken) {
        return this.injectors.hasOwnProperty(injectorToken);
    };
}

AbstractInjectorInstance.prototype.set = function(tokenName, value) {
    this.injectors[tokenName] = value;
};

AbstractInjectorInstance.prototype.get = function(injectorToken) {
    return this.injectors[injectorToken];
};

AbstractInjectorInstance.prototype.destroy = function() {
    this.injectors = null;
};