import { isfunction } from 'js-helpers/helpers';
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
    this.trackBy = trackBy || function(item, index) {
        return item;
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
        order: []
    };

    if ((!source || !source.length) && (!this.cacheHash || !this.cacheHash.length)) {
        return false;
    }

    /**
     * source is empty and cacheHash exists
     * empty cacheHash and return deleted keys
     */
    if (!source.length && this.cacheHash.length) {
        this.out.deleted = Object.keys(this.cacheHash).map(Number);
        this.cacheHash.length = 0;
        return true;
    }

    var len = source.length;
    var newCacheHash = [];
    var operationOrder = new Array(len);
    var isDirty = false;
    for (var inc = 0; inc < len; inc++) {
        var item = source[inc];
        var hash = this.trackBy(item, inc);
        /**
         * find the hash in the cacheHash
         * if hash exists means the object was moved to different index
         * assign to new position
         */
        if (this.cacheHash.includes(hash)) {
            /***
             * cacheHash[key] changed
             */
            if (!Object.is(this.cacheHash[inc], hash)) {
                isDirty = true;
                /**
                 * update changes
                 */
                var prevIndex = this.cacheHash.indexOf(hash);
                /**
                 * check if currentIndex is > prevIndex
                 * eg: [a,b] => [a,c,b]
                 * true: new Data was added in previous index to the collection
                 * false: we move the item to correct index
                 */
                var operationOrderAtIndex = operationOrder[inc];
                if (operationOrderAtIndex && operationOrderAtIndex.state !== 'create') {
                    operationOrder[inc] = ({
                        prevIndex: prevIndex,
                        state: 'move'
                    });
                }
            }
        } else {
            isDirty = true;
            operationOrder[inc] = ({
                index: inc,
                state: 'create'
            });
        }

        newCacheHash.push(hash);
    }

    /**
     * Validate cacheHash
     */
    if (this.cacheHash.length > newCacheHash.length) {
        for (var i = 0; i < this.cacheHash.length; i++) {
            if (!newCacheHash.includes(this.cacheHash[i])) {
                isDirty = true;
                this.out.deleted.push(i - this.out.deleted.length);
            }
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