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
    constructor(fields, validators, autoGenerate) {
        super(validators);
        this.value = [];
        this.formFieldControls = [];
        this._defaultfields = fields;
        this._autoSetup(autoGenerate);
    }
    /**
     *
     * @param {*} fieldControl
     */
    addField(fieldControl) {            
        if (this._defaultfields && typeof this._defaultfields === 'object') {
            fieldControl = new FormControlService(this._defaultfields);
        } else if(!(fieldControl instanceof FormControlAbstract)){
            fieldControl = new FormFieldControlService(fieldControl)
        }

        if (fieldControl){
            this.formFieldControls.push(fieldControl);
            this._setupControl(fieldControl);
            this.updateValueAndStatus();
        }
    }

    patchValue(values, options){
        if (Array.isArray(values)){
            if (values.length) {
                options = (options || {});
                values.forEach((value, idx) => {
                    if (!this.formFieldControls[idx]){
                    this.addField();  
                    }
                    this.formFieldControls[idx].patchValue(value, options);
                });
            } else {
                this.destroy();
            }
        }
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
     * @param {*} index
     * @returns
     */
    removeField(index) {
        var len = this.formFieldControls.length;
        if (!len || len < index) return;
        this.formFieldControls[index].destroy();
        this.formFieldControls.splice(index, 1);
        this.updateValueAndStatus();
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

    _updateValue() {
        this.value = this._collectValues(true);
    }

    forEachField(callback) {
        this.formFieldControls.forEach(callback);
    }

    destroy(){
        while(this.formFieldControls.length){
            const control = this.formFieldControls.shift();
            control.destroy();
        }
        // update value and status
        this.updateValueAndStatus();
        this.valueChanges.emit(this.value);
    }
}