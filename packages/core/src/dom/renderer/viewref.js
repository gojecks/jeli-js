import { scheduler } from '../../utils/scheduler';
import { removeFromArray, addToArray, moveItemInArray } from '@jeli/helpers';

/**
 *
 * @param {*} elementRef
 */
// composition, not `extends Array` - same reasoning as QueryList
export class ViewRef {
    _destroyed = false
    constructor(elementRef) {
        this._views = [];
        /**
         * @param {*} templateRef
         * @param {*} context
         * @param {*} index
         */
        this.createEmbededView = (templateRef, context, index) => {
            const view = new EmbededViewContext(elementRef, templateRef, context);
            view.renderView(index);
            addToArray(this._views, view, index);
            /**
             * ViewRef Object
             */
            return view;
        };
    }

    get length() {
        return this._views.length;
    }

    get(index) {
        return this._views[index];
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

                moveItemInArray(this._views, prev, curr);
                this.updateContext();
            }
        });
    }

    remove(index) {
        const view = removeFromArray(this._views, index);
        if (view) {
            view._destroyed_view = true;
            view.destroy();
        }
    }
    /**
     * destroy the child view
     */
    clearView() {
        while (this._views.length) {
            const view = this._views.shift();
            view.destroy();
        }
    }
    updateContext() {
        for (var i = 0; i < this._views.length; i++) {
            const view = this.get(i);
            view.updateContext({
                index: i,
                count: this._views.length
            });
        }
    }
}

/**
 *
 * @param {*} parentRef
 * @param {*} templateRef
 * @param {*} context
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
            /**
             * create the Viewcontext if templateRef has a context
             */
            if (templateContext) {
                this.compiledElement.hasContext = true;
                this.compiledElement.context = componentRefContext;
            } else if (!context && parentRef.hasContext) {
                this.compiledElement.hasContext = true;
                this.compiledElement.context = parentRef.context;
            } else {
                this.compiledElement.hasContext = false;
            }
        }
    }

    /**
     * schedule a view rendering
     * @param {*} index
     */
    renderView(index) {
        if (!this.compiledElement) return;
        let targetNode = resolveAnchorNode(this.parentRef.children.last || this.parentRef);
        var _arrIndex = (index ? (index - 1) : index);
        if (index !== undefined && this.parentRef.children.hasIndex(_arrIndex))
            targetNode = resolveAnchorNode(this.parentRef.children.getByIndex(_arrIndex));

        // force return if compiledElement is destroyed
        if(!targetNode) return;
        /**
         * view render scheduler
         */
        const nativeElement = this.compiledElement.nativeElement || this.compiledElement.nativeNode;
        this.parentRef.children.add(this.compiledElement, index);
        /**
         * register our scheduler
         */
        this.unsubscribeScheduler = scheduler.schedule(() => {
            try {
                // transverse() already populates this view's own bindings synchronously - no changeDetector call needed here (was O(n^2) across a *for batch)
                transverse(this.compiledElement);
                if (index)  elementInsertAfter(this.parentRef, nativeElement, targetNode, true);
                else elementBefore(targetNode, nativeElement);
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
