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
    props: ['forIn', 'forOf', 'forTrackBy:any']
})
export class ForDirective {
    constructor(viewRef, templateRef) {
        this.viewRef = viewRef;
        this.templateRef = templateRef;
        this.iterable = new IterableProfiler();
        this._forTrackBy = null;
        this._forValue = null;
        this._isForIn = false;
        this._isForOf = false;
        this.inProgress = false;
    }

    set forIn(value) {
        this._isForIn = true;
        this._forValue = value;
        this.willObserve();
    }
    
    get forIn(){
        if (!this._isForIn) return null;
        return this._forValue;
    }

    set forOf(value) {
        this._isForOf = true;
        this._forValue = value;
        this.willObserve();
    }

    get forOf() {
        if (!this._isForOf) return null;
        return this._forValue;
    }

    set forTrackBy(fn) {
        this.iterable.attachTrackBy(fn);
        this._forTrackBy = fn;
    }
    get forTrackBy() {
        return this._forTrackBy;
    }

    _listenerFn() {
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
    }
    willObserve() {
        var changes = this.iterable.diff(this._forValue);
        if (changes && !this.inProgress) {
            this.inProgress = true;
            this._listenerFn();
        }
    }
    /**
     * viewDidDestroy
     */
    viewDidDestroy() {
        this.viewRef.clearView();
        this.iterable.destroy();
        this.viewRef = null;
        this.templateRef = null;
    }
}




/**
 * 
 * @param {*} context 
 * @param {*} index 
 * @param {*} count 
 */
class jForRow {
    constructor(context, index, count) {
        this.count = count;
        this.index = index;
        this.$context = context;
    }

    get first() {
        return this.index > 0;
    }

    get last() {
        return this.count - 1 === this.index;
    }

    get even() {
        return this.index % 2 === 0;
    }
    
    get odd() {
        return !this.even;
    }
}