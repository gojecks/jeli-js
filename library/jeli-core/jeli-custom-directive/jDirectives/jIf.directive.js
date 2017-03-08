    //@Directive <j-if>
    // Compiles the required element based on the logic provided
    //elements are removed from the DOM if condition is not met
    /*@Usage :
      allowed type Attirbute and Element
    */
     
     defaultElementInitializer.prototype['if'] =  function()
     {
        if(!maskedEval(this.checker,this.$model) || !this.checker)
        {   
            if(this.isProcessed)
            {
                element(this.elem).remove();
                this.isProcessed = false; 
            }  
        }
       else
       {
            if(!this.isProcessed)
            {
                this.elem = element(this.$createElement()).data({ignoreProcess : ['if']})[0];
                this.parentNode.insertBefore( $templateCompiler(this.elem, true)(this.$model) , this.cENode );
                //addClass(this.elem);
                this.isProcessed = true;
            }
       }

     };