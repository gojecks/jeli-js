import { errorBuilder } from '@jeli/core';
import { VALUE_ACCESSOR } from './abstract.event.accessor';
Directive({
    selector: 'fieldControl',
    DI: [VALUE_ACCESSOR, 'VALIDATORS?'],
    props: ['control=fieldControl', 'disabled']
})

/**
 * 
 * @param {*} eventBinder 
 * @param {*} validators 
 */
/**
 *
 * @param {*} eventBinder
 * @param {*} validators
 */
export class FormFieldControlDirective {
    constructor(eventBinder, validators) {
        this.eventBinder = getValueAccessor(eventBinder);
        this.control = null;
        this._validators = validators;
        this._warning = false;
    }

    set disabled(value) {
        if (!this._warning) {
            this._warning = true;
            console.warn('The use of disabled property with a form field control directive will not take effect');
        }
    }
    didInit() {
        if (!(this.control instanceof FormFieldControlService)) {
            return errorBuilder('Expected instance of FormFieldControlService but got ' + typeof this.control);
        }

        setupControl(this.control, this);
        if (this.control.disabled && this.eventBinder.setDisabledState) {
            this.eventBinder.setDisabledState(true);
        }
        this.control.updateValueAndStatus({ emitEvent: false });
    }
    modelToViewUpdate() { }
}


