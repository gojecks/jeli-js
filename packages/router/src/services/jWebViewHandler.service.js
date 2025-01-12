import { ComponentFactoryResolver, DOMHelper, compileModule, errorBuilder, rxLoop } from '@jeli/core';
import { staticRoutePrefix } from './utils';
Service({
    name: 'ViewHandler'
})
export class ViewHandler {
    constructor() {
        this.viewsHolder = new Map();
        this._pendingViewStack = new Map();
        this.currentView = staticRoutePrefix;
        this._resolvedRoute = {};
    }
    isResolved(parentName, setValue) {
        var isResolved = this._resolvedRoute[parentName];
        this._resolvedRoute[parentName] = setValue || false;
        return isResolved;
    }
    setViewReference(elementRef, ref) {
        this.viewsHolder.set(ref, {
            element: elementRef,
            compiledWith: null
        });

        this.handlePendingView(ref);
    }
    /**
     *
     * @param {*} view
     * @param {*} name
     */
    getView(view, name) {
        var _viewHolder = this.viewsHolder.get(view);
        return ((name) ? _viewHolder[name] : _viewHolder);
    }
    /**
     *
     * @param {*} viewComponent
     * @param {*} viewObjectInstance
     * @param {*} callback
     * compile the template when loaded
     */
    compileViewTemplate(viewComponent, viewObjectInstance, callback) {
        //remove cache
        this.cleanUp(viewObjectInstance);
        // lazyloaded modules
        var isLazyLoaded = !!viewComponent.loadModule;
        this._loadModule(viewComponent.loadModule).then(componentFactory => {
            ComponentFactoryResolver(isLazyLoaded ? componentFactory : viewComponent, viewObjectInstance.element)
                .then(componentRef => {
                    viewObjectInstance.compiledWith = componentRef;
                    callback();
                }, errMessage => {
                    errorBuilder(errMessage);
                    callback();
                });
        });
    }
    /**
     * remove Views from holder
     * @param {*} _views
     * @param {*} mView
     */
    removeViews(views) {
        this.viewsHolder.forEach((view, key) => {
            if (!views.includes(key)) {
                this.cleanUp(view);
                this.viewsHolder.delete(key);
            }
        });
    }
    /**
     * getCurrentView
     * @param {*} route
     */
    getCurrentView(route) {
        var views = [];
        var mView = Object.keys(route.views).concat();
        // register route to resolved
        this.isResolved(route.name, true);
        if (route.parent && !this.isResolved(route.parent, true)) {
            return mView;
        }

        if (route.targetView) {
            //concat the target view
            if (this.viewsHolder.has(route.targetView))
                return views.concat(route.targetView);

            // lazyLoadedModule will not contain views
            else if (!mView.includes(route.targetView))
                mView.push(route.targetView);

            return mView;
        }

        views = views.concat(route.route._views);
        this.removeViews(views);
        mView = null;

        return views;
    }
    /**
     * trigger the resolved route views
     */
    resolveViews(route) {
        return rxLoop(this.getCurrentView(route), (view, next) => {
            view = view || staticRoutePrefix;
            var viewObj = route.views[view] || route;
            var viewObjectInstance = this.getView(view);
            /**
             * Open Activity
             */
            if (!viewObj) {
                errorBuilder('[Router] No view definition for ' + route.name);
                return next();
            }

            if (viewObjectInstance) {
                this.compileViewTemplate(viewObj, viewObjectInstance, next);
            } else {
                //Push pending view to stack
                this._pendingViewStack.set(view, viewObj);
                next();
            }
        });
    }
    destroy(ref) {
        var viewInstance = this.viewsHolder.get(ref);
        if (!viewInstance) return;
        this.cleanUp(viewInstance);
        this.viewsHolder.delete(ref);
        viewInstance = null;
    }
    handlePendingView(viewName) {
        if (this._pendingViewStack.has(viewName)) {
            this.compileViewTemplate(this._pendingViewStack.get(viewName), this.viewsHolder.get(viewName), () => {
                this._pendingViewStack.delete(viewName);
            });
        }
    }
    /**
     *
     * @param {*} viewInstance
     */
    cleanUp(viewInstance) {
        if (viewInstance.compiledWith) {
            DOMHelper.remove(viewInstance.compiledWith);
        } else {
            // templates only
            viewInstance.element.children.forEach(DOMHelper.remove);
        }
    }
    /**
     *
     * @param {*} factory
     */
    _loadModule(mLoader) {
        if (!mLoader) return Promise.resolve(null);
        return mLoader()
            .then(module => {
                compileModule(module);
                return module.rootElement;
            });
    }
}