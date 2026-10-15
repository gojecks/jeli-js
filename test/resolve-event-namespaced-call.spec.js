import assert from 'node:assert/strict';
import { resolveEventNamespacedCall } from '../packages/core/src/dom/interpolation.js';

/**
 * Runtime counterpart to jeli-cli's compileValueToJs's $event-rooted
 * namespaced-call branch (`$event.stopPropagation()`,
 * `$event.target.closest(sel)`). Mirrors (does not share code with, since
 * event.handler.js's `_dispatch` is a messier place to extract from safely)
 * `_dispatch`'s one-off `event.namespaces[0] === '$event'` special case,
 * but resolves purely against the real event object - never
 * context/componentInstance, unlike `resolveNamespacedCall`.
 */
describe('resolveEventNamespacedCall', () => {
    it('calls a method directly on the event when remainingNamespaces is empty ($event.stopPropagation())', () => {
        let called = false;
        const event = { stopPropagation() { called = true; } };
        const result = resolveEventNamespacedCall([], 'stopPropagation', [], event);
        assert.equal(called, true);
        assert.equal(result, undefined);
    });

    it('walks remaining namespace segments as plain properties of the event ($event.target.closest(sel))', () => {
        let thisArg = null;
        let calledWith = null;
        const target = { closest(sel) { thisArg = this; calledWith = sel; return 'matched-element'; } };
        const event = { target };
        const result = resolveEventNamespacedCall(['target'], 'closest', ['.row'], event);
        assert.equal(result, 'matched-element');
        assert.equal(thisArg, target, '`this` must be the resolved event.target, not the event itself');
        assert.equal(calledWith, '.row');
    });

    it('resolves a deeper chain off the event', () => {
        const event = { detail: { originalEvent: { fn: (x) => `got:${x}` } } };
        const result = resolveEventNamespacedCall(['detail', 'originalEvent'], 'fn', [7], event);
        assert.equal(result, 'got:7');
    });

    it('returns null (does not throw) when an intermediate segment is missing', () => {
        const event = {};
        const result = resolveEventNamespacedCall(['target'], 'closest', [], event);
        assert.equal(result, null);
    });

    it('returns null (does not throw) when the resolved property is not a function', () => {
        const event = { target: { closest: 'not-a-function' } };
        const result = resolveEventNamespacedCall(['target'], 'closest', [], event);
        assert.equal(result, null);
    });

    it('returns null (does not throw) when the event itself is null/undefined', () => {
        assert.equal(resolveEventNamespacedCall([], 'stopPropagation', [], null), null);
        assert.equal(resolveEventNamespacedCall(['target'], 'closest', [], undefined), null);
    });

    it('passes multiple arguments through in order', () => {
        const event = { target: { fn: (...args) => args.join(',') } };
        const result = resolveEventNamespacedCall(['target'], 'fn', [1, 'two', 3], event);
        assert.equal(result, '1,two,3');
    });
});
