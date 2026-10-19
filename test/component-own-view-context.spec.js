import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { core, mount } from './support/mount.mjs';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

if (!globalThis.jeli.common) {
    globalThis.IterableProfiler = core.IterableProfiler;
    const bundlePath = fileURLToPath(new URL('../dist/common/bundles/jeli-common-umd.js', import.meta.url));
    vm.runInThisContext(readFileSync(bundlePath, 'utf8'), { filename: bundlePath });
}
const { ForDirective, IfDirective } = globalThis.jeli.common;

// the child's own view reads `comp`, which is also the consumer's loop variable
const compName = (ctx, cmp) => core.resolveIdentifier('comp', ctx, cmp)?.name;

function ChildCmp() { this.comp = { name: 'own' }; }
ChildCmp.ctors = { selector: 'child-cmp' };
ChildCmp.view = el => core.ViewParser.jit(el, [
    { type: 1, name: 'span', index: 0, isc: false, children: [{ type: 3, ast: ['', compName, false] }] },
    { type: 3, ast: ['', compName, false] }
], {});

function rootComponent(hostHasOwnIf) {
    const host = { type: 1, name: 'child-cmp', index: 0, isc: true, providers: [ChildCmp], children: [] };
    const hostDef = hostHasOwnIf
        ? { type: 8, name: '##', text: 'if', templates: { if: host }, props: { if: { prop: true } }, providers: [IfDirective] }
        : host;

    function Root() { this.rows = [{ name: 'row-a' }, { name: 'row-b' }]; }
    Root.ctors = { selector: 'app-root' };
    Root.view = el => core.ViewParser.jit(el, [{
        type: 1, name: 'ul', index: 0, isc: false, children: [{
            type: 8, name: '##', text: 'for',
            templates: { for: { type: 1, name: 'li', index: 0, isc: false, context: { comp: '$context' }, children: [hostDef] } },
            props: { forOf: { prop: 'rows' } },
            providers: [ForDirective]
        }]
    }], {});
    return Root;
}

describe('a component\'s own view inside a *for row', () => {
    for (const hostHasOwnIf of [false, true]) {
        it(`resolves its template against the component, not the row (host ${hostHasOwnIf ? 'with' : 'without'} *if)`, async () => {
            document.body.innerHTML = '';
            const el = await mount(rootComponent(hostHasOwnIf), 'app-root');
            await wait(30);
            const rendered = [...el.querySelectorAll('child-cmp')].map(node => ({
                element: node.querySelector('span').textContent.trim(),
                text: node.textContent.replace(node.querySelector('span').textContent, '').trim()
            }));
            assert.deepEqual(rendered, [{ element: 'own', text: 'own' }, { element: 'own', text: 'own' }]);
        });
    }
});
