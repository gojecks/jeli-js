/**
 * Private DependencyInjectorService
 * @param {*} restricted 
 */
function DependencyInjectorService(restricted) {
    return {
        get: DependencyInjectorService.get,
        inject: DependencyInjectorService.inject
    }
}
/**
 * 
 * @param {*} di
 * @param {*} resolver 
 */
DependencyInjectorService.get = function(di, resolver) {
    if (resolver && resolver[di]) {
        return resolver[di];
    }

    if (ProviderService._factories.has(di)) {
        return ProviderService._factories.get(di);
    }

    var dependency = null,
        inc = 0;
    /**
     * 
     * @param {*} _module 
     */
    function getDependencyFromQueue() {
        dependency = $compileTracker.compiledModule[inc].annotations.service.filter(function(fn) {
            return fn.annotations.name === di;
        })[0];
        /**
         * instance already exists
         */
        inc++;
        if (dependency) {
            //set provider when its found
            //only inject dependency
            //when its required
            if (!dependency.annotations.instance) {
                dependency.annotations.instance = dependencyInjectorMain(dependency, null, resolver);
            }

            dependency = dependency.annotations.instance;
        } else {
            if ($compileTracker.compiledModule.length > inc) {
                getDependencyFromQueue()
            }
        }
    }

    getDependencyFromQueue();

    return dependency;
};

/**
 * @param {*} fn
 * @param {*} locals
 */
DependencyInjectorService.inject = function(fn, locals) {
    var nArg = [];
    if (fn.annotations.DI && fn.annotations.DI.length) {
        nArg = fn.annotations.DI.map(function(doInject) {
            var injectedArgument = null;
            //Try and catch injectors
            if (doInject) {
                try {
                    injectedArgument = DependencyInjectorService.get(doInject, locals);
                } catch (e) {} finally {
                    if ($isNull(injectedArgument)) {
                        throw new Error('Unable to resolve provider ' + doInject);
                    }
                }
            }

            return injectedArgument;
        });
    }

    return nArg;
};

DependencyInjectorService.getRegisteredElement = function(name) {
    var dir = [];
    $compileTracker.compiledModule.forEach(getElement);

    function getElement(_module) {
        dir = dir.concat(_module.annotations.elements.filter(function(reg) {
            return !$isArray(reg.annotations.selector) ? name === reg.annotations.selector : $inArray(name, reg.annotations.selector);
        }));
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

/**
 * 
 * @param {*} fn 
 * @param {*} args 
 */
function dependencyFnWrapper(fn, args) {
    var instance = Object.create(fn.prototype),
        result = fn.apply(instance, args);
    return result ? result : instance;
}

/**
 * 
 * @param {*} fn 
 * @param {*} initializer 
 * @param {*} locals 
 */
function dependencyInjectorMain(factory, initializer, locals) {
    if ($isFunction(factory)) {
        //get all dependency injectors
        var nArg = DependencyInjectorService.inject(factory, locals);
        //initialize the defined function
        //only initializes when its defined
        if ($isFunction(initializer)) {
            return initializer(nArg);
        }

        return dependencyFnWrapper(factory, nArg);

    }

    return factory;
}


/**
 * 
 * @param {*} factory 
 * @param {*} name 
 */
function $inject(factory, name) {
    var fn, nArg;
    if ($isArray(factory)) {
        fn = factory.pop();
        //other arrays remains the dependencies
        nArg = factory;
    } else if ($isFunction(factory)) {
        nArg = factory.toString()
            .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
            .replace(/ /g, '')
            .split(',')
            .filter(function(dep) {
                return !!dep;
            });
        fn = factory;
    }

    /**
     * create a static property Annotations
     * extend with DI
     */
    fn.annotations = {
        DI: nArg,
        name: name,
        instance: null
    };

    return fn;
}