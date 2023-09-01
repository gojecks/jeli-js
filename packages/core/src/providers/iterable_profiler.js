import { isfunction } from '@jeli/helpers';
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
export function IterableProfiler(trackBy) {
    this._destroyed = false;
    this._typeError = false;
    this.cacheHash = [];
    this.out = null;
    this.trackBy = trackBy || function(item, index) {
        return item || index;
    };
}

IterableProfiler.prototype.diff = function(source) {
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
     * source is empty and cacheHash exists
     * empty cacheHash and return deleted keys
     */
    if (noSource && this.cacheHash.length) {
        this.out.deleted = Object.keys(this.cacheHash).map(Number);
        this.cacheHash.length = 0;
        return true;
    }

    var len = source.length;
    var totalCacheItem = this.cacheHash.length;
    var newCacheHash = new Array(source.length).fill('-').map((_, idx) => this.trackBy(source[idx], idx));
    var operationOrder = [];
    var isDirty = false;
    for (var inc = 0; inc < len; inc++) {
        var prevIndex = this.cacheHash.indexOf(newCacheHash[inc]);
        var cacheHashIndex = newCacheHash.indexOf(this.cacheHash[inc]);
        var existsInCache = prevIndex > -1;
        var cacheIndexExistsInSource = cacheHashIndex > -1;
        var outOfCacheRange = (inc > totalCacheItem - 1);
        /**
         * find the hash in the cacheHash
         * if hash exists means the object was moved to different index
         * assign to new position
         */
        if (existsInCache) {
            /**
             * check if currentIndex is > prevIndex
             * eg: [a,b] => [a,c,b]
             * true: new Data was added in previous index to the collection
             * false: we move the item to correct index
             */
            if (prevIndex !== inc) {
                isDirty = true;
                if (!cacheIndexExistsInSource) {
                    // push the index for deletion
                    // remove the element from cacheHash
                    if (!outOfCacheRange) {
                        this.cacheHash.splice(inc, 1);
                        totalCacheItem--;
                        this.out.deleted.push(inc);
                    }
                } else {
                    var prev = operationOrder[operationOrder.length-1];
                    if (prev && prev.state == 'move' && [prev.index, prev.prevIndex].includes(prevIndex)) {
                        continue;
                    }

                    operationOrder.push({
                        index: inc,
                        prevIndex: prevIndex,
                        state: "move"
                    });
                }
            }
        }
        // item doesn't exist in cache but the current cache item at index exists in source
        // create a move record
        else {
            isDirty = true;
            // push to cacheHash
            var isCreateMode = (outOfCacheRange || cacheIndexExistsInSource);
            if (isCreateMode) {
                this.cacheHash.splice(inc, 0, newCacheHash[inc]);
                totalCacheItem++;
            }

            operationOrder.push({
                index: inc,
                state: (isCreateMode ? 'create' : 'update')
            });
        }
    }

    /**
     * Check if cacheHash > newCacheHash
     */
    if (totalCacheItem > len) {
        for (var i = len; i < totalCacheItem; i++) {
            isDirty = true;
            this.out.deleted.push(i);
        }
    }

    this.cacheHash = newCacheHash;
    this.out.order = operationOrder;
    newCacheHash = null;
    operationOrder = null;

    return isDirty;
};


IterableProfiler.prototype.forEachDeleted = function(callback) {
    this.out.deleted.forEach(callback);
};

IterableProfiler.prototype.forEachOperation = function(callback) {
    var len = this.out.order.length;
    for (var i = 0; i < len; i++) {
        if (this.out.order[i]) {
            callback(this.out.order[i], i);
        }
    }
};



IterableProfiler.prototype.checkDuplicateRepeater = function(hash) {
    if (this.cacheHash.indexOf(hash) > -1) {
        errorBuilder("Duplicate values are not allowed in repeaters. Use 'track by' expression to specify unique keys");
    }
};


IterableProfiler.prototype.attachTrackBy = function(fn) {
    if (!isfunction(fn))
        return;
    this.trackBy = fn;
};

IterableProfiler.prototype.destroy = function() {
    this._destroyed = true;
    this.cacheHash.length = 0;
    this.out = null;
};