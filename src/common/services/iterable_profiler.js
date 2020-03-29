Service({
    name: "iterableProfiler",
    static: true
}, IterableProfiler);
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
function IterableProfiler() {
    this._destroyed = false;
    var cacheHash = [];
    var out = null;

    /**
     * 
     * @param {*} _source 
     * @param {*} out 
     */
    function generateHash(_source, out) {
        _source.forEach(function(val, key) {
            cacheHash.push(getHash(val));
            out.insert.push({
                value: val,
                key: key
            });
        });
    }

    /**
     * 
     * @param {*} item 
     * @param {*} key 
     */
    function getHash(item, key) {
        if (item && typeof item === "object") {
            item = JSON.stringify(item);
        }

        return $hashCode(item);
    }

    /**
     * 
     * @param {*} source 
     */
    function _profiler(source) {
        if (source && !(source instanceof Array)) {
            throw new Error('Collection should be an array');
        }
        /**
         * reset out
         */
        out = {
            deleted: [],
            insert: [],
            moved: [],
            changes: []
        };

        if ((!source || !source.length) && (!cacheHash || !cacheHash.length)) {
            return out;
        }

        /**
         * empty cache and source Data
         */
        if (!cacheHash.length && source.length) {
            generateHash(source, out);
            return out;
        }

        /**
         * source is empty and cacheHash exists
         * empty cacheHash and return deleted keys
         */
        if (!source.length && cacheHash.length) {
            out.deleted = cacheHash.map(function(_, key) {
                return key
            });
            cacheHash.length = 0;
            return out;
        }

        var len = source.length;
        for (var inc = 0; inc < len; inc++) {
            var item = source[inc],
                hash = getHash(item, inc);
            if (cacheHash.hasOwnProperty(inc)) {
                /***
                 * cacheHash[key] changed
                 */
                if (cacheHash[inc] !== hash) {
                    /**
                     * find the hash in the cacheHash
                     * if hash exists means the object was moved around
                     * assign to new position
                     */
                    var index = cacheHash.indexOf(hash);
                    if (index > -1) {
                        cacheHash[index] = cacheHash[inc];
                    }

                    out.changes.push(inc);
                }
            } else {
                out.insert.push({
                    value: item,
                    key: inc
                });
            }

            cacheHash[inc] = hash;
        }

        /**
         * Validate cacheHash
         */
        if (cacheHash.length > source.length) {
            out.deleted.push.apply(out.deleted,
                Object.keys(cacheHash)
                .splice(source.length, cacheHash.length)
                .map(function(key) {
                    return parseInt(key);
                })
            );
            cacheHash.splice(source.length, cacheHash.length);
        }

        return out;
    }

    this.forEachChanges = function(callback) {
        out.changes.forEach(callback);
    };

    this.forEachDeleted = function(callback) {
        out.deleted.forEach(callback);
    };

    this.forEachInserted = function(callback) {
        out.insert.forEach(callback);
    };

    this.forEachInsertedAsync = function(callback, afterMapCallback) {
        out.insert.map(callback).forEach(afterMapCallback);
    };

    this.forEachChangesAsync = function(callback, afterMapCallback) {
        out.changes.map(callback).forEach(afterMapCallback);
    };

    this.forEachDeletedAsync = function(callback, afterMapCallback) {
        out.deleted.map(callback).forEach(afterMapCallback);
    };

    this.diff = function(source) {
        if (this._destroyed) {
            return false;
        }

        _profiler(source);
        return (out.changes.length || out.deleted.length || out.insert.length) > 0;
    };


    this.checkDuplicateRepeater = function(repeater) {
        if (repeater && $isArray(repeater)) {
            if (noDubs(repeater).length < repeater.length) {
                errorBuilder("Duplicate values are not allowed in repeaters. Use 'track by' expression to specify unique keys");
            }
        }
    };

    this.destroy = function() {
        this._destroyed = true;
        cacheHash.length = 0;
        out = null;
    };
}