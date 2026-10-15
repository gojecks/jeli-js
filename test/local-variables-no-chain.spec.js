import assert from 'node:assert/strict';
import { createLocalVariables, SCOPE_PARENT } from '../packages/core/src/dom/renderer/utils.js';
import { resolveIdentifier } from '../packages/core/src/dom/interpolation.js';

/**
 * Direct-source import (bypasses dist/ - see this session's notes on the
 * pre-existing, unrelated compiler-cli/dist incompatibility). Safe here:
 * every localVariables definition below is a function (writeCompiledPropertyBinding's
 * branch), which never touches the bare cross-file `evaluateExpression`
 * identifier writePropertyBinding's branch relies on.
 */

/**
 * Root-cause fix, final form: createLocalVariables never does
 * `Object.create(parentContext)` (a live prototype link to componentInstance
 * in the common non-nested case - what let a *for row's own
 * `selectedHook=hook.value` shadow-write onto the row) NOR copies an
 * ancestor scope's bindings onto every descendant (which duplicated work at
 * every nesting level and gave the COMPILED write-target codegen nothing to
 * walk when a *for was nested more than one level deep - jeli-cli's
 * getScopeNames tracks exact ancestor depth now, and compileAssignmentToJs
 * emits that many explicit `[core.SCOPE_PARENT]` hops).
 *
 * Instead: a row's context holds ONLY its own local variables as own
 * properties, plus (when nested) a single EXPLICIT reference to its
 * immediate parent scope under the SCOPE_PARENT symbol - never a copy,
 * never a prototype link, never anything from componentInstance.
 * resolveIdentifier walks this reference chain dynamically for the
 * interpreter (which has no compile-time scope info); jeli-cli's compiled
 * output walks the exact same chain, but with the hop count already known
 * at compile time.
 */
describe('createLocalVariables - explicit parent reference, no chain to componentInstance', () => {
    it('a row context has Object.prototype as its prototype, never componentInstance', () => {
        const componentInstance = { selectedHook: null };
        const rowContext = createLocalVariables(
            { hook: () => ({ value: 'circles' }) },
            {},
            componentInstance
        );

        assert.equal(Object.getPrototypeOf(rowContext), Object.prototype,
            'the row context must not be Object.create(componentInstance) - no prototype link to the component at all');
        assert.equal('selectedHook' in rowContext, false,
            'a real component property must not be reachable through the row context by any means');
        assert.equal(rowContext[SCOPE_PARENT], undefined,
            'a top-level (non-nested) *for row must have no SCOPE_PARENT at all - componentInstance is never linked, not even via the parent reference');
    });

    it('a nested row holds an EXPLICIT reference to its parent scope, not a copy of its bindings', () => {
        const outerContext = createLocalVariables({
            tdata: () => ({ _id: 1, name: 'row-item' })
        }, {}, null);

        const innerContext = createLocalVariables({
            col: () => ({ name: 'email' })
        }, {}, outerContext);

        assert.equal(Object.getPrototypeOf(innerContext), Object.prototype);
        assert.equal(innerContext[SCOPE_PARENT], outerContext,
            'must be the exact same outer scope object by reference, not a copy of it');
        assert.equal(Object.prototype.hasOwnProperty.call(innerContext, 'tdata'), false,
            'the outer scope\'s variable must NOT be copied onto the inner scope as an own property - only reachable by walking SCOPE_PARENT');

        // resolveIdentifier still finds it, by walking the explicit reference
        const col = resolveIdentifier('col', innerContext, {});
        const tdata = resolveIdentifier('tdata', innerContext, {});
        assert.equal(col && col.name, 'email');
        assert.equal(tdata && tdata.name, 'row-item',
            'an ancestor scope\'s variable must still resolve, via SCOPE_PARENT, exactly like a real JS closure would');
    });

    it('a nested scope still does not leak componentInstance, even through SCOPE_PARENT', () => {
        const componentInstance = { secret: 'do-not-leak' };
        const outerContext = createLocalVariables({ row: () => ({ id: 1 }) }, {}, componentInstance);
        const innerContext = createLocalVariables({ col: () => ({ id: 2 }) }, {}, outerContext);

        assert.equal(outerContext[SCOPE_PARENT], undefined,
            'the outer row\'s parent IS componentInstance, which is never tagged, so no SCOPE_PARENT gets set for it either');
        assert.equal('secret' in outerContext, false);
        assert.equal('secret' in innerContext, false);
        assert.equal(resolveIdentifier('secret', innerContext, componentInstance), 'do-not-leak',
            'componentInstance properties still resolve normally - via the explicit componentInstance parameter, never via the scope chain');
    });

    it('resolveIdentifier walks multiple SCOPE_PARENT hops for a doubly-nested scope', () => {
        const grandparentContext = createLocalVariables({ a: () => 'A' }, {}, null);
        const parentContext = createLocalVariables({ b: () => 'B' }, {}, grandparentContext);
        const childContext = createLocalVariables({ c: () => 'C' }, {}, parentContext);

        assert.equal(childContext[SCOPE_PARENT], parentContext);
        assert.equal(parentContext[SCOPE_PARENT], grandparentContext);
        assert.equal(resolveIdentifier('a', childContext, {}), 'A');
        assert.equal(resolveIdentifier('b', childContext, {}), 'B');
        assert.equal(resolveIdentifier('c', childContext, {}), 'C');
    });
});
