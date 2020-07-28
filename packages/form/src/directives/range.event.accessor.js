import { VALUE_ACCESSOR } from "./abstract.event.accessor";

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
    registerAs: VALUE_ACCESSOR,
    DI: ['ElementRef?']
})

/**
 * 
 * @param {*} elementRef 
 */
export function RangeEventBinder(elementRef) {
    AbstractValueAccessor.call(this, elementRef);
}

RangeEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
RangeEventBinder.prototype.constructor = AbstractValueAccessor;

RangeEventBinder.prototype.writeValue = function(value) {
    value = (value === null || value === undefined) ? '' : value;
    this.element.setProp('value', parseFloat(value), true);
};

RangeEventBinder.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = function(value) {
        onChangeFn(value == '' ? null : parseFloat(value));
    };
};