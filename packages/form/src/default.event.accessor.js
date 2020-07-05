import { VALUE_ACCESSOR } from "./abstract.event.accessor";

Directive({
    selector: 'input:type!=checkbox|radio:model,input:type!=checkbox|radio:formField,textarea:model,textarea:formField',
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
export function DefaultEventBinder(elementRef) {
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};
    this.element = elementRef;
}

DefaultEventBinder.prototype._handleInput = function(event) {
    this.onChange(event);
};

DefaultEventBinder.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = onChangeFn;
};

DefaultEventBinder.prototype.registerOnDisable = function(onDisableFn) {
    this.onDisable = onDisableFn;
};

DefaultEventBinder.prototype._registerOnBlur = function(onBlurFn) {
    this.onBlur = onBlurFn;
};

DefaultEventBinder.prototype.writeValue = function(value) {
    this.element.setProp('value', value, true);
};

DefaultEventBinder.prototype.setDisableState = function(state) {
    this.element.setProp('disabled', state);
};