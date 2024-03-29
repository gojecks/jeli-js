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
    props: ['forIn', 'forOf', 'forTrackBy:Function']
})
export function ForDirective(viewRef, templateRef) {
    this.viewRef = viewRef;
    this.templateRef = templateRef;
    this.iterable = new IterableProfiler();
    this._forTrackBy = null;
    this._forValue = null;
    this._isForIn = false;
    this._isForOf = false;
    this.inProgress = false;

    /**
     * add new property
     */
    Object.defineProperties(this, {
        forIn: {
            set: function(value) {
                this._isForIn = true;
                this._forValue = value;
                this.willObserve();
            },
            get: function() {
                if (!this._isForIn) return null;
                return this._forValue;
            }
        },
        forOf: {
            set: function(value) {
                this._isForOf = true;
                this._forValue = value;
                this.willObserve();
            },
            get: function() {
                if (!this._isForOf) return null;
                return this._forValue;
            }
        },
        forTrackBy: {
            set: function(fn) {
                this.iterable.attachTrackBy(fn);
                this._forTrackBy = fn;
            },
            get: function() {
                return this._forTrackBy;
            }
        }
    });
}

ForDirective.prototype._listenerFn = function() {
    // remove cache element and free up memory
    this.iterable.forEachDeleted(index => {
        this.viewRef.remove(index);
    });

    this.iterable.forEachOperation((item) => {
        switch (item.state) {
            case ('create'):
                var context = new jForRow(this._forValue[item.index], item.index, null);
                this.viewRef.createEmbededView(this.templateRef, context, item.index);
                break;
            case ('update'):
                var view = this.viewRef.get(item.index);
                view.updateContext({
                    $context: this._forValue[item.index]
                });
                break;
            case ('move'):
                this.viewRef.move(item.prevIndex, item.index);
                break;
        }
    });

    this.viewRef.updateContext();
    // set progress to false
    this.inProgress = false;
};

ForDirective.prototype.willObserve = function() {
    var changes = this.iterable.diff(this._forValue);
    if (changes && !this.inProgress){
        this.inProgress = true;
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