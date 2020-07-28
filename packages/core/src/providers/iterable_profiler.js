import { isarray } from 'js-helpers/helpers';
import { hashcode } from 'js-helpers/utils';
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
    this.cacheHash = [];
    this.out = null;
    this.trackBy = trackBy || function(item) {
        if (item && typeof item === "object") {
            item = JSON.stringify(item);
        }

        return hashcode(item);
    }
}

IterableProfiler.prototype.diff = function(source) {
    if (this._destroyed) {
        return false;
    }

    if (source && !(source instanceof Array)) {
        throw new Error('Collection should be an array');
    }
    /**
     * reset out
     */
    this.out = {
        deleted: [],
        insert: [],
        moved: [],
        changes: []
    };

    if ((!source || !source.length) && (!this.cacheHash || !this.cacheHash.length)) {
        return false;
    }

    if (source.length === this.cacheHash.length) {
        return false;
    }

    /**
     * source is empty and cacheHash exists
     * empty cacheHash and return deleted keys
     */
    if (!source.length && this.cacheHash.length) {
        this.out.deleted = Object.keys(this.cacheHash).map(Number);
        this.cacheHash = [];
        return true;
    }

    var len = source.length;
    var newCacheHash = [];
    for (var inc = 0; inc < len; inc++) {
        var item = source[inc],
            hash = this.trackBy(item, inc);
        if (this.cacheHash.hasOwnProperty(inc)) {
            /***
             * cacheHash[key] changed
             */
            if (this.cacheHash[inc] !== hash) {
                /**
                 * find the hash in the cacheHash
                 * if hash exists means the object was moved to different index
                 * assign to new position
                 */
                var index = this.cacheHash.indexOf(hash);
                /**
                 * update changes
                 */
                this.out.changes.push({
                    prev: index > -1 ? index : inc,
                    curr: inc
                });
            }
        } else {
            this.checkDuplicateRepeater(hash);
            this.out.insert.push(inc);
        }

        newCacheHash.push(hash);
    }

    /**
     * Validate cacheHash
     */
    if (this.cacheHash.length > newCacheHash.length) {
        var _this = this;
        this.cacheHash.forEach(function(hash, idx) {
            if (!newCacheHash.includes(hash)) {
                _this.out.deleted.push(idx);
            }
        });
    }

    this.cacheHash = newCacheHash;
    newCacheHash = null;

    return (this.out.changes.length || this.out.deleted.length || this.out.insert.length) > 0;
};

IterableProfiler.prototype.forEachChanges = function(callback) {
    this.out.changes.forEach(callback);
};

IterableProfiler.prototype.forEachDeleted = function(callback) {
    this.out.deleted.forEach(callback);
};

IterableProfiler.prototype.forEachInserted = function(callback) {
    this.out.insert.forEach(callback);
};


IterableProfiler.prototype.checkDuplicateRepeater = function(hash) {
    if (this.cacheHash.indexOf(hash) > -1) {
        errorBuilder("Duplicate values are not allowed in repeaters. Use 'track by' expression to specify unique keys");
    }
};

IterableProfiler.prototype.destroy = function() {
    this._destroyed = true;
    this.cacheHash.length = 0;
    this.out = null;
};