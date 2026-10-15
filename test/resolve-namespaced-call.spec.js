import assert from 'node:assert/strict';
import { resolveNamespacedCall } from '../packages/core/src/dom/interpolation.js';

/**
 * Extracted from parseObjectExpression's `call` handler's namespaced branch
 * (a.b.fn(args)) so jeli-cli's compiled path (compileValueToJs's `call`
 * case, for a statically-known namespace) can call the exact same logic
 * instead of a hand-duplicated copy - same reason resolveIdentifier/
 * resolveCall were already extracted for the bare-identifier/bare-call
 * cases. Direct-source import works cleanly here since resolveContext
 * (which this calls) is private to this same file, not a cross-file bare
 * identifier the way generateArguments/parseObjectExpression are for
 * event.handler.js.
 *
 * resolveContext's actual reduce (interpolation.js:363-376) only consults
 * componentInstance for the FIRST namespace segment (`componentEntry = idx
 * ? null : componentInstance`) - every segment after that resolves against
 * whatever the previous segment produced, with no componentInstance
 * fallback at all. That's the specific ambiguity this suite pins down, not
 * just "it can find a nested function."
 */
describe('resolveNamespacedCall', () => {
    it('resolves the namespace against context first, then componentInstance, and calls with that as `this`', () => {
        const a = { b: { fn(x) { return this === a.b ? `got:${x}` : 'wrong-this'; } } };
        const context = { a };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [42], context, {});
        assert.equal(result, 'got:42');
    });

    it('falls through to componentInstance for the ROOT segment when context does not own it, and calls with componentInstance\'s object as `this`', () => {
        let thisArg = null;
        const a = { b: { fn() { thisArg = this; return 'from-component'; } } };
        const componentInstance = { a };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], {}, componentInstance);
        assert.equal(result, 'from-component');
        assert.equal(thisArg, componentInstance.a.b, '`this` must be the resolved a.b object, not componentInstance itself');
    });

    it('ambiguity: when the ROOT segment exists on both context and componentInstance, context wins', () => {
        const contextA = { b: { fn: () => 'from-context' } };
        const componentA = { b: { fn: () => 'from-component' } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], { a: contextA }, { a: componentA });
        assert.equal(result, 'from-context', 'context must take precedence over componentInstance for the root segment, same rule resolveCall/resolveIdentifier use');
    });

    it('ambiguity: a NON-root segment never falls back to componentInstance, even if componentInstance would have it', () => {
        // context.a exists but has no `.b` - componentInstance.a.b does exist,
        // but componentInstance is only ever consulted for the ROOT segment
        const context = { a: {} };
        const componentInstance = { a: { b: { fn: () => 'should-not-be-reached' } } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], context, componentInstance);
        assert.equal(result, null, 'the second segment must resolve against the first segment\'s own result only, never against componentInstance');
    });

    it('resolves a deeper (3-segment) namespace correctly, still rooted against context/componentInstance only once', () => {
        const context = { a: { b: { c: { fn: (x, y) => x + y } } } };
        const result = resolveNamespacedCall(['a', 'b', 'c'], 'fn', [2, 3], context, {});
        assert.equal(result, 5);
    });

    it('returns null (does not throw) when the root segment is entirely missing', () => {
        const result = resolveNamespacedCall(['missing', 'deeper'], 'fn', [], {}, {});
        assert.equal(result, null);
    });

    it('returns null (does not throw) when an INTERMEDIATE segment resolves to null mid-chain', () => {
        const context = { a: null };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], context, {});
        assert.equal(result, null);
    });

    it('returns null (does not throw) when an INTERMEDIATE segment resolves to undefined mid-chain', () => {
        const context = { a: { b: undefined } };
        const result = resolveNamespacedCall(['a', 'b', 'c'], 'fn', [], context, {});
        assert.equal(result, null);
    });

    it('returns null (does not throw) when the resolved property is not a function', () => {
        const context = { a: { b: { fn: 'not-a-function' } } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], context, {});
        assert.equal(result, null);
    });

    it('returns null (does not throw) when the resolved property is a non-function value inherited via the prototype chain', () => {
        function Base() {}
        Base.prototype.fn = 'not-a-function';
        const context = { a: { b: new Base() } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], context, {});
        assert.equal(result, null);
    });

    it('dispatches a method found only via the prototype chain (not an own property)', () => {
        function Base() {}
        Base.prototype.fn = function (x) { return `proto:${x}:${this === instance}`; };
        const instance = new Base();
        const context = { a: { b: instance } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [7], context, {});
        assert.equal(result, 'proto:7:true');
    });

    it('preserves a falsy-but-valid resolved namespace target (0) without treating it as missing', () => {
        // Number.prototype has no `fn`, so this legitimately resolves to
        // null - proves the falsy target itself didn't short-circuit early
        const context = { a: { b: 0 } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], context, {});
        assert.equal(result, null);
    });

    it('passes multiple arguments through, in order, via apply', () => {
        const context = { a: { b: { fn: (...args) => args.join(',') } } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [1, 'two', 3], context, {});
        assert.equal(result, '1,two,3');
    });

    it('passes an empty args array through as zero arguments', () => {
        const context = { a: { b: { fn: (...args) => args.length } } };
        const result = resolveNamespacedCall(['a', 'b'], 'fn', [], context, {});
        assert.equal(result, 0);
    });
});
