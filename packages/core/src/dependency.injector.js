import { isfunction, isstring } from 'js-helpers/helpers';
import { resolveClosureRef } from './utils/closure';



/**
 * 
 * @param {*} tokenName 
 * @param {*} defaultValue 
 * @param {*} multiple 
 */
export function ProviderToken(tokenName, multiple) {
    var _registries = [];
    this.name = tokenName;
    this.register = function(value) {
        _registries.push(value);
    };

    this.resolve = function() {
        var token = null
        if (multiple) {
            token = _registries;
        } else {
            token = _registries.pop();
        }
        // reset registries
        _registries = [];
        return token;
    };
}

/**
 * 
 * @param {*} factory
 * @param {*} resolver 
 */
export function Inject(factory, resolver) {
    if (isstring(factory)) {
        if (resolver && resolver.hasOwnProperty(factory)) {
            return resolver[factory];
        }
    } else if (isfunction(factory)) {
        var instance = factory.annotations.instance;
        if (!instance) {
            instance = AutoWire(resolveClosureRef(factory), resolver);
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
export function AutoWire(factory, locals, callback) {
    if (isfunction(factory)) {
        var nArg = [];
        if (factory.annotations.DI) {
            for (var serviceName in factory.annotations.DI) {
                var doInject = factory.annotations.DI[serviceName];
                var injectableParam = null;
                //Try and catch injectors
                try {
                    injectableParam = Inject(doInject.factory || serviceName, locals, factory.module);
                } catch (e) { console.error(e); } finally {
                    if (!injectableParam && !doInject.optional) {
                        throw new Error('Unable to resolve provider ' + serviceName);
                    }
                }

                nArg.push(injectableParam);
            }
        }
        //initialize the defined function
        //only initializes when its defined
        var protos = Object.create(factory.prototype);
        var result = factory.apply(protos, nArg);

        if (isfunction(callback)) {
            return callback(result ? result : protos);
        }

        return result ? result : protos;
    }

    return factory;
};