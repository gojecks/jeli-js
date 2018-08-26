//Prototype Binding
/* 
  @Directive 
    :min 
    :minlength 
    :max 
    :maxlength
  just like ng-model
  as attr <input j-min="5" j-max="10">

  cannot be used in class list or LOCALNAME
*/
var _minMaxbindedElem = [];

function jEliMinMaxLenDirective() {
    var self = this,
        modelAttribute = hasAnyAttribute(this.$attr, ["j-model", ":model"]);
    if (!$inArray(this.ref, _minMaxbindedElem)) {
        addBinding();
    }

    /*
      Attach Event-Listener to the Element
      if Element contains the jModel Directives
        bind to the jModel Event
      else
        Attach a new event
    */
    function addBinding() {
        if (!modelAttribute) {
            bind.call(self.elem, $typeOfModel(self.elem), _maxminEventValidator);
        } else {
            _modelBinder.$get(modelAttribute)
                .$eventListener.register(':input', _maxminEventValidator);
        }

        _minMaxbindedElem.push(self.ref);
    }

    // event.preventDefault does work for "input" event
    // instead trigger event.preventDefault on jModel EventListener
    function _maxminEventValidator(ev, insModel) {
        if (!validate(insModel.elem)) {
            ev.preventDefault();
        }
    }

    function validate(_ele) {
        var requiredLength = parseInt(self.checker),
            _valLength = parseInt(_ele.value.length),
            diff = (_valLength > requiredLength),
            ret = true;

        switch (self.type) {
            case ('min'):
                if (!hasAnyAttribute(self.$attr, [":max", "j-max"]) && diff) {
                    self.elem.value = _ele.value.slice(0, requiredLength);
                    ret = false;
                }
                break;
            case ('max'):
                if (diff) {
                    self.elem.value = _ele.value.slice(0, requiredLength);
                    ret = false;
                }
                break;
        }

        return ret;
    }

    if (!this.isProcessed) {
        validate(this.elem);
        this.isProcessed = true;
    }
}

$defaultDirectiveProvider.push({
    selector: "j-min",
    priority: 1,
    isDefault: true
});

$defaultDirectiveProvider.push({
    selector: "j-minlength",
    priority: 1,
    isDefault: true
});

defaultElementInitializer.prototype.min = defaultElementInitializer.prototype.minlength = jEliMinMaxLenDirective;
$defaultDirectiveProvider.push({
    selector: "j-max",
    priority: 1,
    isDefault: true
});

$defaultDirectiveProvider.push({
    selector: "j-maxlength",
    priority: 1,
    isDefault: true
});
defaultElementInitializer.prototype.max = defaultElementInitializer.prototype.maxlength = jEliMinMaxLenDirective;