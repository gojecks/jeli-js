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
/**
 *
 * @param {*} fields
 * @param {*} autoGenerate
 * @param {*} validators
 */
export class FormRepeaterService extends FormControlAbstract{
    constructor(fields, autoGenerate, validators) {
        super(validators);
        this.formFieldControls = [];
        this._defaultfields = fields;
        this._autoSetup(autoGenerate);
    }
    /**
     *
     * @param {*} fieldControl
     */
    addField(fieldControl) {
        if (fieldControl instanceof FormControlService || fieldControl instanceof FormFieldControlService) {
            this.formFieldControls.push(fieldControl);
        } else if (this._defaultfields) {
            this.formFieldControls.push(new FormControlService(this._defaultfields));
        } else {
            this.formFieldControls.push(new FormFieldControlService(fieldControl));
        }

        this._setupControl(this.formFieldControls[this.formFieldControls.length - 1]);
    }
    /**
     *
     * @param {*} index
     * @returns
     */
    getField(index) {
        return this.formFieldControls[index] || null;
    }
    /**
     *
     * @param {*} enabledOnly
     * @returns
     */
    _collectValues(enabledOnly) {
        var values = [];
        this.forEachField(function (control) {
            if ((enabledOnly && control.enabled) || !enabledOnly) {
                values.push(control.value);
            }
        });

        return values;
    }
    /**
     *
     * @param {*} index
     * @returns
     */
    removeField(index) {
        var len = this.formFieldControls.length;
        if (!len || len < index) return;
        this.formFieldControls[index].destroy();
        this.value.splice(index, 1);
        this.formFieldControls.splice(index, 1);
        this.valueChanges.emit(this.value);
    }
    /**
     *
     * @param {*} autoGenerate
     */
    _autoSetup(autoGenerate) {
        /**
         * create the formField and validations
         */
        if (autoGenerate) {
            while (autoGenerate--) {
                this.addField();
            }
        }
    }
}