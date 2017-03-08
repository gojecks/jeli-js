//@Directive <j-show>
    // shows required element if condition is met or hide element.
    /*  
      works like j-hide directive
      as attr <any j-show="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */

    defaultElementInitializer.prototype.show = function()
    {
        var $show = $logicChecker.apply(this.elem, [this.checker,this.$model]);

        // set our class
        element(this.elem)
        .addClass(($show?'j-show':'j-hide'))
        .removeClass(($show?'j-hide':'j-show')); 
    };