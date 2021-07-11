/**
 * 
 * @param {*} transpiledHTML 
 */
export function ViewParser() {
    /**
     * 
     * @param {*} parent 
     * @param {*} viewChild 
     */
    var fragment = document.createDocumentFragment();
    this.compile = function(transpiledHTML, parent) {
        for (var i = 0; i < transpiledHTML.length; i++) {
            var compiled = ViewParserHelper[transpiledHTML[i].type](transpiledHTML[i], parent, this);
            if (compiled) {
                this.pushToView(compiled);
            }
        }

        return fragment;
    };

    this.pushToView = function(compiled) {
        compiled.parent && compiled.parent.children.add(compiled);
        fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
        transverse(compiled);
    };
};

/**
 * @param {*} definition
 * @param {*} parent
 * @param {*} viewContainer
 */
function element(definition, parent, viewContainer) {
    var elementRef = new ElementRef(definition, parent);
    if (definition.attr) {
        AttributeAppender(elementRef.nativeElement, definition.attr);
    }

    if (definition.children) {
        for (var i = 0; i < definition.children.length; i++) {
            var child = ViewParserHelper[definition.children[i].type](definition.children[i], elementRef, viewContainer, true);
            if (child) {
                elementRef.children.add(child);
                elementRef.nativeElement.appendChild(child.nativeElement || child.nativeNode);
            }
        }
    }

    if (definition.vc) {
        elementAddViewQuery(elementRef.hostRef, definition.vc, elementRef);
    }

    return elementRef;
}

/**
 * 
 * @param {*} definition 
 * @param {*} parent 
 * @returns 
 */
function comment(definition, parent) {
    return new AbstractElementRef(definition, parent);
}

/**
 * 
 * @param {*} definition 
 * @param {*} parent 
 */
function text(definition, parent) {
    return new TextNodeRef(definition, parent);
}

/**
 * <j-template #testContent></j-template>
 * @param {*} definition
 * @param {*} parent
 * @param {*} viewContainer
 * @param {*} appendToChild
 */
function place(definition, parent, viewContainer, appendToChild) {
    var hostRef = parent.hostRef;
    var template = hostRef.getTemplateRef(definition.refId || 'place', true);
    if (template) {
        if (definition.refId) {
            createAndAppend(template);
        } else {
            template.forEach(definition.selector, createAndAppend);
        }
    }
    /**
     * 
     * @param {*} elementDefinition 
     */
    function createAndAppend(elementDefinition) {
        var child = ViewParserHelper[elementDefinition.type](elementDefinition, hostRef.parent, viewContainer);
        if (appendToChild) {
            parent.children.add(child);
            parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
        } else {
            viewContainer.pushToView(child);
        }
    }

    return null;
};

/**
 * @param {*} definition
 * @param {*} parent
 * @param {*} viewContainer
 */
function outlet(definition, parent, viewContainer) {
    var template = definition.template;
    if (!template && parent.hostRef) {
        // retrieve the template from parent component
        template = parent.hostRef.templates[definition.templateId];
    }

    if (template) {
        var element = ViewParserHelper.element(template, parent, viewContainer);
        element.context = context;
        return element;
    }

    return null;
}

/**
 * transverse Template Compiler
 * @param {*} node
 */
function transverse(node) {
    if (node instanceof AbstractElementRef) {
        if (node.providers && node.providers.length) {
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else if (node instanceof TextNodeRef && node.hasBinding) {
        textNodeCompiler(node);
    }

    /**
     * 
     * @param {*} node 
     */
    function proceedWithCompilation(node) {
        if (isequal(node.nativeElement.nodeType, 8)) {
            return;
        };
        /**
         * Bind Listeners to the Element
         **/
        EventHandler.registerListener(node);
        //proceed with the compilation
        //checking child elements
        node.children.forEach(transverse);
    }
}

var ViewParserHelper = {
    element: element,
    text: text,
    place: place,
    outlet: outlet,
    comment: comment
};