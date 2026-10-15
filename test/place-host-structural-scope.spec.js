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

// projected bindings of a *if'd host in a *for row resolve members on the consumer
function DropHost() { this.isAdmin = false; this.tag = 'host'; }
DropHost.ctors = { selector: 'drop-host' };
DropHost.view = el => core.ViewParser.jit(el, [
    { type: 1, name: 'div', index: 0, isc: false, children: [{ type: 11, refId: '@', $ctx: false }] }
], {});

const label = (ctx, cmp) => core.resolveIdentifier('row', ctx, cmp)?.label;

function projectedContent() {
    return {
        '@': [
            {
                type: 8, name: '##', text: 'if',
                templates: { if: { type: 1, name: 'a', index: 0, isc: false, children: [{ type: 3, ast: ['', label, false] }] } },
                props: { if: { compiledFn: (ctx, cmp) => cmp && cmp.isAdmin } },
                providers: [IfDirective]
            },
            { type: 1, name: 'b', index: 1, isc: false, children: [{ type: 3, ast: ['', (ctx, cmp) => cmp && cmp.tag, false] }] }
        ]
    };
}

function rootComponent(hostHasOwnIf) {
    const host = { type: 1, name: 'drop-host', index: 0, isc: true, providers: [DropHost], children: [], templates: { place: projectedContent() } };
    const hostDef = hostHasOwnIf
        ? { type: 8, name: '##', text: 'if', templates: { if: host }, props: { if: { prop: true } }, providers: [IfDirective] }
        : host;

    function Root() { this.isAdmin = true; this.tag = 'root'; this.rows = [{ label: 'A' }, { label: 'B' }]; }
    Root.ctors = { selector: 'app-root' };
    Root.view = el => core.ViewParser.jit(el, [{
        type: 1, name: 'ul', index: 0, isc: false, children: [{
            type: 8, name: '##', text: 'for',
            templates: { for: { type: 1, name: 'li', index: 0, isc: false, context: { row: '$context' }, children: [hostDef] } },
            props: { forOf: { prop: 'rows' } },
            providers: [ForDirective]
        }]
    }], {});
    return Root;
}

describe('<j-place> content of a host with its own structural directive', () => {
    for (const hostHasOwnIf of [false, true]) {
        it(`resolves members on the consumer and the row from the loop (host ${hostHasOwnIf ? 'with' : 'without'} *if)`, async () => {
            document.body.innerHTML = '';
            const el = await mount(rootComponent(hostHasOwnIf), 'app-root');
            await wait(30);
            const rendered = [...el.querySelectorAll('drop-host')].map(node => node.textContent.replace(/\s+/g, ''));
            assert.deepEqual(rendered, ['Aroot', 'Broot']);
        });
    }
});
