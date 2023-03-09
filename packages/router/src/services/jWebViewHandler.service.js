import { ComponentFactoryResolver, DOMHelper, compileModule } from '@jeli/core';
import { getParentRoute, staticRoutePrefix } from './utils';
Service({
    name: 'ViewHandler'
})
export function ViewHandler() {
    this.viewsHolder = new Map();
    this.currentView = staticRoutePrefix;
    this.stateInProgress;
    this.stateQueue = [];
    this.$stateTransitioned = false;
    this.currentState = "";
    this.previousState = "";
    this._pendingViewStack = new Map();
    this._resolvedParents = {};
}


ViewHandler.prototype.setViewReference = function(elementRef, ref) {
    this.viewsHolder.set(ref, {
        element: elementRef,
        compiledWith: null
    });

    this.handlePendingView(ref);
};


/**
 * 
 * @param {*} view 
 * @param {*} name 
 */
ViewHandler.prototype.getView = function(view, name) {
    var _viewHolder = this.viewsHolder.get(view);
    return ((name) ? _viewHolder[name] : _viewHolder);
};

/**
 * 
 * @param {*} viewComponent
 * @param {*} viewObjectInstance 
 * compile the template when loaded
 */
ViewHandler.prototype.compileViewTemplate = function(viewComponent, viewObjectInstance) {
    //remove cache
    this.cleanUp(viewObjectInstance);
    // lazyloaded modules
    if (viewComponent.loadModule) {
        this._loadModule(viewComponent.loadModule, compileComponent)
    } else {
        compileComponent(viewComponent);
    }

    // compileElement
    function compileComponent(componentFactory){
        ComponentFactoryResolver(componentFactory, viewObjectInstance.element, componentRef => {
            viewObjectInstance.compiledWith = componentRef;
        });
    }
};

/**
 * remove Views from holder
 * @param {*} _views 
 * @param {*} mView 
 */
ViewHandler.prototype.removeViews = function(_views) {
    this.viewsHolder.forEach((view, key) => {
        if (!_views.includes(key)) {
            this.cleanUp(view);
            this.viewsHolder.delete(key);
        }
    });
}

/**
 * getCurrentView
 * @param {*} _route 
 */
ViewHandler.prototype.getCurrentView = function(_route) {
    var _views = [],
        mView = Object.keys(_route.views).concat();
    // register route to resolved
    this._resolvedParents[_route.name] = true;
    var parentName =  _route.route.parent ? _route.route.parent.name : null;
    if (parentName && !this._resolvedParents[parentName]) {
        var parentRoute = getParentRoute(parentName);
        this._resolvedParents[parentRoute.name] = true;
        this._resolvedParents[parentName] = true;
        return mView;
    }

    if (_route.targetView) {
        //concat the target view
        if (this.viewsHolder.has(_route.targetView)) {
            //concat the views
            return _views.concat(_route.targetView);
        }

        return mView
    }

    _views = _views.concat(_route.route._views);
    this.removeViews(_views);
    mView = null;

    return _views;
}

/**
 * trigger the resolved route views
 */
ViewHandler.prototype.resolveViews = function(route) {
    var _views = this.getCurrentView(route);
    for (var idx = 0; idx < _views.length; idx++) {
        var view = _views[idx] || staticRoutePrefix;
        var viewObj = ((route.views) ? route.views[view] : route);
        var viewObjectInstance = this.getView(view);
        /**
         * Open Activity
         */
        if (viewObjectInstance) {
            if (!viewObj) throw new TypeError('[Router] No view definition for '+ route.name);
            this.compileViewTemplate(viewObj, viewObjectInstance);
        } else {
            //Push pending view to stack
            this._pendingViewStack.set(view, viewObj);
        }
    }
};

ViewHandler.prototype.destroy = function(ref) {
    var viewInstance = this.viewsHolder.get(ref);
    if (!viewInstance) return;
    this.cleanUp(viewInstance);
    this.viewsHolder.delete(ref);
    viewInstance = null;
};

ViewHandler.prototype.handlePendingView = function(viewName) {
    if (this._pendingViewStack.has(viewName)) {
        this.compileViewTemplate(this._pendingViewStack.get(viewName), this.viewsHolder.get(viewName));
        this._pendingViewStack.delete(viewName);
    }
}

/**
 * 
 * @param {*} viewInstance 
 */
ViewHandler.prototype.cleanUp = function(viewInstance) {
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
ViewHandler.prototype._loadModule = function(mLoader, callback){
    if(!mLoader) return callback(null);
    mLoader()
    .then(module => {
        compileModule(module);
        callback(module.rootElement);
    });
}