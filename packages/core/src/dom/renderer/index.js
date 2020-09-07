import { copy } from 'js-helpers/utils';
import { errorBuilder } from '../../utils/errorLogger';
import { isequal } from 'js-helpers/helpers';

/**
 * 
 * @param {*} transpiledHTML 
 */
export function ViewParser(transpiledHTML) {
    /**
     * 
     * @param {*} parent 
     * @param {*} viewChild 
     */
    var _viewContainer = [];
    this.getView = function(parent) {
        for (var i = 0; i < transpiledHTML.length; i++) {
            var compiled = ViewParserHelper[transpiledHTML[i].type](transpiledHTML[i], parent, this);
            if (compiled) {
                _viewContainer.push(compiled);
            }
        }

        return toFragment(_viewContainer, parent);
    };

    this.pushToView = function(element) {
        _viewContainer.push(element);
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
        elementRef.hostRef.addViewQuery(definition.vc, elementRef);
    }

    return elementRef;
};

function comment(definition, parent, viewContainer) {
    return new AbstractElementRef(definition, parent);
}

/**
 * 
 * @param {*} definition 
 * @param {*} parent 
 */
function text(definition, parent) {
    return new TextNodeRef(copy(definition), parent);
};

/**
 * <j-fragment *outlet='testContent:*'></j-fragment>
 * <j-template #test-content data-test></j-template>
 * @param {*} definition
 * @param {*} parent
 * @param {*} viewContainer
 * @param {*} appendToChild
 */
function place(definition, parent, viewContainer, appendToChild) {
    var hostRef = parent.hostRef;
    var templates = hostRef.getTemplateRef('place');
    templates
        .forEach(definition.selector, function(template) {
            var child = ViewParserHelper[template.type](template, parent.hostRef.parent, viewContainer);
            if (appendToChild) {
                parent.children.add(child);
                parent.nativeElement.appendChild(child.nativeElement || child.nativeNode);
            } else {
                viewContainer.pushToView(child);
            }
        });

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
};


function toFragment(compiledTemplate, parent) {
    var fragment = document.createDocumentFragment();
    while (compiledTemplate.length) {
        processCompiler(compiledTemplate.shift());
    }

    /**
     * 
     * @param {*} compiled 
     */
    function processCompiler(compiled) {
        parent.children.add(compiled);
        fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
        transverse(compiled);
    }

    return fragment;
};

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
        node.registerObserver();
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
        node.events.registerListener();
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