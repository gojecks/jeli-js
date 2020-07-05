import { VALUE_ACCESSOR } from './abstract.event.accessor';


Directive({
    selector: 'input:type=checkbox:model,input:type=checkbox:formField',
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
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};
    this.element = elementRef;
};

CheckboxEventBinder.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = onChangeFn;
};

CheckboxEventBinder.prototype.registerOnDisable = function(onDisableFn) {
    this.onDisable = onDisableFn;
};

CheckboxEventBinder.prototype._registerOnBlur = function(onBlurFn) {
    this.onBlur = onBlurFn;
};

CheckboxEventBinder.prototype.writeValue = function(checked) {
    this.element.setProp('checked', checked, true);
};

CheckboxEventBinder.prototype.setDisableState = function(state) {
    this.element.setProp('disabled', state);
};