/**
 * 
 * @param {*} ele 
 * @param {*} check 
 */
function ignoreProcessCheck(ele, check) {
    var elem = element(ele),
        ignore = elem.data('ignoreProcess');

    if (!check) {
        return ignore || [];
    }

    if ($isUndefined(ignore)) {
        elem.data({ ignoreProcess: [check] })
    } else {
        if (!$inArray(check, ignore)) {
            ignore.push(check);
        }
    }
}


/**
 * 
 * @param {*} name 
 */
function directiveMatcher(name) {
    var str = name.match(/[A-Z]/g),
        matcher = name;
    if (str.length > 0) {
        domElementProvider.each(str, function(i, n) {
            matcher = matcher.replace(n, '-' + n.toLowerCase());
        });
    }
    return matcher;
}

/**
 * 
 * @param {*} list 
 * @param {*} found 
 */
function organiseFoundElement(list, found) {
    if (list.length && list) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].className.indexOf(eliBindedClass) < 0) {
                found.push(list[i]);
            }
        }
    }

    return found;
}

//Function directive restriction
/**
 * 
 * @param {*} dir 
 */
function getDirectiveRestriction(dir) {

    return (dir.allowType || 'AE').toLowerCase();
}


//Directive Element Matcher
/**
 * 
 * @param {*} allowType 
 * @param {*} name 
 */
function findDirective(allowType, name) {
    var types = allowType.split(''),
        i,
        ele;

    this.ret = [];

    for (i in types) {
        switch (types[i].toLowerCase()) {
            case ('c'):
                organiseFoundElement(document.getElementsByClassName('.' + name), this.ret);
                break;
            case ('e'):
                organiseFoundElement(document.getElementsByTagName(name), this.ret);
                break;
            case ('a'):
                organiseFoundElement(document.querySelectorAll('[' + name + ']'), this.ret);
                break;
        }
    }
    return this.ret;
}

/**
 * 
 * @param {*} parentController 
 * @param {*} module 
 */
function getParentControllerModel(parentController, module) {
    if (!$isUndefined(parentController)) return $controllers[module][parentController].$scope;

    return null;
}

//structure require Model 
//Useful in Directive Compiler
/**
 * 
 * @param {*} model 
 * @param {*} replacerModel 
 */
function structureModel(model, replacerModel) {
    return function(attr, attrModel) {
        if ($isObject(attr) && $isObject(attrModel)) {
            domElementProvider.each(attrModel, function(name, value) {
                if (value.match(/[&@=?]/g)) {
                    if (expect('=?').contains(value)) {
                        model[name] = $modelSetterGetter(attr[name], replacerModel);
                    } else {
                        value = value.split(/[&@=]/g)[1];
                        model[name] = copy($modelSetterGetter(attr[value], replacerModel));
                    }

                }
            });
        }
        return model;
    }
}

//compile element scope
/**
 * 
 * @param {*} ele 
 * @param {*} attr 
 * @param {*} model 
 */
function $compileScope(attr, $model) {
    var model,
        isIsolated = $isObject(this.props);

    if (!isIsolated) {
        model = $model.$new();
    } else {
        model = $model.$new(1);
        model.$$watchList = [];
        model.$$isIsolated = true;
    }

    return structureModel(model, $model)(attr, this.props);
}

//compile element Attribute
function $compileAttribute() {
    var attr = { $$ele: this };
    if (this.attributes) {
        findInList.call(getAttributes.call(this), function(name, node) {
            if (node.name.indexOf('data-') > -1) {
                node.name = node.name.replace('data-', '');
            }

            attr[camelCase.call(node.name)] = node.value;
        });
    }

    return attr;
}

/**
 * 
 * @param {*} obj 
 * @param {*} ele 
 * @param {*} attr 
 */
function directiveTemplateBuilder(obj, ele, attr) {
    var defer = new $p(),
        getTemplateValue = function(tempVal) {
            return ($isFunction(tempVal)) ? tempVal.apply(null, [ele, attr]) : tempVal;
        };

    if (obj.template) {
        //resolve our template
        defer.resolve(getTemplateValue(obj.template));
    } else if (obj.templateUrl) {
        var url = getTemplateValue(obj.templateUrl),
            _cache = $provider.$get('$templateCache').get(url);

        //template was stored in templateCache
        if (_cache) {
            defer.resolve(_cache);
        } else {
            //get resource from server
            $http({ url: url, cache: true })
                .done(function(template) {
                    defer.resolve(template.data);
                });
        }
    } else {
        //element is having children
        defer.resolve();
    }

    return defer;
}

//jElement compilerFn
/**
 * 
 * @param {*} options 
 */
function jElementCompilerFn(options) {
    this.allowType = 'AE';
    this.transplace = false;
    //compiler function
    this.$compiler = function(element, attr, init) {
        return this.$init;
    };
    //initialize function
    //Only initialized after build
    this.$init = function(ele, attr, model) {};

    this.controller = function() {};
    this.controllerAs = "$ctrl";
    this.props = true;
    this.priority = 1;
    this.selector = "";
    this.style = "";

    for (var prop in options) {
        this[prop] = options[prop];
    }
}

// registerComponentToWatch
/**
 * 
 * @param {*} ele 
 * @param {*} model 
 * @param {*} canCompile 
 */
function registerComponentToWatch(ele, model, canCompile) {
    ele.data('jModel', model.$mId);
    //element can compile
    if (ele[0].hasChildNodes()) {
        $templateCompiler(ele[0])(model);
        //Add event Watcher to the ele
        // set element observer only when the 
        // ParentModel is different from the childModel
        $observeElement(ele[0], model.$mId, model.onDestroy);
    }
}

// registerComponentToProcess
/**
 * 
 * @param {*} ele 
 * @param {*} componentName 
 */
function registerComponentToProcess(ele, componentName) {
    //set the refID of the directive
    if (!ele[0]['$object:id']) {
        ele[0]['$object:id'] = getUID();
    }

    //bind eli class to element 
    ignoreProcessCheck(ele[0], componentName);
}

// attach component styles
/**
 * 
 * @param {*} style 
 * @param {*} ele 
 */
function attachComponentStyles(style, ele) {
    if (style && ele) {
        if ($isString(style)) {
            customStyleSheetAppender(style, ele[0]);
        } else {
            var externalLoader = new loadExternalScript(ele[0]);
            externalLoader.css(style);
        }
    }
}

//directives initializer
//@Private Function initializeDirective
//@arguments (Object) directive to initializes
//@argument (String) module name
//@return function (DOM Element)
/**
 * 
 * @param {*} obj 
 * @param {*} ele 
 * @param {*} model 
 */
function initializeDirective(obj, ele, $model) {
    registerComponentToProcess(ele, obj.selector);
    var _directive = new jElementCompilerFn(obj),
        _linker,
        replacerFn,
        attr = $compileAttribute.call(ele[0]);
    /**
     * retrieve linker Function
     */
    _linker = _directive.$compiler.apply(_directive, [ele, attr]);

    /**
     * Process the replace configuration
     * replace : true || 'element'
     */
    if (_directive.transplace) {
        _directive.elem = ele[0];
        /**
         * generate a replacer function 
         * that will be passed to the compiler
         */
        replacerFn = domElementReplacerFn.call(_directive, _directive.selector, attr[_directive.selector]);

        if (_directive.isDetachedElem) {
            ele = element(_directive.elem);
        } else {
            ele.data('$replacerFn', replacerFn);
        }
    }

    //build Directive template
    directiveTemplateBuilder(_directive, ele, attr)
        .then(function(template) {
            ele.html(template);
            //Initialize directive
            var model = $compileScope.call(_directive, attr, $model);
            //initialize the linker function
            _linker.apply(_linker, [ele, attr, model, replacerFn]);
            // register Component to watchList
            registerComponentToWatch(ele, model);
        });

    _directive = null;

}


// jComponent Compiler
/**
 * 
 * @param {*} obj 
 * @param {*} ele 
 * @param {*} model 
 */
function initializeComponent(obj, ele, model) {
    var _component = new jElementCompilerFn(obj),
        attr = $compileAttribute.call(ele[0]),
        controllerAs = _component.controllerAs || '$ctrl',
        _model = model.$new(1);

    registerComponentToProcess(ele, obj.selector);
    // initilize the directive
    $provider.$jControllerProvider.$initialize(_component.controller, _model, null, controllerAs);
    structureModel(_model[controllerAs], model)(attr, _component.props);
    //build Directive template
    directiveTemplateBuilder(_component, ele[0], attr)
        .then(function(template) {
            // register Component to watchList
            registerComponentToWatch(ele, _model);
            attachComponentStyles(_component.style, ele);

            // trigger the init
            (_model[controllerAs].onInit || function() {}).apply(_model[controllerAs], [ele]);
        });
}