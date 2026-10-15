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
const ForDirective = globalThis.jeli.common.ForDirective;
const IfDirective = globalThis.jeli.common.IfDirective;

/**
 * Root-cause regression for a reported bug: an *if directive sitting inside a *for
 * (e.g. <div *for="row of rows"><div *if="cond"><child @onSave="handler(row)"></div></div>)
 * silently loses the *for's loop context for everything it wraps, so a bound expression
 * referencing the loop var inside the *if resolves against the plain componentInstance
 * instead - either as undefined/null, or (worse) a same-named componentInstance property
 * if one happens to exist.
 *
 * Cause: IfDirective.createView() calls viewRef.createEmbededView(templateRef) with no
 * context argument (unlike ForDirective, which always passes one - see for.js). In
 * EmbededViewContext's constructor (viewref.js), hasContext was set unconditionally to
 * `!!templateContext` - true only when the view's OWN template declares new local vars.
 * *if never declares any (it doesn't introduce a loop var like *for does), so hasContext
 * was always false for an *if's embedded view, and its .context was never assigned -
 * severing the chain regardless of what the parent actually had.
 *
 * Fix: when a view introduces no new local vars AND wasn't given its own per-instance
 * context (the *if case, as opposed to *for's jForRow), it now inherits hasContext/context
 * from its parentRef instead of resetting to an unscoped view.
 */
describe('*if does not break context inherited from an enclosing *for', () => {
    it('a bound event inside *if, nested inside *for, resolves the loop variable (not just componentInstance)', async () => {
        function ChildEmitter() {
            this.onSave = new core.EventEmitter(null);
            setTimeout(() => this.onSave.emit('fired'), 5);
        }
        ChildEmitter.ctors = { selector: 'if-child-emitter', events: { onSave: { type: 'emitter' } } };
        ChildEmitter.view = (elementRef) => core.ViewParser.jit(elementRef, [], {});

        function TestRoot() {
            window.__instance = this;
            window.__calls = [];
            this.rows = [{ label: 'A' }, { label: 'B' }];
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
                                context: { row: '$context' },
                                children: [
                                    {
                                        // real *if structural directive - matches <div *if="cond">...</div> inside a *for row
                                        type: 8, name: '##', text: 'if',
                                        templates: {
                                            if: {
                                                type: 1, name: 'div', index: 0, isc: false,
                                                children: [
                                                    {
                                                        type: 1, name: 'if-child-emitter', index: 0, isc: true,
                                                        providers: [ChildEmitter],
                                                        children: [],
                                                        events: [{
                                                            name: 'onSave',
                                                            compiledFn: (ctx, cmp, ev) => {
                                                                window.__calls.push({
                                                                    rowLabel: core.resolveIdentifier('row', ctx, cmp)?.label,
                                                                    cmpIsRoot: cmp === window.__instance,
                                                                    ev
                                                                });
                                                            }
                                                        }]
                                                    }
                                                ]
                                            }
                                        },
                                        props: { if: { prop: true } },
                                        providers: [IfDirective]
                                    }
                                ]
                            }
                        },
                        props: { forOf: { prop: 'rows' } },
                        providers: [ForDirective]
                    }
                ]
            }
        ], {});

        await mount(TestRoot, 'app-root');
        await new Promise(r => setTimeout(r, 60));

        assert.deepEqual(
            window.__calls.map(c => [c.rowLabel, c.cmpIsRoot]),
            [['A', true], ['B', true]],
            'each row\'s if-child-emitter event must resolve that row\'s own label, not undefined/null'
        );
    });
});
