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

/**
 * Regression coverage for a reported (but, per this test, not reproducible) bug: "when
 * an @Output event is triggered inside a *for loop, attachEventEmitter passes the
 * componentInstance instead of the loop's context." Investigated against fo-site-builder's
 * editor-services array-object json field, which has exactly this shape two *for levels
 * deep: *for(row,idx2) > div > *for(subField) > div (*if) > fo-markup-editor (isc:true,
 * emits markupEditorChange).
 *
 * place-for-scope-repro.spec.js already covers a component sitting AT a *for's own root
 * (context:{row:'$context'} on the component itself). This covers the gap that test
 * doesn't: a component several plain wrapper divs deep inside a *for, AND nested two
 * *for levels, which is editor-services' actual shape.
 *
 * Key subtlety that likely produced the original report: createLocalVariables
 * deliberately never does Object.create(parentContext) (see its own comment) - outer
 * loop vars on a nested context live only behind the Symbol-keyed SCOPE_PARENT link, not
 * as an own/enumerable property. Naive `ctx.row` access (or console.log(ctx)) looks
 * exactly like "context lost, only componentInstance-shaped data left" even when the
 * link is intact - only resolveIdentifier's SCOPE_PARENT walk (what real compiled
 * expressions use) sees it. Both assertions below use that real mechanism.
 */
describe('attachEventEmitter / event interpreter: nested *for context two levels deep', () => {
    it('compiledFn path resolves both the outer and inner loop vars, not just componentInstance', async () => {
        function ChildEmitter() {
            this.onSave = new core.EventEmitter(null);
            setTimeout(() => this.onSave.emit('fired'), 5);
        }
        ChildEmitter.ctors = { selector: 'child-emitter', events: { onSave: { type: 'emitter' } } };
        ChildEmitter.view = (elementRef) => core.ViewParser.jit(elementRef, [], {});

        function TestRoot() {
            window.__instance = this;
            window.__calls = [];
            this.rows = [
                { label: 'A', subs: [{ key: 'a1' }, { key: 'a2' }] },
                { label: 'B', subs: [{ key: 'b1' }] }
            ];
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
                                type: 1, name: 'li', index: 0, isc: false,
                                context: { row: '$context', idx2: 'index' },
                                children: [
                                    {
                                        type: 1, name: 'div', index: 0, isc: false,
                                        children: [
                                            {
                                                type: 8, name: '##', text: 'for',
                                                templates: {
                                                    for: {
                                                        type: 1, name: 'div', index: 0, isc: false,
                                                        context: { subField: '$context' },
                                                        children: [
                                                            {
                                                                type: 1, name: 'div', index: 0, isc: false,
                                                                children: [
                                                                    {
                                                                        type: 1, name: 'child-emitter', index: 0, isc: true,
                                                                        providers: [ChildEmitter],
                                                                        children: [],
                                                                        events: [{
                                                                            name: 'onSave',
                                                                            compiledFn: (ctx, cmp, ev) => {
                                                                                window.__calls.push({
                                                                                    rowLabel: core.resolveIdentifier('row', ctx, cmp)?.label,
                                                                                    idx2: core.resolveIdentifier('idx2', ctx, cmp),
                                                                                    subFieldKey: core.resolveIdentifier('subField', ctx, cmp)?.key,
                                                                                    cmpIsRoot: cmp === window.__instance,
                                                                                    ev
                                                                                });
                                                                            }
                                                                        }]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                props: { forOf: { prop: ['row', 'subs'] } },
                                                providers: [globalThis.jeli.common.ForDirective]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        props: { forOf: { prop: 'rows' } },
                        providers: [globalThis.jeli.common.ForDirective]
                    }
                ]
            }
        ], {});

        await mount(TestRoot, 'app-root');
        await new Promise(r => setTimeout(r, 60));

        assert.deepEqual(
            window.__calls.map(c => [c.rowLabel, c.idx2, c.subFieldKey, c.cmpIsRoot]),
            [['A', 0, 'a1', true], ['A', 0, 'a2', true], ['B', 1, 'b1', true]],
            'each nested child-emitter event must resolve BOTH the outer (row, idx2) and inner (subField) loop vars, and still write to the real component instance'
        );
    });

    it('interpreter path (registeredEvent.value) - what the default (non-compiledBindings) build uses - resolves the same way', async () => {
        function ChildEmitter() {
            this.onSave = new core.EventEmitter(null);
            setTimeout(() => this.onSave.emit('fired'), 5);
        }
        ChildEmitter.ctors = { selector: 'child-emitter2', events: { onSave: { type: 'emitter' } } };
        ChildEmitter.view = (elementRef) => core.ViewParser.jit(elementRef, [], {});

        function TestRoot() {
            window.__calls2 = [];
            this.rows = [
                { label: 'A', subs: [{ key: 'a1' }, { key: 'a2' }] },
                { label: 'B', subs: [{ key: 'b1' }] }
            ];
            // mirrors editor-services' updateContext($event, prefix + field.key + '.' + idx2 + '.' + subField.key, 'json')
            this.record = (ev, path) => window.__calls2.push(path);
        }
        TestRoot.ctors = { selector: 'app-root2' };
        TestRoot.view = (elementRef) => core.ViewParser.jit(elementRef, [
            {
                type: 1, name: 'ul', index: 0, isc: false,
                children: [
                    {
                        type: 8, name: '##', text: 'for',
                        templates: {
                            for: {
                                type: 1, name: 'li', index: 0, isc: false,
                                context: { row: '$context', idx2: 'index' },
                                children: [
                                    {
                                        type: 1, name: 'div', index: 0, isc: false,
                                        children: [
                                            {
                                                type: 8, name: '##', text: 'for',
                                                templates: {
                                                    for: {
                                                        type: 1, name: 'div', index: 0, isc: false,
                                                        context: { subField: '$context' },
                                                        children: [
                                                            {
                                                                type: 1, name: 'div', index: 0, isc: false,
                                                                children: [
                                                                    {
                                                                        type: 1, name: 'child-emitter2', index: 0, isc: true,
                                                                        providers: [ChildEmitter],
                                                                        children: [],
                                                                        // real jeli-cli interpreter AST shape for
                                                                        // `prefix + field.key + '.' + idx2 + '.' + subField.key` -
                                                                        // property access is the array form ['row','label'],
                                                                        // confirmed against fo-site-builder's actual compiled output.
                                                                        events: [{
                                                                            name: 'onSave',
                                                                            value: [{
                                                                                type: 'call',
                                                                                fn: 'record',
                                                                                args: [
                                                                                    '$event',
                                                                                    {
                                                                                        type: 'bin',
                                                                                        left: { type: 'bin', left: ['row', 'label'], ops: '+', right: 'idx2' },
                                                                                        ops: '+',
                                                                                        right: ['subField', 'key']
                                                                                    }
                                                                                ]
                                                                            }]
                                                                        }]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                props: { forOf: { prop: ['row', 'subs'] } },
                                                providers: [globalThis.jeli.common.ForDirective]
                                            }
                                        ]
                                    }
                                ]
                            }
                        },
                        props: { forOf: { prop: 'rows' } },
                        providers: [globalThis.jeli.common.ForDirective]
                    }
                ]
            }
        ], {});

        await mount(TestRoot, 'app-root2');
        await new Promise(r => setTimeout(r, 60));

        assert.deepEqual(window.__calls2, ['A0a1', 'A0a2', 'B1b1'],
            'the interpreter path must resolve the same nested outer+inner loop vars as the compiledFn path');
    });
});
