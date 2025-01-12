import { scheduler } from '../../utils/scheduler';
import { removeFromArray, addToArray, moveItemInArray } from '@jeli/helpers';

/**
 * 
 * @param {*} elementRef 
 */
/**
 *
 * @param {*} elementRef
 */
export class ViewRef extends Array {
    constructor(elementRef) {
        super();
        this._destroyed = false;
        this.get = function (index) {
            return this[index];
        };

        /**
         * @param {*} templateRef
         * @param {*} context
         * @param {*} index
         */
        this.createEmbededView = function (templateRef, context, index) {
            var view = new EmbededViewContext(elementRef, templateRef, context);
            view.renderView(index);
            addToArray(this, view, index);
            /**
             * ViewRef Object
             */
            return view;
        };
    }
    /**
     *
     * @param {*} prev
     * @param {*} curr
     */
    move(prev, curr) {
        scheduler.schedule(() => {
            var view = this.get(prev);
            var targetNode = this.get(curr);
            if (targetNode && view) {
                // insert after
                if (curr > prev) {
                    elementInsertAfter(null, view.compiledElement.nativeElement, targetNode.compiledElement.nativeElement);
                } else {
                    // insert before
                    elementBefore(targetNode.compiledElement.nativeElement, view.compiledElement.nativeElement);
                }

                moveItemInArray(this, prev, curr);
                this.updateContext();
            }
        });
    }
    remove(index) {
        var view = removeFromArray(this, index);
        if (view) {
            view._destroyed_view = true;
            view.destroy();
        }
        view = null;
    }
    /**
     * destroy the child view
     */
    clearView() {
        while (this.length) {
            var view = this.shift();
            view.destroy();
        }
    }
    updateContext() {
        for (var i = 0; i < this.length; i++) {
            var view = this.get(i);
            view.updateContext({
                index: i,
                count: this.length
            });
        }
    }
}


/**
 * 
 * @param {*} parentRef 
 * @param {*} templateRef 
 * @param {*} context 
 * @param {*} index 
 */
class EmbededViewContext {
    constructor(parentRef, templateRef, context) {
        this.context = context;
        this.parentRef = parentRef;
        var templateContext = templateRef.getContext();
        var componentRefContext = createLocalVariables(templateContext, context, parentRef.context);
        this.compiledElement = templateRef.createElement(parentRef, null, componentRefContext);
        this.compiledElement.hasContext = !!templateContext;
        this.unsubscribeScheduler;
        /**
         * create the Viewcontext if templateRef has a context
         */
        if (this.compiledElement && this.compiledElement.hasContext) {
            this.compiledElement.context = componentRefContext;
            // ComponentRef.create(this.compiledElement.refId, parentRef.hostRef.refId, componentRefContext);
        }
    }

    /**
     * schedule a view rendering
     * @param {*} index
     */
    renderView(index) {
        var targetNode = (this.parentRef.children.last || this.parentRef).nativeElement;
        var _arrIndex = (index ? (index - 1) : index);
        if (index !== undefined && this.parentRef.children.hasIndex(_arrIndex))
            targetNode = this.parentRef.children.getByIndex(_arrIndex).nativeElement;

        // force return if compiledElement is destroyed
        if (!this.compiledElement) return;
        /**
         * view render scheduler
         */
        var nativeElement = this.compiledElement.nativeElement || this.compiledElement.nativeNode;
        var changeDetector = this.compiledElement && this.compiledElement.changeDetector;
        this.parentRef.children.add(this.compiledElement, index);

        var _scheduler = () => {
            try {
                transverse(this.compiledElement);
                if (index)
                    elementInsertAfter(this.parentRef, nativeElement, targetNode, true);
                else
                    // insert before
                    elementBefore(targetNode, nativeElement);
                
                if (changeDetector)
                    changeDetector.detectChanges();

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

    destroy() {
        this.unsubscribeScheduler();
        removeElement(this.compiledElement, true);
        this.compiledElement = null;
        this.context = null;
        this.parentRef = null;
    }

    setContext(context) {
        this.context = context;
        this.compiledElement.changeDetector.detectChanges();
    }

    updateContext(updates) {
        if (!this.context) return;
        for (var prop in updates) {
            this.context[prop] = updates[prop];
        }
    }
}

