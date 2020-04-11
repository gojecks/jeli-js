import { isfunction, isstring } from 'js.helpers/helpers';

function DependencyInjectorService() {}
/**
 * 
 * @param {*} factory
 * @param {*} resolver 
 */
DependencyInjectorService.get = function(factory, resolver, moduleName) {
    if (isstring(factory)) {
        if (resolver && (factory in resolver)) {
            return resolver[factory];
        }

        if (InternalProviderService.has(factory)) {
            return InternalProviderService.get(factory);
        }

        // var entryModule = CoreBootstrapContext.compiledModule;
        // var requiredModule = entryModule.annotations.requiredModules;
        // function getDependencyFromQueue() {
        //     factory = _getService(entryModule, di);
        //     if (entryModule.annotations.services.has(di)) {
        //         return entryModule.annotations.services.get(di);
        //     } else if (requiredModule && requiredModule.length > inc) {
        //         entryModule = CoreModuleFactory.get(requiredModule[inc]);
        //         inc++;
        //         return getDependencyFromQueue();
        //     }
        // }
    }


    if (isfunction(factory)) {
        //set provider when its found
        //only inject dependency
        //when its required
        var dependency = factory.annotations.instance;
        if (!dependency) {
            dependency = DependencyInjectorService.inject(factory, resolver);
            if (!factory.annotations.noSingleton) {
                factory.annotations.instance = dependency;
            }
        }

        return dependency;
    }

    return null;
};

/**
 * 
 * @param {*} factory 
 * @param {*} locals 
 * @param {*} callback 
 */
DependencyInjectorService.inject = function(factory, locals, callback) {
    if (isfunction(factory)) {
        var nArg = [];
        if (factory.annotations.DI) {
            nArg = Object.keys(factory.annotations.DI).map(function(serviceName) {
                var doInject = factory.annotations.DI[serviceName];
                var injectedArgument = null;
                //Try and catch injectors
                try {
                    injectedArgument = DependencyInjectorService.get(doInject.factory || serviceName, locals, factory.module);
                } catch (e) { console.error(e); } finally {
                    if (!injectedArgument && !doInject.optional) {
                        throw new Error('Unable to resolve provider ' + serviceName);
                    }
                }

                return injectedArgument;
            });
        }
        //initialize the defined function
        //only initializes when its defined
        var protos = Object.create(factory.prototype);
        var result = factory.apply(protos, args);

        if (isfunction(callback)) {
            return callback(result ? result : protos);
        }

        return result ? result : protos;
    }

    return factory;
};

/**
 * @param {*} name
 * @param {*} type
 */
DependencyInjectorService.getRegisteredElement = function(name, type) {
    var dir = [];
    getElement(CoreBootstrapContext.compiledModule);
    if (CoreBootstrapContext.compiledModule.annotations.requiredModules) {
        CoreBootstrapContext.compiledModule.annotations.requiredModules.forEach(function(moduleName) {
            getElement(ModuleService._factories.get(moduleName));
        });
    }

    function getElement(_module) {
        if (_module.annotations[type].has(name)) {
            dir.push(_module.annotations[type].get(name));
        }
    }

    return dir;
};

/*
  @Function Binding
  @argument {Function} {ARRAY}
  @return Function
*/
DependencyInjectorService.binding = function(fn, arg) {
    var Temp = function() {
        return fn.apply(this, arg);
    };

    Temp.prototype = fn.prototype;
    return init;
};

export var publicDependencyInjector = {
    get: DependencyInjectorService.get,
    inject: DependencyInjectorService.inject
};