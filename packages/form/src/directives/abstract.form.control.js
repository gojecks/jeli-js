/**
 * 
 * @param {*} changeDetector 
 */
/**
 *
 * @param {*} changeDetector
 */
export class AbstractFormControl {
    constructor(changeDetector) {
        this.changeDetector = changeDetector;
        this._registered = false;
        this.formName = '';
        this._formFields = [];
        this.form = null;
    }
    addField(formFieldInstance) {
        var formControl = this.getField(formFieldInstance.name);
        setupControl(formControl, formFieldInstance);
        formControl.updateValueAndStatus({ emitEvent: false });
        this._formFields.push(formFieldInstance);
        return formControl;
    }
    removeField(formFieldInstance) {
        // remove the formFieldInstance
        this._formFields.splice(this._formFields.indexOf(formFieldInstance), 1);
        var formControl = this.getField(formFieldInstance.name);
        cleanupControl(formControl, formFieldInstance);
    }
    getField(fieldName) {
        return this.form && this.form.getField(fieldName);
    }
    resetForm(values) {
        this.form.reset(values);
    }
    viewDidDestroy() {
        if (this.form) {
            this._formFields.forEach(formField => {
                cleanupControl(this.getField(formField.name), formField);
            });
            this.form = null;
        }
    }
}