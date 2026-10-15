import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { core, mount } from './support/mount.mjs';

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

if (!globalThis.jeli.common) {
    globalThis.IterableProfiler = core.IterableProfiler;
    const bundlePath = fileURLToPath(new URL('../dist/common/bundles/jeli-common-umd.js', import.meta.url));
    vm.runInThisContext(readFileSync(bundlePath, 'utf8'), { filename: bundlePath });
}
const ForDirective = globalThis.jeli.common.ForDirective;

// regression test: @for(x of y){ <singleElement> } used to only render row 0 - a DocumentFragment-shaped row broke elementInsertAfter's anchor. Fixed via resolveAnchorNode in dom/renderer/utils.js
describe('@for(...) { <singleElement> } renders every row, not just row 0', () => {
    it('FIXED: <j-fragment {template}="alphabet.id" /> block body renders all 3 rows', async () => {
        function TestRoot() {
            window.__instance = this;
            this.alphabets = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => {
            var _GT = (id) => core.ViewParser.$({
                A: { type: 1, name: 'li', index: 0, isc: false, children: [{ type: 3, ast: ['Item A'] }] },
                B: { type: 1, name: 'li', index: 0, isc: false, children: [{ type: 3, ast: ['Item B'] }] },
                C: { type: 1, name: 'li', index: 0, isc: false, children: [{ type: 3, ast: ['Item C'] }] }
            }[id]);

            // exact shape jeli-cli's real compiler produces for:
            // <ul>@for(alphabet of alphabets){<j-fragment {template}="alphabet.id" />}</ul>
            return core.ViewParser.jit(elementRef, [
                {
                    type: 1, name: 'ul', index: 0, isc: false,
                    children: [
                        {
                            type: 8, name: '##', text: 'for',
                            templates: {
                                for: {
                                    type: 1, name: '#', index: 0, isc: false, // <- synthetic wrapper, the root cause
                                    context: { alphabet: '$context' },
                                    children: [
                                        {
                                            type: 13,
                                            $templateId: {
                                                prop: ['alphabet', 'id'],
                                                compiledFn: (ctx, cmp) => core.resolveIdentifier('alphabet', ctx, cmp)?.id
                                            },
                                            _GT: _GT
                                        }
                                    ]
                                }
                            },
                            props: { forOf: { prop: 'alphabets' } },
                            providers: [ForDirective]
                        }
                    ]
                }
            ], {});
        };

        const el = await mount(TestRoot, 'app-root');
        await wait(30);
        const items = el.querySelectorAll('li');
        assert.equal(items.length, 3, `expected 3 <li> entries, got ${items.length}: ${el.innerHTML}`);
    });

    it('CONTROL: <li *for="alphabet of alphabets"> (attribute-style, no # wrapper) renders all 3 rows fine', async () => {
        function TestRoot() {
            window.__instance = this;
            this.alphabets = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
        }
        TestRoot.ctors = { selector: 'app-root' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'ul', index: 0, isc: false,
                children: [
                    {
                        type: 8, name: '##', text: 'for',
                        templates: {
                            for: {
                                type: 1, name: 'li', index: 0, isc: false, // <- real tag directly, no wrapper
                                context: { alphabet: '$context' },
                                children: [
                                    { type: 3, ast: ['', (ctx, cmp) => core.resolveIdentifier('alphabet', ctx, cmp)?.id, false] }
                                ]
                            }
                        },
                        props: { forOf: { prop: 'alphabets' } },
                        providers: [ForDirective]
                    }
                ]
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        await wait(30);
        const items = el.querySelectorAll('li');
        assert.equal(items.length, 3, `expected 3 <li> entries, got ${items.length}: ${el.innerHTML}`);
    });
});
