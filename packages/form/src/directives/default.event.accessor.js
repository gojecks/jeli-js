import { VALUE_ACCESSOR } from "./abstract.event.accessor";
import { closureRef } from '@jeli/core';

export var ResolveDefaultBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return DefaultEventBinder;
    })
};
Directive({
    selector: 'input:type!=checkbox|radio|number|range:[model|formField|fieldControl],textarea:[model|formField|fieldControl]',
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
export function DefaultEventBinder(elementRef) {
    AbstractValueAccessor.call(this, elementRef);
}

DefaultEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
DefaultEventBinder.prototype.constructor = AbstractValueAccessor;

DefaultEventBinder.prototype.writeValue = function(value) {
    value = (value === null || value === undefined) ? '' : value;
    this.element.setProp('value', value, true);
};