export var VALUE_ACCESSOR = new ProviderToken('ValueAccessor', true);

export function AbstractValueAccessor(elementRef) {
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};
    this.element = elementRef;
}

AbstractValueAccessor.prototype.setDisabledState = function(state) {
    AttributeAppender.setProp(this.element.nativeElement, 'disabled', state);
};

AbstractValueAccessor.prototype.registerOnBlur = function(onBlurFn) {
    this.onBlur = onBlurFn;
};

AbstractValueAccessor.prototype.registerOnChange = function(onChangeFn) {
    this.onChange = onChangeFn;
};

AbstractValueAccessor.prototype.registerOnDisable = function(onDisableFn) {
    this.onDisable = onDisableFn;
};