import { ComponentFactoryResolver, DOMHelper } from '@jeli/core';
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
        compiledWith: null,
        cleanUp: function() {
            if (this.compiledWith) {
                DOMHelper.remove(this.compiledWith);
            } else {
                // templates only
                this.element.children.forEach(DOMHelper.remove);
            }
        }
    });

    return this;
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
    viewObjectInstance.cleanUp();
    if (viewComponent) {
        ComponentFactoryResolver(viewComponent, viewObjectInstance.element, function(componentRef) {
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
    var _this = this;
    this.viewsHolder.forEach(function(view, key) {
        if (!_views.includes(key)) {
            view.cleanUp();
            _this.viewsHolder.delete(key);
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
    if (_route.route.parent && !this._resolvedParents[_route.route.parent.name]) {
        var parentRoute = getParentRoute(_route.route.parent.name);
        this._resolvedParents[parentRoute.name] = true;
        this._resolvedParents[_route.route.parent.name] = true;
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

    _views = _views.concat(_route.route.$$views);
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
            this.compileViewTemplate(viewObj, viewObjectInstance);
        } else {
            //Push pending view to stack
            this._pendingViewStack.set(view, viewObj);
        }
    }
};

ViewHandler.prototype.destroy = function(ref) {
    if (!this.viewsHolder.has(ref)) return;
    this.viewsHolder.get(ref).cleanUp();
    this.viewsHolder.delete(ref);
};