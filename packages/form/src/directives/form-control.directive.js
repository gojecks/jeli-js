import { errorBuilder } from '@jeli/core';

Directive({
    selector: 'formControl',
    props: ['formControl']
})
export function FormControlDirective() {
    this._formFields = [];
    this.form = null;
    Object.defineProperty(this, 'formControl', {
        set: function(formControl) {
            this.form = formControl;
            if (!formControl || !(formControl instanceof FormControlService)) {
                errorBuilder('Expected instance of FormControlService but got ' + typeof formControl);
            }
        }
    });
}

FormControlDirective.prototype.addField = function(formFieldInstance) {
    var formControl = this.form.getField(formFieldInstance.name);
    setupControl(formControl, formFieldInstance);
    this.form.updateValueAndStatus({ emitEvent: false });
    this._formFields.push(formFieldInstance);
    return formControl;
}

FormControlDirective.prototype.removeField = function(formFieldInstance) {
    // remove the formFieldInstance
    this._formFields.splice(this._formFields.indexOf(formFieldInstance), 1);
}

FormControlDirective.prototype.getField = function(fieldName) {
    return this.formControl.getField(fieldName);
}

FormControlDirective.prototype.resetForm = function(values) {
    this.form.reset(values);
}

FormControlDirective.prototype.viewDidDestroy = function() {
    if (this.form) {
        this.form.destroy();
        this.form = null;
    }
};