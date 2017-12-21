/**
 * 
 * @param {*} name 
 * @param {*} options 
 */
function $jModule(name, options) {
    if (!module.hasOwnProperty(name) && !options) {
        errorBuilder(name + ' Module was not Found');
    }

    if (!module.hasOwnProperty(name)) {

        module[name] = (new jEliModuleInstance());
        module[name].appName = name;
        module[name]['require'] = options.requiredModules || [];

        // process Options
        processOptions(options);
    }

    return module[name];
}


// jEli Option Processor
/*
  options {
    delimiter : ['{%','%}']
  }

*/
function processOptions(options) {
    if (options.delimiter && $isArray(options.delimiter)) {
        _defaultTemplateExp = new RegExp(
            options.delimiter.join('@').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").split('@').join('(.*?)'), "g"
        );
    }
}



// jEli Module Instance Class
function jEliModuleInstance() {
    this.jInjector = dependencyInjectorMain;
    this.require = [];
    this._jQueue = [];
}

jEliModuleInstance.prototype.init = function(fn) {
    $provider.$get('$jInitProvider').register(this.appName, $inject(fn));
};

//directive Provider caller
jEliModuleInstance.prototype.jElement = function(name, fn) {
    if ($isString(name) && name.indexOf('-') < 0 && !$isUndefined(fn)) {
        //add the object to _jInjector Array
        this._jQueue.push(queueBuilder('$jElementProvider', [name, 'unregistered']));
        $provider.$get('$jElementProvider').register(this.appName, name, $inject(fn));
    }

    return this;
};

/*
  JCOMPONENT for creating custom COMPONENTS
  {
    "selector" : "",
    "template" : "",
    "props" : {},
    "controller": "DefineController",
    "controllerDI" : [],
    "templateUrl": "",
    "style": "",
    "controllerAs": "",
    "componentAs": ""
  }
*/
jEliModuleInstance.prototype.jComponent = function(component) {
    if ($isObject(component)) {
        var name = camelCase.call(component.selector);
        // set the allowType
        component.allowType = 'E';
        component.$isComponent = true;
        //add the object to _jInjector Array
        this._jQueue.push(queueBuilder('$jComponentProvider', [name]));
        $provider.$get('$jComponentProvider').register(this.appName, name, component);
    }

    return this;
};

//Module Provider 
jEliModuleInstance.prototype.jProvider = function(name, fn) {
    if ($isString(name) && !$isUndefined(fn)) {
        //add the object to _jInjector Array
        this._jQueue.push(queueBuilder('$jProvideProvider', [name, 'unregistered']));
        $provider.$get('$jProvideProvider').register(this.appName, name, new fn);
    }

    return this;
};


jEliModuleInstance.prototype.jFactory = function(name, fn) {
    if ($isString(name) && !$isUndefined(fn)) {
        //add the object to _jInjector Array
        this._jQueue.push(queueBuilder('$jFactoryProvider', [name, 'unregistered']));
        $provider.$get('$jFactoryProvider').register(this.appName, name, $inject(fn));
    }

    return this;
};

jEliModuleInstance.prototype.jService = function(name, fn) {
    if ($isString(name) && !$isUndefined(fn)) {
        //add the object to _jInjector Array
        this._jQueue.push(queueBuilder('$jServiceProvider', [name, 'unregistered']));
        $provider.$get('$jServiceProvider').register(this.appName, name, $inject(fn));
    }

    return this
};

jEliModuleInstance.prototype.jConfig = function(a) {
    //add the object to _jInjector Array
    this._jQueue.push(queueBuilder('$jConfigProvider', [name]));
    $provider.$get('$jConfigProvider').register(this.appName, [$inject(a)]);

    return this;
};

jEliModuleInstance.prototype.jFilter = function(name, fn) {
    if (!$isUndefined(name) && !$isUndefined(fn)) {
        this._jQueue.push(queueBuilder('$jFilterProvider', [name, 'unregistered']));
        $provider.$get('$jFilterProvider').register(this.appName, name, $inject(fn));
    }

    return this;
};

jEliModuleInstance.prototype.jController = function(name, fn) {
    if (!$isUndefined(name) && !$isUndefined(fn)) {

        this._jQueue.push(queueBuilder('$jControllerProvider', [name]));
        $provider.$get('$jControllerProvider').register(this.appName, name, $inject(fn));
    }

    return this;
};

//$value that runs in compile mode
jEliModuleInstance.prototype.jValue = function(name, fn) {
    if (!$isUndefined(name) && !$isUndefined(fn)) {
        //add the object to _jInjector Array
        this._jQueue.push(queueBuilder('$jValueProvider', [name]));
        $provider.$get('$jValueProvider').register(this.appName, name, ($isFunction(fn) ? fn() : fn));
    }

    return this;
};