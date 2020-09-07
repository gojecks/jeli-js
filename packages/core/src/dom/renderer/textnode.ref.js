/**
 * 
 * @param {*} definition
 * @param {*} parent 
 */
function TextNodeRef(definition, parent) {
    var _this = this;
    this.nativeNode = document.createTextNode(definition.ast.text);
    this.type = 'text';
    this.hasBinding = !!definition.ast.templates;

    this.render = function() {
        compileTemplate(definition.ast, parent.context, parent.componentInstance, function(value) {
            if (_this.nativeNode.nodeValue === value) return;
            _this.nativeNode.nodeValue = value;
        });
    };

    this.registerObserver = function() {
        this.render();
        if (!definition.ast.once) {
            parent.observer(SubscribeObservables(parent.hostRef.refId, this.render));
        };
    }
}

TextNodeRef.prototype.remove = function() {
    this.nativeNode.remove();
    this.nativeNode = null;
};