/**
 * 
 * @param {*} changeDetector 
 */
export function AbstractFormControl(changeDetector) {
    this.changeDetector = changeDetector;
    this._registered = false;
    this.formName = '';
    this._formFields = [];
    this.form = null;
}

AbstractFormControl.prototype.addField = function(formFieldInstance) {
    var formControl = this.getField(formFieldInstance.name);
    setupControl(formControl, formFieldInstance);
    formControl.updateValueAndStatus({ emitEvent: false });
    this._formFields.push(formFieldInstance);
    return formControl;
}

AbstractFormControl.prototype.removeField = function(formFieldInstance) {
    // remove the formFieldInstance
    this._formFields.splice(this._formFields.indexOf(formFieldInstance), 1);
    var formControl = this.getField(formFieldInstance.name);
    cleanupControl(formControl, formFieldInstance);
}

AbstractFormControl.prototype.getField = function(fieldName) {
    return this.form && this.form.getField(fieldName);
}

AbstractFormControl.prototype.resetForm = function(values) {
    this.form.reset(values);
}

AbstractFormControl.prototype.viewDidDestroy = function() {
    if (this.form) {
        this._formFields.forEach(formField => {
            cleanupControl(this.getField(formField.name), formField);
        });
        this.form = null;
    }
};