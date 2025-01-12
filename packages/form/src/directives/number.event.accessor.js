import { VALUE_ACCESSOR } from "./abstract.event.accessor";
import { closureRef, AttributeAppender } from '@jeli/core';

export var ResolveNumberBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return NumberEventBinder;
    })
};
Directive({
    selector: 'input:type=number:[model|formField|fieldControl]',
    events: [
        "input:event=onChange($event.target.value)",
        "blur:event=onBlur($event)"
    ],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveNumberBinder],
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
export class NumberEventBinder extends AbstractValueAccessor{
    writeValue(value) {
        value = (value === null || value === undefined) ? '' : value;
        AttributeAppender.setProp(this.element.nativeElement, 'value', value);
    }
    registerOnChange(onChangeFn) {
        this.onChange = function (value) {
            onChangeFn(value == '' ? null : parseFloat(value));
        };
    }
}
