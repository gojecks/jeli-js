/**
	Directive Name:  j-pattern
	Set a regular expression to be parsed before setting value to an ELEMENT
	@Usage: ELEMENT OR ATTR

	Directive doesn't function correctly if jMin or jMax Directive is also binded to element
**/
var _patternbindedElem = [];
function jPatternDirectiveFn(){
	var self =this;
	if(!this.isProcessed){
		var modelAttribute = hasAnyAttribute(this.$attr, ["j-model",":model"]);
		if(!modelAttribute){
			errorBuilder('jPattern Directive need jModel to function');
		}

		var jModelInstance = _modelBinder.$get(modelAttribute);
			
			jModelInstance
			// bind Listener to jModel
			.$eventListener.register(':input', function(ev, elem){
				// trigger the preventDefault 
				// isFailed validation
				if(!validatePattern(elem)){
					ev.preventDefault();
					jModelInstance.$$setViewValue("");
				}
			});

		this.isProcessed = true;
		this.isInput = $isEqual('input',$typeOfModel(this.elem));

		validatePattern(self.elem);
	}

	function validatePattern(_ele){
		var rExp;
		try{
			rExp = maskedEval(self.checker, self.$model);
		}catch(e){
			rExp = self.checker;
		}

		var value = self.isInput?_ele.value : maskedEval(modelAttribute,  self.$model);

		return new RegExp( rExp, "g").test(value);
	}
}

$defaultDirectiveProvider.push({
  selector: "j-pattern",
  priority: 1,
  isDefault:true
});

defaultElementInitializer.prototype['pattern'] = jPatternDirectiveFn;