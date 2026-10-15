/**
 * Type declarations for @jeli/core
 *
 * Hand-authored from the actual runtime source (not generated). Covers the
 * symbols reachable, transitively, from `public.api.js` -> every file it
 * `import`s or `export * from`s (jeli's own compiler flattens that whole
 * reachable graph's `export`ed bindings into one package surface - see
 * @jeli/compiler-cli/lib/core/compiler.js `pushToExports`, which is called
 * for every processed file, not just the entry file).
 *
 * Also declares the decorator option-object shapes (`Element({...})`,
 * `Directive({...})`, `Service(...)`, `Provider(...)`, `Pipe(...)`,
 * `jModule({...})`) at the bottom of this file, as global ambient function
 * declarations - see that section's own header comment for why (they are
 * not real exported runtime values, and are not real TC39/TS decorators
 * either, despite the naming convention).
 */

// ---------------------------------------------------------------------------
// Dependency Injection
// ---------------------------------------------------------------------------

/**
 * A DI token/registry. `multiple: true` tokens (e.g. INITIALIZERS,
 * APP_BOOTSTRAP) accumulate an array of registered providers; singular
 * tokens hold a single resolved value.
 */
export declare class ProviderToken<T = any> {
    tokenName: string;
    multiple?: boolean;
    constructor(tokenName: string, multiple?: boolean, provide?: any);
    static getToken(resolved: boolean, token: any): any;
    register(value: any, persist?: boolean): void;
    resolve(): T;
}

/** Resolve a dependency (DI token, class reference, or static value). */
export declare function Inject<T = any>(dep: any, localInjector?: AbstractInjectorInstance): T;

/** Instantiate `constructorFN`, resolving its `.ctors.DI` dependency list. */
export declare function AutoWire(constructorFN: any, localInjector?: AbstractInjectorInstance, callback?: (result: any) => any): any;

/** Resolve and register a list of local (component/directive-scoped) DI overrides. */
export declare function wireResolvers(deps: any[] | undefined, localInjector?: AbstractInjectorInstance): void;

export declare class AbstractInjectorInstance {
    injectors: Record<string, any>;
    constructor(injector?: Record<string, any>);
    has(injectorToken: string): boolean;
    set(tokenName: string, value: any): void;
    get(injectorToken: string): any;
    destroy(): void;
}

/** Names of injector tokens resolved implicitly at compile/render time (ElementRef, TemplateRef, etc). */
export declare const staticInjectionToken: {
    ElementRef: string;
    TemplateRef: string;
    ContentData: string;
    changeDetector: string;
    ViewRef: string;
    ParentRef: string;
    VALIDATORS: string;
    QueryList: string;
    Function: string;
    HostRef: string;
    HTMLElement: string;
    ContentHostRef: string;
    HostElement: string;
};

/** Per-element DI registry used while resolving a compiled component/directive tree. */
export declare class ComponentInjectors extends AbstractInjectorInstance {
    constructor(elementRef: ElementRef, selector?: string);
    has(tokenName: string): boolean;
    destroy(): void;
    /**
     * Widened to accept the base class's plain `string` key too (even
     * though real call sites always pass the object form) - the real
     * runtime `get(dep)` (component/injectors.js) only ever destructures
     * `dep.tokenName`, so a plain string parameter would be `undefined`,
     * not a runtime error; this signature exists so TypeScript's method-
     * override compatibility check (a subclass method's parameter type
     * must accept everything the base method's parameter type accepts)
     * doesn't flag a real, narrower-than-the-base override as unsound.
     */
    get(dep: string | { tokenName: string; value?: any; type?: string }): any;
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

/** Multi-provider token for functions run before bootstrap completes. */
export declare const INITIALIZERS: ProviderToken<Array<() => Promise<any> | any>>;
/** Multi-provider token for functions run right after the root component mounts. */
export declare const APP_BOOTSTRAP: ProviderToken<Array<() => any>>;
/** Single-value token for the application's base href. */
export declare const APP_BASE_HREF: ProviderToken<string>;
/** Single-value token for the application's static-assets base URL. */
export declare const APP_ASSET_URL: ProviderToken<string>;

/** Compile and bootstrap the root jModule, mounting its root component onto the DOM. */
export declare function bootStrapApplication(moduleToBootStrap: any): Promise<void>;

/** Instantiate (compile) a jModule class. */
export declare function compileModule(m: any): any;

/** Trigger change detection on the bootstrapped root component, if any. */
export declare function ChangeDetector(): void;

// ---------------------------------------------------------------------------
// Component internals
// ---------------------------------------------------------------------------

export declare class ElementCompiler {
    /** Wire up and instantiate a single provider (component/directive) factory onto `elementRef`. */
    static compile(factory: any, elementRef: ElementRef, componentInjectors: ComponentInjectors, next: (componentInstance: any) => void): void;
    /** Resolve every provider registered on `node`, one at a time, then call `nextTick(node)`. */
    static resolve(node: any, nextTick: (node: any) => void): void;
}

/** Per-component runtime record: instance, change detector, observer tree position - held directly on its owning ElementRef (`elementRef.componentRef`). */
export declare class ComponentRef {
    observables: Observer;
    child: ComponentRef[];
    parent: ComponentRef | null;
    changeDetector: any;
    componentInstance: any;
    readonly context: any;
    constructor(context?: any);
    linkParent(parentComponentRef: ComponentRef): void;
    removeChild(componentRef: ComponentRef): void;
    updateModel(propName: string | Record<string, any>, value?: any): this;
    destroy(): void;
}

/** Component lifecycle driver: didInit / viewDidLoad / willObserve / didChange / viewDidDestroy. */
export declare class LifeCycle {
    static lifeCycleConst: {
        willObserve: 0;
        didChange: 1;
        didInit: 2;
        viewDidLoad: 3;
        viewDidDestroy: 4;
        AfterViewLoad: 5;
    };
    static lifeCycleKeys: string[];
    static getContext(elementRef: ElementRef): any;
    static hash(a: any, count?: number): number;
    componentInstance: any;
    constructor(componentInstance: any, elementRef: ElementRef, props?: Record<string, any>);
    onDestroy(callback: () => void): void;
    has(cycle: string): boolean;
    trigger(cycle: number, args?: any): void;
    setValue(property: string, value: any): void;
}

/** Wraps `elementConstructor` (a compiled component factory) as a native `HTMLElement` (customElements.define target). */
export declare function createCustomElement(elementConstructor: Function, attributes: Record<string, [string, string]>): CustomElementConstructor;

/** Compile a component factory directly onto an existing native DOM element (used by native/custom-element bootstrapping). */
export declare function CompileNativeElement(componentClass: any, selector: any, callback?: (elementRef: ElementRef, componentInstance?: any) => void): void;

// ---------------------------------------------------------------------------
// DOM / renderer
// ---------------------------------------------------------------------------

export declare class ViewParser {
    static jit(elementRef: ElementRef, transpiledHTML: any[], vt?: Record<string, any>): DocumentFragment;
}

/** Strict-contextual-escaping helpers for trusting/escaping raw HTML strings. */
export declare const sce: {
    trustAsHTML(str: string): string;
    escapeHTML(str: string): string;
    isPlainHtml: RegExp;
};

/** Resolve a bare identifier against template `context`, falling back to `componentInstance`. */
export declare function resolveIdentifier(name: string, context: any, componentInstance: any): any;
/** Resolve and invoke a no-namespace function call (`fn(args)`) against `context`/`componentInstance`. */
export declare function resolveCall(name: string, args: any[], context: any, componentInstance: any): any;
/** Replace `${...}`-style placeholders in `str` using `replacerData`. */
export declare function interpolationHelper(delimiterRegExp: RegExp, str: any, replacerData: any): any;

export declare function elementMutationObserver(nativeElement: Node, callback: MutationCallback): void;
/** Subscribe `eventListener` to the owning component's observer stream until `elementRef` is removed. */
export declare function ObserveUntilDestroyed(elementRef: ElementRef, eventListener: { next: () => void; done: (destroyed?: boolean) => void }): void;
export declare function setupAttributeObservers(element: ElementRef, attrObservers: Record<string, any>): void;
export declare function createLocalVariables(localVariables: Record<string, any> | undefined, localContext?: any, parentContext?: any): Record<string, any>;
export declare function getElementContext(targetContext: any, targetElement: ElementRef): any;

/** Low-level native-DOM helpers used by the renderer. */
export declare const DOMHelper: {
    insert(hostElement: ElementRef | null, newNode: Node, targetNode: Node, ignoreDetector?: boolean): void;
    remove(elementRef: ElementRef | null, removeFromParent?: boolean): void;
    replace(fromElement: ElementRef, toElement: ElementRef): void;
    createElement(tag: string, attributes?: Record<string, any>, content?: string | ((el: HTMLElement) => void), parent?: HTMLElement, replaceParentContent?: boolean): HTMLElement;
    createTextNode(textContent: string, parent?: Node): Text;
};

export declare class TemplateRef {
    constructor(templates: any);
    createElement(parentNode: ElementRef, viewContainer?: any, context?: any): any;
    getContext(): any;
    forEach(selector: string, callback: (template: any) => void): void;
    static factory(node: ElementRef, templateId: string, silent?: boolean): TemplateRef | null;
    static reflect(elementRef: ElementRef, nodeAst: any, callback: (compiled: any) => any): (context: any) => any;
    static templatesCompiler(templates: any, asNative?: boolean): (type: string) => any;
}

/** Array-like handle onto a set of embedded views created from a `TemplateRef` (e.g. by `*for`). Composition, not `extends Array`. */
export declare class ViewRef {
    constructor(elementRef: ElementRef);
    readonly length: number;
    get(index: number): any;
    createEmbededView(templateRef: TemplateRef, context?: any, index?: number): any;
    move(prev: number, curr: number): void;
    remove(index: number): void;
    clearView(): void;
    updateContext(): void;
}

/** Runtime handle to a compiled DOM element (component host, plain element, or structural anchor). */
export declare class ElementRef {
    constructor(definition: Record<string, any>, parent?: ElementRef | null, lcmp?: boolean);
    nativeElement: HTMLElement | Node;
    refId: number;
    children: QueryList<ElementRef>;
    parent: ElementRef | null;
    /** Nearest ancestor (or self) that is a real component - a direct reference, resolved once at construction. */
    hostRef: ElementRef;
    /** The component this element's projected content actually originated from (`<j-place/>`). */
    contentHostRef: ComponentRef | null;
    /** Set when `isc` - this element's own component's change-detector/observables/instance. */
    componentRef: ComponentRef | null;
    tagName: string;
    hasContext: boolean;
    type: number;
    attr?: Record<string, any>;
    isc?: boolean;
    providers?: any[];
    nodes?: Map<string, any>;
    events: EventHandler;
    context: any;
    readonly componentInstance: any;
    readonly changeDetector: any;
    readonly hostRef: ElementRef;
    readonly nativeNode: Node | null;
    hasAttribute(name: string): boolean;
    getAttribute(name: string): any;
    getProps(prop: string): any;
    internal_getDefinition(prop: string): any;
}

/** Runtime handle to a compiled text node with interpolation bindings. */
export declare class TextNodeRef {
    constructor(definition: { ast: any[] }, parent: ElementRef);
    nativeNode: Text;
    type: number;
    hasBinding: boolean;
    readonly parent?: ElementRef;
    readonly ast?: any[];
}

export declare class AttributeAppender {
    static set(nativeElement: HTMLElement, prop: string | Record<string, any>, value?: any): void;
    static setValue(nativeElement: HTMLElement, prop: string, value: any, canRemoveAttr?: boolean): void;
    static byType(type: string, nativeElement: HTMLElement, value: any, template?: any): void;
    static setProp(nativeElement: HTMLElement, propName: string, propValue: any, template?: any): void;
    static singleOrMultipeUpdate(nativeElement: HTMLElement, prop: string, value: any): void;
}

export declare class ElementClassList {
    static set(nativeElement: HTMLElement, classList?: string, type?: 'add' | 'remove'): string | void;
    static add(nativeElement: HTMLElement, classList: string | Record<string, boolean>): void;
    static remove(nativeElement: HTMLElement, classList: string): void;
    static contains(nativeElement: HTMLElement, className: string): boolean;
    static toClass(classList: string): string[];
}

export declare class EventHandler {
    constructor(events: any[]);
    push(event: any): void;
    destroy(): void;
    static registerListener(element: ElementRef): void;
    static attachEventEmitter(element: ElementRef, eventName: string, componentInstance: any): void;
    static attachEventDispatcher(element: ElementRef, eventName: string, componentInstance: any): void;
    static handleEvent(element: ElementRef, event: Event, eventName?: string): void;
}

/** Array-like collection of child elements / query results, with change notifications via `onChanges`. Composition, not `extends Array<T>`. */
export declare class QueryList<T = any> implements Iterable<T> {
    onChanges: Subject;
    static from<T = any>(iterable: T[]): QueryList<T>;
    static is(instance: any): instance is QueryList<any>;
    readonly length: number;
    readonly first: T;
    readonly last: T;
    add(element: T, index?: number, emitEvent?: boolean): void;
    replace(from: T, to: T, emitEvent?: boolean): void;
    get(element?: T): T | T[];
    getByIndex(index: number): T;
    destroy(): void;
    remove(element: T, deep?: boolean): T | null;
    hasIndex(index: number): boolean;
    removeByIndex(index: number): T | null;
    forEach(fn: (item: T, index: number) => void, thisArg?: any): void;
    map<U>(fn: (item: T, index: number) => U, thisArg?: any): U[];
    filter(fn: (item: T, index: number) => boolean, thisArg?: any): T[];
    find(fn: (item: T, index: number) => boolean, thisArg?: any): T | undefined;
    some(fn: (item: T, index: number) => boolean, thisArg?: any): boolean;
    every(fn: (item: T, index: number) => boolean, thisArg?: any): boolean;
    indexOf(element: T): number;
    includes(element: T): boolean;
    toArray(): T[];
    [Symbol.iterator](): Iterator<T>;
}

/** Get/set an inline style property (with automatic px suffixing on known dimension props). */
export declare function ElementStyle(nativeElement: HTMLElement, name: string | Record<string, any>, value?: any, suffix?: string): any;
export declare namespace ElementStyle {
    function set(nativeElement: HTMLElement, name: string, value: any, suffix?: string): void;
    const props: { WithSuffix: string[]; background: string[] };
    function fixValue(value: any, name: string, suffix?: string): any;
}

// ---------------------------------------------------------------------------
// rx
// ---------------------------------------------------------------------------

export declare class StateManager {
    current: string;
    states: string[];
    validator: (current: string, next: string, isKnown: boolean) => boolean;
    constructor(current?: string, validator?: StateManager['validator'], states?: string[]);
    readonly isLast: boolean;
    readonly isFirst: boolean;
    set(state: string): void;
    pushStates(states: string[]): void;
    next(): void;
    previous(): void;
    isState(state: string): boolean;
    setClass(state: string): string;
}

/** Event-with-guards primitive backing `EventEmitter`/`EventDebounce`. */
declare abstract class AbstractEventRx {
    when(...guards: Array<(args: any, next: (passed: boolean) => void) => void>): this;
    subscribe(fn: (value: any) => void): () => void;
    destroy(index?: number): void;
}

export declare class EventEmitter extends AbstractEventRx {
    emit(args?: any): void;
}

/** Component-scoped change-detection observer/notifier (backs `ComponentRef.observables`). */
export declare class Observer {
    constructor();
    subscribe(callback: (model: any) => void): () => void;
    observeForKey(key: any, callback: (value: any) => void, core?: (value: any) => boolean): () => void;
    notifyAllObservers(model: any, ignoreCheck?: boolean): void;
    destroy(): void;
}

export declare class Subject<T = any> {
    constructor();
    subscribe(success?: (value: T) => void, error?: (err: any) => void, completed?: () => void): Subscription;
    destroy(): void;
    hasObservers(): boolean;
    next(...values: T[]): void;
    error(error: any): void;
    completed(): void;
}

/** Lightweight custom Promise-like utility (predates/parallels native Promise usage in this codebase). */
export declare class Promise2<T = any> {
    constructor(callback: (resolve: (value?: T) => void, reject: (reason?: any) => void) => void, extension?: Record<string, Function>);
    onSuccess(fn: (value: T) => any): this;
    onError(fn: (reason: any) => any): this;
    then(done?: (value: T) => any, fail?: (reason: any) => any): this;
    catch(catchFn: (error: any) => void): void;
    static extension(callback: Function, events?: string[]): any;
    static all(resolve: any[]): Promise2<any[]>;
}

export declare class EventManager {
    defaultCallback: (...args: any[]) => void;
    eventExtensionMethod: (obj: any) => any;
    constructor(defaultCallback?: (...args: any[]) => void, eventExtensionMethod?: (obj: any) => any);
    add(eventName: string, callback: Function): number;
    get(eventName: string): Function[];
    dispatch(eventName: string, ...args: any[]): void;
    unlink(eventName: string, index: number): void;
    destroy(eventName: string): void;
    one(eventName: string, idx: number): Function | undefined;
}

export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean): (...args: Parameters<T>) => void;
export declare function rxDebounceTime(timeout: number, immediate?: boolean): (value: any, listener: (passed: boolean) => void) => void;
export declare function rxWhile(callback: (value: any) => boolean): (value: any, next: (passed: boolean) => void) => void;
export declare function rxUntilChanged(): (value: any, next: (changed: boolean) => void) => void;
export declare function rxWait(): void;
/** Register `eventNames` on `targetInstance`; returns an unsubscribe function. */
export declare function rxEvents(targetInstance: EventTarget, eventNames: string | string[]): () => void;
/**
 * Subscribe to `source` and call `changeDetector.manualCheck()` on every emission
 * (works even for components opted out of the automatic change-detection cascade).
 */
export declare function rxWatch(source: { subscribe(fn: (value: any) => void): () => void }, changeDetector: { manualCheck(): void } | undefined, onNext?: (value: any) => void): () => void;
export declare function rxLoop(operations: any[], callback: (operation: any, next: () => void) => void): Promise<void>;

export declare class rxTimeout {
    subscription: Subscription;
    timerId: any;
    constructor();
    play(timer?: number): this;
    subscribe(callback: (value?: any) => void, onDestroy?: () => void): this;
    stop(): void;
    clearTimeout(destroy?: boolean): void;
}

export declare class rxInterval {
    subscription: Subscription;
    intervalId: any;
    constructor();
    play(interval?: number): this;
    subscribe(callback: (value?: any) => void, onDestroy?: () => void): this;
    stop(): void;
    clearInterval(destroy?: boolean): void;
}

export declare class EventDebounce extends AbstractEventRx {
    constructor(timer?: number, immediate?: boolean);
    next(args?: any): void;
}

/** Attach `matchMedia` listeners for a set of ascending breakpoints; returns a teardown function. */
export declare function MediaQueryEvent(breakPoints: number[], callback: (event: MediaQueryList | MediaQueryListEvent, screenSize: number) => void): () => void;

export declare const SubscriptionStates: {
    onError: 0;
    onSuccess: 1;
    onCompleted: 2;
};

export declare class Subscription {
    subscriptions: any[];
    state: { pending: boolean; value: any; resolveWith: number } | null;
    constructor(replayOnSubscription?: boolean);
    add(success: any, error?: any, completed?: any): this;
    notify(state: number, args?: any[]): void;
    destroy(): void;
}

export declare class Observable<T = any> {
    constructor(callback: (observer: AbstractObserver) => void);
    subscribe(success?: (value: T) => void, error?: (err: any) => void, completed?: () => void): Subscription;
}

export declare class AbstractObserver {
    constructor();
    add(subscription: Subscription): void;
    hasObservers(): boolean;
    next(...values: any[]): void;
    error(errorObject: any): void;
    completed(): void;
    destroy(): void;
}

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------

/** Run every interceptor registered under `interceptorToken`, in sequence, over `locals`. */
export declare function InterceptorResolver(interceptorToken: any, locals?: any): Promise<any>;

/** Compile and mount a component factory imperatively (outside the template compiler). */
export declare function ComponentFactoryResolver(componentFactory: any, viewRef?: ElementRef, callback?: (elementRef: ElementRef, componentInstance: any) => void, skipElementInsert?: boolean): Promise<any>;

/** Minimal-diff iterable comparer used by structural repeaters (e.g. `*jFor`) to compute create/move/delete operations. */
export declare class IterableProfiler {
    cacheHash: any[];
    out: { deleted: number[]; order: any[] } | null;
    constructor(trackBy?: string | ((item: any, index: number) => any));
    trackBy(item: any, index: number): any;
    diff(source: any[] | null | undefined): boolean;
    forEachDeleted(callback: (index: number) => void): void;
    forEachOperation(callback: (operation: { index: number; prevIndex?: number; state: 'create' | 'move' }, i: number) => void): void;
    checkDuplicateRepeater(hash: any, seenHashes: Set<any>): void;
    attachTrackBy(trackBy: string | ((item: any, index: number) => any)): void;
    destroy(): void;
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------

/** Log a framework error/warning through the console at the given level (0=error .. 4=debug). */
export declare function errorBuilder(error: string | Error, logLevel?: number, stack?: string): void;

export declare function closureRef<T extends Function>(closureRefFn: T): T;
export declare function resolveClosureRef(ref: any): any;
export declare namespace resolveClosureRef {
    function factory(token: { DI?: any[]; factory: Function }, localInjector?: AbstractInjectorInstance): () => any;
}
export declare function noop(callback?: Function): Function;

/** requestAnimationFrame-backed task scheduler (falls back to setTimeout). */
export declare const scheduler: {
    schedule(taskFn: (...args: any[]) => void, timer?: number): () => void;
};

/** Delegated-listener registry for a single native target (window/document/body/custom). */
export declare class CustomEventHandler {
    element: EventTarget | null;
    callback: (event: Event) => void;
    registeredEvents: Map<string, Function[]>;
    constructor(element: EventTarget);
    static trigger(context: CustomEventHandler): (event: Event) => void;
    register(type: string, callback: (event: Event) => void): (() => void) | undefined;
    destroy(): void;
}

/** Clone a subset of `event`'s properties, overriding `target`, for delegated-listener dispatch. */
export declare function ProxyEvent(event: Event, target: EventTarget): Record<string, any>;

/** Load external `<script>`/`<link>` resources on demand, de-duplicating by resolved URL. */
export declare class LazyLoader {
    dropZone?: Element;
    resourcePath?: string;
    constructor(dropZone?: Element);
    setPath(path: string): this;
    static staticLoader(...args: any[]): void;
    static mimeType(type?: string): { type: string };
    static getExt(name: string): string;
    js(obj: any, callback?: (result: { failed: number; resolved: number; allResolved: boolean }) => void): void;
    css(obj: any): void;
    jscs(obj: Record<string, any>, callback?: Function): this;
    /** Dynamic-import()-based alternative to js()/_resolve()'s <script>-tag injection. */
    static resolveModule(filePaths: string | string[], callback?: (result: { failed: number; resolved: number; allResolved: boolean; modules: Record<string, any> }) => void): void;
}

/** Names backing dom/animation.js's FX.easing table - all 7 are real, implemented easing functions; only 'swing' was reachable from `animate()` before its `easing` param existed. */
export type AnimationEasing = 'linear' | 'quadratic' | 'swing' | 'circ' | 'back' | 'bounce' | 'elastic';

/** Animate numeric style properties on `element` over `speed` milliseconds. `easing` defaults to 'swing' (and falls back to it for an unrecognized name), matching pre-existing behavior. */
export declare function animate(element: HTMLElement, styles: Record<string, number> | ((delta: number) => void), speed?: number, callback?: () => void, easing?: AnimationEasing): void;
export declare namespace animate {
    function hide(element: HTMLElement, speed?: number, callback?: () => void): void;
    function show(element: HTMLElement, speed?: number, callback?: () => void): void;
    function fadeIn(element: HTMLElement, speed?: number, callback?: () => void): void;
    function fadeOut(element: HTMLElement, speed?: number, callback?: () => void): void;
    function slideUp(element: HTMLElement, speed?: number, callback?: () => void): void;
    function slideDown(element: HTMLElement, speed?: number, callback?: () => void): void;
    function toggleSlide(element: HTMLElement): void;
}

/** dom/animation-dsl.js - a declarative named-state animation config built on top of animate(). Scoped to unitless numeric CSS properties (opacity, zIndex, ...), same real boundary animate()'s own generic per-property path already has. */
export interface AnimationConfig {
    states: Record<string, Record<string, number>>;
    transitions?: Record<string, { duration?: number; easing?: AnimationEasing }>;
    defaults?: { duration?: number; easing?: AnimationEasing };
}
export interface AnimationController {
    /** Transitions `element` to `toName`, from `fromName` (default: the state last reached via trigger(), or 'void'). Resolves once the transition completes; rejects for an unknown `toName`. */
    trigger(element: HTMLElement, toName: string, fromName?: string): Promise<void>;
    /** The state name last reached via trigger() on `element`, or 'void' if it's never been triggered. */
    currentState(element: HTMLElement): string;
}
export declare function createAnimation(config: AnimationConfig): AnimationController;

// ---------------------------------------------------------------------------
// Devtools (utils/debugger.js's global.jeli.devtools)
// ---------------------------------------------------------------------------
//
// Reads already-live runtime state (ElementRef's `.children`, a walk from
// the bootstrap root; a component class's static `ctors.DI`) - not a
// separate tracked shadow structure. `global.jeli.devtools` is a
// runtime-attached global, not an ES export of @jeli/core - these types
// describe its shape for `declare global` consumers (see below), not an
// importable value.
export interface DevtoolsComponentTreeNode {
    refId: number;
    tagName: string;
    isComponent: boolean;
    /** present only when isComponent is true */
    componentInstance?: any;
    children: DevtoolsComponentTreeNode[];
}
export interface DevtoolsDependencyInfo {
    /** e.g. a ProviderToken's tokenName, a singleton class's name, or "name?" for an optional dep */
    description: string;
    /** only populated for a singleton constructor function that's already been instantiated */
    resolvedInstance?: any;
}
export interface DevtoolsComponentInfo {
    selector: string;
    instance: any;
    refId?: number;
    changeDetectorStatus?: number;
    dependencies: DevtoolsDependencyInfo[];
}
export interface DevtoolsSingletonEntry {
    name: string;
    instance: any;
}
export interface JeliDevtools {
    getComponentTree(elementRef?: any): DevtoolsComponentTreeNode | null;
    inspectElement(nativeNode: Node): any;
    inspectComponent(target: Node | object): DevtoolsComponentInfo | null;
    /** Off by default; zero overhead until enabled. */
    enableSingletonTracking(): void;
    disableSingletonTracking(): void;
    /** null when tracking isn't enabled */
    getSingletonInstances(): DevtoolsSingletonEntry[] | null;
}

// ---------------------------------------------------------------------------
// Decorator option types (Element/Directive/Service/Provider/Pipe/jModule)
// ---------------------------------------------------------------------------
//
// Confirmed via @jeli/compiler-cli/lib/core/annotation.js (the only code
// that actually reads these option objects) and utils/keywords.js
// (ckeyWords, the canonical field-name registry): `Element`/`Directive`/
// `Service`/`Provider`/`Pipe`/`jModule` are NOT real exported runtime
// values anywhere in any of the 5 @jeli/* packages, and - despite the
// naming convention - are NOT real TC39/TypeScript decorators either.
// `Element({...}) class Foo {}` is two separate, syntactically unrelated
// statements: a function call whose return value is discarded, followed by
// a class declaration. jeli-cli recognizes the *source-position adjacency*
// of a call immediately followed by a class as its own AST pattern (see
// annotation.js's `processAst`) and strips/rewrites it at compile time -
// there is no `@`-prefixed decorator application, and no way for
// TypeScript's type system to enforce or even see the "this call applies
// to the following class" relationship. So these are declared as plain
// ambient global functions (not `ClassDecorator`s) returning `void` - the
// real, honest value here is autocomplete/type-checking on the *options
// object* passed in, not modeling a decorator relationship that doesn't
// really exist at the type level.
//
// Field shapes are mostly string-DSL entries (`props`/`viewChild`/
// `contentChild`/`events`), parsed at compile time by
// `helper.stringToObjectNameValueMapping` - a runtime string convention
// TypeScript's type system can't validate further (e.g. `"click:
// onClick($event)"`, `"name=#refId"`) - similar in spirit to Angular's own
// `@Component` `template`/`selector` strings. Typed as `string[]` with
// JSDoc explaining the embedded syntax, not as an over-precise shape that
// would be dishonest. Declared once here (not repeated in
// common/form/http/router's own .d.ts) since every consuming app always
// has @jeli/core's types available regardless of which other packages it
// uses - repeating an ambient global declaration across multiple files
// would raise TypeScript duplicate-identifier errors.

declare global {
    interface ElementOptions {
        /** Must contain a hyphen - enforced at compile time (HTML custom-element naming spec). */
        selector: string;
        template?: string;
        templateUrl?: string;
        style?: string;
        styleUrl?: string;
        /** Compiles to a real `customElements.define()` Web Component instead of jeli's own renderer. */
        asNative?: boolean;
        /** Only meaningful when `asNative` is set - attaches an open Shadow Root instead of light DOM. */
        useShadowDom?: boolean;
        /**
         * One entry per bindable input property: `"name"`, `"name:Type"`, or
         * `"name:Type=defaultValue"`.
         */
        props?: string[];
        /**
         * One entry per DOM event binding: `"eventName: handlerCall($event)"`,
         * e.g. `"click: onClick($event)"`. Delegated events use a
         * `"eventName-childSelector: ..."` form.
         */
        events?: string[];
        /**
         * DI token list - each entry is a class reference, a string service
         * name, a `ProviderToken`, or a `{name, useClass|factory|value, DI?}`
         * descriptor object. `"token?"` (trailing `?`) marks it optional;
         * `"token=localName"` renames it for `dynamicInjectors` use.
         */
        DI?: any[];
        resolve?: any[];
        /** `"localFieldName=#templateRefId"` or `"localFieldName:Type=#templateRefId"` per entry. */
        viewChild?: string[];
        /** Same syntax as `viewChild` - must NOT resolve to a `QueryList`-typed field. */
        contentChild?: string[];
        /** Same syntax as `viewChild` - MUST resolve to a `QueryList`-typed field. */
        contentChildren?: string[];
        /** Local template variable name this element/directive can be referenced by (`#name="exportAs"`). */
        exportAs?: string;
        /** Registers this instance's resolved value against a DI token (`ProviderToken`) instead of a class name. */
        registerAs?: any;
    }

    /** Same shape as `ElementOptions` minus the view-specific (template/style/native) fields - directives have no template of their own. */
    interface DirectiveOptions {
        selector: string;
        props?: string[];
        events?: string[];
        DI?: any[];
        resolve?: any[];
        viewChild?: string[];
        contentChild?: string[];
        contentChildren?: string[];
        exportAs?: string;
        registerAs?: any;
    }

    interface ServiceOptions {
        DI?: any[];
        resolve?: any[];
        registerAs?: any;
    }

    /** An alternative implementation registered against an existing DI token. */
    interface ProviderOptions extends ServiceOptions {
        useExisting?: any;
        useClass?: Function;
        useValue?: any;
        useFactory?: Function;
    }

    /** A `value | pipeName:arg` template filter/transform. */
    interface PipeOptions extends ServiceOptions {
        selector?: string;
    }

    interface JModuleOptions {
        /** Class references, or `{name: ProviderToken, useClass|factory|value, DI?}` descriptors registered directly against a token. */
        services?: (Function | { name: any; useClass?: Function; factory?: Function; DI?: any[]; value?: any })[];
        /** Other `jModule`-annotated classes this module transitively depends on. */
        requiredModules?: Function[];
        /** `Element`/`Directive`-annotated classes this module declares, or `{useExisting, selector}` aliases. */
        selectors?: (Function | { useExisting: Function; selector: string })[];
        exports?: any[];
        /** Only meaningful on the module passed to `bootStrapApplication()` - the app's root component. */
        rootElement?: Function;
    }

    /**
     * NOT declared as a global function here, despite every other decorator
     * being one - `Element` collides with `lib.dom.d.ts`'s own built-in
     * global `Element` (the real DOM `Element` constructor/interface every
     * browser-targeting TS project already has), which is declared with an
     * incompatible shape (`{new(): Element; prototype: Element; ...}`, not
     * a callable function). TypeScript correctly rejects redeclaring a
     * global identifier with two incompatible shapes - this is a genuine
     * naming collision in jeli's own decorator-naming convention, not a
     * typing oversight fixable by declaring it more carefully. `ElementOptions`
     * above is still exported/usable directly, e.g.
     * `Element(<ElementOptions>{...})` or `Element({...} satisfies ElementOptions)`
     * at the call site, or by giving the value a variable first:
     * `const opts: ElementOptions = {...}; Element(opts);`
     */
    function Directive(options: DirectiveOptions): void;
    function Service(options?: ServiceOptions): void;
    function Provider(options: ProviderOptions): void;
    function Pipe(options?: PipeOptions): void;
    function jModule(options: JModuleOptions): void;

    /**
     * Runtime-attached by utils/debugger.js when @jeli/core's bundle
     * evaluates - not an ES export, so it's typed here on the ambient
     * `jeli` global rather than as an importable value. `debug`/`devtools`
     * are both always present once @jeli/core has loaded (module-level
     * side effect); `[pkgName: string]` covers the other packages'
     * self-registration (`global.jeli.core`, `global.jeli.http`, ...),
     * each package's own .d.ts doesn't attempt to type its own entry here
     * to avoid duplicate-identifier conflicts across the 5 packages.
     */
    var jeli: {
        buildTime: string;
        version: string;
        debug(element: Node): any;
        devtools: JeliDevtools;
        [pkgName: string]: any;
    };
}
