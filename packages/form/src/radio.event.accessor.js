import { VALUE_ACCESSOR } from './abstract.event.accessor';

Directive({
    selector: 'input:type=radio:model,input:type=radio:formField',
    props: ['name'],
    events: [
        "change:event=_handleInput($event)",
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
export function RadioEventBinder(elementRef) {
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};
    this.element = elementRef;
};

RadioEventBinder.prototype._handleInput = function(event) {
    this.onChange(event.target.value);
};

RadioEventBinder.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = onChangeFn;
};

RadioEventBinder.prototype.registerOnDisable = function(onDisableFn) {
    this.onDisable = onDisableFn;
};

RadioEventBinder.prototype._registerOnBlur = function(onBlurFn) {
    this.onBlur = onBlurFn;
};

RadioEventBinder.prototype.writeValue = function(checked) {
    this.element.setProp('checked', checked, true);
};

RadioEventBinder.prototype.setDisableState = function(state) {
    this.element.setProp('disabled', state);
};