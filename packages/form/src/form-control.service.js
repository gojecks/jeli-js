import { isobject, isundefined, isarray } from '@jeli/helpers';
import { errorBuilder } from '@jeli/core';
import { FormControlAbstract } from './form-control.abstract';
import {FormFieldControlService} from './form-field-control.service';


Service({
    static: true,
})

/**
 * requires ValidatorService
 * @param {*} formFields 
 * @param {*} validators 
 */
/**
 * requires ValidatorService
 * @param {*} formFields
 * @param {*} validators
 */
export class FormControlService extends FormControlAbstract{
    constructor(formFields, validators) {
        super(validators, true);
        this.formFieldControls = {};
        /**
         * create the formField and validations
         */
        this.addFields(formFields);
    }
    /**
     * @param name
     * @param fieldControl
     */
    addField(name, fieldControl) {
        if (fieldControl instanceof FormControlService || fieldControl instanceof FormFieldControlService) {
            this.formFieldControls[name] = fieldControl;
        } else {
            this.formFieldControls[name] = new FormFieldControlService(fieldControl);
        }

        this._setupControl(this.formFieldControls[name]);
    }
    /**
     * add multple fields to the contol instance
     * @param {*} fieldControls
     */
    addFields(fieldControls) {
        if (!isobject(fieldControls)) return;
        for (var field in fieldControls) {
            this.addField(field, fieldControls[field]);
        }
        // update status and value
        this.updateValueAndStatus();
    }
    hasField(controlName) {
        return this.formFieldControls.hasOwnProperty(controlName);
    }
    getField(controlName) {
        var path = this.getPath(controlName);
        if (isarray(path))
            return this.getByPath(path);
        return this.formFieldControls ? this.formFieldControls[controlName] : null;
    }
    getByPath(paths) {
        return paths.reduce(function (accum, path) {
            return accum.getField(path);
        }, this);
    }
    _setupControl(control) {
        control.setParent(this);
        control._registerOnControlChangeListener(this._onControlChangeListener);
    }
    patchValue(values, options) {
        options = options || {};
        if (isobject(values) || isarray(values)) {
            for (var field in values) {
                if (this.hasField(field) && !options.self) {
                    this.getField(field).patchValue(values[field], {
                        self: options.self,
                        updateView: true
                    });
                }
            }
        }
    }
    setValue(values, options) {
        if (!values) return;
        this._allValuePresent(values);
        for (var field in values) {
            this._isControlPresent(field);
            this.formFieldControls[field].setValue(values[field], {
                self: options && options.self,
            });
        }
    }
    forEachField(callback) {
        Object.keys(this.formFieldControls).forEach((field) => {
            callback(this.formFieldControls[field], field);
        });
    }
    reset(value, options) {
        options = (options || {});
        value = (value || {});
        this.forEachField(function (control, name) {
            control.reset(value[name] || null, {
                self: true,
                emitEvent: options.emitEvent
            });
        });
    }
    setFormFieldValidators(fieldValidators) {
        for (var field in fieldValidators) {
            this.setFieldValidator(field, fieldValidators[field]);
        }
    }
    setFieldValidator(field, validator) {
        this.getField(field).setValidators(validator);
        return this;
    }
    allTouched() {
        var alltouched = true;
        this.forEachField(function (control, name) {
            if (!control.touched) {
                alltouched = false;
            }
        });

        return alltouched;
    }
    removeField(name) {
        this.getField(name).destroy();
        delete this.formFieldControls[name];
        delete this.value[name];
        this.valueChanges.emit(this.value);
    }
    getAllValues() {
        return this._collectValues(false);
    }
    _allValuePresent(values) {
        this.forEachField(function (control, field) {
            if (isundefined(values[field])) {
                errorBuilder('value for formField(' + field + ') is missing');
            }
        });
    }
    _isControlPresent(field) {
        if (!Object.keys(this.formFieldControls).length) {
            errorBuilder('There are no field controls registered to this form');
        }

        if (!this.hasField(field)) {
            errorBuilder('Cannot find field control for ' + field);
        }
    }
    _anyControl(callback) {
        for (var field in this.formFieldControls) {
            var found = callback(this.formFieldControls[field]);
            if (found) {
                return found;
            }
        }
        return undefined;
    }
    _allFieldDisabled() {
        for (var field in this.formFieldControls) {
            if (this.formFieldControls[field].enabled) {
                return false;
            }
        }

        return Object.keys(this.formFieldControls).length > 0 || this.disabled;
    }
    _updateValue() {
        this.value = this._collectValues(true);
    }
    _collectValues(enabledOnly) {
        var values = {};
        this.forEachField(function (control, field) {
            if ((enabledOnly && control.enabled) || !enabledOnly) {
                values[field] = control.value;
            }
        });

        return values;
    }

    _getAllFieldErrors() {
        var errors = {};
        var invalid = false;
        this.forEachField(function (control, field) {
            if (control.error) {
                errors[field] = control.error;
                invalid = true;
            }
        });

        return invalid ? errors : null;
    }

    _collectErrors(){
        this.error = this._getAllFieldErrors();
    }
}