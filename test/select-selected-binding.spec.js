import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

/**
 * Real-renderer version of select-input-value-order.spec.js: the options use a
 * compiled {selected} binding (attr$.selected, same shape the grid-editor
 * template compiles to), and the <select> sits inside a wrapper with a
 * delegated `@input-delegate:select` handler.
 */
function selectedOption(value) {
    return {
        type: 1, name: 'option', index: 0, isc: false,
        attr: { value },
        attr$: {
            selected: {
                once: false,
                compiledFn: (ctx, cmp) => core.resolveIdentifier('model', ctx, cmp) === value
            }
        },
        children: [{ type: 3, ast: [value] }]
    };
}

function buildRoot({ withWrapper }) {
    function TestRoot() {
        window.__instance = this;
        this.model = 'a';
        this.readValue = null;
    }
    TestRoot.ctors = { selector: 'app-root' };
    const select = {
        type: 1, name: 'select', index: 0, isc: false,
        events: [{
            name: 'input',
            compiledFn: (ctx, cmp, ev) => {
                cmp.readValue = ev.target.value;
                cmp.model = ev.target.value;
            }
        }],
        children: [selectedOption('a'), selectedOption('b'), selectedOption('c')]
    };
    const wrapper = {
        type: 1, name: 'div', index: 0, isc: false,
        events: [{ name: 'input', target: ['select'], compiledFn: () => {} }],
        children: [select]
    };
    TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [withWrapper ? wrapper : select], {});
    return TestRoot;
}

describe('select {selected} binding with a delegated ancestor (real renderer)', () => {
    it('control: without a delegated wrapper, the handler reads the picked value', async () => {
        const el = await mount(buildRoot({ withWrapper: false }), 'app-root');
        const select = el.querySelector('select');
        select.value = 'b';
        select.dispatchEvent(new window.Event('input', { bubbles: true }));
        assert.equal(window.__instance.readValue, 'b');
        assert.equal(window.__instance.model, 'b');
    });

    it('with a delegated wrapper, the handler still reads the picked value', async () => {
        const el = await mount(buildRoot({ withWrapper: true }), 'app-root');
        const select = el.querySelector('select');
        select.value = 'b';
        select.dispatchEvent(new window.Event('input', { bubbles: true }));
        assert.equal(window.__instance.readValue, 'b', 'handler read the value after {selected} reset it');
        assert.equal(window.__instance.model, 'b');
        assert.equal(select.value, 'b', 'select should keep the picked value after change detection');
    });
    it('with an outer delegated ancestor (its change detection runs first), the handler still reads the picked value', async () => {
        function TestRoot() {
            window.__instance = this;
            this.model = 'a';
            this.readValue = null;
        }
        TestRoot.ctors = { selector: 'app-root' };
        const select = {
            type: 1, name: 'select', index: 0, isc: false,
            children: [selectedOption('a'), selectedOption('b'), selectedOption('c')]
        };
        const inner = {
            type: 1, name: 'div', index: 0, isc: false,
            events: [{ name: 'input', target: ['select'], compiledFn: (ctx, cmp, ev) => { cmp.readValue = ev.target.value; } }],
            children: [select]
        };
        const outer = {
            type: 1, name: 'section', index: 0, isc: false,
            events: [{ name: 'input', target: ['select'], compiledFn: () => {} }],
            children: [inner]
        };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [outer], {});

        const el = await mount(TestRoot, 'app-root');
        const selectEl = el.querySelector('select');
        selectEl.value = 'b';
        selectEl.dispatchEvent(new window.Event('input', { bubbles: true }));
        assert.equal(window.__instance.readValue, 'b', 'outer delegate change detection reset the select before the read');
    });
});
