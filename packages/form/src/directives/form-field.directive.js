import { VALUE_ACCESSOR } from "./abstract.event.accessor";
import { errorBuilder } from "@jeli/core";

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
/**
 *
 * @param {*} parentContainer
 * @param {*} eventBinder
 * @param {*} validators
 */
export class FormFieldDirective {
    constructor(parentContainer, eventBinder, validators) {
        this.eventBinder = getValueAccessor(eventBinder);
        this.control = null;
        this._validators = validators;
        this.parent = parentContainer;
    }
    didInit() {
        if (!this.parent) {
            return errorBuilder('[formField=' + this.name + ']: Expected an instance of FormControlDirective but got ' + typeof this.parent);
        }

        this.control = this.parent.addField(this);
        if (this.control.disabled && this.eventBinder.setDisabledState) {
            this.eventBinder.setDisabledState(true);
        }
    }
    modelToViewUpdate() { }
    viewDidDestroy() {
        if (this.parent) {
            this.parent.removeField(this);
            this.parent = null;
        }
        this.control = null;
    }
}


