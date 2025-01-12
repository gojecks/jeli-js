import { errorBuilder } from '@jeli/core';
import { AbstractFormControl } from './abstract.form.control';

Directive({
    selector: 'formControl',
    props: ['formControl'],
    DI: ['changeDetector?']
})
export class FormControlDirective extends AbstractFormControl {
    set formControl(formControl){
        this.form = formControl;
        _validateAndBindStatus(this);
    }
}


Directive({
    selector: 'formControlName',
    props: ['formControlName'],
    DI: ["ParentRef?=formControl", "changeDetector?"],
    exportAs: "formControl"
})
export class FormControlNameDirective extends AbstractFormControl{
    constructor(parentControl, changeDetector) {
        super(changeDetector);
        this.parentControl = parentControl;
        if (!parentControl || !(parentControl instanceof FormControlDirective)) {
            return errorBuilder('Expected instance of FormControlService but got ' + typeof parentControl);
        }
    }

    set formControlName(formName){
        this.formName = formName;
        this.form = this.parentControl.getField(formName);
        _validateAndBindStatus(this);
    }
}