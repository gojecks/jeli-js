import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

/**
 * <j-place fallback="id"> renders the <j-template #id> registered on the
 * SAME component's own view (resolved via _GT, same mechanism as
 * <j-fragment {template}="..."> uses) whenever nothing was projected into
 * that place - mirroring these hand-written AST shapes is how the compiler
 * (jeli-cli's jPlaceCompiler) actually emits type:11 nodes, see
 * attribute-binding.spec.js's <j-fragment> test for the same convention.
 */
describe('core render harness (<j-place fallback="...">)', () => {
    it('renders the fallback <j-template> when no content was projected for the place', async () => {
        function ChildEl() { window.__childInstance = this; }
        ChildEl.ctors = { selector: 'child-el' };
        ChildEl.view = (elementRef) => {
            var _GT = (id) => core.ViewParser.$({
                fb: { type: 1, name: 'span', index: 0, isc: false, children: [{ type: 3, ast: ['Fallback Content'] }] }
            }[id]);
            return core.ViewParser.jit(elementRef, [
                { type: 11, refId: '@', fallback: 'fb', _GT: _GT }
            ], {});
        };

        function TestRoot() { window.__instance = this; }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            // no `templates` on this definition - nothing projected into <child-el>
            { type: 1, name: 'child-el', index: 0, isc: true, providers: [ChildEl] }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.querySelector('child-el').textContent, 'Fallback Content');
    });

    it('prefers projected content over the fallback when something was placed', async () => {
        function ChildEl() { window.__childInstance = this; }
        ChildEl.ctors = { selector: 'child-el' };
        ChildEl.view = (elementRef) => {
            var _GT = (id) => core.ViewParser.$({
                fb: { type: 1, name: 'span', index: 0, isc: false, children: [{ type: 3, ast: ['Fallback Content'] }] }
            }[id]);
            return core.ViewParser.jit(elementRef, [
                { type: 11, refId: '@', fallback: 'fb', _GT: _GT }
            ], {});
        };

        function TestRoot() { window.__instance = this; }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'child-el', index: 0, isc: true, providers: [ChildEl],
                templates: { place: { '@': [{ type: 1, name: 'em', index: 0, isc: false, children: [{ type: 3, ast: ['Projected'] }] }] } }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.querySelector('child-el').textContent, 'Projected');
        assert.equal(el.querySelector('child-el span'), null);
    });
});
