import { VALUE_ACCESSOR } from "./abstract.event.accessor";
import { closureRef, AttributeAppender } from '@jeli/core';

export var ResolveDefaultBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return DefaultEventBinder;
    })
};
Directive({
    selector: 'input:type!=checkbox|radio|number|range:[model|formField|fieldControl],textarea:[model|formField|fieldControl],input:list:[model|formField|fieldControl]',
    events: [
        "input:event=onChange($event.target.value)",
        "blur:event=onBlur($event)"
    ],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveDefaultBinder],
    DI: ['ElementRef?']
})
/**
 *
 * @param {*} elementRef
 */
export class DefaultEventBinder extends AbstractValueAccessor {
    writeValue(value) {
        value = (value === null || value === undefined) ? '' : value;
        AttributeAppender.setProp(this.element.nativeElement, 'value', value);
    }
}
