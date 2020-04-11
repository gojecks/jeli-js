// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

// jViewHandler Service

import { inarray } from 'js.helpers/utils/inarray';

Service({
    name: 'jViewHandler',
    DI: ['$jeliWebStateProvider', 'ComponentResolver?']
})

/**
 * 
 * @param {*} jeliWebProvider 
 * @param {*} ComponentResolver 
 */
export function jViewHandlerFn(jeliWebProvider, ComponentResolver) {
    var _this = this;
    this.viewsHolder = new Map();
    this.currentView = '@';
    this.stateInProgress;
    this.stateQueue = [];
    this.$stateTransitioned = false;
    this.currentState = "";
    this.previousState = "";
    this._pendingViewStack = new Map();
    this._resolvedParents = {};

    this.setViewReference = function(elementRef, ref) {
        this.viewsHolder.set(ref, {
            element: elementRef,
            cleanUp: function() {
                if (this.compiledWith) {
                    this.compiledWith.remove();
                } else {
                    // templates only
                    this.element.children.forEach(function(child) {
                        child.remove();
                    });
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
    this.getView = function(view, name) {
        var _viewHolder = this.viewsHolder.get(view);
        return ((name) ? _viewHolder[name] : _viewHolder);
    };

    /**
     * 
     * @param {*} view 
     * @param {*} viewObjectInstance 
     * compile the template when loaded
     */
    this.compileViewTemplate = function(view, viewObjectInstance) {
        //remove cache
        viewObjectInstance.cleanUp();
        if (view.component) {
            ComponentResolver(view.component, viewObjectInstance.element, function(component, componentInstance) {
                component.insertAfter(component.nativeElement, viewObjectInstance.element.nativeElement);
                viewObjectInstance.compiledWith = component;
            });
        } else if (view.template) {
            viewObjectInstance.compiledWith = null;
            viewObjectInstance.element.appendChild(view.template);
        }
    };

    /**
     * remove Views from holder
     * @param {*} _views 
     * @param {*} mView 
     */
    this.removeViews = function(_views) {
        this.viewsHolder.forEach(function(view, key) {
            if (!inarray(key, _views)) {
                view.cleanUp();
                _this.viewsHolder.delete(key);
            }
        });
    }

    /**
     * getCurrentView
     * @param {*} _route 
     * @param {*} currentRoute
     */
    this.getCurrentView = function(_route, currentRoute) {
        var _views = [],
            mView = Object.keys(_route.views).concat();
        // register route to resolved
        this._resolvedParents[_route.name] = true;
        if (_route.route.parent && !this._resolvedParents[_route.route.parent.name]) {
            this._resolvedParents[jeliWebProvider.getParentRoute(_route.route.parent.name).name] = true;
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
    this.resolveViews = function(route, currentRoute) {
        var _views = this.getCurrentView(route, currentRoute);

        /**
         * 
         * @param {*} cb 
         * @param {*} webState 
         */
        return function(cb) {
            cb(route);
            _views.forEach(iterateView);

            function iterateView(view, idx) {
                view = view || '@';
                var viewObj = ((route.views) ? route.views[view] : route),
                    viewObjectInstance = _this.getView(view);
                /**
                 * Open Activity
                 */
                if (viewObjectInstance) {
                    _this.compileViewTemplate(viewObj, viewObjectInstance);
                } else {
                    //Push pending view to stack
                    _this._pendingViewStack.set(view, viewObj);
                }
            }
        };
    };

}