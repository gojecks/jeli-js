import './setup-dom.mjs';
import { core } from './mount.mjs';

// Not a mocha spec - a standalone timing probe. Tests whether the *for
// diff engine's move-tracking (for.js's IterableProfiler, see its own
// header comment: "not a full O(n log n) worst-case guarantee") shows
// super-linear cost on a full-reverse reorder (worst case: every item's
// move distance is ~n), independent of any DOM/render cost.
function timeReverse(n) {
    const source = Array.from({ length: n }, (_, i) => ({ id: i }));
    const profiler = new core.IterableProfiler('id');
    profiler.diff(source); // seed cacheHash with the initial order

    const reversed = source.slice().reverse();
    const start = process.hrtime.bigint();
    profiler.diff(reversed);
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(`n=${n.toString().padStart(6)}  full-reverse diff: ${ms.toFixed(3)}ms  (${(ms / n).toFixed(5)}ms/item)`);
    return ms;
}

console.log('--- IterableProfiler full-reverse cost by list size ---');
[100, 500, 1000, 2000, 4000, 8000].forEach(timeReverse);
