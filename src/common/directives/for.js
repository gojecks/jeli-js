/**
 * @Directive <j-for> <j-do>
 * Compiles the required element based on the item provided
 * elements are removed from the DOM if condition is not met
 * @Usage :
 * allowed type Attirbute and Element
 */
Directive({
    selector: 'for',
    DI: ['ViewRef?', 'TemplateRef?'],
    props: ['forIn', 'trackBy']
}, ForDirective);

/**
 * 
 * @param {*} viewRef 
 * @param {*} TemplateRef 
 */
function ForDirective(viewRef, TemplateRef) {
    this.iterable = new IterableProfiler();
    this._forIn = null;
    this.trackBy;
    this.queryList = new Map();

    this._listenerFn = function() {
        var _this = this;
        // remove cache element and free up memory
        this.iterable.forEachDeleted(function(index) {
            var viewRef = _this.queryList.get(index);
            if (viewRef) {
                viewRef.removeView();
            }
        });
        /**
         * update view content
         */
        this.iterable.forEachChanges(function(key) {
            var cacheElementRef = _this.queryList.get(key);
            if (cacheElementRef) {
                cacheElementRef.updateContext({
                    index: key,
                    count: _this._forIn.length
                });
            }
        });

        /**
         * trigger filter
         * large data might be slow for filter
         */
        this.iterable.forEachInserted(function(item) {
            var context = new jForRow(item, null);
            var view = viewRef.createEmbededView(TemplateRef);
            view.setContext(context);
            _this.queryList.set(item.idx, view);
        });
    };

    /**
     * add new property
     */
    Object.defineProperties(this, {
        forIn: {
            set: function(value) {
                this._forIn = value;
            }
        }
    });
}

ForDirective.prototype.willObserve = function() {
    var changes = this.iterable.diff(this._forIn);
    if (changes) {
        this._listenerFn();
    }
}

/**
 * viewDidDestroy
 */
ForDirective.prototype.viewDidDestroy = function() {
    this.queryList.forEach(function(viewRef) {
        viewRef.removeView();
    });
    this._forIn = null;
    this.queryList.clear();
    this.iterable.destroy();
};

/**
 * 
 * @param {*} name 
 * @param {*} context 
 * @param {*} index 
 * @param {*} count 
 */
function jForRow(context, count) {
    this.count = count;
    this.index = context.idx;

    Object.defineProperties(this, {
        $context: {
            get: function() {
                return context.value;
            }
        },
        first: {
            get: function() {
                return this.index > 0;
            }
        },
        last: {
            get: function() {
                return this.count - 1 === this.index;
            }
        },
        even: {
            get: function() {
                return this.index % 2 === 0;
            }
        },
        odd: {
            get: function() {
                return !this.even;
            }
        }
    });
}