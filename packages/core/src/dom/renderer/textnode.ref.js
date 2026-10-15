/**
 * 
 * @param {*} definition
 * @param {*} parent 
 */
export function TextNodeRef(definition, parent) {
    // SSR hydration (Phase 3, see .claude/plans/greedy-singing-mist.md):
    // adopts a real, already-rendered text node instead of creating a new
    // one when `definition.adoptedNode` is set (dom/renderer/index.js's
    // $3, only when the node was successfully paired during the adoption
    // walk). Absent in every non-hydration render - zero behavior change.
    this.nativeNode = definition.adoptedNode || document.createTextNode(definition.ast[0]);
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