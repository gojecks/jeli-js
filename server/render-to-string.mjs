import { JSDOM } from 'jsdom';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import * as helpers from '@jeli/helpers';

/**
 * Server-side render harness for @jeli/core - Phase 0 of the SSR/hydration
 * plan (see .claude/plans/greedy-singing-mist.md and the "SSR / hydration"
 * design-decision writeup in .claude/catalogues/jeli-js.md for the full
 * design). Deliberately lives OUTSIDE packages/core/src/ (mirroring
 * test/support/mount.mjs) - jeli-cli's bundler flattens the *entire*
 * transitive import graph of anything reachable from public.api.js into
 * one package surface (confirmed empirically while authoring this
 * session's .d.ts files), so if this file imported `jsdom` from inside
 * src/, jsdom - a large, Node-only package - would get bundled straight
 * into @jeli/core's browser-facing UMD/MODULE output. This module is a
 * consumption-side tool, not framework source; it loads the *already
 * compiled* dist bundle the same way test/support/mount.mjs does.
 *
 * Two real architectural constraints (found empirically, not assumed)
 * shape this file's design - both are documented in the plan/catalogue in
 * more depth:
 *
 * 1. `@jeli/core`'s bundle can only be evaluated (vm.runInThisContext)
 *    ONCE per process - `dom/event.handler.js` reads `document.body` at
 *    MODULE LOAD TIME (`new CustomEventHandler(document.body)`), so
 *    whichever `document` is global at that first evaluation is
 *    permanently captured. A genuinely fresh, isolated jsdom document per
 *    render call would need re-evaluating the whole bundle per call
 *    (expensive - re-parsing the entire framework on every request) and
 *    was deliberately not attempted here.
 * 2. `bootstrap/index.js`'s `CoreBootstrapContext` (holds
 *    `bootStrapComponent`/`injector`/`compiledModule`) is a MODULE-LEVEL
 *    SINGLETON, and the exported `ChangeDetector()` function reads it with
 *    no arguments - two concurrent `bootStrapApplication()` calls would
 *    silently corrupt each other's state (e.g. one render's `ChangeDetector()`
 *    call firing against the OTHER render's component tree).
 *
 * Net effect: renders through this module are deliberately SERIALIZED (one
 * at a time, via the queue below) against ONE shared jsdom document,
 * reset between renders - not truly concurrent. This is a real, current
 * limitation, not a bug: true per-request isolation needs either
 * re-evaluating the bundle per request, or a real DI-scoping fix to
 * `CoreBootstrapContext`/`ChangeDetector` - both out of scope for Phase 0.
 * Scaling to concurrent request volume today means multiple Node
 * processes (the classic PHP-FPM/CGI shape), not concurrency within one.
 */

/**
 * IMPORTANT: jsdom setup and bundle evaluation are each independently
 * guarded (on `globalThis.document` and `globalThis.jeli.core`
 * respectively). `vm.runInThisContext`, unlike `import`, is NOT
 * idempotent/cached - two separate files each calling it on the core bundle
 * would each create their own isolated closure (separate
 * ViewParser/ComponentRef/module-level state) and silently stomp
 * `globalThis.document`/`globalThis.jeli.core` out from under each other,
 * with "whichever imports last wins" - a real, previously shipped bug here
 * (this file used to set both up unconditionally; if
 * test/support/mount.mjs and this file both got imported in the same
 * mocha process, whichever loaded second would silently take over
 * `globalThis.document` for everything, including already-completed tests
 * that held stale references - masked in practice only by file-glob
 * alphabetical ordering, not real correctness). Guarding independently
 * means: standalone usage (no test/ involved) sets up its own environment
 * as before; usage under the test harness (where
 * test/support/setup-dom.mjs already ran via register-loader.mjs) reuses
 * that jsdom document instead of creating a redundant second one; and
 * whichever of this file / test/support/mount.mjs evaluates the core
 * bundle first "wins" and the other reuses it, regardless of import order.
 */
if (!globalThis.document) {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    globalThis.Node = dom.window.Node;
    globalThis.MutationObserver = dom.window.MutationObserver;
    globalThis.Reflect = Reflect;
    if (!dom.window.requestAnimationFrame) {
        dom.window.requestAnimationFrame = (fn) => setTimeout(fn, 0);
        dom.window.cancelAnimationFrame = (id) => clearTimeout(id);
    }
}

if (!globalThis.jeli || !globalThis.jeli.core) {
    globalThis.jeli = globalThis.jeli || {};
    globalThis.jeli.helpers = helpers;

    /**
     * WORKAROUND, not a fix: same flattened-scope bundler bug documented in
     * test/support/mount.mjs (bare `@jeli/helpers` imports not hoisted into
     * `helpers.X` bindings inside the generated bundle).
     */
    for (const name of Object.keys(helpers)) {
        if (!(name in globalThis)) globalThis[name] = helpers[name];
    }
    if (!('moveItemInArray' in globalThis)) {
        globalThis.moveItemInArray = function moveItemInArray(arr, from, to) {
            if (!(arr instanceof Array)) return;
            arr.splice(to, 0, arr.splice(from, 1)[0]);
        };
    }

    const bundlePath = fileURLToPath(new URL('../dist/core/bundles/jeli-core-umd.js', import.meta.url));
    vm.runInThisContext(readFileSync(bundlePath, 'utf8'), {
        filename: bundlePath,
        importModuleDynamically: (specifier) => import(specifier)
    });
}

export const core = globalThis.jeli.core;

let queue = Promise.resolve();

/**
 * Waits for pending MutationObserver callbacks to flush. `bootStrapApplication`'s
 * returned promise resolves as soon as `bootStrapElement()` returns
 * (bootstrap/index.js) - it does NOT wait for `ElementCompiler.compile`'s
 * `elementMutationObserver` callback (component/compiler.js), which is what
 * actually fires `viewDidLoad` and binds @ContentChild(ren) queries.
 * MutationObserver callbacks are spec'd to run as their own microtask
 * checkpoint after the current synchronous execution completes - a single
 * `await` (one microtask hop) isn't reliably enough for jsdom's scheduler in
 * practice, so this yields a real macrotask boundary instead of guessing at
 * a microtask count.
 */
function flushPendingMutations() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Drains and awaits pending lifecycle-hook promises (see
 * component/lifecycle.js's `enableLifecyclePromiseTracking`/
 * `drainLifecyclePromises` - SSR Phase 2), re-running change detection
 * after each batch settles, since resolved data can itself trigger new
 * lifecycle hooks (e.g. a `*for`/`*if` creating child components once data
 * arrives) that register further pending promises. Bounded by
 * `maxIterations` (runaway/looping async work) and `timeoutMs` per batch
 * (a slow/hanging request shouldn't hang the whole render - proceeds with
 * whatever resolved in time rather than blocking forever).
 */
async function drainDataFetching({ timeoutMs = 5000, maxIterations = 10 } = {}) {
    for (let i = 0; i < maxIterations; i++) {
        const pending = core.drainLifecyclePromises();
        if (!pending.length) return;

        await Promise.race([
            Promise.allSettled(pending),
            new Promise((resolve) => setTimeout(resolve, timeoutMs))
        ]);
        await flushPendingMutations();
        core.ChangeDetector();
    }
}

/**
 * Renders `rootFactory` (a compiled-shape root component - constructor
 * function with static `.ctors`/`.view`, matching jeli-cli codegen output)
 * mounted at `selector`, and returns the resulting DOM subtree serialized
 * to an HTML string. Renders are serialized process-wide (see file header) -
 * concurrent calls queue rather than interleave.
 * @param {Function} rootFactory
 * @param {string} selector
 * @param {{timeoutMs?: number, maxIterations?: number}} [dataFetchOptions]
 *   passed through to the data-fetching drain loop (SSR Phase 2)
 * @returns {Promise<string>}
 */
export function renderToString(rootFactory, selector, dataFetchOptions) {
    const run = async () => {
        document.body.innerHTML = `<${selector}></${selector}>`;
        core.enableLifecyclePromiseTracking();

        function TestModule() {}
        TestModule.fac = () => {};
        TestModule.rootElement = rootFactory;

        await core.bootStrapApplication(TestModule);
        await flushPendingMutations();
        // ConnectView's one synchronous detectChanges() call (component/compiler.js)
        // runs BEFORE the MutationObserver callback that fires viewDidLoad - any
        // state a component mutates in viewDidLoad (e.g. "loading" -> real content)
        // needs a second pass to actually reach the DOM. Confirmed empirically: a
        // component that sets `this.x` in viewDidLoad does not reflect it in the
        // rendered output without this.
        core.ChangeDetector();

        await drainDataFetching(dataFetchOptions);
        core.disableLifecyclePromiseTracking();

        const host = document.querySelector(selector);
        const html = host ? host.outerHTML : '';

        document.body.innerHTML = '';
        return html;
    };

    const result = queue.then(run, run);
    // keep the queue alive even if this render rejects, so later calls
    // still get their turn
    queue = result.then(() => {}, () => {});
    return result;
}

/**
 * SSR Phase 3 (hydration) - see .claude/plans/greedy-singing-mist.md for
 * the full design and its deliberate scope boundary: a component's
 * template is adopted (real node-by-node reuse) only when it contains no
 * structural directives (`*if`/`*for`/`{:switch}`) anywhere; otherwise the
 * stale server-rendered content is discarded and it falls back to a normal
 * full remount, safely, never partially/misaligned.
 *
 * `serverRenderedHTML` should be exactly what `renderToString()` returned
 * for the same `selector` (its `<${selector}>...</${selector}>` outer
 * HTML) - this simulates the real deployment shape (server sends that
 * markup to the browser, the same client bundle then hydrates it), without
 * requiring an actual HTTP round-trip for testing purposes.
 * @param {Function} rootFactory
 * @param {string} selector
 * @param {string} serverRenderedHTML
 * @returns {Promise<Element>} the hydrated host element
 */
export function hydrate(rootFactory, selector, serverRenderedHTML) {
    const run = async () => {
        document.body.innerHTML = serverRenderedHTML;

        function TestModule() {}
        TestModule.fac = () => {};
        TestModule.rootElement = rootFactory;

        core.enableHydrationMode();
        await core.bootStrapApplication(TestModule);
        core.disableHydrationMode();
        await flushPendingMutations();
        core.ChangeDetector();

        return document.querySelector(selector);
    };

    const result = queue.then(run, run);
    queue = result.then(() => {}, () => {});
    return result;
}
