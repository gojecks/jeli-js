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
export function FormFieldControlDirective(eventBinder, validators) {
    this.eventBinder = getValueAccessor(eventBinder);
    this.control = null;
    this._validators = validators;

    Object.defineProperty(this, 'disabled', {
        set: function(disabled) {
            console.warn('The use of disabled property with a form field control directive will not take effect');
        }
    })
}

FormFieldControlDirective.prototype.didInit = function() {
    if (!(this.control instanceof FormFieldControlService)) {
        errorBuilder('Expected instance of FormFieldControlService but got ' + typeof this.control);
    }

    setupControl(this.control, this);
    if (this.control.disabled && this.eventBinder.setDisabledState) {
        this.eventBinder.setDisabledState(true);
    }
    this.control.updateValueAndStatus({ emitEvent: false });
};

FormFieldControlDirective.prototype.modelToViewUpdate = function() {};