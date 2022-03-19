import { isequal, isarray } from 'js-helpers/helpers';
import { EventEmitter } from '@jeli/core';
import { FormValidatorService } from './form-validator.service';

var VALID = 'VALID';
var INVALID = 'INVALID';
var DISABLED = 'DISABLED';
var PENDING = 'PENDING';

/**
 * 
 * @param {*} validators 
 */
export function FormControlAbstract(validators) {
    var _this = this;
    this._parent = null;
    this.status = INVALID;
    this.value = null;
    this.error = null;
    this.touched = false;
    this._pendingValue = null;
    this._onDisableEvents = [];
    this._onControlChangeListener = function() {};
    this.validator = FormValidatorService(function(errors) {
        _this.setError(errors, true);
    }, validators);


    /**
     * create onUpdate listener
     */
    this.valueChanges = new EventEmitter();
    this.statusChanged = new EventEmitter();

    Object.defineProperties(this, {
        parent: {
            get: function() {
                return this._parent;
            }
        },
        untouched: {
            get: function() {
                return !this.touched;
            }
        },
        invalid: {
            get: function() {
                return isequal(this.status, INVALID);
            }
        },
        enabled: {
            get: function() {
                return !isequal(this.status, DISABLED);
            }
        },
        disabled: {
            get: function() {
                return isequal(this.status, DISABLED);
            }
        },
        valid: {
            get: function() {
                return isequal(this.status, VALID);
            }
        }
    });
}

FormControlAbstract.prototype.setParent = function(context) {
    this._parent = context;
};

FormControlAbstract.prototype._anyFieldHasStatus = function(status) {
    return this._anyControl(function(control) {
        return isequal(control.status, status);
    });
};

FormControlAbstract.prototype._anyControl = function() {}

FormControlAbstract.prototype.setStatus = function() {
    if (this.disabled) return DISABLED;
    if (this.error || this._anyFieldHasStatus(INVALID)) return INVALID;
    return VALID;
};

FormControlAbstract.prototype.destroy = function() {
    if (this.formFieldControls) {
        this.formFieldControls = null;
    }
    this._parent = null;
    this.valueChanges.destroy();
    this.statusChanged.destroy();
};

FormControlAbstract.prototype.markAsTouched = function(options) {
    options = options || {};
    this.touched = true;
    if (this._parent && !option.self) {
        this._parent.markAsTouched(options);
    }
};

FormControlAbstract.prototype.markAllAsTouched = function() {
    this.markAsTouched({ self: true });
    this.forEachField(function(control) {
        control.markAllAsTouched();
    });
};

FormControlAbstract.prototype.updateValueAndStatus = function(options) {
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
};

FormControlAbstract.prototype.enable = function(options) {
    options = options || {};
    this.status = VALID;
    this.updateValueAndStatus({ self: true, emitEvent: options.emitEvent });
    this.forEachField(function(control) {
        control.enable({
            self: true
        });
    });
    this._onDisableEvents.forEach(function(listener) {
        listener(false);
    });
};

FormControlAbstract.prototype.disable = function(options) {
    options = options || {};
    this.status = DISABLED;
    this.forEachField(function(control) {
        control.disable({
            self: true
        });
    });

    this.updateValueAndStatus({ self: true, emitEvent: options.emitEvent });
    if (isequal(options.emitEvent, true)) {
        this.valueChanges.emit(this.value);
    }

    this._onDisableEvents.forEach(function(listener) {
        listener(true);
    });
};


FormControlAbstract.prototype.forEachField = function() {}

FormControlAbstract.prototype._allFieldDisabled = function() {
    return this.disabled;
};

FormControlAbstract.prototype._setInitialStatus = function() {
    this.status = this._allFieldDisabled() ? DISABLED : VALID;
};

FormControlAbstract.prototype._updateValue = function() {};

/**
 * Set field validators
 */
FormControlAbstract.prototype.setValidators = function(validator) {
    if (!validator) return;
    this.validator.addValidators(validator);
    this._runValidators();
};

FormControlAbstract.prototype._runValidators = function() {
    this.validator(this.value);
};

/**
 * options = {self: boolean}
 */
FormControlAbstract.prototype.markAsUntouched = function(options) {
    options = options || {};
    this.touched = false;
    this.forEachField(function(control) {
        control.markAsUntouched({ self: true });
    });

    // if (this.parent && !options.self) {
    //     this.parent.markAsUnTouched({
    //         self: true
    //     });
    // }
};

/**
 * options = {self: boolean}
 */
FormControlAbstract.prototype.markAsTouched = function(options) {
    if (this.touched) return;
    options = options || {};
    this.touched = true;
    if (this.parent && !options.self) {
        this.parent.markAsTouched(options);
    }
};

FormControlAbstract.prototype.markAllAsUnTouched = function() {
    this.markAsUntouched({ self: true });
    this.forEachField(function(control) {
        control.markAllAsUnTouched();
    });
};

FormControlAbstract.prototype._registerOnControlChangeListener = function(fn) {
    this._onControlChangeListener = fn;
};

FormControlAbstract.prototype.setError = function(errors, emitEvent) {
    this.error = errors;
    this._updateStatusOnError(emitEvent);
};

FormControlAbstract.prototype.getError = function(errorType) {
    return this.error ? this.error[errorType] : null;
};

FormControlAbstract.prototype.hasError = function(errorType) {
    return !!this.getError(errorType);
}

FormControlAbstract.prototype._updateStatusOnError = function(emitEvent) {
    this.status = this.setStatus();
    if (emitEvent) {
        this.statusChanged.emit(this.status);
    }

    if (this._parent) {
        this._parent._updateStatusOnError(emitEvent);
    }
}

FormControlAbstract.prototype.getPath = function(path) {
    return ((path && path.includes('.')) ? path.split('.') : path);
}