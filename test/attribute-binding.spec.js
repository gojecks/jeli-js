import assert from 'node:assert/strict';
import { core, mount } from './support/mount.mjs';

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('core render harness (Phase 2: attribute/property bindings)', () => {
    // regression: the compiler moves static aria-*/data-* into their own maps, which the renderer used to ignore
    it('renders static aria-* and data-* attributes from their compiled maps', async () => {
        function TestRoot() {}
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                attr: { role: 'dialog' },
                aria: { modal: 'true', label: 'Jump to' },
                data: { 'bs-toggle': 'tab', 'node-id': 'n1' }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const div = el.querySelector('div');
        assert.equal(div.getAttribute('role'), 'dialog');
        assert.equal(div.getAttribute('aria-modal'), 'true');
        assert.equal(div.getAttribute('aria-label'), 'Jump to');
        assert.equal(div.getAttribute('data-bs-toggle'), 'tab');
        assert.equal(div.getAttribute('data-node-id'), 'n1');
    });

    it('renders and updates a compiled attribute binding on a native element', async () => {
        function TestRoot() {
            window.__instance = this;
            this.isDisabled = true;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'input', index: 0, isc: false,
                attr$: {
                    disabled: {
                        prop: 'isDisabled', once: false,
                        compiledFn: (ctx, cmp) => core.resolveIdentifier('isDisabled', ctx, cmp)
                    }
                }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const input = el.querySelector('input');
        assert.equal(input.disabled, true);

        window.__instance.isDisabled = false;
        core.ChangeDetector();
        assert.equal(input.disabled, false);
    });

    it('applies a compiled style.* dotted binding, preserving type/suffix alongside .compiledFn', async () => {
        function TestRoot() {
            window.__instance = this;
            this.w = 100;
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                attr$: {
                    style: [
                        {
                            prop: 'w', type: 'width', once: false,
                            compiledFn: (ctx, cmp) => core.resolveIdentifier('w', ctx, cmp)
                        }
                    ]
                }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const div = el.querySelector('div');
        // confirms the adjacent ElementStyle.fixValue(value, item.type, item.suffix)
        // arg-order fix - 'width' is in WithSuffix, so 'px' must be appended
        assert.equal(div.style.width, '100px');

        window.__instance.w = 200;
        core.ChangeDetector();
        assert.equal(div.style.width, '200px');
    });

    it('compiles an embedded ${} placeholder inside a plain attribute value (Target D)', async () => {
        // uses `title`, not `class` - AttributeAppender.byType's `class`
        // case (ElementClassList.add) is additive-only by pre-existing
        // design (unrelated to compiled vs. interpreted evaluation, same
        // behavior either way), so it's not a representative attribute
        // for isolating this dual-path mechanism specifically.
        function TestRoot() {
            window.__instance = this;
            this.state = 'active';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'div', index: 0, isc: false,
                attr$: {
                    title: [
                        'btn-${0}',
                        function ($ctx, $cmp) {
                            var $v = `btn-${core.resolveIdentifier('state', $ctx, $cmp)}`;
                            return ($v === 'null' || $v === 'undefined') ? '' : $v;
                        },
                        false
                    ]
                }
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        const div = el.querySelector('div');
        assert.equal(div.title, 'btn-active');

        window.__instance.state = 'inactive';
        core.ChangeDetector();
        assert.equal(div.title, 'btn-inactive');
    });

    it('swaps <j-fragment> content based on a compiled $templateId', async () => {
        // templates are element-wrapped (not bare text nodes) - matches
        // every real <j-fragment> template usage found this session, and
        // avoids a separate, pre-existing gap where replaceElement (used
        // for the swap) only handles AbstractElementRef-shaped nodes
        // (.nativeElement/.children), not a bare TextNodeRef
        // (.nativeNode) - unrelated to compiled bindings, not fixed here.
        function TestRoot() {
            window.__instance = this;
            this.which = 'a';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => {
            var _GT = (id) => core.ViewParser.$({
                a: { type: 1, name: 'span', index: 0, isc: false, children: [{ type: 3, ast: ['Template A'] }] },
                b: { type: 1, name: 'span', index: 0, isc: false, children: [{ type: 3, ast: ['Template B'] }] }
            }[id]);
            return core.ViewParser.jit(elementRef, [
                {
                    type: 13,
                    $templateId: {
                        prop: 'which',
                        compiledFn: (ctx, cmp) => core.resolveIdentifier('which', ctx, cmp)
                    },
                    _GT: _GT
                }
            ], {});
        };

        const el = await mount(TestRoot, 'app-root');
        assert.equal(el.textContent, 'Template A');

        window.__instance.which = 'b';
        core.ChangeDetector();
        // subsequent (post-initial) <j-fragment> swaps are batched onto the
        // scheduler (requestAnimationFrame, polyfilled to setTimeout(0) in
        // the jsdom harness) - wait a tick for the swap to land
        await wait(20);
        assert.equal(el.textContent, 'Template B');
    });

    it('updates a compiled component/directive {prop}= binding through lifecycle.js:_updateViewBinding', async () => {
        // this is the highest real-world-impact target found this session -
        // 53% of all real {prop}= bindings target custom elements and flow
        // through this exact path, via setObjectType's second, independent
        // filterModel producer (not setAttributeBinder).
        function ChildEl() {
            window.__childInstance = this;
        }
        ChildEl.ctors = { selector: 'child-el', props: { value: {} } };

        function TestRoot() {
            window.__instance = this;
            this.label = 'jane';
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'child-el', index: 0, isc: true,
                providers: [ChildEl],
                props: {
                    value: {
                        prop: 'label',
                        compiledFn: (ctx, cmp) => core.resolveIdentifier('label', ctx, cmp)
                    }
                }
            }
        ], {});

        await mount(TestRoot, 'app-root');
        assert.equal(window.__childInstance.value, 'jane');

        window.__instance.label = 'jeli';
        core.ChangeDetector();
        assert.equal(window.__childInstance.value, 'jeli');
    });
});
