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

/**
 * Generic regression test - a *for'd custom element (isc:true) projecting content via
 * <j-place>, the exact shape jeli-cli emits for e.g.
 * <row-item {label}="row.label" *for="row of rows"><span>${row.label}</span></row-item>
 * See catalogue [[jeli-js]] "<j-place> default context ignores a *for'd host" for the fix.
 */
describe('<j-place> content inside a *for\'d custom element', () => {
    it('projected children see their own row, not the outer ambient value', async () => {
        function RowItem() {}
        RowItem.ctors = { selector: 'row-item', props: { label: {} } };
        RowItem.view = (elementRef) => core.ViewParser.jit(elementRef, [
            { type: 11, refId: '@', $ctx: false }
        ], {});

        function TestRoot() {
            window.__instance = this;
            this.rows = [{ label: 'A' }, { label: 'B' }, { label: 'C' }];
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
                                type: 1, name: 'row-item', index: 0, isc: true,
                                context: { row: '$context' },
                                props: { label: { compiledFn: (ctx, cmp) => core.resolveIdentifier('row', ctx, cmp)?.label } },
                                providers: [RowItem],
                                children: [],
                                templates: {
                                    place: {
                                        '@': [
                                            { type: 3, ast: ['', (ctx, cmp) => core.resolveIdentifier('row', ctx, cmp)?.label, false] }
                                        ]
                                    }
                                }
                            }
                        },
                        props: { forOf: { prop: 'rows' } },
                        providers: [ForDirective]
                    }
                ]
            }
        ], {});

        const el = await mount(TestRoot, 'app-root');
        await wait(30);
        const items = [...el.querySelectorAll('row-item')].map(n => n.textContent);
        // each row-item's projected text should echo its OWN row's label
        assert.deepEqual(items, ['A', 'B', 'C'], `expected each row's own label, got ${JSON.stringify(items)}`);
    });
});
