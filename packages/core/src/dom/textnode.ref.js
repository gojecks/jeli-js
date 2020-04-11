/**
 * 
 * @param {*} definition
 * @param {*} parent 
 */
function TextNodeRef(definition, parent) {
    var _this = this;
    this.nativeNode = document.createTextNode(definition.ast.rawValue);
    this.type = 'text';

    this.render = function() {
        compileTemplate(definition.ast, parent.context, function(value) {
            _this.nativeNode.nodeValue = value;
        });
    };

    Object.defineProperty(this, 'hasBinding', {
        get: function() {
            return !!definition.ast.templates;
        }
    });

    if (definition.ast._) {
        parent.observer(SubscribeObservables(parent.hostRef.refId, this.render));
    };

}

TextNodeRef.prototype.remove = function() {
    this.nativeNode.remove();
    this.nativeNode = null;
};