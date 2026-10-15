import assert from 'node:assert/strict';
import { core } from './support/mount.mjs';

// Regression test for a nested *for scoping bug (e.g. `<td *for="col of
// formData.columns">` inside `<tr *for="tdata of rows">` couldn't see
// `tdata`) - originally fixed by chaining createLocalVariables' context
// onto its parent via Object.create instead of a disconnected {}; that
// chaining was later replaced (see local-variables-no-chain.spec.js) with
// copying the parent scope's own bindings as real properties instead, since
// the live prototype link was also what let a *for row's own assignment
// shadow-write onto the row instead of the real component. This test still
// protects the original nested-scope behavior, just via the new mechanism.
describe('nested structural-directive scope chain', () => {
    it('own local variable (col) resolves from the inner context', () => {
        const outerContext = core.createLocalVariables({
            tdata: () => ({ _id: 1, name: 'row-item' })
        }, {}, null);

        const innerContext = core.createLocalVariables({
            col: () => ({ name: 'email' })
        }, {}, outerContext);

        const col = core.resolveIdentifier('col', innerContext, {});
        assert.equal(col && col.name, 'email', 'inner loop variable must resolve from its own context');
    });

    it('outer loop variable (tdata) resolves from a nested inner context', () => {
        const outerContext = core.createLocalVariables({
            tdata: () => ({ _id: 1, name: 'row-item' })
        }, {}, null);

        const innerContext = core.createLocalVariables({
            col: () => ({ name: 'email' })
        }, {}, outerContext);

        const tdata = core.resolveIdentifier('tdata', innerContext, {});
        assert.equal(tdata && tdata.name, 'row-item',
            'outer loop variable should resolve through the context chain, same as a real JS closure would');
    });
});
