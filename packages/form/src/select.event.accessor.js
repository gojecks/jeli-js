import { isequal } from 'js-helpers/helpers';
import { VALUE_ACCESSOR } from './abstract.event.accessor';

Directive({
    selector: 'select:model,select:formField',
    events: [
        "input:event=_handleInput($event.target.value)",
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
export function SelectEventBinder(elementRef) {
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};
    this.element = elementRef;
};

SelectEventBinder.prototype._handleInput = function(event) {
    this.onChange(event);
};

SelectEventBinder.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = onChangeFn;
};

SelectEventBinder.prototype.registerOnDisable = function(onDisableFn) {
    this.onDisable = onDisableFn;
};

SelectEventBinder.prototype._registerOnBlur = function(onBlurFn) {
    this.onBlurFn = onBlurFn;
};

SelectEventBinder.prototype.writeValue = function(value) {
    this.element.children.forEach(
        /**
         * 
         * @param {*} options 
         */
        function setOptionsValue(options) {
            var optionValue = options.getAttribute('value');
            if (isequal(optionValue, value)) {
                options.setProp('selected', true);
            }
        });
};

SelectEventBinder.prototype.setDisableState = function(state) {
    this.element.setProp('disabled', state);
};