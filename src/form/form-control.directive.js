Directive({
    selector: 'formControl',
    props: ['formControl'],
    registry: [
        "submit:event=onSubmitHandler($event)"
    ],
    exportAs: "formControl"
}, FormControlDirective);
/**
 * 
 * @param {*} ElementRef 
 * @param {*} Observables 
 */
function FormControlDirective() {
    this.$context = null;
    Object.defineProperty(this, 'formControl', {
        set: function(formControl) {
            this.$context = formControl;
            if (!formControl) {
                errorBuilder('FormController instance is required to use this directive');
            }
        }
    });
}


FormControlDirective.prototype.onSubmitHandler = function(event) {
    event.preventDefault();
};

FormControlDirective.prototype.viewDidDestroy = function() {
    if (this.$context) {
        this.$context.destroy();
        this.$context = null;
    }
};