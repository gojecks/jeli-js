import { copy } from 'js.helpers/utils';
/**
 * 
 * @param {*} transpiledHTML 
 * @param {*} templates 
 * @param {*} providers 
 */
function HtmlParser(transpiledHTML, templates, providers) {
    /**
     * 
     * @param {*} parent 
     * @param {*} viewChild 
     */
    var _viewContainer = [];
    this.buildView = function(parent) {
        for (var i = 0; i < transpiledHTML.length; i++) {
            var compiled = HtmlDOM[transpiledHTML[i].type](transpiledHTML[i], parent, this);
            if (compiled) {
                _viewContainer.push(compiled);
            }
        }

        return toFragment(_viewContainer, parent);
    };

    this.getProvider = function(provide) {
        return providers[provide];
    };

    this.pushToView = function(element) {
        _viewContainer.push(element);
    };

    this.getTemplate = function(templateRefId) {
        if (templates.hasOwnProperty(templateRefId)) {
            return templates[templateRefId];
        }

        errorBuilder('unable to find template [' + templateRefId + ']');
    };
};

/**
 * @param {*} definition
 * @param {*} parent
 * @param {*} viewContainer
 */
function element(definition, parent, viewContainer) {
    var elementRef = new ElementRef(parent, copy(definition));
    if (definition.isc) {
        elementRef.customElements.push(viewContainer.getProvider(definition.name));
    }

    /**
     * register customElements
     */
    if (definition.directives) {
        for (var i = 0; i < definition.directives.length; i++) {
            definition.directives[i].providers.forEach(function(dir) {
                elementRef.customElements.push(viewContainer.getProvider(dir));
            });
        }
    }

    if (definition.attr) {
        AttributeAppender(elementRef.nativeElement, definition.attr);
    }

    if (definition.children) {
        for (var i = 0; i < definition.children.length; i++) {
            var child = HtmlDOM[definition.children[i].type](definition.children[i], elementRef, viewContainer, true);
            if (child) {
                elementRef.children.add(child);
                elementRef.nativeElement.appendChild(child.nativeElement || child.nativeNode);
            }
        }
    }

    if (definition.vc) {
        elementRef.hostRef.viewQuery.add(definition.vc, elementRef);
    }

    return elementRef;
};

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
    if (definition.selector) {
        templates = templates.selector(definition.selector);
    }

    templates.forEach(function(template) {
        var child = HtmlDOM[template.type](template, parent, viewContainer);
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
        var element = HtmlParser.element(template, parent, viewContainer);
        element.context = context;
        return element;
    }

    return null;
};

function comment(definition, parent) {
    return new CommentRef(definition, parent);
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
        if (!compiled) {
            return;
        }

        parent.children.add(compiled);
        fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
        HtmlParser.transverse(compiled);
    }

    return fragment;
};

/**
 * @method parseFromString
 * @param {*} html
 * @return Fragment
 */
function parseFromString(html) {
    return document.createRange().createContextualFragment(html);
};

/**
 * transverse Template Compiler
 * @param {*} node
 */
function transverse(node) {
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

var sce = (function() {
    // trustAsHTML
    // this prevents any overhead from creating the object each time
    var element = document.createElement('div');

    function htmlEscape(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    /**
     * 
     * @param {*} str 
     */
    function decodeHTMLEntities(str) {
        if (str && typeof str === 'string') {
            // strip script/html tags
            str = htmlEscape(str)
                .replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
                .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '')
                .replace(/^[ \n\r\t\f]+/, '')
                .replace(/[ \n\r\t\f]+$/, '');
            element.innerHTML = str;
            str = element.textContent;
            element.textContent = '';
        }

        return str;
    }



    return {
        trustAsHTML: decodeHTMLEntities,
        escapeHTML: htmlEscape,
        isPlainHtml: /<[a-z][\s\S]*>/i
    };
})();

var HtmlDOM = {
    element: element,
    text: text,
    place: place,
    comment: comment,
    outlet: outlet
};

export {
    HtmlParser,
    sce
}