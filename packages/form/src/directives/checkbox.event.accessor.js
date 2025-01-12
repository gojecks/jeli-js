import { VALUE_ACCESSOR } from './abstract.event.accessor';
import { closureRef, AttributeAppender } from '@jeli/core';

export var ResolveCheckboxBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return CheckboxEventBinder;
    })
};

Directive({
    selector: 'input:type=checkbox:[model|formField|fieldControl]',
    events: [
        "change:event=onChange($event.target.checked)",
        "blur:event=onBlur($event)"
    ],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveCheckboxBinder],
    DI: ['ElementRef?']
})

/**
 * 
 * @param {*} elementRef 
 */
/**
 *
 * @param {*} elementRef
 */
export class CheckboxEventBinder extends AbstractValueAccessor{
    writeValue(checked) {
        AttributeAppender.setProp(this.element.nativeElement, 'checked', checked, true);
    }
};