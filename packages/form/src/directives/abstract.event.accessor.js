import { ProviderToken } from "@jeli/core";
export var VALUE_ACCESSOR = new ProviderToken('ValueAccessor', true);

export class AbstractValueAccessor {
    constructor(elementRef) {
        this.onChange = function () { };
        this.onDisable = function () { };
        this.onBlur = function () { };
        this.element = elementRef;
    }
    setDisabledState(state) {
        AttributeAppender.setProp(this.element.nativeElement, 'disabled', state);
    }
    registerOnBlur(onBlurFn) {
        this.onBlur = onBlurFn;
    }
    registerOnChange(onChangeFn) {
        this.onChange = onChangeFn;
    }
    registerOnDisable(onDisableFn) {
        this.onDisable = onDisableFn;
    }
    clearRegistries() {
        this.elementRef = null;
        this.onChange = null;
        this.onBlur = null;
        this.onDisable = null;
    }
}