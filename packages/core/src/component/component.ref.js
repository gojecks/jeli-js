import { inarray } from 'js-helpers/helpers';
import { Observer } from '../rx/observer';

/**
 * InternalChangeDetector Class
 * @param {*} tick 
 */
function InternalChangeDetector(tick) {
    var _changeDetectorState = 3;
    this.detectChanges = function() {
        tick.apply(null, arguments);
    };
    this.markAsChecked = function() {
        _changeDetectorState = 1;
    };
    this.markAsUnChecked = function() {
        _changeDetectorState = 3;
    };

    this.markAsOnce = function() {
        _changeDetectorState = 2;
    };

    Object.defineProperty(this, 'status', {
        get: function() {
            return _changeDetectorState;
        }
    });
}

/**
 * Variable for holding Component Context
 */
var componentDebugContext = new Map();
/**
 * 
 * @param {*} refId 
 */
function ComponentRef(refId) {
    var _this = this;
    this.componentRefId = refId;
    this.observables = new Observer();
    this.child = [];
    this.parent = null;
    this.changeDetector = new InternalChangeDetector(tick);
    this.componentInstance = null;
    this._context = null;
    Object.defineProperty(this, 'context', {
        get: function() {
            if (this._context) {
                return this._context
            }

            return this.componentInstance;
        }
    });

    /**
     * @method tick
     * @param {*} ignoreChild
     * @param {*} ignoreParent
     * trigger all subscribers
     */
    function tick(ignoreChild, ignoreParent) {
        if (!_this.observables || _this.inProgress) {
            return;
        }

        _this.inProgress = true;
        _this.observables.notifyAllObservers(_this.componentInstance);
        if (!ignoreChild) {
            triggerChild(_this.child, []);
        }

        /**
         * trigger parent
         */
        if (_this.parent && !ignoreParent && componentDebugContext.has(_this.parent)) {
            var parent = componentDebugContext.get(_this.parent);
            parent.changeDetector.detectChanges(true);
            triggerChild(parent.child, [_this.componentRefId]);
        }

        /**
         * 
         * @param {*} children 
         */
        function triggerChild(children, ignore) {
            children.forEach(function(childRef) {
                if (!inarray(childRef, ignore)) {
                    var child = componentDebugContext.get(childRef);
                    child.changeDetector.detectChanges(false, true);
                }
            });
        }

        _this.inProgress = false;
    };
}

ComponentRef.prototype.removeChild = function(refId) {
    this.child.slice(this.child.indexOf(refId), 1);
    componentDebugContext.delete(refId);
};

ComponentRef.prototype.updateModel = function(propName, value) {
    setModelValue(propName, this.context, value);
    this.changeDetector.detectChanges(false, true);
    return this;
};

/**
 * @param {*} ComponentRef
 */
ComponentRef.prototype.new = function(refId) {
    var childInstance = new ComponentRef(refId);
    childInstance.parent = this;
    this.child.push(refId);
    return childInstance;
};


ComponentRef.prototype.destroy = function() {
    // destroy observables
    componentDebugContext.delete(this.componentRefId);
    this.observables.destroy();
    this.changeDetector = null;
    this.observables = null;
    this.parent = null;
    this.child.length = 0;
    if (this.parent) {
        this.parent.removeChild(this.componentRefId);
    }
};

/**
 * 
 * @param {*} refId 
 * @param {*} parentId 
 */
ComponentRef.create = function(refId, parentId) {
    var componentRef = new ComponentRef(refId);
    if (parentId) {
        componentRef.parent = parentId;
    }

    componentDebugContext.set(refId, componentRef);
    componentRef = null;
};

/**
 * Change detector
 */
export function ChangeDetector() {
    CoreBootstrapContext.bootStrapComponent.context.tick();
};

/**
 * 
 * @param {*} refId 
 * @param {*} fn 
 * @param {*} attachDestroy 
 */
function SubscribeObservables(refId, fn, attachDestroy) {
    var componentRef = componentDebugContext.get(refId);
    var unsubscribe = null;
    if (componentRef) {
        unsubscribe = componentRef.observables.subscribe(fn);
        if (attachDestroy) {
            componentRef.observables.on('$destroy', unsubscribe);
        }

    }

    return unsubscribe;
}