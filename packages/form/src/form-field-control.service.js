import { FormControlAbstract } from './form-control.abstract';
import { isobject, isequal } from 'js.helpers/helpers';

Service({
    name: 'formFieldService',
    static: true,
})

/**
 * 
 * @param {*} checker 
 * @param {*} fieldControl 
 */
export function FormFieldControlService(checker, fieldControl) {
    FormControlAbstract.call(this, fieldControl ? fieldControl.validators : null);
    this._onChangeEvents = [];
    this.name = checker;
    this._setInitialState(fieldControl);
    this.updateValueAndStatus({ self: true, emitEvent: false });
}

FormFieldControlService.prototype = Object.create(FormControlAbstract.prototype);
FormFieldControlService.prototype.constructor = FormControlAbstract;

FormFieldControlService.prototype._setInitialState = function(state) {
    if (isobject(state)) {
        this.value = state.value;
        state.disabled ? this.disable({ self: true }) : this.enable({ self: true });
    } else {
        this.value = state;
    }
};

FormFieldControlService.prototype.setValue = function(value, options) {
    options = options || {};
    this.value = value;
    if (this._onChangeEvents.length && !isequal(options.emitToView, false)) {
        this._onChangeEvents.length && this._onChangeEvents.forEach(function(eventChange) {
            return eventChange(value, !isequal(options.emitToView, false));
        });
    }

    this.updateValueAndStatus(options);
};


/*
  instance setViewValue Method
*/
FormFieldControlService.prototype.patchValue = function(val, options) {
    if (!options) {
        options = {};
    }

    this.setValue(val, options);
};

/**
 * reset a form field
 */
FormFieldControlService.prototype.reset = function(config, options) {
    this._setInitialState(config);
    this.markAsUntouched(options);
    this.setValue(this.value, options);
};

FormFieldControlService.prototype.registerOnChangeListener = function(listener) {
    this._onChangeEvents.push(listener);
};

FormFieldControlService.prototype.registerOnDisabledListener = function(listener) {
    this._onDisableEvents.push(listener);
};

FormFieldControlService.prototype.clearListeners = function() {
    this._onChangeEvents.length = 0;
    this._onDisableEvents.length = 0;
};