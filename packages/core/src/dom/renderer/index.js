import { TemplateRef } from "./templateref";

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
                pushToParent(child, elementRef, i);
            }
        }
    }

    if (definition.vc) {
        addViewQuery(elementRef.hostRef, definition.vc, elementRef);
    }

    return elementRef;
}

/**
 * push Child element to parent
 * @param {*} child 
 * @param {*} parent 
 */
function pushToParent(child, parent, index) {
    parent.children.add(child, index);
    parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
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
 * @param {*} appendToParent
 */
function place(definition, parent, viewContainer, appendToParent) {
    var hostRef = parent.hostRef;
    var createPlaceElement = !(viewContainer || appendToParent);
    var template = TemplateRef.factory(hostRef, 'place', true);
    var placeElement = (createPlaceElement) ? new AbstractElementRef({
        name: "#fragment",
        type: "element"
    }, hostRef) : null

    /**
     * 
     * @param {*} elementDefinition 
     */
    function createAndAppend(elementDefinition) {
        var child = ViewParserHelper[elementDefinition.type](elementDefinition, hostRef.parent, viewContainer);
        // store the origin
        child.hostRefId = hostRef.refId;
        if (appendToParent || createPlaceElement) {
            pushToParent(child, placeElement || parent);
        } else {
            viewContainer.pushToView(child);
        }

        /**
         * check if VC property is defined in placeTemplate
         * register the required to the child
         */
        if (definition.vc && ([elementDefinition.refId, child.tagName].includes(definition.vc[0].value))) {
            addViewQuery(hostRef, definition.vc, child);
        }
    }

    if (template) {
        template.forEach(definition.selector, createAndAppend);
    }

    return placeElement;
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
        if (node._lazyCompiled) return;
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