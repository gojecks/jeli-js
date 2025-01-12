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
         * @method tick
         * @param {*} ignoreChild
         * @param {*} ignoreParent
         * trigger all subscribers
         */
        function tick(ignoreChild, ignoreParent) {
            if (!context.observables) {
                return;
            }

            /**
             * trigger parent
             */
            if (context.parent && !ignoreParent && componentDebugContext.has(context.parent)) {
                var parent = componentDebugContext.get(context.parent);
                parent.changeDetector.detectChanges(true);
                triggerChild(parent.child, [], context.parent);
            }

            context.observables && context.observables.notifyAllObservers(context.componentInstance);
            if (!ignoreChild) {
                triggerChild(context.child, [], context.parent);
            }

            /**
             *
             * @param {*} children
             * @param {*} ignore
             * @param {*} parentRef
             */
            function triggerChild(children, ignore, parentRef) {
                for (var refId of children) {
                    if (componentDebugContext.has(parentRef) && !ignore.includes(refId) && componentDebugContext.has(refId)) {
                        var child = componentDebugContext.get(refId);
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
}





/**
 * Variable for holding Component Context
 */
var componentDebugContext = new Map();
/**
 * 
 * @param {*} refId 
 * @param {*} context 
 */
class ComponentRef {
    constructor(refId, context) {
        this.componentRefId = refId;
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
        if (!this._componentInstance && this.parent && componentDebugContext.has(this.parent)) {
            return componentDebugContext.get(this.parent).componentInstance;
        }

        return this._componentInstance;
    }
    
    set componentInstance(value) {
        this._componentInstance = value;
    }
    /**
     *
     * @param {*} refId
     * @param {*} parentId
     * @param {*} context
     */
    static create(refId, parentId, context) {
        var componentRef = componentDebugContext.get(refId);
        if (!componentRef) {
            componentRef = new ComponentRef(refId, context);
            componentDebugContext.set(refId, componentRef);
        } else {
            // only update context if componentRef already exists
            componentRef._context = context || null;
        }

        if (componentDebugContext.has(parentId) && (parentId != refId)) {
            componentRef.parent = parentId;
            // add child to parent
            componentDebugContext.get(parentId).child.push(refId);
        }
        componentRef = null;
    }
    /**
     *
     * @param {*} refId
     * @returns
     */
    static get(refId, hostRefId) {
        return componentDebugContext.get(refId) || componentDebugContext.get(hostRefId) || {};
    }
    static has(refId) {
        return componentDebugContext.has(refId);
    }
    removeChild(refId) {
        this.child.splice(this.child.indexOf(refId), 1);
        componentDebugContext.delete(refId);
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
        if (!componentDebugContext.has(this.componentRefId)) return;
        this.changeDetector.markAsChecked();
        // destroy observables
        componentDebugContext.delete(this.componentRefId);
        if (this.parent && componentDebugContext.has(this.parent)) {
            componentDebugContext.get(this.parent).removeChild(this.componentRefId);
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


