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
        var len = context.elem.options.length;
        while (len--) {
            var option = context.elem.options[len];
            if (option.value === newVal) {
                option.selected = true;
            }
        }
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
        if (modelInstance) {
            setModelValue(modelInstance.checker, modelInstance.$model, $typeOfValue(modelInstance.elem));
            modelInstance.$model.$consume();

            updateViews.call(modelInstance, modelInstance.elem, modelInstance.checker);
            //set state
            modelInstance.isProcessed = true;
        }
    });

    this.$$views = [];

    // getView Function
    this.getView = function(ele) {
        if (!ele) { return null; }

        return this.$$views.filter(function(ins) {
            return ins.elem === ele;
        })[0];
    }
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


/*
  jModel Core Function
  Directive Name: j-Model
*/
function prepareModel() {
    var evName = $typeOfModel(this.elem),
        cVal = $modelSetterGetter(this.checker, this.$model, true),
        eleVal = $typeOfValue(this.elem),
        _self = this;

    if (!_modelBinder.hasProp(this.checker)) {
        _modelBinder.$new(this.checker, (new modelInstance));
    }

    var _jModelInstance = _modelBinder.$get(this.checker);
    /**
      set the view to the model instance
    **/
    _jModelInstance.$$views.push(this);

    this.isProcessed = false;

    //Check for setting Value
    //onChange Input Types shouldn't change Value
    this.canSetValue = $isEqual('input', evName);

    bind.call(this.elem, evName, _jModelInstance.inputListener());
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


    return _onviewModelChanged(this.checker);
}

$defaultDirectiveProvider.push({
    selector: "j-model",
    priority: 7,
    isDefault: true
});