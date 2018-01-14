/*
Model Processor for j-Model Element
*/

var _modelBinder = new watchBinding();

// set default value
function setViewValue(newVal, oldVal) {
    if (this.canSetValue) {
        //set the new value
        if (!$isEqual(newVal, oldVal)) {
            this.elem.value = newVal || '';
            this.isProcessed = false;
        }
    } else {
        switch (this.elem.localName) {
            case ('select'):
                performOptions('select', this)(newVal, oldVal);
                break;
            case ('input'):
                performOptions('checked', this)(newVal, oldVal)
                break;
            default:
                this.elem.innerHTML = newVal;
                break;
        }
    }
}

function performOptions(type, context) {
    var _options = {};
    _options.select = function(newVal) {
        expect(context.elem.options).each(function(options) {
            if (options.value === newVal) {
                options.selected = true;
            }
        });
    };

    _options.checked = function(checked) {
        switch (context.elem.type.toLowerCase()) {
            case ('checkbox'):
                context.elem[checked ? 'setAttribute' : 'removeAttribute']('checked', true);
                break;
            case ('radio'):
                if ($isEqual(context.elem.value, checked)) {
                    context.elem.setAttribute('checked', true);
                }
                break;
        }

    };

    return function() {
        (_options[type] || noop).apply(null, arguments)
    };
}

function updateViews(elem, checker) {
    //model was modified
    var _jModelInstance = _modelBinder.$get(checker);

    _jModelInstance.$$views.forEach(function(viewInstance) {
        if (!$isEqual(elem, viewInstance.elem)) {

            var val = $modelSetterGetter(viewInstance.checker, viewInstance.$model),
                eleVal = $typeOfValue(viewInstance.elem);
            setViewValue.call(viewInstance, val, eleVal);
        }

    });

}

/*
  Jmodel _onviewModelChanged
  @return function
*/

function _onviewModelChanged(checker) {
    return function() {
        updateViews(null, checker);
    };
}

/**
  jModelInstance Function
  @return ModelInstance
**/

function modelInstance() {
    /**
      Model Event Listener
    **/

    var self = this;
    this.$eventListener = new $CustomEventHandler('register', function(ev, elem) {
        var modelInstance = self.getView(elem);
        setModelValue(modelInstance.checker, modelInstance.$model, $typeOfValue(elem));
        //set state
        modelInstance.isProcessed = true;
    });

    this.$$views = [];

    // getView Function
    this.getView = function(ele) {
        if (!ele) { return null; }

        return this.$$views.filter(function(ins) {
            return ins.elem === ele;
        })[0];
    };
}

/*
  Jmodel setViewValue Method
*/
modelInstance.prototype.$$setViewValue = function(val) {
    this.$$views.forEach(function(viewInstance) {
        setViewValue.call(viewInstance, val);
    });
};


/*
  jModel Listener
*/
modelInstance.prototype.inputListener = function() {
    var jModelInstance = this;
    return function(ev) {
        jModelInstance.$eventListener.$broadcast(":" + ev.type, this);
    }
};

/**
 * 
 * @param {*} jModelObj 
 */
modelInstance.prototype.__registerEvents = function(jModelObj) {
    var jModelInstance = this;

    jModelObj.modelOptions.$events.split(/\s/).forEach(function(evName) {
        var $bindingName = $isEqual(evName, 'default') ? jModelObj.eventName : evName;
        jModelInstance.$eventListener.register(':' + $bindingName, debounce(updateModelBindings, jModelObj.modelOptions.debounce[evName]));
        bind.call(jModelObj.elem, $bindingName, jModelInstance.inputListener());
    });

    function updateModelBindings(ev, elem) {
        var modelInstance = jModelInstance.getView(elem);
        $modelMapping.$digestParentAndChild(modelInstance.$model);
        updateViews.call(modelInstance, elem, modelInstance.checker);
        modelInstance = null;
    }
};

/**
 * 
 * @param {*} jModelObj 
 */
modelInstance.prototype.__unregisterEvents = function(jModelObj) {
    var jModelInstance = this;
    jModelObj.modelOptions.$events.split(/\s/).forEach(function(evName) {
        var $bindingName = $isEqual(evName, 'default') ? jModelObj.eventName : evName;
        jModelInstance.$eventListener.$destroy(evName);
    });
}




/*
  jModel Core Function
  Directive Name: j-Model
*/
function prepareModel() {
    var evName = this.eventName = $typeOfModel(this.elem),
        cVal = $modelSetterGetter(this.checker, this.$model, true),
        eleVal = $typeOfValue(this.elem),
        _self = this;

    if (!_modelBinder.hasProp(this.checker)) {
        _modelBinder.$new(this.checker, (new modelInstance));
    }

    var _jModelInstance = _modelBinder.$get(this.checker);
    this.modelOptions = extend(true, {
        $events: 'default',
        debounce: {
            default: 0
        }
    }, maskedEval(this.$attr['model-options']) || {});

    /**
      set the view to the model instance
    **/
    _jModelInstance.$$views.push(this);
    this.isProcessed = false;

    //Check for setting Value
    //onChange Input Types shouldn't change Value
    this.canSetValue = $isEqual('input', evName);
    _jModelInstance.__registerEvents(this);
    // check for external binder
    if (this.$attr.getAttribute('@listener')) {
        _jModelInstance
        // bind Listener to jModel
            .$eventListener.register(':' + evName, function(ev, elem) {
            execFnByName(_self.$attr.getAttribute('@listener'), _self.$model, elem);
        });
    }

    /*
      update the viewModel if default value is set
    */
    if (!cVal && eleVal) {
        setModelValue(this.checker, this.$model, eleVal);
        //set state
        this.isProcessed = true;
    }

    _jModelInstance.$$setViewValue(cVal || eleVal);


    // perform cleanUp
    // observe the element change
    _mutationObserver(this.elem, function() {
        if (_jModelInstance.$$views.length < 2) {
            _modelBinder.$remove(_self.checker);
            _jModelInstance.__unregisterEvents(_self);
        }

        _self.$unWatch();
        _self = _jModelInstance = null;
    });


    return _onviewModelChanged(this.checker);
}

$defaultDirectiveProvider.push({
    selector: "j-model",
    priority: 7,
    isDefault: true
});