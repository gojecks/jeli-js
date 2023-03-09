/**
 * 
 * @param {*} definition
 * @param {*} parent 
 */
export function TextNodeRef(definition, parent) {
    this.nativeNode = document.createTextNode(definition.ast[0]);
    this.type = 3;
    this.hasBinding = definition.ast.length > 1;

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