import { isfunction, isstring } from '@jeli/helpers';

// unique sentinel hash - guaranteed never to collide with a real trackBy
// result (even a pathological custom trackBy returning `null`/`undefined`)
var TAIL_SENTINEL = Symbol('iterable-profiler-tail');

function DiffNode(hash) {
    this.hash = hash;
    this.prev = null;
    this.next = null;
}

function unlinkNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
}

function insertNodeBefore(node, ref) {
    node.prev = ref.prev;
    node.next = ref;
    ref.prev.next = node;
    ref.prev = node;
}

/**
 * IterableProfiler
 * Compare Two Objects or Array<Objects>
 *
 * @param {*} source
 * @param {*} cache
 *
 * Dependency : HashCode Generator
 * Dependency : expect
 */
export class IterableProfiler {
    _destroyed = false;
    _typeError = false;
    cacheHash = [];
    out = null;
    _trackBy = null;

    constructor(trackBy) {
        this._trackBy = trackBy;
    }

    trackBy(item, index) {
        if (this._trackBy){
            if (isfunction(this._trackBy)){
                return this._trackBy(item, index);
            } else if (isstring(this._trackBy)){
                return item[this._trackBy];
            }
        }
        return item || index;
    }

    diff(source) {
        if (this._destroyed) return false;
        if (source && !(source instanceof Array)) {
            if (!this._typeError) {
                this._typeError = true;
                return errorBuilder(new TypeError('Collection should be an array'));
            }

            return false;
        }


        /**
         * reset caches
         */
        this.out = {
            deleted: [],
            order: []
        };
        this._typeError = false;

        var noSource = (!source || !source.length);
        if (noSource && (!this.cacheHash || !this.cacheHash.length)) {
            return false;
        }

        /**
         * source is empty and cacheHash exists - clear everything.
         * Reported in descending order: forEachDeleted below applies these
         * one at a time via a real splice-shrinking removal (matching
         * ViewRef.remove()), which is only safe to do sequentially from
         * the highest index down - removing low-to-high invalidates every
         * later index in the same batch.
         */
        if (noSource && this.cacheHash.length) {
            for (var d = this.cacheHash.length - 1; d >= 0; d--) {
                this.out.deleted.push(d);
            }
            this.cacheHash.length = 0;
            return true;
        }

        var len = source.length;

        /**
         * build this render's hash list once, checking for duplicate
         * trackBy hashes as we go (a duplicate would otherwise make the
         * lookups below ambiguous - they only ever resolve to the *first*
         * matching index)
         */
        var seenHashes = new Set();
        var newHash = new Array(len);
        var newHashIndex = new Map();
        for (var idx = 0; idx < len; idx++) {
            var hash = this.trackBy(source[idx], idx);
            this.checkDuplicateRepeater(hash, seenHashes);
            seenHashes.add(hash);
            newHash[idx] = hash;
            newHashIndex.set(hash, idx);
        }

        /**
         * Phase 1 - deletes: any old position whose hash doesn't survive
         * into the new array. `working` becomes the old survivors in
         * their original relative order - i.e. exactly the state
         * for.js's ViewRef is left in once forEachDeleted has applied
         * `deleted` (all deletes are applied *before* any create/move,
         * see for.js:_listenerFn), so phase 2 below can simulate from
         * here directly. Deletes are reported descending for the same
         * sequential-removal-safety reason as the clear-all case above.
         */
        var oldHash = this.cacheHash;
        var deleted = [];
        var working = [];
        for (var oi = 0; oi < oldHash.length; oi++) {
            if (newHashIndex.has(oldHash[oi])) {
                working.push(oldHash[oi]);
            } else {
                deleted.push(oi);
            }
        }
        deleted.sort(function (a, b) { return b - a; });
        this.out.deleted = deleted;

        /**
         * Phase 2 - creates/moves: transform `working` into `newHash`
         * left to right, one position at a time, *simulating* each
         * decision against a doubly-linked list representation of the
         * evolving sequence rather than a plain array - this is what
         * makes the reported operations correct when for.js applies them
         * in this same sequential order, not just individually plausible
         * (for.js's own ViewRef.move(prevIndex, index) mutates its view
         * array in lockstep, so `prevIndex` must be a live position in
         * the same evolving sequence, not a stable pre-diff snapshot -
         * confirmed by tracing for.js:_listenerFn's 'move' case).
         *
         * Using a linked list instead of the array this replaced avoids
         * the O(distance) array-shift cost `moveItemInArray`/`splice`
         * paid on every single move/create (unlink+relink is O(1)
         * regardless of how far a node moves), and the walk needed to
         * report a moved node's live positional `prevIndex` only ever
         * scans the remaining *unprocessed* tail (never the
         * already-finalized head - once a position is finalized here it
         * is provably never revisited, since duplicate hashes are
         * already excluded above), rather than rescanning the whole
         * array from position 0 on every iteration the way the previous
         * `indexOf`-based implementation did. This is not a full
         * O(n log n) worst-case guarantee - that needs an
         * order-statistics tree (each node tracking its own rank), a
         * materially larger and riskier data structure for a directive
         * this load-bearing - but it's a real, unconditional
         * improvement: the shift cost is gone entirely, and the common
         * case (nearby moves - the overwhelming majority of real
         * list-reorder patterns) is now bounded by the actual move
         * distance, not the full remaining sequence length.
         *
         * (Note: unlike the previous implementation, this doesn't special
         * case an in-place "update" when a position's old occupant is
         * being fully replaced by an unrelated new hash - that position
         * is now reported as a plain create. A deliberate simplification,
         * not a correctness issue: it costs one extra DOM create+destroy
         * in that specific scenario instead of reusing the view in place.)
         */
        var tail = new DiffNode(TAIL_SENTINEL);
        tail.next = tail;
        tail.prev = tail;

        var nodeByHash = new Map();
        var prevNode = tail;
        for (var wi = 0; wi < working.length; wi++) {
            var wNode = new DiffNode(working[wi]);
            nodeByHash.set(working[wi], wNode);
            wNode.prev = prevNode;
            prevNode.next = wNode;
            prevNode = wNode;
        }
        prevNode.next = tail;
        tail.prev = prevNode;

        var operationOrder = [];
        var isDirty = deleted.length > 0;
        var cursor = tail.next; // node currently at position `i`
        for (var i = 0; i < len; i++) {
            var h = newHash[i];
            if (cursor.hash === h) {
                cursor = cursor.next;
                continue;
            }

            var target = nodeByHash.get(h);
            if (target) {
                var prevIndex = i;
                var scan = cursor;
                while (scan !== target) {
                    prevIndex++;
                    scan = scan.next;
                }

                unlinkNode(target);
                insertNodeBefore(target, cursor);
                operationOrder.push({ index: i, prevIndex: prevIndex, state: 'move' });
            } else {
                var created = new DiffNode(h);
                nodeByHash.set(h, created);
                insertNodeBefore(created, cursor);
                operationOrder.push({ index: i, state: 'create' });
            }
            isDirty = true;
        }

        this.out.order = operationOrder;
        this.cacheHash = newHash;

        return isDirty;
    }
    forEachDeleted(callback) {
        this.out.deleted.forEach(callback);
    }
    forEachOperation(callback) {
        var len = this.out.order.length;
        for (var i = 0; i < len; i++) {
            if (this.out.order[i]) {
                callback(this.out.order[i], i);
            }
        }
    }
    /**
     * @param {*} hash - this item's trackBy result
     * @param {Set} seenHashes - hashes already seen earlier in *this* diff
     *   pass (not the previous render's cacheHash - checking against that
     *   would misfire on the ordinary case of the same item persisting
     *   across renders)
     */
    checkDuplicateRepeater(hash, seenHashes) {
        if (seenHashes.has(hash)) {
            errorBuilder("Duplicate values are not allowed in repeaters. Use 'track by' expression to specify unique keys");
        }
    }

    attachTrackBy(trackBy) {
        this._trackBy = trackBy;
    }

    destroy() {
        this._destroyed = true;
        this.cacheHash.length = 0;
        this.out = null;
    }
}