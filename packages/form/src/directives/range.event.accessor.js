import { VALUE_ACCESSOR } from "./abstract.event.accessor";
import { closureRef, AttributeAppender } from '@jeli/core';

export var ResolveRangeBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return RangeEventBinder;
    })
};
Directive({
    selector: 'input:type=range:[model|formField|fieldControl]',
    events: [
        "input:event=onChange($event.target.value)",
        "change:event=onChange($event.target.value)",
        "blur:event=onBlur($event)"
    ],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveRangeBinder],
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
export class RangeEventBinder extends AbstractValueAccessor{
    writeValue(value) {
        value = (value === null || value === undefined) ? '' : value;
        AttributeAppender.setProp(this.element.nativeElement, 'value', parseFloat(value), true);
    }
    registerOnChange(onChangeFn) {
        this.onChange = function (value) {
            onChangeFn(value == '' ? null : parseFloat(value));
        };
    }
}