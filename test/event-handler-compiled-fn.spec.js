import assert from 'node:assert/strict';
import { EventHandler } from '../packages/core/src/dom/event.handler.js';

/**
 * Direct-source unit test (bypasses dist/ entirely - see this session's
 * notes on the pre-existing, unrelated compiler-cli/source incompatibility
 * that currently breaks a full `dist` rebuild) for the compiledFn dispatch
 * branch added to `triggerEvents` in event.handler.js: when jeli-cli
 * statically compiled an event's assignment (compileAssignmentToJs), the
 * compiled function must run instead of the interpreter
 * (_executeEventsTriggers/parseObjectExpression), and must receive the same
 * (context, componentInstance, event) triple the interpreter path uses.
 */
function makeElement({ context, componentInstance, events }) {
    return {
        context,
        hostRef: { componentInstance },
        changeDetector: { detectChanges() {} },
        events: { _events: events }
    };
}

describe('EventHandler.handleEvent - compiledFn dispatch', () => {
    it('calls compiledFn(context, componentInstance, event) instead of the interpreter when present', () => {
        const componentInstance = { selectedHook: null };
        // exact shape of a real *for row's context: Object.create(componentInstance)
        const rowContext = Object.create(componentInstance);
        rowContext.hook = { value: 'circles' };

        let calledWith = null;
        const element = makeElement({
            context: rowContext,
            componentInstance,
            events: [{
                name: 'click',
                // deliberately wrong interpreter fallback - proves it did NOT run
                value: [{ left: 'selectedHook', right: 'WRONG', asg: true }],
                compiledFn(ctx, cmp, ev) {
                    calledWith = [ctx, cmp, ev];
                    cmp.selectedHook = ctx.hook.value;
                }
            }]
        });

        const fakeDomEvent = { type: 'click' };
        EventHandler.handleEvent(element, fakeDomEvent);

        assert.equal(componentInstance.selectedHook, 'circles', 'compiledFn must write to the real component instance');
        assert.equal(calledWith[0], rowContext, 'compiledFn must receive the row context as $ctx');
        assert.equal(calledWith[1], componentInstance, 'compiledFn must receive the component instance as $cmp');
        assert.equal(calledWith[2], fakeDomEvent, 'compiledFn must receive the native event as $event');
    });

    // The interpreter path itself (_executeEventsTriggers/parseObjectExpression)
    // relies on bare cross-file identifiers (generateArguments,
    // parseObjectExpression - both defined in interpolation.js) that only
    // resolve once jeli-cli's bundler flattens every @jeli/core source file
    // into one shared scope (same class of thing mount.mjs's own comments
    // document for isfunction/moveItemInArray) - not reachable importing
    // this one file directly. That path, and that it still runs untouched
    // when compiledFn is absent, is covered end-to-end (real DOM click,
    // real *for-row-shaped context) by for-row-click-assignment.spec.js's
    // "interpreter path (no compiledFn)" case instead.

    it('does not invoke compiledFn for a non-matching event name', () => {
        const componentInstance = {};
        let compiledFnCalled = false;
        const element = makeElement({
            context: componentInstance,
            componentInstance,
            events: [{
                name: 'dblclick',
                value: [],
                compiledFn() { compiledFnCalled = true; }
            }]
        });

        EventHandler.handleEvent(element, { type: 'click' });

        assert.equal(compiledFnCalled, false);
    });
});

describe('EventHandler.attachEventEmitter - compiledFn dispatch', () => {
    it('calls compiledFn instead of the interpreter when a child component\'s @Output emitter fires', () => {
        // a *for row inside a component that also has @onSave="saved=true" -
        // registeredEvent.value alone would silently stop this from firing
        // once .value is dropped in the compiled case, so this path must
        // check .compiledFn on its own, same as handleEvent's triggerEvents
        const grandComponentInstance = { saved: false };
        const rowContext = Object.create(grandComponentInstance);
        rowContext.item = { id: 42 };

        let calledWith = null;
        const parentElement = {
            isc: true,
            componentInstance: grandComponentInstance,
            changeDetector: { detectChanges() {} }
        };
        const element = {
            hasContext: true,
            context: rowContext,
            parent: parentElement,
            events: {
                _events: [{
                    name: 'onSave',
                    compiledFn(ctx, cmp, ev) {
                        calledWith = [ctx, cmp, ev];
                        cmp.saved = true;
                    }
                }],
                registeredEvents: new Map()
            }
        };

        let subscribedFn = null;
        const childComponentInstance = {
            onSave: { subscribe(fn) { subscribedFn = fn; return () => {}; } }
        };

        EventHandler.attachEventEmitter(element, 'onSave', childComponentInstance);
        subscribedFn('emitted-value');

        assert.equal(grandComponentInstance.saved, true, 'compiledFn must run and write to the real component instance');
        assert.equal(calledWith[0], rowContext);
        assert.equal(calledWith[1], grandComponentInstance);
        assert.equal(calledWith[2], 'emitted-value');
    });
});

describe('EventHandler.attachEventDispatcher - compiledFn dispatch', () => {
    it('calls compiledFn instead of the interpreter for a dispatcher-bound event', () => {
        const componentInstance = { flag: false };
        const rowContext = Object.create(componentInstance);

        let subscribedFn = null;
        rowContext.valueChange = { subscribe(fn) { subscribedFn = fn; return () => {}; } };

        const element = {
            isc: false,
            context: rowContext,
            changeDetector: { detectChanges() {} },
            events: {
                _events: [{
                    name: 'valueChange',
                    compiledFn(ctx, cmp, ev) { cmp.flag = ev; }
                }],
                registeredEvents: new Map()
            }
        };

        EventHandler.attachEventDispatcher(element, 'valueChange', componentInstance);
        subscribedFn(true);

        assert.equal(componentInstance.flag, true, 'compiledFn must run for a dispatcher-bound event too');
    });
});
