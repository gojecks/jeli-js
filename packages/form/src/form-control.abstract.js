import { isequal, isarray } from '@jeli/helpers';
import { EventEmitter } from '@jeli/core';
import { FormValidatorService } from './form-validator.service';

var VALID = 'VALID';
var INVALID = 'INVALID';
var DISABLED = 'DISABLED';
var PENDING = 'PENDING';

/**
 * 
 * @param {*} validators 
 * @param {*} deepValidation for formControls only
 */
/**
 *
 * @param {*} validators
 * @param {*} deepValidation for formControls only
 */
export class FormControlAbstract {
    constructor(validators, deepValidation) {
        this._parent = null;
        this.status = INVALID;
        this.value = null;
        this.error = null;
        this.touched = false;
        this._pendingValue = null;
        this._onDisableEvents = [];
        this._onControlChangeListener = function () { };
        this.validator = FormValidatorService(errors => {
            this.setError(errors, true);
        }, validators, deepValidation);


        /**
         * create onUpdate listener
         */
        this.valueChanges = new EventEmitter();
        this.statusChanged = new EventEmitter();
    }
    get parent() {
        return this._parent;
    }

    get untouched() {
        return !this.touched;
    }

    get invalid() {
        return isequal(this.status, INVALID);
    }

    get enabled() {
        return !isequal(this.status, DISABLED);
    }

    get disabled() {
        return isequal(this.status, DISABLED);
    }

    get valid() {
        return isequal(this.status, VALID);
    }

    setParent(context) {
        this._parent = context;
    }
    _anyFieldHasStatus(status) {
        return this._anyControl(function (control) {
            return isequal(control.status, status);
        });
    }
    _anyControl() { }
    setStatus() {
        if (this.disabled) return DISABLED;
        if (this.error || this._anyFieldHasStatus(INVALID)) return INVALID;
        return VALID;
    }
    destroy() {
        if (this.formFieldControls) {
            this.formFieldControls = null;
        }
        this._parent = null;
        this.valueChanges.destroy();
        this.statusChanged.destroy();
    }
    markAsTouched(options) {
        options = options || {};
        this.touched = true;
        if (this._parent && !option.self) {
            this._parent.markAsTouched(options);
        }
    }
    markAllAsTouched() {
        this.markAsTouched({ self: true });
        this.forEachField(function (control) {
            control.markAllAsTouched();
        });
    }
    updateValueAndStatus(options) {
        options = options || {};
        this._setInitialStatus();
        this._updateValue();

        if (this.enabled) {
            this.error = null;
            this.status = this.setStatus();
            this._runValidators();
        }

        if (!isequal(options.emitEvent, false)) {
            this.valueChanges.emit(this.value);
        }

        if (this._parent && !isequal(options.self, false)) {
            this._parent.updateValueAndStatus(options);
        }
    }
    enable(options) {
        options = options || {};
        this.status = VALID;
        this.updateValueAndStatus({ self: true, emitEvent: options.emitEvent });
        this.forEachField(function (control) {
            control.enable({
                self: true
            });
        });
        this._onDisableEvents.forEach(function (listener) {
            listener(false);
        });
    }
    disable(options) {
        options = options || {};
        this.status = DISABLED;
        this.forEachField(function (control) {
            control.disable({
                self: true
            });
        });

        this.updateValueAndStatus({ self: true, emitEvent: options.emitEvent });
        if (isequal(options.emitEvent, true)) {
            this.valueChanges.emit(this.value);
        }

        this._onDisableEvents.forEach(function (listener) {
            listener(true);
        });
    }
    forEachField() { }
    _allFieldDisabled() {
        return this.disabled;
    }
    _setInitialStatus() {
        this.status = this._allFieldDisabled() ? DISABLED : VALID;
    }
    _updateValue() { }
    /**
     * Set field validators
     */
    setValidators(validator) {
        if (!validator) return;
        this.validator.addValidators(validator);
        this._runValidators();
    }
    _runValidators() {
        this.validator(this.value);
    }
    /**
     * options = {self: boolean}
     */
    markAsUntouched(options) {
        options = options || {};
        this.touched = false;
        this.forEachField(function (control) {
            control.markAsUntouched({ self: true });
        });

        // if (this.parent && !options.self) {
        //     this.parent.markAsUnTouched({
        //         self: true
        //     });
        // }
    }
    markAllAsUnTouched() {
        this.markAsUntouched({ self: true });
        this.forEachField(function (control) {
            control.markAllAsUnTouched();
        });
    }
    _registerOnControlChangeListener(fn) {
        this._onControlChangeListener = fn;
    }
    setError(errors, emitEvent) {
        this.error = errors;
        if (this._parent)
            this._parent._collectErrors();

        this._updateStatusOnError(emitEvent);
    }
    getError(errorType) {
        return this.error ? this.error[errorType] : null;
    }
    hasError(errorType) {
        return !!this.getError(errorType);
    }
    _updateStatusOnError(emitEvent) {
        this.status = this.setStatus();
        if (emitEvent) {
            this.statusChanged.emit(this.status);
        }

        if (this._parent) {
            this._parent._updateStatusOnError(emitEvent);
        }
    }
    getPath(path) {
        return ((path && path.includes('.')) ? path.split('.') : path);
    }

    markAsTouched(options) {
        if (this.touched) return;
        options = options || {};
        this.touched = true;
        if (this.parent && !options.self) {
            this.parent.markAsTouched(options);
        }
    }
}
