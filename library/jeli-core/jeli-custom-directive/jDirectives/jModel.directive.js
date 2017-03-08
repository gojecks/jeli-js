/*
Model Processor for j-Model Element
*/

var _modelBinder = new watchBinding(),
_modelBinderSubscribers = new $eventStacks();

    // set default value
function setViewValue(newVal, oldVal){
  if(this.canSetValue){
    //set the new value
    if(!$isEqual(newVal, oldVal)){
        this.elem.value = newVal || '';
        this.isProcessed = false;
    }
  }else{
      switch(this.elem.localName){
          case('select'):
            performOptions('select',this)(newVal, oldVal);
          break;
          case('input'):
            performOptions('checked',this)(newVal, oldVal)
          break;
      }
  }
}

function performOptions(type, context){
    var _options = {};
    _options.select = function(newVal){
       var len= context.elem.options.length;
       while(len--){
        var option = context.elem.options[len];
          if(option.value === newVal){
            option.selected = true;
          }
       }
    };

    _options.checked = function(checked){
      switch(context.elem.type.toLowerCase()){
        case('checkbox'):
          context.elem[checked?'setAttribute':'removeAttribute']('checked',true);
        break;
        case('radio'):
          if($isEqual(context.elem.value, checked)){
            context.elem.setAttribute('checked',true);
          }
        break;
      }
      
    };

    return function(){
        (_options[type] || noop).apply(null,arguments)
    };
}

function updateViews(elem, checker){
  //model was modified
  _modelBinder.$get(checker).forEach(function(models){
    if(!$isEqual(elem, models.elem)){

      var val = $modelSetterGetter(models.checker,models.$model),
          eleVal = $typeOfValue(models.elem);
        setViewValue.call(models, val, eleVal);
    }
  });

}

function _onviewModelChanged(checker){
  
  return function(){
    updateViews(null, checker);
  };
}

/*
  jModel Core Function
*/
function prepareModel(){
  var evName = $typeOfModel(this.elem),
  cVal = $modelSetterGetter(this.checker, this.$model,true),
  eleVal = $typeOfValue(this.elem),
  _self = this;
  this.isProcessed = false;

  //Check for setting Value
  //onChange Input Types shouldn't change Value
   _modelBinder.$push(this.checker, this);
  this.canSetValue = $isEqual('input',evName);

  bind.call(this.elem, evName,function(ev)
  {
    // broadcast events binding to the model
    _modelBinderSubscribers.broadcast(_self.ref, [ev]);

      setModelValue(_self.checker, _self.$model, $typeOfValue(this));
      _self.$model.$consume();

      updateViews.call(_self, this, _self.checker);
      //set state
      _self.isProcessed = true;
  });

    /*
      update the viewModel if default value is set
    */
    if(!cVal && eleVal)
    {
        setModelValue(this.checker, this.$model, eleVal);
        //set state
        this.isProcessed = true;
    }

    setViewValue.call(this, cVal || eleVal);

    return _onviewModelChanged(this.checker);
}