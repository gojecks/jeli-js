import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

describe('core render harness (text-node bindings)', () => {
    it('renders and updates a dynamic text interpolation binding', async () => {
        function TestRoot() {
            window.__instance = this;
            this.label = 'world';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 3, ast: ['Hello ${0}', [['${0}', { prop: 'label' }]], false] }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.textContent, 'Hello world');

        window.__instance.label = 'jeli';
        core.ChangeDetector();
        assert.equal(el.textContent, 'Hello jeli');
    });

    it('does not re-evaluate a once-only text binding after the first render', async () => {
        function TestRoot() {
            window.__instance = this;
            this.label = 'first';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            // once flag is array index [2], matching jeli-cli's interpolation.js:parser output
            { type: 3, ast: ['${0}', [['${0}', { prop: 'label' }]], true] }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.textContent, 'first');

        window.__instance.label = 'second';
        core.ChangeDetector();
        assert.equal(el.textContent, 'first', 'once binding must not update after first render');
    });

    it('renders and updates a compiled-function text binding (hand-written, no compiler involved)', async () => {
        // Shape jeli-cli's compiledBindings codegen is expected to emit:
        // ast[1] is a real function instead of the interpreted
        // [placeholder, filterModel] pair list. ast[0] is only ever used
        // as transient initial textContent (overwritten synchronously by
        // the first setValue() call), so its exact value doesn't matter.
        function TestRoot() {
            window.__instance = this;
            this.first = 'jane';
            this.last = 'doe';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 3, ast: [
                    '',
                    function (context, componentInstance) {
                        return core.resolveIdentifier('first', context, componentInstance) + ' ' +
                            core.resolveIdentifier('last', context, componentInstance);
                    },
                    false
                ]
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.textContent, 'jane doe');

        window.__instance.last = 'smith';
        core.ChangeDetector();
        assert.equal(el.textContent, 'jane smith');
    });

    it('respects the once flag for a compiled-function text binding', async () => {
        function TestRoot() {
            window.__instance = this;
            this.label = 'first';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 3, ast: [
                    '',
                    (context, componentInstance) => core.resolveIdentifier('label', context, componentInstance),
                    true
                ]
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.textContent, 'first');

        window.__instance.label = 'second';
        core.ChangeDetector();
        assert.equal(el.textContent, 'first', 'once binding must not update after first render');
    });
});
