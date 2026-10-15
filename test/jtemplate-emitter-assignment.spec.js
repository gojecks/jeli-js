import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { core, mount } from './support/mount.mjs';

if (!globalThis.jeli.common) {
    globalThis.IterableProfiler = core.IterableProfiler;
    const bundlePath = fileURLToPath(new URL('../dist/common/bundles/jeli-common-umd.js', import.meta.url));
    vm.runInThisContext(readFileSync(bundlePath, 'utf8'), { filename: bundlePath });
}

// fo-site-builder grid-editor shape: *for(comp) > div > <j-fragment {template}> > <j-template> > child @emitter="comp.content=$event"
describe('interpreted assignment from a child emitter inside a {template} j-fragment within *for', () => {
    it('writes onto the row variable, not the component instance', async () => {
        function ChildEmitter() {
            this.onSave = new core.EventEmitter(null);
            setTimeout(() => this.onSave.emit('fired'), 5);
        }
        ChildEmitter.ctors = { selector: 'child-emitter-tpl', events: { onSave: { type: 'emitter' } } };
        ChildEmitter.view = (elementRef) => core.ViewParser.jit(elementRef, [], {});

        function TestRoot() {
            window.__tplInstance = this;
            this.items = [{ type: 'markup' }, { type: 'markup' }];
        }
        TestRoot.ctors = { selector: 'app-root-tpl' };
        TestRoot.view = (elementRef) => {
            var _GT = (id) => core.ViewParser.$({
                markupViewEditor: {
                    type: 1, name: '#', index: 2, isc: false, refId: 'markupViewEditor',
                    children: [
                        { type: 1, name: 'p', index: 0, isc: false, children: [{ type: 3, ast: ['x'] }] },
                        {
                            type: 1, name: 'child-emitter-tpl', index: 1, isc: true,
                            providers: [ChildEmitter], children: [],
                            events: [{ name: 'onSave', value: [{ type: 'asg', left: ['comp', 'content'], right: '$event' }] }]
                        }
                    ]
                }
            }[id]);

            return core.ViewParser.jit(elementRef, [{
                type: 8, name: '##', text: 'for',
                templates: {
                    for: {
                        type: 1, name: 'div', index: 0, isc: false,
                        context: { comp: '$context', idx: 'index' },
                        children: [{
                            type: 1, name: 'div', index: 0, isc: false,
                            children: [{
                                type: 13,
                                $templateId: { compiledFn: (ctx, cmp) => core.resolveIdentifier('comp', ctx, cmp)?.type + 'ViewEditor' },
                                _GT: _GT
                            }]
                        }]
                    }
                },
                props: { forOf: { prop: 'items' } },
                providers: [globalThis.jeli.common.ForDirective]
            }], {});
        };

        await mount(TestRoot, 'app-root-tpl');
        await new Promise(r => setTimeout(r, 60));

        const instance = window.__tplInstance;
        assert.deepEqual(instance.items.map(i => i.content), ['fired', 'fired']);
        assert.equal(instance.comp, undefined, 'must not create a stray comp object on the component');
    });
});
