export var VALUE_ACCESSOR = new ProviderToken('ValueAccessor', true);

export function AbstractValueAccessor() {
    this.onChange = function() {};
    this.onDisable = function() {};
    this.onBlur = function() {};
}