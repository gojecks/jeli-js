import { scheduler } from '../../utils/scheduler';
import { removeFromArray, addToArray, moveItemInArray } from '@jeli/helpers';
/**
 * Element ViewRef
 */
export function ViewRef(elementRef) {
    this._destroyed = false;
    this.get = function(index) {
        return this[index];
    };

    /**
     * @param {*} templateRef
     * @param {*} context
     * @param {*} index
     */
    this.createEmbededView = function(templateRef, context, index) {
        var view = new EmbededViewContext(elementRef, templateRef, context);
        view.renderView(index);
        addToArray(this, view, index);
        /**
         * ViewRef Object
         */
        return view;
    };
}

ViewRef.constructor = Array;
ViewRef.prototype = Object.create(Array.prototype);

/**
 * 
 * @param {*} prev 
 * @param {*} curr 
 */
ViewRef.prototype.move = function(prev, curr) {
    scheduler.schedule(() => {
        var view = this.get(prev);
        var targetNode = this.get(curr);
        if (targetNode && view) {
            // insert after
            if (curr > prev){
                elementInsertAfter(null, view.compiledElement.nativeElement, targetNode.compiledElement.nativeElement);
            } else {
                // insert before
                elementBefore(targetNode.compiledElement.nativeElement, view.compiledElement.nativeElement);
            }
            
            moveItemInArray(this, prev, curr);
            this.updateContext();
        }
    });
};

ViewRef.prototype.remove = function(index) {
    var view = removeFromArray(this, index);
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
    while (this.length) {
        var view = this.shift();
        view.destroy();
    }
};

ViewRef.prototype.updateContext = function(){
    for (var i = 0; i < this.length; i++) {
        var view = this.get(i);
        view.updateContext({
            index: i,
            count: this.length
        });
    }
}

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
        var targetNode = (parentRef.children.last || parentRef).nativeElement;
        var _arrIndex = (index ? (index - 1) : index);
        if (index !== undefined && parentRef.children.hasIndex(_arrIndex)) {
            targetNode = parentRef.children.getByIndex(_arrIndex).nativeElement;
        }
        // force return if compiledElement is destroyed
        if (!this.compiledElement) return;
        /**
         * view render scheduler
         */

        var nativeElement = this.compiledElement.nativeElement || this.compiledElement.nativeNode;
        var changeDetector = this.compiledElement && this.compiledElement.changeDetector;
        parentRef.children.add(this.compiledElement, index);

        var _scheduler  = () => {
            try {
                transverse(this.compiledElement);
                elementInsertAfter(parentRef, nativeElement, targetNode, true);
                if (changeDetector) {
                    changeDetector.detectChanges();
                }

                nativeElement = null;
                changeDetector = null;
                targetNode = null;
            } catch (e) {
                // silent the error
            }
        };
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