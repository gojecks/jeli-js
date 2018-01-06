/**
	Directive Name:  j-pattern
	Set a regular expression to be parsed before setting value to an ELEMENT
	@Usage: ELEMENT OR ATTR

	Directive doesn't function correctly if jMin or jMax Directive is also binded to element
**/
var _patternbindedElem = [];

function jPatternDirectiveFn() {
    var self = this,
        modelAttribute = hasAnyAttribute(this.$attr, ["j-model", ":model"]);
    if (!this.isProcessed) {
        if (!modelAttribute) {
            errorBuilder('jPattern Directive need jModel to function');
        }

        var jModelInstance = _modelBinder.$get(modelAttribute);

        jModelInstance
        // bind Listener to jModel
            .$eventListener.register(':input', function(ev, elem) {
            // trigger the preventDefault 
            // isFailed validation
            if (!validatePattern(elem)) {
                ev.preventDefault();
                var _value = getValue(elem);
                jModelInstance.$$setViewValue(_value.substr(0, _value.length - 1));
                _value = null;
            }
        });

        this.isProcessed = true;
        this.isInput = $isEqual('input', $typeOfModel(this.elem));

        validatePattern(self.elem);
    }

    function validatePattern(_ele) {
        var rExp;
        try {
            rExp = maskedEval(self.checker, self.$model);
        } catch (e) {
            rExp = self.checker;
        }

        var _regx = new RegExp(rExp).exec(getValue(_ele));

        return _regx && _regx[0].length === _regx.input.length;
    }

    function getValue(_ele) {
        return self.isInput ? _ele.value : maskedEval(modelAttribute, self.$model)
    }
}

$defaultDirectiveProvider.push({
    selector: "j-pattern",
    priority: 1,
    isDefault: true
});

defaultElementInitializer.prototype['pattern'] = jPatternDirectiveFn;