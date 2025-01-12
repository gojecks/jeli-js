import { FormControlAbstract } from './form-control.abstract';
import { isobject, isequal } from '@jeli/helpers';

Service({
    static: true,
})
/**
 *
 * @param {*} fieldControl
 */
export class FormFieldControlService extends FormControlAbstract {
    constructor(fieldControl) {
        super(fieldControl ? fieldControl.validators : null, false);
        this.eventType = 'default';
        this._onChangeEvents = [];
        this._setInitialState(fieldControl);
    }
    _setInitialState(state) {
        if (isobject(state)) {
            this.value = state.value;
            state.disabled ? this.disable({ self: true }) : this.enable({ self: true });
            this.eventType = state.eventType || this.eventType;
        } else {
            this.value = (state !== undefined ? state : null);
        }
    }
    setValue(value, options) {
        options = options || {};
        this.value = value;
        if (this._onChangeEvents.length && !isequal(options.emitToView, false)) {
            this._onChangeEvents.length && this._onChangeEvents.forEach(function (eventChange) {
                return eventChange(value, !isequal(options.emitToView, false));
            });
        }

        this.updateValueAndStatus(options);
    }
    /*
      instance setViewValue Method
    */
    patchValue(val, options) {
        if (!options) {
            options = {};
        }

        this.setValue(val, options);
    }
    /**
     * reset a form field
     */
    reset(config, options) {
        this._setInitialState(config);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
    }
    registerOnChangeListener(listener) {
        this._onChangeEvents.push(listener);
    }
    registerOnDisabledListener(listener) {
        this._onDisableEvents.push(listener);
    }
    clearListeners() {
        this._onChangeEvents.length = 0;
        this._onDisableEvents.length = 0;
    }
}