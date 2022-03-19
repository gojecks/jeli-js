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
    var formControl = this.form.getField(formFieldInstance.name);
    setupControl(formControl, formFieldInstance);
    this.form.updateValueAndStatus({ emitEvent: false });
    this._formFields.push(formFieldInstance);
    return formControl;
}

AbstractFormControl.prototype.removeField = function(formFieldInstance) {
    // remove the formFieldInstance
    this._formFields.splice(this._formFields.indexOf(formFieldInstance), 1);
}

AbstractFormControl.prototype.getField = function(fieldName) {
    return this.form.getField(fieldName);
}

AbstractFormControl.prototype.resetForm = function(values) {
    this.form.reset(values);
}

AbstractFormControl.prototype.viewDidDestroy = function() {
    if (this.form) {
        this.form = null;
    }
};