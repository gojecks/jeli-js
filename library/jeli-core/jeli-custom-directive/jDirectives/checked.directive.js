//@Directive <j-checked>
// checks required element if condition is met.
/*  
  as attr <any j-checked="(1==1 || (model[1] === 1))">

  cannot be used in class list
*/
$defaultDirectiveProvider.push({
  selector: "j-checked",
  priority: 1,
  isDefault:true
});

defaultElementInitializer.prototype['checked'] = function()
{
    var ele = this.elem;
    if($logicChecker.call(this.elem, this.checker,this.$model) ){
      ele.setAttribute('checked','true');
    }else{
        ele.removeAttribute('checked')
    }
};

