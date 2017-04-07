    

$defaultDirectiveProvider.push({
  selector: "j-href",
  priority: 1,
  isDefault:true
});

$defaultDirectiveProvider.push({
  selector: "j-src",
  priority: 1,
  isDefault:true
});
defaultElementInitializer.prototype['href'] = defaultElementInitializer.prototype['src'] = function()
{
    if(this.type && this.elem)
    {
      var setter = $logicChecker.call(this.elem, this.checker,this.$model);
      if(!$isEqual(setter,this.lastProcessed || this.checker) && setter)
      {
        this.elem.setAttribute(this.type,setter);
        this.lastProcessed = setter;
      }
      
    }
};