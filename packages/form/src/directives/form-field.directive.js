import { VALUE_ACCESSOR } from "./abstract.event.accessor";
import { errorBuilder } from "@jeli/core";
import { FormControlDirective } from "./form-control.directive";

Directive({
    selector: 'formField',
    DI: ["ParentRef?=formControl", VALUE_ACCESSOR, 'VALIDATORS?'],
    props: ['name=formField'],
})

/**
 * 
 * @param {*} parentContainer 
 * @param {*} eventBinder 
 * @param {*} validators 
 */
export function FormFieldDirective(parentContainer, eventBinder, validators) {
    this.eventBinder = getValueAccessor(eventBinder);
    this.control = null;
    this._validators = validators;
    this.parent = parentContainer;
}

FormFieldDirective.prototype.didInit = function() {
    if (!(this.parent instanceof FormControlDirective)) {
        errorBuilder('Expected an instance of FormControlDirective but got ' + typeof this.parent);
    }

    this.control = this.parent.addField(this);
    if (this.control.disabled && this.eventBinder.setDisabledState) {
        this.eventBinder.setDisabledState(true);
    }
}

FormFieldDirective.prototype.modelToViewUpdate = function() {};
FormFieldDirective.prototype.viewDidDestroy = function() {
    if (this.parent) {
        this.parent.removeField(this);
        this.parent = null;
    }
    this.control = null;
};