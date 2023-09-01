import { ComponentFactoryResolver, DOMHelper, compileModule, errorBuilder } from '@jeli/core';
import { routeConfig, staticRoutePrefix } from './utils';
Service({
    name: 'ViewHandler'
})
export function ViewHandler() {
    this.viewsHolder = new Map();
    this._pendingViewStack = new Map();
    this.currentView = staticRoutePrefix;
    this._resolvedRoute = {};
}

ViewHandler.prototype.isResolved = function (parentName, setValue) {
    var isResolved = this._resolvedRoute[parentName];
    this._resolvedRoute[parentName] = setValue || false;
    return isResolved;
}


ViewHandler.prototype.setViewReference = function (elementRef, ref) {
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
ViewHandler.prototype.getView = function (view, name) {
    var _viewHolder = this.viewsHolder.get(view);
    return ((name) ? _viewHolder[name] : _viewHolder);
};

/**
 * 
 * @param {*} viewComponent
 * @param {*} viewObjectInstance 
 * compile the template when loaded
 */
ViewHandler.prototype.compileViewTemplate = function (viewComponent, viewObjectInstance) {
    //remove cache
    this.cleanUp(viewObjectInstance);
    // lazyloaded modules
    var isLazyLoaded = !!viewComponent.loadModule;
    this._loadModule(viewComponent.loadModule).then(componentFactory => {
        ComponentFactoryResolver(isLazyLoaded ? componentFactory : viewComponent, viewObjectInstance.element, componentRef => {
            viewObjectInstance.compiledWith = componentRef;
            if (routeConfig.scrollTop) {
                window.scrollTo(0, 0);
            }
        });
    });
};

/**
 * remove Views from holder
 * @param {*} _views 
 * @param {*} mView 
 */
ViewHandler.prototype.removeViews = function (views) {
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
ViewHandler.prototype.getCurrentView = function (route) {
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

        return mView
    }

    views = views.concat(route.route._views);
    this.removeViews(views);
    mView = null;

    return views;
}

/**
 * trigger the resolved route views
 */
ViewHandler.prototype.resolveViews = function (route) {
    var views = this.getCurrentView(route);
    for (var idx = 0; idx < views.length; idx++) {
        var view = views[idx] || staticRoutePrefix;
        var viewObj = route.views[view] || route;
        var viewObjectInstance = this.getView(view);
        /**
         * Open Activity
         */
        if (!viewObj) {
            errorBuilder('[Router] No view definition for ' + route.name);
            continue;
        }

        if (viewObjectInstance) {
            this.compileViewTemplate(viewObj, viewObjectInstance);
        } else {
            //Push pending view to stack
            this._pendingViewStack.set(view, viewObj);
        }
    }
};

ViewHandler.prototype.destroy = function (ref) {
    var viewInstance = this.viewsHolder.get(ref);
    if (!viewInstance) return;
    this.cleanUp(viewInstance);
    this.viewsHolder.delete(ref);
    viewInstance = null;
};

ViewHandler.prototype.handlePendingView = function (viewName) {
    if (this._pendingViewStack.has(viewName)) {
        this.compileViewTemplate(this._pendingViewStack.get(viewName), this.viewsHolder.get(viewName));
        this._pendingViewStack.delete(viewName);
    }
}

/**
 * 
 * @param {*} viewInstance 
 */
ViewHandler.prototype.cleanUp = function (viewInstance) {
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
ViewHandler.prototype._loadModule = function (mLoader) {
    if (!mLoader) return Promise.resolve(null);
    return mLoader()
        .then(module => {
            compileModule(module);
            return module.rootElement;
        });
}