import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

/**
 * Regression test for the database-hooks bug: a *for row's click handler
 * assigning to a real component property (`selectedHook=hook.value`) must
 * write to the component instance, not shadow-write onto the row's own
 * template-local context.
 *
 * `ctx$` reproduces the exact runtime shape a real *for row has (see
 * element.ref.js: `createLocalVariables(definition.ctx$, ..., parentRef.componentInstance)`)
 * without needing the full ForDirective/IterableProfiler iteration machinery -
 * the row's `context` ends up `Object.create(componentInstance)`, matching
 * the devtools screenshot that diagnosed this bug (a row's local context had
 * its own `selectedHook: "circles"` while the real component's stayed null).
 *
 * Requires a real `dist/core/bundles/jeli-core-umd.js` (mount.mjs loads it
 * directly). A pre-existing, unrelated issue in this working tree - the
 * installed @jeli/compiler-cli@1.0.0 can't parse a dynamic `import()`
 * expression added to utils/lazyloader.js by other uncommitted work, and
 * packages/core/public.api.js has never re-exported ProviderToken even
 * though bootstrap/index.js's INITIALIZERS token needs it - currently makes
 * `npm run build:all` produce a bundle this suite's mount() can't load at
 * all (`ReferenceError: ProviderToken is not defined`). Both are flagged,
 * not fixed, here (out of scope for this change). The exact same dispatch
 * logic this file exercises is also covered directly against source,
 * bypassing dist entirely, in event-handler-compiled-fn.spec.js.
 */
describe('*for row @click assignment write target', () => {
    it('interpreter path (no compiledFn): writes to the component instance, not the row context', async () => {
        function TestRoot() {
            window.__instance = this;
            this.selectedHook = null;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                ctx$: { dummy: { type: 'raw', value: 'x' } },
                events: [{
                    name: 'click',
                    value: [{ type: 'asg', left: 'selectedHook', right: { type: 'raw', value: 'circles' } }]
                }],
                children: []
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        el.querySelector('div').dispatchEvent(new window.Event('click', { bubbles: true }));

        assert.equal(window.__instance.selectedHook, 'circles', 'the real component property must be updated');
    });

    it('compiledFn path: invoked directly instead of the interpreter, still writes to the component instance', async () => {
        function TestRoot() {
            window.__instance = this;
            this.selectedHook = null;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                ctx$: { dummy: { type: 'raw', value: 'x' } },
                events: [{
                    name: 'click',
                    // deliberately WRONG interpreter fallback value, so the
                    // assertion only passes if compiledFn (not this) ran
                    value: [{ type: 'asg', left: 'selectedHook', right: { type: 'raw', value: 'WRONG_VALUE' } }],
                    compiledFn: function ($ctx, $cmp) { return ($cmp['selectedHook'] = 'circles'); }
                }],
                children: []
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        el.querySelector('div').dispatchEvent(new window.Event('click', { bubbles: true }));

        assert.equal(window.__instance.selectedHook, 'circles', 'compiledFn must run instead of the interpreter, and must still write to the component instance');
    });
});
