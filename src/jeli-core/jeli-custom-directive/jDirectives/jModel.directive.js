/**
 * jModel Directive
 * @private Method
 * _modelBinder holds instance of all created model
 */

var _modelBinder = new watchBinding();
/**
 * 
 * @param {*} newVal 
 * @param {*} oldVal 
 * 
 * Method is triggered each time 
 * there is an update in model or DOM element
 */
function setViewValue(newVal, oldVal) {
    if (this.canSetValue) {
        //set the new value
        if (!$isEqual(newVal, oldVal)) {
            this.elem.value = newVal || '';
            this.isProcessed = true;
        }
    } else {
        switch (this.elem.localName) {
            case ('select'):
                selectType(this, newVal, oldVal);
                break;
            case ('input'):
                checkType(this, newVal, oldVal)
                break;
            default:
                this.elem.innerHTML = newVal;
                break;
        }
    }
}

/**
 * 
 * @param {*} context 
 * @param {*} checked 
 */
function checkType(context, checked) {
    switch (context.elem.type.toLowerCase()) {
        case ('checkbox'):
            context.elem[checked ? 'setAttribute' : 'removeAttribute']('checked', true);
            context.elem.checked = checked || false;
            break;
        case ('radio'):
            if ($isEqual($typeOfValue(context.elem), checked)) {
                context.elem.setAttribute('checked', true);
            }
            break;
    }
}

/**
 * 
 * @param {*} context 
 * @param {*} newVal 
 */
function selectType(context, newVal) {
    newVal = JSON.stringify(newVal).toLowerCase();
    expect(context.elem.options).each(function(options) {
        if ($isEqual(JSON.stringify(options.value).toLowerCase(), newVal)) {
            options.selected = true;
        }
    });
}

/**
 * 
 * @param {*} elem 
 * @param {*} checker 
 */
function updateViews(elem, checker) {
    //model was modified
    (_modelBinder.$get(checker).$$views || [])
    .forEach(function(viewInstance) {
        if (!$isEqual(elem, viewInstance.elem)) {
            setViewValue.call(viewInstance,
                $modelSetterGetter(viewInstance.checker, viewInstance.$model),
                $typeOfValue(viewInstance.elem)
            );
        }
    });

}

/*
 * Jmodel _onviewModelChanged
 * @return function
 */

function _onviewModelChanged(directiveModel) {
    return function() {
        updateViews(null, directiveModel.checker);
    };
}

/**
 * jModelInstance Function
 *  @return ModelInstance
 **/

function modelInstance() {
    /**
      Model Event Listener
    **/

    var self = this;
    this.$$totalBinding = 0;
    this.$modelValue;
    this.$eventListener = new $CustomEventHandler('register', function(ev, directiveModel) {
        self.$modelValue = $typeOfValue(directiveModel.elem);
        setModelValue(directiveModel.checker, directiveModel.$model, self.$modelValue);
        //set state
        directiveModel.isProcessed = true;
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
    this.$modelValue = val;
    this.$$views.forEach(function(viewInstance) {
        setViewValue.call(viewInstance, val);
    });
};

/**
 * jModel remove view from collector
 */
modelInstance.prototype.removeFromView = function(viewIndex) {
    this.$$views = this.$$views.filter(function(directiveModel) {
        return directiveModel.jModelViewReferenceIndex != viewIndex;
    });

    return this;
};


/*
  jModel Listener
*/
modelInstance.prototype.inputListener = function(directiveModel) {
    var jModelInstance = this;
    return function(ev) {
        jModelInstance.$eventListener.$broadcast(":" + ev.type, directiveModel);
    }
};

/**
 * 
 * @param {*} directiveModel 
 */
modelInstance.prototype.__registerEvents = function(directiveModel) {
    var jModelInstance = this;
    directiveModel.modelOptions.$events.split(/\s/).forEach(function(evName) {
        var $bindingName = $isEqual(evName, 'default') ? directiveModel.eventName : evName;
        directiveModel.$$eventRegistryIdx = jModelInstance.$eventListener.register(':' + $bindingName, debounce(updateModelBindings, directiveModel.modelOptions.debounce[evName]));
        bind.call(directiveModel.elem, $bindingName, jModelInstance.inputListener(directiveModel));
    });
    return this;
};

function updateModelBindings(ev, directiveModel) {
    updateViews.call(directiveModel, directiveModel.elem, directiveModel.checker);
    $modelMapping.$digestParentAndChild(directiveModel.$model);
}

/**
 * 
 * @param {*} directiveModel 
 */
modelInstance.prototype.__unregisterEvents = function(directiveModel, one) {
    var jModelInstance = this;
    directiveModel.modelOptions.$events.split(/\s/).forEach(function(evName) {
        var $bindingName = ':' + ($isEqual(evName, 'default') ? directiveModel.eventName : evName);
        if (one) {
            jModelInstance.$eventListener.$removeOne($bindingName, directiveModel.$$eventRegistryIdx);
        } else {
            jModelInstance.$eventListener.$destroy($bindingName);
        }
    });

    return this;
};




/*
 * jModel Core Function
 * Directive Name: j-Model
 */
function prepareModel() {
    // change checker for ArrayCase
    this.checker = generateArrayKeyType(this.checker, this.$model);
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
     * set the view to the model instance
     **/
    _jModelInstance.$$views.push(this);
    // set the viewReferenceIndex
    // used to remove Object from the collector when element is removed from DOM
    this.jModelViewReferenceIndex = "jModel:" + +new Date;
    _jModelInstance.$$totalBinding++;
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
     * update the viewModel if default value is set
     */
    if (!cVal && $isDefined(eleVal)) {
        setModelValue(this.checker, this.$model, eleVal);
        //set state
        this.isProcessed = true;
    }
    _jModelInstance.$$setViewValue($isDefined(cVal) ? cVal : eleVal);
    // perform cleanUp
    // observe the element change
    _mutationObserver(this.elem, function() {
        _jModelInstance.$$totalBinding--;
        if (!_jModelInstance.$$totalBinding) {
            _modelBinder.$remove(_self.checker);
            _jModelInstance.__unregisterEvents(_self);
        } else {
            _jModelInstance
                .removeFromView(_self.jModelViewReferenceIndex)
                .__unregisterEvents(_self, true);
            _self.$unWatch();
        }

        _self = _jModelInstance = null;
    });

    return _onviewModelChanged(this);
}

$defaultDirectiveProvider.push({
    selector: "j-model",
    priority: 7,
    isDefault: true
});