import { scheduler } from '../../utils/scheduler';
import { removeFromArray, addToArray } from 'js-helpers/helpers';
/**
 * Element ViewRef
 */
export function ViewRef(elementRef) {
    this._viewRefs = [];
    this._destroyed = false;
    this.get = function(index) {
        return this._viewRefs[index];
    };

    /**
     * @param {*} templateRef
     * @param {*} context
     * @param {*} index
     */
    this.createEmbededView = function(templateRef, context, index) {
        var view = new EmbededViewContext(elementRef, templateRef, context);
        view.renderView(index);
        addToArray(this._viewRefs, view, index);
        /**
         * ViewRef Object
         */
        return view;
    };

    Object.defineProperty(this, 'length', {
        get: function() {
            return this._viewRefs.length;
        }
    });
}

/**
 * 
 * @param {*} prev 
 * @param {*} curr 
 */
ViewRef.prototype.move = function(prev, curr) {
    var view = this.get(prev);
    scheduler.schedule(function() {
        if (view) {
            var parent = view.compiledElement.parent;
            var targetNode = parent.children.getByIndex(curr - 1);
            if (targetNode) {
                elementInsertAfter(parent, view.compiledElement.nativeElement, targetNode.nativeElement);
            }
        }
    });
};

ViewRef.prototype.remove = function(index) {
    var view = removeFromArray(this._viewRefs, index);
    if (view) {
        view._destroyed_view = true;
        view.destroy();
    }
    view = null;
};

/**
 * destroy the child view
 */
ViewRef.prototype.clearView = function() {
    while (this._viewRefs.length) {
        var view = this._viewRefs.shift();
        view.destroy();
    }
};

/**
 * 
 * @param {*} parentRef 
 * @param {*} templateRef 
 * @param {*} context 
 * @param {*} index 
 */
function EmbededViewContext(parentRef, templateRef, context) {
    var _componentRef = null;
    this.context = context;
    var templateContext = templateRef.getContext();
    var componentRefContext = createLocalVariables(templateContext, context, parentRef.context);
    this.compiledElement = templateRef.createElement(parentRef, null, componentRefContext);
    this.compiledElement.hasContext = !!templateContext;
    this.unsubscribeScheduler;
    /**
     * create the Viewcontext if templateRef has a context
     */
    if (this.compiledElement && this.compiledElement.hasContext) {
        ComponentRef.create(this.compiledElement.refId, parentRef.hostRef.refId, componentRefContext);
    }

    /**
     * schedule a view rendering
     * @param {*} index 
     */
    this.renderView = function(index) {
        var _this = this;
        /**
         * view render scheduler
         */
        function _scheduler() {
            var targetNode = (parentRef.children.last || parentRef).nativeElement;
            var _arrIndex = (index ? (index - 1) : index);
            if (index !== undefined && parentRef.children.hasIndex(_arrIndex)) {
                targetNode = parentRef.children.getByIndex(_arrIndex).nativeElement;
            }
            // force return if compiledElement is destroyed
            if (!_this.compiledElement) return;
            try {
                transverse(_this.compiledElement);
                var nativeElement = _this.compiledElement.nativeElement || _this.compiledElement.nativeNode;
                elementInsertAfter(parentRef, nativeElement, targetNode);
                parentRef.children.add(_this.compiledElement, index);
                var changeDetector = _this.compiledElement && _this.compiledElement.changeDetector;
                if (changeDetector) {
                    changeDetector.detectChanges();
                }

                nativeElement = null;
                changeDetector = null;
                targetNode = null;
            } catch (e) {
                // silent the error
            }
        }
        /**
         * register our scheduler
         */
        this.unsubscribeScheduler = scheduler.schedule(_scheduler);
    }


    this.destroy = function() {
        this.unsubscribeScheduler();
        if (_componentRef && !this.compiledElement.isc) {
            _componentRef.destroy();
            _componentRef = null;
        }

        removeElement(this.compiledElement, true);
        this.compiledElement = null;
        this.context = null;
    }

    this.setContext = function(context) {
        this.context = context;
        this.compiledElement.changeDetector.detectChanges();
    };
}

EmbededViewContext.prototype.updateContext = function(updates) {
    if (!this.context) return;
    for (var prop in updates) {
        this.context[prop] = updates[prop];
    }
}