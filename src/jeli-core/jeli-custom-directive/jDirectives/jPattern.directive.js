/**
 * Directive Name:  j-pattern
 * Set a regular expression to be parsed before setting value to an ELEMENT
 * @Usage: ELEMENT OR ATTR
 * Directive doesn't function correctly if jMin or jMax Directive is also binded to element
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
            .$eventListener.register(':input', function(ev, insModel) {
            // trigger the preventDefault 
            // isFailed validation
            var _value = getValue(insModel.elem);
            if ((self.isInput && insModel.elem.value) && !self._expr_.test(_value)) {
                ev.preventDefault();
                jModelInstance.$$setViewValue(_value.substr(0, _value.length - 1));
                _value = null;
            }
        });

        this.isProcessed = true;
        this.isInput = $isEqual('input', $typeOfModel(this.elem));
        // generate and validate Regular Expression
        var rExp;
        try {
            rExp = maskedEval(this.checker, this.$model);
        } catch (e) {} finally {
            this._expr_ = new RegExp(rExp || self.checker);
        }

        function getValue(_ele) {
            return self.isInput ? _ele.value : maskedEval(modelAttribute, self.$model)
        }
    }
}

$defaultDirectiveProvider.push({
    selector: "j-pattern",
    priority: 1,
    isDefault: true
});

defaultElementInitializer.prototype['pattern'] = jPatternDirectiveFn;