import { VALUE_ACCESSOR } from './abstract.event.accessor';


Directive({
    selector: 'input:type=checkbox:[model|formField|fieldControl]',
    events: [
        "change:event=onChange($event.target.checked)",
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
export function CheckboxEventBinder(elementRef) {
    AbstractValueAccessor.call(this, elementRef);
};

CheckboxEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
CheckboxEventBinder.prototype.constructor = AbstractValueAccessor;

CheckboxEventBinder.prototype.writeValue = function(checked) {
    this.element.setProp('checked', checked, true);
};