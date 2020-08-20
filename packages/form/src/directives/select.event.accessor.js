import { isequal, isarray, inarray } from 'js-helpers/helpers';
import { VALUE_ACCESSOR } from './abstract.event.accessor';
import { closureRef } from '@jeli/core';

export var ResolveSelectBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return SelectEventBinder;
    })
};

Directive({
    selector: 'select:[model|formField|fieldControl]',
    events: [
        "input:event=_handleSelection($event.target)",
        "blur:event=onBlur($event)"
    ],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveSelectBinder],
    DI: ['ElementRef?']
})

/**
 * 
 * @param {*} elementRef 
 */
export function SelectEventBinder(elementRef) {
    AbstractValueAccessor.call(this, elementRef);
};

SelectEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
SelectEventBinder.prototype.constructor = AbstractValueAccessor;

SelectEventBinder.prototype._handleSelection = function(target) {
    var selectedValue = this._getValue(target);
    this.onChange(selectedValue);
};

SelectEventBinder.prototype.writeValue = function(value) {
    this.element.children.forEach(function(options) {
        options.setProp('selected', (isarray(value) ? inarray : isequal)(options.getAttribute('value'), value));
    });
};

SelectEventBinder.prototype._getValue = function(target) {
    if (!this.element.children.length || target.options.length > this.element.children.length) {
        return target.value;
    }

    if (this.element.hasAttribute('multiple')) {
        var optionsValue = [];
        for (var i = 0; i < target.selectedOptions.length; i++) {
            var option = target.selectedOptions[i];
            var value = this.element.children.findByIndex(option.index).getAttribute('value');
            optionsValue.push(value);
        }

        return optionsValue;
    }

    return this.element.children.findByIndex(target.selectedIndex).getAttribute('value');
}