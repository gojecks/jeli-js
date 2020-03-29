/**
 * 
 * @param {*} definition 
 * @param {*} parent 
 */
function CommentRef(definition, parent) {
    this.nativeNode = document.createComment(definition.text);
    Object.defineProperties(this, {
        context: {
            get: function() {
                return parent.context
            }
        },
        parent: {
            get: function() {
                return parent;
            }
        },
        refId: {
            get: function() {
                return definition.refId
            }
        }
    });

    this.getTemplate = function() {
        if (definition.template) {
            return HtmlParser[definition.template.type](definition.template, this.parent);
        }
    };
}

CommentRef.prototype.cleanup = function() {

};

CommentRef.prototype.remove = function() {
    this.nativeNode.parentNode.removeChild(this.nativeNode);
    this.cleanup();
};