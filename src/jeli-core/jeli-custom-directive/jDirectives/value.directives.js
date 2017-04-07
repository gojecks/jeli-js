  //Prototype Binding
  //@Directive <j-value>
    // overwrites the element value with the required binding result.
    /*  
      just like ng-model
      as attr <any j-value="html">

      cannot be used in class list
    */
$defaultDirectiveProvider.push({
  selector: "j-value",
  priority: 1,
  isDefault:true
});
defaultElementInitializer.prototype.value = function()
{
  var value = setTemplateValue(this.checker,this.$model);

    if(!$isEqual(this.lastProcessed, value))
    {
      this.elem.value =  value;
    }

    this.lastProcessed = value;
};