import { scheduler } from '../../utils/scheduler';
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
        this._viewRefs.splice(index, 0, view);
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
                parent.insertAfter(view.compiledElement.nativeElement, targetNode.nativeElement);
            }
        }
    });
};

ViewRef.prototype.remove = function(index) {
    var view = this._viewRefs.splice(index, 1)[0];
    if (view) {
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
    this.compiledElement = templateRef.createElement(parentRef);
    this.context = context;
    this.unsubscribeScheduler;
    /**
     * create the Viewcontext if templateRef has a context
     */
    if (templateRef.hasContext) {
        ComponentRef.create(this.compiledElement.refId, parentRef.hostRef.refId);
        _componentRef = componentDebugContext.get(this.compiledElement.refId);
        /**
         * build the localVariables if context is defined
         */
        _componentRef._context = createLocalVariables(templateRef.getContext(), this);
    }

    /**
     * schedule a view rendering
     * @param {*} index 
     */
    this.renderView = function(index) {
        var _this = this;
        this.unsubscribeScheduler = scheduler.schedule(function() {
            var targetNode = (parentRef.children.last || parentRef).nativeElement;
            if (index !== undefined && parentRef.children.length > index) {
                targetNode = parentRef.children.getByIndex(index - 1).nativeElement;
            }
            transverse(_this.compiledElement);
            parentRef.insertAfter(_this.compiledElement.nativeElement, targetNode);
            parentRef.children.add(_this.compiledElement, index);
            _this.compiledElement.changeDetector.detectChanges();
        });
    }


    this.destroy = function() {
        this.unsubscribeScheduler();
        if (_componentRef && !this.compiledElement.isc) {
            _componentRef.destroy();
            _componentRef = null;
        }

        this.compiledElement.remove(true);
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

/**
 * 
 * @param {*} localVariables 
 */
function createLocalVariables(localVariables, viewContext) {
    var context = {};
    if (localVariables) {
        for (var propName in localVariables) {
            if (localVariables[propName].match(/\s/)) {
                context[propName] = localVariables[propName];
            } else {
                writePropertyBinding(propName);
            }
        }
    }

    /**
     * 
     * @param {*} propName 
     */
    function writePropertyBinding(propName) {
        Object.defineProperty(context, propName, {
            get: function() {
                if (!viewContext.context) return;

                return viewContext.context[localVariables[propName]];
            }
        });
    }
    return context;
}