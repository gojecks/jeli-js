/*
    @Directive <j-readonly>
    set ELEMENT to readOnly if condition is met
    @Usage :
    allowed type Attirbute
*/ 

function jReadOnlyFn(){
	if(maskedEval(this.checker, this.$model)){
		this.elem.setAttribute('disabled', true);
	}else{
		this.elem.removeAttribute('disabled');
	}
}

$defaultDirectiveProvider.push({
  selector: "j-readonly",
  priority: 1,
  isDefault:true
});
defaultElementInitializer.prototype['readonly'] = jReadOnlyFn;