/**
 * Element ViewRef
 */
function ViewRef(elementRef) {
    this._destroyed = false;
    /**
     * @param {*} templateRef
     * @param {*} context
     */
    this.createEmbededView = function(templateRef) {
        var compiledElement = templateRef.createElement(elementRef);
        var templateContext = templateRef.getContext();
        var _componentRef = null;
        elementRef.insertAfter(compiledElement, (elementRef.children.last || elementRef).nativeElement);
        /**
         * ViewRef Object
         */
        return ({
            removeView: function() {
                if (templateContext && _componentRef) {
                    _componentRef.destroy();
                    templateContext = null;
                    _componentRef = null;
                }

                compiledElement.remove(true);
                compiledElement = null;
            },
            setContext: function(context) {
                /**
                 * build the localVariables if context is defined
                 */
                if (templateContext) {
                    var localVariables = createLocalVariables(templateContext, context);
                    ComponentRef.create(compiledElement.refId, compiledElement.parent && compiledElement.parent.refId);
                    _componentRef = componentDebugContext.get(compiledElement.refId);
                    _componentRef._context = localVariables;
                }
                compiledElement.changeDetector.detectChanges();
            },
            updateContext: function(updates) {
                if (templateContext) {
                    var componentRef = componentDebugContext.get(compiledElement.refId);
                    for (var prop in updates) {
                        componentRef.updateModel(prop, updates[prop]);
                    }
                }
                compiledElement.changeDetector.detectChanges();
            }
        });
    };

    /**
     * destroy the child view
     */
    this.clearView = function() {
        elementRef.children.destroy();
    };
}