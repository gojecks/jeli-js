/**
 * Type declarations for @jeli/common
 *
 * Hand-authored from the actual runtime source. Covers every symbol
 * reachable from `public.api.js` -> `src/module.js`'s imports (jeli's
 * compiler flattens the whole reachable import graph's exports into one
 * package surface - see @jeli/compiler-cli/lib/core/compiler.js).
 *
 * OUT OF SCOPE (see packages/core/index.d.ts header for the full rationale):
 * the `Directive({...})` / `Service({...})` / `Pipe({...})` decorator
 * option objects applied to each class below (e.g. `ForDirective`'s
 * `selector: 'for'`, `props: [...]`). Those calls aren't real exported
 * runtime functions - they're a compile-time-only annotation pattern
 * recognized by @jeli/compiler-cli - so only the decorated classes
 * themselves (their constructor/public members, as actually used at
 * runtime) are declared here.
 */

/// <reference path="../core/index.d.ts" />

import { ElementRef, ViewRef, TemplateRef } from '@jeli/core';

/** Root module bundling every directive/pipe/service declared by this package. */
export declare class CommonModule {}

// ---------------------------------------------------------------------------
// Structural directives
// ---------------------------------------------------------------------------

/** `*jFor` / `<j-for>` - repeats its template once per item in `forOf`/`forIn`. */
export declare class ForDirective {
    viewRef: ViewRef;
    templateRef: TemplateRef;
    constructor(viewRef: ViewRef, templateRef: TemplateRef);
    forIn: Record<string, any> | null;
    forOf: any[] | null;
    forTrackBy: string | ((item: any, index: number) => any) | null;
    willObserve(): void;
    viewDidDestroy(): void;
}

/** `*jIf` - conditionally renders `ifThen`/`ifElse` templates based on `if`. */
export declare class IfDirective {
    viewRef: ViewRef;
    constructor(viewRef: ViewRef, templateRef: TemplateRef);
    if: boolean;
    ifElse: TemplateRef | null;
    ifThen: TemplateRef;
    createView(): void;
}

/** `:switch` - host directive coordinating a set of sibling `*switchCase`/`*switchDefault` views. */
export declare class SwitchDirective {
    constructor();
    switch: any;
    viewDidDestroy(): void;
}

/** `*switchCase` - renders its template when its value matches the parent `SwitchDirective`'s `switch` value. */
export declare class SwitchCaseDirective {
    switchCase: any;
    constructor(viewRef: ViewRef, templateRef: TemplateRef, jSwitch: SwitchDirective);
    willObserve(): void;
}

/** `*switchDefault` - renders when no sibling `*switchCase` matches. */
export declare function SwitchDefaultDirective(viewRef: ViewRef, templateRef: TemplateRef, jSwitch: SwitchDirective): void;

/** `[class]="jClass"` - adds/removes classes based on a string or `{ className: boolean }` map. */
export declare class ClassDirective {
    elementRef: ElementRef;
    lastAddedClass: string;
    constructor(elementRef: ElementRef);
    class: string | Record<string, boolean> | undefined;
    viewDidDestroy(): void;
}

// ---------------------------------------------------------------------------
// Filters / pipes (registered as Services; used via template `| filterName` syntax)
// ---------------------------------------------------------------------------

export declare class capitalizeFilter {
    compile(value: string): string;
}

export declare class CurrencyFilter {
    numberFilter: NumberFilter;
    constructor(numberFilter: NumberFilter);
    compile(value: number, style?: Intl.NumberFormatOptions): string;
}

export declare class jsonFilterFn {
    compile(value: any, spacing?: string | number): any;
}

export declare class lowerCaseFilter {
    compile(value: string): string;
}

export declare class NumberFilter {
    compile(value: number, factoRize?: [number?, number?, string?, string?]): string;
}

export declare class orderByFilterFn {
    compile(value: any[], propertyName: string): any[];
}

export declare class upperCaseFilter {
    compile(value: string): string;
}

export declare class whereFilterFn {
    compile(model: any[], query: string): any[];
}

export declare class FilterPipe {
    compile(array: any[], expression: Function | boolean | number | string | null | Record<string, any>): any[];
}

export declare class ReversePipe {
    compile(data: any[]): any[];
}

export declare class SizeToUnitPipe {
    compile(size: number): string;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

/** Small query/sort helper over an array of objects (constructed fresh per query). */
export declare class QueryFactory {
    constructor(data: any[]);
    sortBy(...propertyNames: string[]): any[];
    /** Additional query operators (e.g. `.where(...)`) used by this package's own filters. */
    [method: string]: any;
}
