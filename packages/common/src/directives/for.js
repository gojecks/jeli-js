import { IterableProfiler } from '@jeli/core';
/**
 * @Directive <j-for> <j-do>
 * Compiles the required element based on the item provided
 * elements are removed from the DOM if condition is not met
 * @Usage :
 * allowed type Attirbute and Element
 */
/**
 * 
 * @param {*} viewRef 
 * @param {*} TemplateRef 
 */
Directive({
    selector: 'for',
    DI: ['ViewRef?', 'TemplateRef?'],
    props: ['forIn', 'trackBy']
})
export function ForDirective(viewRef, templateRef) {
    this.viewRef = viewRef;
    this.templateRef = templateRef;
    this.iterable = new IterableProfiler();
    this._forIn = null;
    this.trackBy;

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

ForDirective.prototype._listenerFn = function() {
    var _this = this;
    // remove cache element and free up memory
    this.iterable.forEachDeleted(function(index) {
        _this.viewRef.remove(index);
    });

    this.iterable.forEachChanges(function(item) {
        if (item.prev !== item.curr) {
            _this.viewRef.move(item.prev, item.curr);
        }
    });

    /**
     * trigger filter
     * large data might be slow for filter
     */
    this.iterable.forEachInserted(function(index) {
        _this.viewRef.createEmbededView(_this.templateRef, new jForRow(_this._forIn[index], index, null), index);
    });

    for (var i = 0; i < this.viewRef.length; i++) {
        var view = this.viewRef.get(i);
        view.updateContext({
            index: i,
            count: this._forIn.length
        });
    }
};

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
    this.viewRef.clearView();
    this.iterable.destroy();
    this.viewRef = null;
    this.templateRef = null;
};

/**
 * 
 * @param {*} context 
 * @param {*} index 
 * @param {*} count 
 */
function jForRow(context, index, count) {
    this.count = count;
    this.index = index;
    this.$context = context;

    Object.defineProperties(this, {
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