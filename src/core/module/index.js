/**
 * 
 * @param {*} options 
 */
function ModuleService(_module) {
    if (!_module.annotations) {
        _module.annotations = {
            initializers: [],
            elements: [],
            service: [],
            config: []
        };
    }

    this.init = function(fn) {
        _module.annotations.initializers.push($inject(fn));
    };

    //directive Provider caller
    this.directive = function(options, controller) {
        controller.provider = '$jElementProvider';
        controller.annotations = options;
        _module.annotations.elements.push(controller);

        return this;
    };

    /**
     * JCOMPONENT for creating custom COMPONENTS
     * {
     * "selector" : "",
     * "template" : "",
     * "props" : {},
     * "controller": "DefineController",
     * "controllerDI" : [],
     * "templateUrl": "",
     * "style": "",
     * "controllerAs": "",
     * "componentAs": ""
     * }
     */
    this.element = function(options, controller) {
        options.$isComponent = true;
        controller.annotations = options;
        controller.provider = '$jElementProvider';
        _module.annotations.elements.push(controller);

        return this;
    };

    //Module Provider 
    this.provider = function(name, provider) {
        provider.provider = '$jProvideProvider';
        provider.annotations = {
            name: name,
            instance: (new provider)
        };
        _module.annotations.service.push(provider);

        return this;
    };

    this.service = function(name, serviceFn) {
        serviceFn = $inject(serviceFn, name);
        serviceFn.provider = '$jServiceProvider';
        _module.annotations.service.push(serviceFn);
        return this;
    };

    this.config = function(configFn) {
        configFn.provider = '$jConfigProvider';
        _module.annotations.config.push($inject(configFn));
        return this;
    };

    //$value that runs in compile mode
    this.value = function(name, value) {
        _module.annotations.service.push({
            name: name,
            value: ($isFunction(fn) ? fn() : fn),
            provider: '$jValueProvider'
        });
        return this;
    };
}

/*
 *  options {
 *    delimiter : ['{%','%}']
 * }
 */
ModuleService.delimiterProcessor = function(options) {
    if (options.delimiter && $isArray(options.delimiter)) {
        _defaultTemplateExp = new RegExp(
            options.delimiter.join('@').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").split('@').join('(.*?)'), "g"
        );
    }
};

/**
 * Static Method
 */
ModuleService['[[entries]]'] = [];
ModuleService.get = function(moduleName) {
    return ModuleService['[[entries]]'].filter(function(_module) {
        return _module.moduleName === moduleName;
    })[0];
};

/**
 * @method injectRequiredModule
 */
ModuleService.injectRequiredModule = function(required, cb) {
    required.forEach(function(moduleName) {
        var _module = ModuleService.get(moduleName);
        if (_module) {
            ProviderService.resolveConfig(_module.annotations.config);
            //add the required Module to the bootstraped App
            if (_module.options.requiredModules) {
                ModuleService.injectRequiredModule(_module.options.requiredModules);
            }

            if (cb) {
                cb(_module);
            }
        }
    });
}