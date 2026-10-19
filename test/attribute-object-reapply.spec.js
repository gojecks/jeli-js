import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

describe('attr$ re-application: primitives skipped, objects always written', () => {
    it('re-writes an object binding whose reference is the same but whose contents changed', async () => {
        function TestRoot() {
            window.__instance = this;
            this.style = { color: 'red' };
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                attr$: {
                    style: {
                        once: false,
                        compiledFn: (ctx, cmp) => core.resolveIdentifier('style', ctx, cmp)
                    }
                }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const div = el.querySelector('div');
        assert.equal(div.style.color, 'red');

        // same object reference, mutated in place
        window.__instance.style.color = 'blue';
        core.ChangeDetector();
        assert.equal(div.style.color, 'blue', 'in-place mutation of an object binding must reach the element');
    });

    it('does not re-write an unchanged primitive binding', async () => {
        function TestRoot() {
            window.__instance = this;
            this.label = 'a';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                attr$: {
                    'data-label': { once: false, compiledFn: (ctx, cmp) => core.resolveIdentifier('label', ctx, cmp) }
                }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const div = el.querySelector('div');
        assert.equal(div.getAttribute('data-label'), 'a');
        // user/DOM-side change that the model has not caught up with
        div.setAttribute('data-label', 'typed');
        core.ChangeDetector();
        assert.equal(div.getAttribute('data-label'), 'typed', 'unchanged primitive should not be re-applied');
    });
});
