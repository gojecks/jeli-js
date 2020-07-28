import { scheduler } from '../../utils/scheduler';
/**
 * Element ViewRef
 */
export function ViewRef(elementRef) {
    var _viewRefs = new Map();
    this._destroyed = false;
    this.get = function(index) {
        return _viewRefs.get(index);
    };

    /**
     * @param {*} templateRef
     * @param {*} context
     * @param {*} index
     */
    this.createEmbededView = function(templateRef, context, index) {
        var view = new EmbededViewContext(elementRef, templateRef, context);
        _viewRefs.set(index, view);
        /**
         * ViewRef Object
         */
        return view;
    };

    this.remove = function(index) {
        var view = _viewRefs.get(index);
        if (view) {
            view.destroy();
            _viewRefs.delete(index);
        }
    }

    this.move = function(prev, curr) {
        _viewRefs.set(curr, _viewRefs.get(prev));
        _viewRefs.delete(prev);
    };

    /**
     * destroy the child view
     */
    this.clearView = function() {
        _viewRefs.forEach(function(view) {
            view.destroy();
        });
        _viewRefs.clear();
    };

    Object.defineProperty(this, 'length', {
        get: function() {
            return _viewRefs.size;
        }
    });
}

/**
 * 
 * @param {*} elementRef 
 * @param {*} templateRef 
 * @param {*} context 
 */
function EmbededViewContext(parentRef, templateRef, context) {
    var compiledElement = templateRef.createElement(parentRef);
    var targetNode = (parentRef.children.last || parentRef).nativeElement;
    var _componentRef = null;
    var _this = this;
    this.context = context;
    /**
     * set the isc flag so that child will inherit the right reference for componentRef
     */
    createComponentRef();
    parentRef.children.add(compiledElement);
    /**
     * schedule render event
     */
    scheduler.schedule(function() {
        transverse(compiledElement);
        parentRef.insertAfter(compiledElement.nativeElement, targetNode);
        compiledElement.changeDetector.detectChanges();
    });

    this.destroy = function() {
        if (_componentRef) {
            _componentRef.destroy();
            _componentRef = null;
        }

        compiledElement.remove(true);
        compiledElement = null;
        this.context = null;
    }

    this.setContext = function(context) {
        this.context = context;
        compiledElement.changeDetector.detectChanges();
    };

    function createComponentRef() {
        compiledElement.isc = !!templateRef.getContext();
        if (compiledElement.isc) {
            ComponentRef.create(compiledElement.refId, parentRef.hostRef.refId);
            _componentRef = componentDebugContext.get(compiledElement.refId);
            /**
             * build the localVariables if context is defined
             */
            _componentRef._context = createLocalVariables(templateRef.getContext());
        }
    }

    /**
     * 
     * @param {*} localVariables 
     */
    function createLocalVariables(localVariables) {
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
                    if (!_this.context) return;

                    return _this.context[localVariables[propName]];
                }
            });
        }
        return context;
    }
}

EmbededViewContext.prototype.updateContext = function(updates) {
    if (!this.context) return;
    for (var prop in updates) {
        this.context[prop] = updates[prop];
    }
}