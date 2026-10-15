/**
 * No import statements, deliberately - see jeliQuerySelector/jeliDebugger
 * below, which already relied on this same thing (bare `CoreBootstrapContext`/
 * `$elementContext` access) before any devtools code existed here.
 * jeli-cli's compiler concatenates every source file in a package into one
 * shared top-level scope (confirmed empirically: `CoreBootstrapContext`, a
 * plain module-level `var` in bootstrap/index.js, has always been readable
 * here as a bare identifier with zero import). Adding *real* `import {...}
 * from '../bootstrap/index'` / `'../dependency.injector'` statements to
 * this specific file, while writing this section, made jeli-cli's compiler
 * fail with "no exported name(s) ProviderToken ... imported in
 * utils/debugger.js" and cascade into "Error while compiling" across
 * nearly every other file in the package (verified via `npm run build:all`,
 * both with and without those two import lines) - a real jeli-cli compiler
 * bug, out of scope to chase down here. Bare access is the workaround,
 * matching this file's own pre-existing style.
 */
var jeliContext = Object.create({
    buildTime: __buildOptions.buildTime,
    version: __buildOptions.version,
    debug: jeliDebugger
});

/**
 * Depth-first search for the ElementRef/TextNodeRef wrapping a given native
 * DOM node, starting from `root`. `.children` is a QueryList
 * (dom/queryList.js) - iterable via `for...of`; TextNodeRef has no
 * `.children` at all (leaf node).
 * @param {*} root
 * @param {Node} nativeNode
 * @returns {*} the matching ElementRef/TextNodeRef, or null
 */
function jeliQuerySelector(root, nativeNode) {
    if (!root) return null;
    if ((root.nativeElement || root.nativeNode) === nativeNode) {
        return root;
    }
    if (root.children) {
        for (var child of root.children) {
            var found = jeliQuerySelector(child, nativeNode);
            if (found) return found;
        }
    }
    return null;
}

/**
 * @param {Node} element a native DOM node
 * @returns {*} that node's component/template context, or null
 */
function jeliDebugger(element) {
    if (!element || !_isDebuggerEnabled()) return null;
    var ref = jeliQuerySelector(_getBootstrapRoot(), element);
    return ref ? ref.context : null;
}

/**
 * Human-readable description of a raw DI dependency declaration (a
 * `ctors.DI` array entry) - mirrors dependency.injector.js's own Inject(),
 * the single source of truth for what shape a dep can take.
 * @param {*} dep
 */
function describeDep(dep) {
    if (!dep) return String(dep);
    if (dep instanceof ProviderToken) return dep.tokenName + (dep.multiple ? '[]' : '');
    if (typeof dep === 'function') return dep.name || '(anonymous)';
    if (dep.tokenName) return dep.tokenName + (dep.optional ? '?' : '');
    return String(dep);
}

/**
 * Builds a plain, serializable snapshot of the live element tree rooted at
 * `elementRef` (default: the currently bootstrapped application root).
 * Includes every element, not just components - non-component elements
 * (plain DOM nodes, structural-directive output) are how components nest
 * in practice; `isComponent` marks which nodes are actual addressable
 * component instances (have their own `componentInstance`/change detector).
 * @param {*} [elementRef]
 */
function getComponentTree(elementRef) {
    var root = elementRef || _getBootstrapRoot();
    if (!root) return null;
    return walk(root);

    function walk(ref) {
        var node = {
            refId: ref.refId,
            tagName: ref.tagName,
            isComponent: !!ref.isc,
            children: (ref.children || []).map(walk)
        };
        if (ref.isc) {
            node.componentInstance = ref.componentInstance;
        }
        return node;
    }
}

/**
 * Finds the live ElementRef/TextNodeRef backing a native DOM node.
 * @param {Node} nativeNode
 */
function inspectElement(nativeNode) {
    return jeliQuerySelector(_getBootstrapRoot(), nativeNode);
}

/**
 * Given a native DOM node belonging to a component, or a component
 * instance itself, describes its declared dependencies (its class's static
 * `ctors.DI`) plus its change-detector status. A declared dep's
 * `resolvedInstance` is only populated when it's a singleton constructor
 * function that's already been instantiated (`dep.ctors.instance`, set by
 * Inject()) - most per-injection-site deps (tokens, values, non-singletons)
 * have no single "the instance" to show, only their declaration.
 * @param {Node|Object} target a native DOM node or a component instance
 */
function inspectComponent(target) {
    var ref = (target && target.nodeType) ? jeliQuerySelector(_getBootstrapRoot(), target) : null;
    var instance = ref ? ref.componentInstance : target;
    if (!instance || !instance.constructor || !instance.constructor.ctors) return null;

    var di = instance.constructor.ctors.DI || [];
    return {
        selector: instance.constructor.ctors.selector,
        instance: instance,
        refId: ref ? ref.refId : undefined,
        changeDetectorStatus: ref ? ref.changeDetector.status : undefined,
        dependencies: di.map(function(dep) {
            return {
                description: describeDep(dep),
                resolvedInstance: (typeof dep === 'function' && dep.ctors) ? dep.ctors.instance : undefined
            };
        })
    };
}

/**
 * Opt-in (zero overhead when disabled) log of every singleton service/
 * component instantiated via Inject() since tracking was enabled, in
 * creation order. Returns null when tracking isn't enabled.
 */
function getSingletonInstances() {
    var registry = getSingletonRegistry();
    if (!registry) return null;
    return Array.from(registry.entries()).map(function(entry) {
        return { name: entry[0].name || '(anonymous)', instance: entry[1] };
    });
}

/**
 * expose jeli context for debugging
 * merge rather than overwrite: the UMD wrapper's plain-<script>-tag
 * fallback path already stashes the package's own exports on
 * `global.jeli[pkgName]` (e.g. `global.jeli.core`) before this module
 * evaluates - clobbering `global.jeli` here would destroy that reference.
 */
global.jeli = Object.assign(global.jeli || {}, jeliContext);
global.jeli.devtools = {
    getComponentTree: getComponentTree,
    inspectElement: inspectElement,
    inspectComponent: inspectComponent,
    enableSingletonTracking: enableSingletonTracking,
    disableSingletonTracking: disableSingletonTracking,
    getSingletonInstances: getSingletonInstances
};
