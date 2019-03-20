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

        if ($inArray(options.selector, _module.options.exports)) {
            _module._factories.set(options.selector, controller);
        }

        return this;
    };

    //Module Provider 
    this.provider = function(name, provider) {
        provider = $inject(provider, name);
        provider.moduleName = _module.moduleName;
        provider.provider = '$jProvideProvider';
        _module.annotations.service.push(provider);

        return this;
    };

    this.service = function(name, serviceFn) {
        serviceFn = $inject(serviceFn, name);
        serviceFn.moduleName = _module.moduleName;
        serviceFn.provider = '$jServiceProvider';
        _module.annotations.service.push(serviceFn);
        return this;
    };

    this.config = function(configFn) {
        configFn = $inject(configFn);
        configFn.provider = '$jConfigProvider';
        configFn.moduleName = _module.moduleName;
        _module.annotations.config.push(configFn);
        return this;
    };

    //$value that runs in compile mode
    this.value = function(name, value) {
        _module.annotations.service.push({
            annotations: {
                name: name,
                instance: ($isFunction(value) ? value() : value),
            },
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
ModuleService._factories = new Map();
/**
 * @method injectRequiredModule
 */
ModuleService.compileModule = function(_module, cb) {
    ProviderService.resolver(_module.annotations.config);
    ProviderService.resolver(_module.annotations.initializers);

    if (_module.options.requiredModules) {
        _module.options.requiredModules.forEach(function(moduleName) {
            var _module = ModuleService._factories.get(moduleName);
            if (_module) {
                //add the required Module to the bootstraped App
                ModuleService.compileModule(_module);
            } else {
                throw new Error('Unable to resolve module ' + moduleName);
            }
        });
    }
}