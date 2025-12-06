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
    constructor(fieldControl, isManualInit = false) {
        super(fieldControl ? fieldControl.validators : null, false);
        this.eventType = 'default';
        this.valueType = 'default'
        this._onChangeEvents = [];
        if (!isManualInit){
            this._setInitialState(fieldControl);
        }
    }

    _setInitialState(state) {
        if (isobject(state)) {
            this.value = (![undefined, null].includes(state.value) ? state.value : this.value);
            state.disabled ? this.disable({ self: true }) : this.enable({ self: true });
            this.eventType = state.eventType || this.eventType;
            this.valueType = state.valueType || this.valueType;
        } else {
            this.value = (state !== undefined ? state : null);
        }
    }

    setValue(value, options) {
        options = options || {};
        this.value = value;
        const emitToView = !isequal(options.emitToView, false);
        if (this._onChangeEvents.length && emitToView) {
            this._onChangeEvents.forEach(
                (eventChange) => eventChange(value, emitToView)
            );
        }

        this.updateValueAndStatus(options);
    }
    
    // instance setViewValue Method
    patchValue(val, options) {
        this.setValue(val, options || {});
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