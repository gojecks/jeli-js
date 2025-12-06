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
    _destroyed = false
    constructor(elementRef) {
        super();
        /**
         * @param {*} templateRef
         * @param {*} context
         * @param {*} index
         */
        this.createEmbededView = function (templateRef, context, index) {
            const view = new EmbededViewContext(elementRef, templateRef, context);
            view.renderView(index);
            addToArray(this, view, index);
            /**
             * ViewRef Object
             */
            return view;
        };
    }

    get(index) {
        return this[index];
    }
    /**
     *
     * @param {*} prev
     * @param {*} curr
     */
    move(prev, curr) {
        scheduler.schedule(() => {
            const view = this.get(prev);
            const targetNode = this.get(curr);
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
        const view = removeFromArray(this, index);
        if (view) {
            view._destroyed_view = true;
            view.destroy();
        }
    }
    /**
     * destroy the child view
     */
    clearView() {
        while (this.length) {
            const view = this.shift();
            view.destroy();
        }
    }
    updateContext() {
        for (var i = 0; i < this.length; i++) {
            const view = this.get(i);
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
    unsubscribeScheduler = null;
    constructor(parentRef, templateRef, context) {
        this.context = context;
        this.parentRef = parentRef;
        const templateContext = templateRef.getContext();
        const componentRefContext = createLocalVariables(templateContext, context, parentRef.context);
        this.compiledElement = templateRef.createElement(parentRef, null, componentRefContext);

        if (this.compiledElement) {
            this.compiledElement.hasContext = !!templateContext;
            /**
             * create the Viewcontext if templateRef has a context
             */
            if (this.compiledElement.hasContext) {
                this.compiledElement.context = componentRefContext;
            }
        }
    }

    /**
     * schedule a view rendering
     * @param {*} index
     */
    renderView(index) {
        if (!this.compiledElement) return;
        let targetNode = (this.parentRef.children.last || this.parentRef).nativeElement;
        var _arrIndex = (index ? (index - 1) : index);
        if (index !== undefined && this.parentRef.children.hasIndex(_arrIndex))
            targetNode = this.parentRef.children.getByIndex(_arrIndex).nativeElement;

        // force return if compiledElement is destroyed
        if(!targetNode) return;
        /**
         * view render scheduler
         */
        const nativeElement = this.compiledElement.nativeElement || this.compiledElement.nativeNode;
        const changeDetector = this.compiledElement && this.compiledElement.changeDetector;
        this.parentRef.children.add(this.compiledElement, index);
        /**
         * register our scheduler
         */
        this.unsubscribeScheduler = scheduler.schedule(() => {
            try {
                transverse(this.compiledElement);
                if (index)  elementInsertAfter(this.parentRef, nativeElement, targetNode, true);
                else elementBefore(targetNode, nativeElement);
                
                if (changeDetector) changeDetector.detectChanges();
                targetNode = null;
            } catch (e) { }
            finally {
                this.unsubscribeScheduler();
                this.unsubscribeScheduler = null;
            }
        });
    }

    destroy() {
        this.unsubscribeScheduler && this.unsubscribeScheduler();
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
        for (const prop in updates) {
            this.context[prop] = updates[prop];
        }
    }
}

