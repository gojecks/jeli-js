    //@Directive <j-disabled>
    // disables required element if condition is met.
    /*  
      as attr <any j-disabled="(1==1 || (model[1] === 1))">

      cannot be used in class list
    */
    $defaultDirectiveProvider.push({
        selector: "j-disabled",
        priority: 1,
        isDefault: true
    });

    defaultElementInitializer.prototype.disabled = function() {
        if ($logicChecker.call(this.elem, this.checker, this.$model)) {
            this.elem.setAttribute('disabled', 'true')
        } else {
            this.elem.removeAttribute('disabled');
        }
    };