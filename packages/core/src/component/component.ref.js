import { isobject } from '@jeli/helpers';
import { Observer } from '../rx/observer';

/**
 * InternalChangeDetector Class
 * @param {*} context
 */
function InternalChangeDetector(context) {
    this._changeDetectorState = 3;
    Object.defineProperty(this, 'status', {
        get: function() {
            return _changeDetectorState;
        }
    });

    this.detectChanges = function() {
        if (this._changeDetectorState == 3) {
            tick.apply(null, arguments);
        }
    }

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
            for(var refId of children) {
                if (componentDebugContext.has(parentRef) && !ignore.includes(refId) && componentDebugContext.has(refId)) {
                    var child = componentDebugContext.get(refId);
                    child.changeDetector.onlySelf();
                }
            }
        }
    };
}

InternalChangeDetector.prototype.onlySelf = function() {
    this.detectChanges(false, true);
};

InternalChangeDetector.prototype.markAsChecked = function() {
    this._changeDetectorState = 1;
};

InternalChangeDetector.prototype.markAsUnChecked = function() {
    this._changeDetectorState = 3;
};

InternalChangeDetector.prototype.markAsOnce = function() {
    this._changeDetectorState = 2;
};

/**
 * Variable for holding Component Context
 */
var componentDebugContext = new Map();
/**
 * 
 * @param {*} refId 
 * @param {*} context 
 */
function ComponentRef(refId, context) {
    this.componentRefId = refId;
    this.observables = new Observer();
    this.child = [];
    this.parent = null;
    this.changeDetector = new InternalChangeDetector(this);
    this._componentInstance = null;
    this._context = context || null;
    Object.defineProperties(this, {
        context: {
            get: function() {
                if (this._context) {
                    return this._context;
                }

                return this.componentInstance;
            }
        },
        componentInstance: {
            get: function() {
                if (!this._componentInstance && this.parent && componentDebugContext.has(this.parent)) {
                    return componentDebugContext.get(this.parent).componentInstance;
                }

                return this._componentInstance;
            },
            set: function(componentInstance) {
                this._componentInstance = componentInstance;
            }
        }
    });
}

ComponentRef.prototype.removeChild = function(refId) {
    this.child.splice(this.child.indexOf(refId), 1);
    componentDebugContext.delete(refId);
};


ComponentRef.prototype.updateModel = function(propName, value) {
    if (isobject(propName)) {
        for (var prop in propName) {
            setModelValue(prop, this.context, propName[name]);
        }
    } else {
        setModelValue(propName, this.context, value);
    }

    this.changeDetector.detectChanges(false, true);
    return this;
};

ComponentRef.prototype.destroy = function() {
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
};

/**
 * 
 * @param {*} refId 
 * @param {*} parentId 
 * @param {*} context 
 */
ComponentRef.create = function(refId, parentId, context) {
    var componentRef = componentDebugContext.get(refId)
    if (!componentRef) {
        componentRef = new ComponentRef(refId, context);
        componentDebugContext.set(refId, componentRef);
    } else {
        // only update context if componentRef already exists
        componentRef._context = context || null;
    }

    if (componentDebugContext.has(parentId)  && (parentId != refId)) {
        componentRef.parent = parentId;
        // add child to parent
        componentDebugContext.get(parentId).child.push(refId);
    }
    componentRef = null;
};

/**
 * 
 * @param {*} refId 
 * @returns 
 */
ComponentRef.get = function(refId, hostRefId) {
    return componentDebugContext.get(refId) || componentDebugContext.get(hostRefId) || {};
};

ComponentRef.has = function(refId) {
    return componentDebugContext.has(refId);
}