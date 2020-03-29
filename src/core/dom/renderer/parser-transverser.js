/**
 * transverse Template Compiler
 * @param {*} node
 */
HtmlParser.transverse = function(node) {
    if (node instanceof ElementRef) {
        if (node.customElements.length) {
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else if (node instanceof TextNodeRef && node.hasBinding) {
        node.render();
    }

    /**
     * 
     * @param {*} node 
     */
    function proceedWithCompilation(node) {
        /**
         * Bind Listeners to the Element
         **/
        node.events.registerListener();
        //proceed with the compilation
        //checking child elements
        node.children.forEach(HtmlParser.transverse);
    }
}