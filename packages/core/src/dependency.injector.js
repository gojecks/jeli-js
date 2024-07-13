import { isfunction } from '@jeli/helpers';
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
    var _persists = true;
    var resolved = false;
    this.tokenName = tokenName;
    /**
     * 
     * @param {*} value 
     * @param {*} persist 
     */
    this.register = function(value, persist) {
        if (multiple) {
            tokenRecords.push(value);
        } else {
            tokenRecords = value;
        }
        _persists = persist;
        resolved = false;
    };

    this.resolve = function() {
        if (resolved && _persists) return tokenRecords;

        var token = null;
        try {
            if (multiple) {
                token = tokenRecords.map(getToken);
            } else {
                token = getToken(tokenRecords);
            }

            if (!_persists) tokenRecords = [];
            else tokenRecords = token;

            resolved = _persists;
        } catch (e) {
            errorBuilder('error while resolving ' + tokenName);
        }

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
        return resolved ? token : AutoWire(token);
    }
}

/**
 * 
 * @param {*} dep
 * @param {*} localInjector 
 */
export function Inject(dep, localInjector) {
    if (!dep) return null;
    if (dep.instance) {
        return dep.instance;
    } else if (dep instanceof ProviderToken) {
        return dep.resolve();
    } else if (localInjector && localInjector.has(dep.tokenName)) {
        return localInjector.get(dep);
    } else if (isfunction(dep)) {
        /**
         * static dep
         */
        if (!dep.ctors) {
            return resolveClosureRef(dep);
        }

        var instance = dep.ctors.instance;
        if (!instance) {
            instance = AutoWire(resolveClosureRef(dep), localInjector);
            if (!dep.ctors.noSingleton) {
                dep.ctors.instance = instance;
            }
        }

        return instance;
    }


    return null;
};

/**
 * 
 * @param {*} constructorFN 
 * @param {*} locals 
 * @param {*} callback 
 */
export function AutoWire(constructorFN, localInjector, callback) {
    if (isfunction(constructorFN)) {
        var deps = resolveDeps(constructorFN.ctors && constructorFN.ctors.DI, localInjector);
        //initialize the defined function
        //only initializes when its defined
        var result = null;
        if ('Reflect' in window) {
            result = Reflect.construct(constructorFN, deps);
        } else {
            var protos = Object.create(constructorFN.prototype);
            var result = constructorFN.apply(protos, deps) || protos;
        }

        /**
         * set the instance for reference providerToken to pick up
         */
        if (existingInstance.has(constructorFN)) {
            existingInstance.set(constructorFN, result);
        }
        /**
         * trigger callback if passed
         */
        if (isfunction(callback)) {
            return callback(result);
        }

        return result;
    }

    constructorFN = resolveTokenBase(constructorFN, localInjector);
    return constructorFN;
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
                token.name.register(tokenValue, false);
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
        tokenValue = resolveClosureRef.factory(token, localInjector);
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
 * @param {*} deps
 * @param {*} localInjector 
 */
function resolveDeps(deps, localInjector) {
    return (deps || []).map(function(di) {
        var injectableParam = null;
        var err = false;
        //Try and catch injectors
        try {
            injectableParam = Inject(di, localInjector);
        } catch (e) { err = true; } finally {
            if (err && !di.optional) {
                throw new Error('Unable to resolve provider ' + di.name || di.tokenName);
            }
        }

        return injectableParam;
    });
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
        else if (reference.ctors) {
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

resolveClosureRef.factory = function(token, localInjector) {
    var args = resolveDeps(token.DI, localInjector);
    return function() {
        return resolveClosureRef(token.factory).apply(null, args);
    }
};

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