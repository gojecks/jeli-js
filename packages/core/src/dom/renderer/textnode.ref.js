/**
 * 
 * @param {*} definition
 * @param {*} parent 
 */
function TextNodeRef(definition, parent) {
    this.nativeNode = document.createTextNode(definition.ast.text);
    this.type = 'text';
    this.hasBinding = !!definition.ast.templates;

    if (this.hasBinding) {
        Object.defineProperties(this, {
            parent: {
                get: function() {
                    return parent;
                }
            },
            ast: {
                get: function() {
                    return definition.ast;
                }
            }
        });
    }
}