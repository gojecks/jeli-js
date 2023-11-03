import { isobject, isundefined, isarray } from '@jeli/helpers';
import { errorBuilder } from '@jeli/core';
import { FormControlAbstract } from './form-control.abstract';
import {FormFieldControlService} from './form-field-control.service';

/**
 * 
 * @param {*} context 
 * @param {*} controls 
 */
function addFields(context, formFields) {
    if (!isobject(formFields)) return;
    for (var field in formFields) {
        context.addField(field, formFields[field]);
    }
}

Service({
    static: true,
})

/**
 * requires ValidatorService
 * @param {*} formFields 
 * @param {*} validators 
 */
export function FormControlService(formFields, validators) {
    FormControlAbstract.call(this, validators, true);
    this.formFieldControls = {};
    /**
     * create the formField and validations
     */
    addFields(this, formFields);
}

FormControlService.prototype = Object.create(FormControlAbstract.prototype);
FormControlService.prototype.constructor = FormControlAbstract;

/**
 * @param name
 * @param fieldControl
 */
FormControlService.prototype.addField = function(name, fieldControl) {
    if (fieldControl instanceof FormControlService || fieldControl instanceof FormFieldControlService) {
        this.formFieldControls[name] = fieldControl;
    } else {
        this.formFieldControls[name] = new FormFieldControlService(fieldControl);
    }

    this._setupControl(this.formFieldControls[name]);
};

/**
 * add multple fields to the contol instance
 * @param {*} fieldControls 
 */
FormControlService.prototype.addFields = function(fieldControls) {
    addFields(this, fieldControls)
}


FormControlService.prototype.hasField = function(controlName) {
    return this.formFieldControls.hasOwnProperty(controlName);
};

FormControlService.prototype.getField = function(controlName) {
    var path = this.getPath(controlName);
    if (isarray(path)) {
        return this.getByPath(path);
    }
    return this.formFieldControls[controlName] || null;
};

FormControlService.prototype.getByPath = function(paths) {
    return paths.reduce(function(accum, path) {
        return accum.getField(path);
    }, this);
}

FormControlService.prototype._setupControl = function(control) {
    control.setParent(this);
    control._registerOnControlChangeListener(this._onControlChangeListener);
};


FormControlService.prototype.patchValue = function(values, options) {
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
};

FormControlService.prototype.setValue = function(values, options) {
    if (!values) return;
    this._allValuePresent(values);
    for (var field in values) {
        this._isControlPresent(field);
        this.formFieldControls[field].setValue(values[field], {
            self: options && options.self,
        });
    }
};

FormControlService.prototype.forEachField = function(callback) {
    var _this = this;
    Object.keys(this.formFieldControls).forEach(function(field) {
        callback(_this.formFieldControls[field], field);
    });
};

FormControlService.prototype.reset = function(value, options) {
    options = (options || {});
    value = (value || {});
    this.forEachField(function(control, name) {
        control.reset(value[name] || null, {
            self: true,
            emitEvent: options.emitEvent
        });
    });
}

FormControlService.prototype.setFormFieldValidators = function(fieldValidators) {
    for (var field in fieldValidators) {
        this.setFieldValidator(field, fieldValidators[field]);
    }
};

FormControlService.prototype.setFieldValidator = function(field, validator) {
    this.getField(field).setValidators(validator);
    return this;
};

FormControlService.prototype.allTouched = function() {
    var alltouched = true;
    this.forEachField(function(control, name) {
        if (!control.touched) {
            alltouched = false;
        }
    });

    return alltouched;
}


FormControlService.prototype.removeField = function(name) {
    this.getField(name).destroy();
    delete this.formFieldControls[name];
    delete this.value[name];
    this.valueChanges.emit(this.value);
};

FormControlService.prototype.getAllValues = function() {
    return this._collectValues(false);
};


FormControlService.prototype._allValuePresent = function(values) {
    this.forEachField(function(control, field) {
        if (isundefined(values[field])) {
            errorBuilder('value for formField(' + field + ') is missing');
        }
    });
};

FormControlService.prototype._isControlPresent = function(field) {
    if (!Object.keys(this.formFieldControls).length) {
        errorBuilder('There are no field controls registered to this form');
    }

    if (!this.hasField(field)) {
        errorBuilder('Cannot find field control for ' + field);
    }
};

FormControlService.prototype._anyControl = function(callback) {
    for (var field in this.formFieldControls) {
        var found = callback(this.formFieldControls[field]);
        if (found) {
            return found;
        }
    }
    return undefined;
}

FormControlService.prototype._allFieldDisabled = function() {
    for (var field in this.formFieldControls) {
        if (this.formFieldControls[field].enabled) {
            return false;
        }
    }

    return Object.keys(this.formFieldControls).length > 0 || this.disabled;
};

FormControlService.prototype._updateValue = function() {
    this.value = this._collectValues(true);
};

FormControlService.prototype._collectValues = function(enabledOnly) {
    var values = {};
    this.forEachField(function(control, field) {
        if ((enabledOnly && control.enabled) || !enabledOnly) {
            values[field] = control.value;
        }
    });

    return values;
};

FormControlService.prototype._getFieldErrors = function() {
    var errors = {};
    var invalid = false;
    this.forEachField(function(control, field) {
        if (control.error) {
            errors[field] = control.error;
            invalid = true;
        }
    });

    return invalid ? errors : null;
};