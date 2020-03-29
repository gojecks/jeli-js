Directive({
    selector: 'input:type!=checkbox|radio:model,input:type!=checkbox|radio:formField,textarea:model,textarea:formField',
    registry: [
        "input:event=_handleInput($event)",
        "blur:event=onBlur($event)"
    ],
    DI: ['ElementRef?'],
    VALUE_ACCESSOR: true
}, DefaultEventBinder);

/**
 * 
 * @param {*} elementRef 
 */
function DefaultEventBinder(elementRef) {
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};

    Object.defineProperty(this, 'element', {
        get: function() {
            return elementRef;
        }
    });
}

DefaultEventBinder.prototype._handleInput = function(event) {
    this.onChange(event.target.value);
};

DefaultEventBinder.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = onChangeFn;
};

DefaultEventBinder.prototype.registerOnDisable = function(onDisableFn) {
    this.onDisable = onDisableFn;
};

DefaultEventBinder.prototype._registerOnBlur = function(onBlurFn) {
    this.onBlurFn = onBlurFn;
};

DefaultEventBinder.prototype.writeValue = function(value) {
    this.element.setProp('value', value, true);
};

DefaultEventBinder.prototype.setDisableState = function(state) {
    this.element.setProp('disabled', state);
};