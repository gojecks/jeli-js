import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import * as helpers from '@jeli/helpers';

/**
 * jeli's compiled UMD bundles (dist/<pkg>/bundles/*.js) are written to run
 * as a browser <script> global, not to be require()'d/import()'d through
 * Node's module system (their own UMD wrapper falls back to
 * `global.jeli[pkg] = ...` / `global.jeli['helpers']` when no AMD/CJS
 * loader is present). Evaluating the compiled source directly in this
 * realm (via vm.runInThisContext, matching classic-<script> "Script"
 * grammar) is what actually matches production, and sidesteps the ESM/CJS
 * packaging mismatches in unrelated sibling dependencies entirely.
 */
/**
 * Guarded on `globalThis.jeli.core` rather than evaluated unconditionally:
 * `vm.runInThisContext`, unlike `import`, is NOT idempotent/cached - if
 * this file and another vm-evaluating loader (e.g. server/render-to-string.mjs)
 * both got imported in the same process, evaluating the bundle twice would
 * each create an isolated closure (separate ViewParser/ComponentRef/
 * module-level state) and the second evaluation would silently stomp
 * `globalThis.jeli.core` out from under the first - "whichever imports
 * last wins," a real bug found while building server/render-to-string.mjs
 * this session (see its own header comment for the full story). Guarding
 * here means whichever of the two loaders runs first "wins" and the other
 * reuses it, regardless of import order.
 */
if (!globalThis.jeli || !globalThis.jeli.core) {
    const bundlePath = fileURLToPath(new URL('../../dist/core/bundles/jeli-core-umd.js', import.meta.url));
    const bundleSource = readFileSync(bundlePath, 'utf8');

    globalThis.jeli = globalThis.jeli || {};
    globalThis.jeli.helpers = helpers;

    /**
     * WORKAROUND, not a fix: jeli-cli's library-UMD bundler (packages/compiler-cli
     * lib/core/generator.js et al) does not consistently hoist
     * `import { X } from '@jeli/helpers'` into `var X = helpers.X;` inside the
     * generated factory - e.g. `isfunction` is called as a bare identifier in
     * `AutoWire` (dependency.injector.js) with no local binding anywhere in the
     * bundle, throwing `ReferenceError: isfunction is not defined` the first
     * time a component is instantiated. Reading an unqualified identifier still
     * falls back to the global object in strict mode (only *assigning* to one
     * is restricted), so pre-seeding these on `globalThis` lets the real,
     * unmodified bundle run for test purposes. This is a real bug in jeli-cli's
     * bundler, out of scope for this change - flagged, not fixed, here.
     */
    for (const name of Object.keys(helpers)) {
        if (!(name in globalThis)) globalThis[name] = helpers[name];
    }

    /**
     * WORKAROUND, not a fix: the installed node_modules/@jeli/helpers@0.0.2 is a
     * stale published copy that never shipped fns/moveItemInArray.js at all (the
     * sibling js-helpers *source* repo has it - that's what real builds resolve
     * against via jeli.json's resolve.alias, so this gap is test-harness-only,
     * not something real apps hit). @jeli/core's compiled bundle references it
     * as a bare identifier (same flattened-scope pattern as the isfunction/etc.
     * workaround above), so without this, any test exercising a *for reorder
     * throws ReferenceError: moveItemInArray is not defined. Implementation
     * copied verbatim from js-helpers/fns/moveItemInArray.js.
     */
    if (!('moveItemInArray' in globalThis)) {
        globalThis.moveItemInArray = function moveItemInArray(arr, from, to) {
            if (!(arr instanceof Array)) return;
            arr.splice(to, 0, arr.splice(from, 1)[0]);
        };
    }

    vm.runInThisContext(bundleSource, {
        filename: bundlePath,
        /**
         * Without this, any `import()` expression evaluated inside the vm
         * context (e.g. LazyLoader.resolveModule) unconditionally rejects with
         * "A dynamic import callback was not specified" - Node requires an
         * explicit callback for vm-evaluated scripts since it can't infer a
         * sensible default resolution base the way it can for a real module.
         * Delegating straight to this file's own (real, ESM) `import()` gives
         * vm-evaluated code genuine dynamic-import behavior, matching what a
         * real browser <script> environment provides for free.
         */
        importModuleDynamically: (specifier) => import(specifier)
    });
}

export const core = globalThis.jeli.core;

/**
 * Mounts a hand-built "compiled-shape" root component (the same shape
 * jeli-cli's codegen produces: a constructor function with static
 * `.ctors`/`.view`) through the real, public `bootStrapApplication` path -
 * only `@jeli/core`'s public API is used, nothing internal-only.
 *
 * The component under test should stash `this` somewhere test-reachable
 * (e.g. `window.__instance = this`) in its constructor, since
 * `bootStrapApplication` doesn't hand back the component instance.
 */
export async function mount(rootFactory, selector) {
    document.body.innerHTML = `<${selector}></${selector}>`;

    function TestModule() {}
    TestModule.fac = () => {};
    TestModule.rootElement = rootFactory;

    await core.bootStrapApplication(TestModule);
    return document.querySelector(selector);
}
