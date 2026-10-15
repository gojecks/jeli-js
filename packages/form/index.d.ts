/**
 * Type declarations for @jeli/form
 *
 * Hand-authored from the actual runtime source. Covers every symbol
 * reachable from `public.api.js` -> `src/module.js`'s imports (jeli's
 * compiler flattens the whole reachable import graph's exports into one
 * package surface - see @jeli/compiler-cli/lib/core/compiler.js).
 *
 * OUT OF SCOPE: `Directive({...})`/`Service({...})` decorator option
 * objects (see packages/core/index.d.ts header for the full rationale) -
 * only the decorated classes' actual runtime members are declared.
 *
 * Note on naming: this framework doesn't use Angular's FormControl/
 * FormGroup/FormArray names. The equivalent roles are filled by:
 *   - `FormFieldControlService` - a single control (~FormControl)
 *   - `FormControlService`      - a named group of controls (~FormGroup)
 *   - `FormRepeaterService`     - an indexed/repeating set of controls (~FormArray)
 * all three extend the shared `FormControlAbstract` base.
 */

/// <reference path="../core/index.d.ts" />

import { ProviderToken, EventEmitter } from '@jeli/core';

export declare class FormModule {}

// ---------------------------------------------------------------------------
// Control model
// ---------------------------------------------------------------------------

/** Shared base for every control-like node (field, group, or repeater) in a form tree. */
export declare class FormControlAbstract {
    status: 'VALID' | 'INVALID' | 'DISABLED' | 'PENDING';
    value: any;
    error: Record<string, any> | null;
    touched: boolean;
    valueChanges: EventEmitter;
    statusChanged: EventEmitter;
    formFieldControls?: Record<string, FormControlAbstract> | FormControlAbstract[];
    constructor(validators?: Record<string, any> | null, deepValidation?: boolean);
    readonly parent: FormControlAbstract | null;
    readonly untouched: boolean;
    readonly invalid: boolean;
    readonly enabled: boolean;
    readonly disabled: boolean;
    readonly valid: boolean;
    setParent(context: FormControlAbstract): void;
    setStatus(): string;
    destroy(softDestroy?: boolean): void;
    markAsTouched(options?: { self?: boolean }): void;
    markAllAsTouched(): void;
    markAsUntouched(options?: { self?: boolean }): void;
    markAllAsUnTouched(): void;
    updateValueAndStatus(options?: { self?: boolean; emitEvent?: boolean }): void;
    enable(options?: { emitEvent?: boolean }): void;
    disable(options?: { emitEvent?: boolean }): void;
    forEachField(callback: (control: FormControlAbstract, field: string | number) => void): void;
    setValidators(validator: Record<string, any>): void;
    setError(errors: Record<string, any> | null, emitEvent?: boolean): void;
    getError(errorType: string): any;
    hasError(errorType: string): boolean;
    getPath(path: string): string | string[];
    isValueChanged(value: any): boolean;
}

/** A named group of field/group controls (~FormGroup). */
export declare class FormControlService extends FormControlAbstract {
    formFieldControls: Record<string, FormControlAbstract>;
    constructor(formFields: Record<string, any>, validators?: Record<string, any>);
    addField(name: string, fieldControl: FormControlAbstract | any): void;
    addFields(fieldControls: Record<string, any>): void;
    hasField(controlName: string): boolean;
    getField(controlName: string): FormControlAbstract | null;
    getByPath(paths: string[]): FormControlAbstract | null;
    patchValue(values: Record<string, any>, options?: { self?: boolean }): void;
    setValue(values: Record<string, any>, options?: { self?: boolean }): void;
    reset(value?: Record<string, any>, options?: { emitEvent?: boolean }): void;
    setFormFieldValidators(fieldValidators: Record<string, any>): void;
    setFieldValidator(field: string, validator: Record<string, any>): this;
    allTouched(): boolean;
    removeField(name: string, softDestroy?: boolean): void;
    getAllValues(): Record<string, any>;
}

/** A single leaf control's value/status (~FormControl). */
export declare class FormFieldControlService extends FormControlAbstract {
    eventType: string;
    valueType: string;
    constructor(fieldControl?: { value?: any; disabled?: boolean; eventType?: string; valueType?: string; validators?: Record<string, any> } | any, isManualInit?: boolean);
    setValue(value: any, options?: { emitToView?: boolean }): void;
    patchValue(value: any, options?: Record<string, any>): void;
    reset(config?: any, options?: Record<string, any>): void;
    registerOnChangeListener(listener: (value: any, emitEvent?: boolean) => void): void;
    registerOnDisabledListener(listener: (disabled: boolean) => void): void;
    clearListeners(): void;
}

/** An indexed, repeatable set of controls (~FormArray). */
export declare class FormRepeaterService extends FormControlAbstract {
    value: any[];
    formFieldControls: FormControlAbstract[];
    constructor(fields?: Record<string, any> | null, validators?: Record<string, any>, autoGenerate?: number);
    addField(fieldControl?: any): void;
    patchValue(values: any[], options?: Record<string, any>): void;
    getField(index: number): FormControlAbstract | null;
    removeField(index: number): void;
    destroy(): void;
}

// ---------------------------------------------------------------------------
// Form directives
// ---------------------------------------------------------------------------

/** Base for directives that host a `FormControlService` (`[formControl]` / `[formControlName]`). */
export declare class AbstractFormControl {
    changeDetector: any;
    formName: string;
    form: FormControlService | null;
    constructor(changeDetector?: any);
    addField(formFieldInstance: { name: string }): FormControlAbstract;
    removeField(formFieldInstance: { name: string }): void;
    getField(fieldName: string): FormControlAbstract | null;
    resetForm(values?: Record<string, any>): void;
    viewDidDestroy(): void;
}

/** `[formControl]` - binds a `FormControlService` instance directly. */
export declare class FormControlDirective extends AbstractFormControl {
    formControl: FormControlService;
}

/** `[formControlName]` - resolves a named field from the nearest ancestor `FormControlDirective`. */
export declare class FormControlNameDirective extends AbstractFormControl {
    parentControl: FormControlDirective;
    constructor(parentControl: FormControlDirective, changeDetector?: any);
    formControlName: string;
}

/** `[fieldControl]` - binds a `FormFieldControlService` directly to a value-accessor-bearing element. */
export declare class FormFieldControlDirective {
    eventBinder: AbstractValueAccessor;
    control: FormFieldControlService | null;
    constructor(eventBinder: AbstractValueAccessor[], validators?: any);
    disabled: any;
    didInit(): void;
    modelToViewUpdate(): void;
}

/** `[formField]` - a named field registered onto the nearest ancestor `AbstractFormControl` directive. */
export declare class FormFieldDirective {
    eventBinder: AbstractValueAccessor;
    control: FormControlAbstract | null;
    parent: AbstractFormControl;
    name?: string;
    constructor(parentContainer: AbstractFormControl, eventBinder: AbstractValueAccessor[], validators?: any);
    didInit(): void;
    modelToViewUpdate(): void;
    viewDidDestroy(): void;
}

/** `[model]` - standalone two-way model binding (`jModel`), independent of any parent form group. */
export declare class ModelDirective {
    eventBinder: AbstractValueAccessor;
    fieldControl: FormFieldControlService;
    modelChange: EventEmitter;
    constructor(eventBinder: AbstractValueAccessor[], parentControl?: any, validators?: any);
    model: any;
    modelOptions?: Record<string, any>;
    name?: string;
    modelToViewUpdate(value: any): void;
    didInit(): void;
    viewDidDestroy(): void;
}

// ---------------------------------------------------------------------------
// Value accessors
// ---------------------------------------------------------------------------

/** Multi-provider DI token every value-accessor directive registers itself under. */
export declare const VALUE_ACCESSOR: ProviderToken<AbstractValueAccessor[]>;

/** Base for directives that read/write a native form element's value (writeValue/onChange/onBlur). */
export declare class AbstractValueAccessor {
    onChange: (value?: any) => void;
    onDisable: (state?: boolean) => void;
    onBlur: (event?: any) => void;
    element: any;
    constructor(elementRef: any);
    setDisabledState(state: boolean): void;
    registerOnBlur(onBlurFn: (event?: any) => void): void;
    registerOnChange(onChangeFn: (value?: any) => void): void;
    registerOnDisable(onDisableFn: (state?: boolean) => void): void;
    clearRegistries(): void;
    writeValue?(value: any): void;
}

export declare const ResolveDefaultBinder: { name: ProviderToken<any>; reference: Function };
export declare class DefaultEventBinder extends AbstractValueAccessor {
    writeValue(value: any): void;
    stringifyValue(value: any): any;
}

export declare const ResolveCheckboxBinder: { name: ProviderToken<any>; reference: Function };
export declare class CheckboxEventBinder extends AbstractValueAccessor {
    writeValue(checked: boolean): void;
}

export declare const ResolveRadioBinder: { name: ProviderToken<any>; reference: Function };
/** @internal registry coordinating mutually-exclusive selection across a named radio group. */
export declare class RadioEventContainer {
    constructor();
    register(eventBinder: RadioEventBinder): void;
    remove(eventBinder: RadioEventBinder): void;
    selectValue(eventBinder: RadioEventBinder): void;
}
export declare class RadioEventBinder extends AbstractValueAccessor {
    radioEventContainer: RadioEventContainer;
    state: boolean;
    name?: string;
    formField?: string;
    value?: any;
    constructor(elementRef: any, radioEventContainer: RadioEventContainer);
    didInit(): void;
    didDestroy(): void;
    registerOnChange(onChangeFn: (value?: any) => void): void;
    writeValue(value: any): void;
}

export declare const ResolveSelectBinder: { name: ProviderToken<any>; reference: Function };
export declare class SelectEventBinder extends AbstractValueAccessor {
    idIncrement: number;
    selectedValue: any;
    constructor(elementRef: any);
    compareFn: (a: any, b: any) => boolean;
    writeValue(value: any): void;
    isSelected(optionId: string): boolean;
    genOptionId(): string;
    getOptionIdByValue(value: any): string | null;
    destroyOption(optionId: string): void;
}
/** `<option>` inside a `SelectEventBinder`-managed `<select>`. */
export declare class OptionDirective {
    selectInstance: SelectEventBinder;
    id?: string;
    value: any;
    jValue: any;
    constructor(selectInstance: SelectEventBinder, elementRef: any);
    prepareValue(value: any): void;
    setValue(value: any): void;
    viewDidDestroy(): void;
}

export declare const ResolveNumberBinder: { name: ProviderToken<any>; reference: Function };
export declare class NumberEventBinder extends AbstractValueAccessor {
    writeValue(value: any): void;
    registerOnChange(onChangeFn: (value: number | null) => void): void;
}

export declare const ResolveRangeBinder: { name: ProviderToken<any>; reference: Function };
export declare class RangeEventBinder extends AbstractValueAccessor {
    writeValue(value: any): void;
    registerOnChange(onChangeFn: (value: number | null) => void): void;
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

export declare function setupControl(fieldControl: FormControlAbstract, dir: { name?: string; eventBinder: AbstractValueAccessor; _validators?: any; modelToViewUpdate?: Function }): void;
export declare function cleanupControl(fieldControl: FormControlAbstract | null | undefined, dir: { eventBinder: AbstractValueAccessor } | null | undefined): void;
export declare function _validateAndBindStatus(dir: { _registered?: boolean; form?: FormControlService; formName?: string; changeDetector: any }): void;
export declare function getValueAccessor(valueAccessors: AbstractValueAccessor[]): AbstractValueAccessor;
export declare function getValueByPath(value: any, paths: string[]): any;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface FormValidatorFn {
    (formValue: any): void;
    addValidators(newValidators: Record<string, any>): void;
}

/** Build a validator function (with `.addValidators`) that reports failures back through `callback`. */
export declare function FormValidatorService(callback: (errors: Record<string, any> | null) => void, validators?: Record<string, any> | null, isDeep?: boolean): FormValidatorFn;

/** Register a custom named validator function onto `FormValidationStack`. */
export declare function customFormValidator(validatorName: string, validatorFn: (value: any, criteria?: any) => boolean | Promise<boolean>, override?: boolean): void;

/** Registry of built-in validator functions (REQUIRED, MINLENGTH, PATTERN, EMAILVALIDATION, ...), keyed by uppercased name. */
export declare class FormValidationStack {
    static MINLENGTH(value: any, requiredLength: number): boolean;
    static MAXLENGTH(value: any, requiredLength: number): boolean;
    static EMAILVALIDATION(value: any): boolean;
    static ISEMPTY(val: any, def: boolean): boolean;
    static BOOLEAN(value: any, def: boolean): boolean;
    static DOMAINVALIDATION(domain: any): boolean;
    static MEDIUMPASSWORDSTRENGTH(passwd: any): boolean;
    static STRONGPASSWORDSTRENGTH(passwd: any): boolean;
    static PATTERN(value: any, pattern: string): boolean;
    static REQUIRED(value: any, required: boolean): boolean;
    static REQUIREDTRUE(value: any): boolean;
    static MINNUMBER(value: any, minNumber: number): boolean;
    static MAXNUMBER(value: any, maxNumber: number): boolean;
    [validatorName: string]: any;
}
