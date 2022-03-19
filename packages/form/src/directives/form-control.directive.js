import { errorBuilder } from '@jeli/core';
import { AbstractFormControl } from './abstract.form.control';

Directive({
    selector: 'formControl',
    props: ['formControl'],
    DI: ['changeDetector?']
})
export function FormControlDirective(changeDetector) {
    AbstractFormControl.call(this, changeDetector);
    Object.defineProperty(this, 'formControl', {
        set: function(formControl) {
            this.form = formControl;
            _validateAndBindStatus(this);
        }
    });
}

FormControlDirective.prototype = Object.create(AbstractFormControl.prototype);
FormControlDirective.prototype.constructor = FormControlDirective;


Directive({
    selector: 'formControlName',
    props: ['formControlName'],
    DI: ["ParentRef?=formControl", "changeDetector?"],
    exportAs: "formControl"
})
export function FormControlNameDirective(parentControl, changeDetector) {
    AbstractFormControl.call(this, changeDetector);
    if (!parentControl || !(parentControl instanceof FormControlDirective)) {
        return errorBuilder('Expected instance of FormControlService but got ' + typeof parentControl);
    }

    Object.defineProperty(this, 'formControlName', {
        set: function(formName) {
            this.formName = formName;
            this.form = parentControl.getField(formName);
            _validateAndBindStatus(this);
        }
    });
}

FormControlNameDirective.prototype = Object.create(AbstractFormControl.prototype);
FormControlNameDirective.prototype.constructor = FormControlNameDirective;