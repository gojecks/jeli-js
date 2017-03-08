  //Prototype Binding
  //@Directive <j-value>
    // overwrites the element value with the required binding result.
    /*  
      just like ng-model
      as attr <any j-value="html">

      cannot be used in class list
    */
    defaultElementInitializer.prototype.value = function()
    {
        if(this.elem)
        {
            element(this.elem).val( $modelSetterGetter(this.checker,this.$model) );
        }
    };