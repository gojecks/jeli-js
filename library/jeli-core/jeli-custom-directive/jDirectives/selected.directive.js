    //@Directive <j-selected>
    // checks required element if condition is met.
    /*  
      as attr <any j-checked="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */
    defaultElementInitializer.prototype['selected'] = function()
    {
      this.elem[($logicChecker.call(this.elem, this.checker,this.$model))?'setAttribute':'removeAttribute']('selected',true); 
    };