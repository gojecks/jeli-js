    //@Directive <j-if>
    // Compiles the required element based on the logic provided
    //elements are removed from the DOM if condition is not met
    /*@Usage :
      allowed type Attirbute and Element
    */
    $defaultDirectiveProvider.push({
        selector: "j-if",
        priority: 10,
        canDetachElement: true,
        isDefault: true
    });

    defaultElementInitializer.prototype['if'] = function() {
        if (!maskedEval(this.checker, this.$model) || !this.checker) {
            element(this.elem).remove();
            this.elemIsDetached = true;
        } else {
            if (this.elemIsDetached) {
                this.elemIsDetached = false;
                this.elem = element(this.$createElement()).data({ ignoreProcess: [this.cSelector] })[0];
                this.parentNode.insertBefore(this.elem, this.cENode);
                $templateCompiler(this.elem, true)(this.$model);
                //addClass(this.elem);
            }
        }

        /**
         * proceed with compilation
         */
        if (!this.isProcessed && !this.elemIsDetached) {
            this.isProcessed = true;
            transverseTemplate(this.elem)(this.$model, this.ref);
        }
    };