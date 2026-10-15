import { isobject } from '@jeli/helpers';
import { Observer } from '../rx/observer';

/**
 * InternalChangeDetector Class
 * @param {*} context
 */
class InternalChangeDetector {
    constructor(context) {
        this._changeDetectorState = 3;
        this.detectChanges = function () {
            if (this._changeDetectorState == 3) {
                tick.apply(null, arguments);
            }
        };
        /**
         * bypasses the _changeDetectorState gate entirely (unlike
         * detectChanges()/onlySelf(), which only run when state == 3) -
         * for a manual-mode component's own explicit, deliberate
         * self-trigger, e.g. from an rxWatch subscription callback.
         * ignoreChild:false, ignoreParent:true - same scope as onlySelf().
         */
        this.manualCheck = function () {
            tick.call(null, false, true);
        };

        /**
         * @method tick
         * @param {*} ignoreChild
         * @param {*} ignoreParent
         * trigger all subscribers
         */
        function tick(ignoreChild, ignoreParent) {
            if (!context.observables) {
                return;
            }

            // trigger parent - null changeDetector means a stale/destroyed reference
            var parent = context.parent;
            var hasParent = (!parent || !!parent.changeDetector);
            if (parent && !ignoreParent && hasParent) {
                parent.changeDetector.detectChanges(true);
                triggerChild(parent.child, []);
            }

            context.observables && context.observables.notifyAllObservers(context.componentInstance);
            if (!ignoreChild) {
                triggerChild(context.child, []);
            }

            /**
             *
             * @param {*} children
             * @param {*} ignore
             * @param {*} parentRef
             */
            function triggerChild(children, ignore) {
                for (var child of children) {
                    if (!ignore.includes(child) && child.changeDetector && hasParent) {
                        child.changeDetector.onlySelf();
                    }
                }
            }
        };
    }

    get status() {
        return this._changeDetectorState;
    }

    onlySelf() {
        this.detectChanges(false, true);
    }
    markAsChecked() {
        this._changeDetectorState = 1;
    }
    markAsUnChecked() {
        this._changeDetectorState = 3;
    }
    markAsOnce() {
        this._changeDetectorState = 2;
    }
    /**
     * opts this component out of the automatic cascade permanently -
     * every existing trigger site's detectChanges()/onlySelf() becomes a
     * no-op for this component, same as markAsChecked(), but (unlike
     * markAsChecked()) manualCheck() still works, so the component can
     * still refresh itself deliberately (e.g. via rxWatch) instead of
     * being frozen entirely
     */
    markAsManual() {
        this._changeDetectorState = 4;
    }
}





// held directly on its owning ElementRef (elementRef.componentRef), not a side registry keyed by id
export class ComponentRef {
    constructor(context) {
        this.observables = new Observer();
        this.child = [];
        this.parent = null;
        this.changeDetector = new InternalChangeDetector(this);
        this._componentInstance = null;
        this._context = context || null;
    }

    get context() {
        if (this._context) {
            return this._context;
        }

        return this.componentInstance;
    }
    get componentInstance() {
        if (!this._componentInstance && this.parent) {
            return this.parent.componentInstance;
        }

        return this._componentInstance;
    }

    set componentInstance(value) {
        this._componentInstance = value;
    }
    /**
     * links this componentRef under its parent's child list for the change-detection cascade
     * @param {*} parentComponentRef
     */
    linkParent(parentComponentRef) {
        if (parentComponentRef && parentComponentRef !== this) {
            this.parent = parentComponentRef;
            parentComponentRef.child.push(this);
        }
    }
    removeChild(componentRef) {
        var idx = this.child.indexOf(componentRef);
        if (idx > -1) this.child.splice(idx, 1);
    }
    updateModel(propName, value) {
        if (isobject(propName)) {
            for (var prop in propName) {
                setModelValue(prop, this.context, propName[name]);
            }
        } else {
            setModelValue(propName, this.context, value);
        }

        this.changeDetector.detectChanges(false, true);
        return this;
    }
    destroy() {
        if (!this.changeDetector) return;
        this.changeDetector.markAsChecked();
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this._componentInstance = null;
        this._context = null;
        this.observables.destroy();
        this.changeDetector = null;
        this.observables = null;
        this.parent = null;
        this.child.length = 0;
    }
}


