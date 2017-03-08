//Prototype Binding
//@Directive <j-value>
  // overwrites the element value with the required binding result.
  /*  
    just like ng-model
    as attr <any j-value="html">

    cannot be used in class list
  */
var _minMaxbindedElem = [];
function jEliMinMaxLenDirective(){
  var self = this; 
  if(!$inArray(this.ref, _minMaxbindedElem)){
    addBinding();
  }

  /*
    Attach Event-Listener to the Element
    if Element contains the jModel Directives
      bind to the jModel Event
    else
      Attach a new event
  */
  function addBinding(){
      if(!hasAnyAttribute(self.$attr, ["j-model",":model"])){
      bind.call(self.elem, $typeOfModel(self.elem), _maxminEventValidator);
    }else{
      _modelBinderSubscribers.subscribe(self.ref, _maxminEventValidator);
    }

    _minMaxbindedElem.push( self.ref );
  }

  // event.preventDefault does work for "input" event
  function _maxminEventValidator(ev){
    validate();
  }

  function validate(){
    var requiredLength = parseInt( self.checker ),
        _valLength = parseInt( self.elem.value.length ),
        diff = (_valLength > requiredLength);

    switch(self.type){
      case('min'):
        if(!hasAnyAttribute(self.$attr, [":max","j-max"]) && diff){
          self.elem.value = self.elem.value.slice(0, requiredLength);
        }
      break;
      case('max'):
        if(diff){
          self.elem.value = self.elem.value.slice(0, requiredLength);
        }
      break;
    }
  }

  if(!this.isProcessed){
    validate();
    this.isProcessed = true;
  }
}

defaultElementInitializer.prototype.min = defaultElementInitializer.prototype.minlength = jEliMinMaxLenDirective;
defaultElementInitializer.prototype.max = defaultElementInitializer.prototype.maxlength =jEliMinMaxLenDirective;
