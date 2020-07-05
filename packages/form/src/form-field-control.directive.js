import { isequal } from 'js-helpers/helpers';
import { errorBuilder } from '@jeli/core';
Directive({
    selector: 'fieldControl',
    DI: ['ElementRef?', 'formControl?=:formControl'],
    props: ['control=fieldControl'],
    events: ["default:event=eventListener($event)"]
})

/**
 * 
 * @param {*} elementRef 
 */
export function FormFieldControlDirective(elementRef, formControl) {
    this.control = null;
    this.didInit = function() {
        this.control.attachView({
            element: elementRef,
            canSetValue: isequal('input', EventHandler.getEventType(elementRef.nativeElement)),
            viewRef: -1
        });
    };

    Object.defineProperty(this, 'control', {
        get: function(control) {
            if (!(control instanceof FormFieldControlService)) {
                errorBuilder(new TypeError('Invalid field control'));
            }

            if (formControl && formControl instanceof FormControlDirective) {
                errorBuilder('use a {:form-field} directive instead.');
            }

            this.control = control;
        }
    });
}