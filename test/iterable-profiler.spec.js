import assert from 'node:assert/strict';
import { core } from './support/mount.mjs';

/**
 * IterableProfiler (packages/core/src/providers/iterable_profiler.js) is
 * *for*'s diff engine - not exported from @jeli/core's public.api.js, but
 * reachable off the UMD namespace anyway (see the "same-package flattened
 * scope" note elsewhere in this repo's docs).
 *
 * These tests assert on the *contract* for.js actually depends on, not on
 * internal bookkeeping details, so they stay valid across an internal
 * rewrite (e.g. swapping the array+splice implementation for a
 * linked-list one): after diff(source), cacheHash must always converge to
 * source's hash sequence, and applying the reported deleted/order
 * operations against a plain working copy (the same way for.js's
 * _listenerFn applies them against a real ViewRef) must reproduce that
 * same sequence.
 */
const { IterableProfiler } = core;

// Mirrors for.js's _listenerFn consumption exactly: all deletes first (by
// index, applied in the order reported), then order entries in sequence
// (create = insert at index, move = relocate from prevIndex to index,
// update = no positional change).
function applyDiff(profiler, working) {
    profiler.forEachDeleted((index) => {
        working.splice(index, 1);
    });
    profiler.forEachOperation((op) => {
        if (op.state === 'create') {
            working.splice(op.index, 0, profiler.cacheHash[op.index]);
        } else if (op.state === 'move') {
            const [item] = working.splice(op.prevIndex, 1);
            working.splice(op.index, 0, item);
        }
    });
    return working;
}

function diffAndVerify(profiler, working, source) {
    const before = working.slice();
    // cacheHash/working both store trackBy *hashes*, not raw source items -
    // for the primitive-array tests these are the same thing, but for the
    // object+custom-trackBy tests they're not (e.g. trackBy = item => item.id)
    const expectedHashes = source.map((item, i) => profiler.trackBy(item, i));
    const changed = profiler.diff(source);
    if (changed) {
        applyDiff(profiler, working);
    }
    assert.deepEqual(profiler.cacheHash, expectedHashes, `cacheHash must converge to the new source's hashes (from ${JSON.stringify(before)} -> ${JSON.stringify(expectedHashes)})`);
    assert.deepEqual(working, expectedHashes, `applying reported deleted/order ops must reproduce the new source's hashes (from ${JSON.stringify(before)} -> ${JSON.stringify(expectedHashes)})`);
    return changed;
}

describe('IterableProfiler (*for diff engine)', () => {
    it('initial population is all creates', () => {
        const p = new IterableProfiler();
        const working = [];
        const changed = diffAndVerify(p, working, ['a', 'b', 'c']);
        assert.equal(changed, true);
    });

    it('re-diffing an unchanged array reports no change', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        const changed = diffAndVerify(p, working, ['a', 'b', 'c']);
        assert.equal(changed, false);
    });

    it('append at the end', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b']);
        diffAndVerify(p, working, ['a', 'b', 'c']);
    });

    it('prepend at the start', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['b', 'c']);
        diffAndVerify(p, working, ['a', 'b', 'c']);
    });

    it('insert in the middle', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'c']);
        diffAndVerify(p, working, ['a', 'b', 'c']);
    });

    it('delete from the middle', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        diffAndVerify(p, working, ['a', 'c']);
    });

    it('delete from the end', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        diffAndVerify(p, working, ['a', 'b']);
    });

    it('delete from the start', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        diffAndVerify(p, working, ['b', 'c']);
    });

    it('swap two adjacent items', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        diffAndVerify(p, working, ['b', 'a', 'c']);
    });

    it('move the first item to the end', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        diffAndVerify(p, working, ['b', 'c', 'a']);
    });

    it('move the last item to the start', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        diffAndVerify(p, working, ['c', 'a', 'b']);
    });

    it('full reverse of a longer list', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c', 'd', 'e']);
        diffAndVerify(p, working, ['e', 'd', 'c', 'b', 'a']);
    });

    it('mixed create + delete + move in one diff', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c', 'd']);
        diffAndVerify(p, working, ['d', 'x', 'b']);
    });

    it('clear all items', () => {
        const p = new IterableProfiler();
        const working = [];
        diffAndVerify(p, working, ['a', 'b', 'c']);
        const changed = diffAndVerify(p, working, []);
        assert.equal(changed, true);
        assert.deepEqual(p.cacheHash, []);
    });

    it('diffing two empty arrays reports no change', () => {
        const p = new IterableProfiler();
        const changed = p.diff([]);
        assert.equal(changed, false);
    });

    it('supports a custom trackBy function keyed on object identity', () => {
        const p = new IterableProfiler((item) => item.id);
        const working = [];
        const a = { id: 1, label: 'A' };
        const b = { id: 2, label: 'B' };
        diffAndVerify(p, working, [a, b]);

        // same identity (by id) and same position - the differ tracks hash
        // identity/position only, not deep content, so a content-only
        // change on an otherwise-stable id is correctly *not* reported as
        // a positional change (matches Angular's NgForOf/trackBy semantics)
        const bUpdated = { id: 2, label: 'B-changed' };
        const changed = p.diff([a, bUpdated]);
        assert.equal(changed, false, 'a content-only change on a still-present id/position is not a positional diff');
        assert.deepEqual(p.cacheHash, [1, 2]);
    });

    it('supports a trackBy given as a string property name', () => {
        const p = new IterableProfiler('id');
        const working = [];
        diffAndVerify(p, working, [{ id: 'x' }, { id: 'y' }]);
        assert.deepEqual(p.cacheHash, ['x', 'y']);
    });

    it('a duplicate trackBy hash within one diff pass is reported via errorBuilder, not silently corrupted', () => {
        const originalError = console.error;
        let warned = false;
        console.error = () => { warned = true; };
        try {
            const p = new IterableProfiler();
            p.diff(['x', 'x', 'y']);
            assert.equal(warned, true);
        } finally {
            console.error = originalError;
        }
    });

    it('re-diffing the same array across renders does not falsely report a duplicate', () => {
        const originalError = console.error;
        let warned = false;
        console.error = () => { warned = true; };
        try {
            const p = new IterableProfiler();
            p.diff(['a', 'b']);
            p.diff(['a', 'b']);
            assert.equal(warned, false, 'the same item persisting across two diff() calls is not a duplicate');
        } finally {
            console.error = originalError;
        }
    });

    it('a non-array source is reported via errorBuilder and treated as no change', () => {
        const originalError = console.error;
        let warned = false;
        console.error = () => { warned = true; };
        try {
            const p = new IterableProfiler();
            const changed = p.diff({ not: 'an array' });
            assert.equal(warned, true);
            assert.equal(changed, undefined);
        } finally {
            console.error = originalError;
        }
    });

    it('destroy() makes every subsequent diff a no-op', () => {
        const p = new IterableProfiler();
        p.diff(['a', 'b']);
        p.destroy();
        const changed = p.diff(['a', 'b', 'c']);
        assert.equal(changed, false);
    });
});
