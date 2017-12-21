    //@Directive <j-hide>
    // shows required element if condition is met.
    /*  
    unlike the j-if directive that removes element from DOM
    <j-hide> directive sets the element display to none if condition is met.
      as attr <any j-hide="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */

    $defaultDirectiveProvider.push({
        selector: "j-hide",
        priority: 1,
        isDefault: true
    });

    defaultElementInitializer.prototype.hide = function() {
        var $hide = $logicChecker.apply(this.elem, [this.checker, this.$model]);
        // set our class
        element(this.elem)
            .addClass(($hide ? 'j-hide' : 'j-show'))
            .removeClass(($hide ? 'j-show' : 'j-hide'));
    };