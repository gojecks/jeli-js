import { FormControlAbstract } from "./form-control.abstract";
import { FormControlService } from "./form-control.service";
import { FormFieldControlService } from "./form-field-control.service";

Service({
    static: true,
})

/**
 * 
 * @param {*} fields 
 * @param {*} autoGenerate 
 * @param {*} validators 
 */
export function FormRepeaterService(fields, autoGenerate, validators) {
    FormControlAbstract.call(this, validators);
    this.formFieldControls = [];
    this._defaultfields = fields;
    this._autoSetup(autoGenerate);
}
FormRepeaterService.prototype = Object.create(FormControlService.prototype);
FormRepeaterService.prototype.constructor = FormControlAbstract;

/**
 * 
 * @param {*} fieldControl 
 */
FormRepeaterService.prototype.addField = function(fieldControl) {
    if (fieldControl instanceof FormControlService || fieldControl instanceof FormFieldControlService) {
        this.formFieldControls.push(fieldControl);
    } else if (this._defaultfields) {
        this.formFieldControls.push(new FormControlService(this._defaultfields));
    } else {
        this.formFieldControls.push(new FormFieldControlService(fieldControl));
    }

    this._setupControl(this.formFieldControls[this.formFieldControls.length - 1]);
};

/**
 * 
 * @param {*} index 
 * @returns 
 */
FormRepeaterService.prototype.getField = function(index) {
    return this.formFieldControls[index] || null;
};

/**
 * 
 * @param {*} enabledOnly 
 * @returns 
 */
FormRepeaterService.prototype._collectValues = function(enabledOnly) {
    var values = [];
    this.forEachField(function(control) {
        if ((enabledOnly && control.enabled) || !enabledOnly) {
            values.push(control.value);
        }
    });

    return values;
};

/**
 * 
 * @param {*} index 
 * @returns 
 */
FormRepeaterService.prototype.removeField = function(index) {
    var len = this.formFieldControls.length;
    if (!len || len < index) return;
    this.formFieldControls[index].destroy();
    this.value.splice(index, 1);
    this.formFieldControls.splice(index, 1);
    this.valueChanges.emit(this.value);
};

/**
 * 
 * @param {*} autoGenerate 
 */
FormRepeaterService.prototype._autoSetup = function(autoGenerate) {
    /**
     * create the formField and validations
     */
    if (autoGenerate) {
        while (autoGenerate--) {
            this.addField();
        }
    }
}