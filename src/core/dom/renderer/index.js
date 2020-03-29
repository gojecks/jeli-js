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
            var compiled = HtmlParser[transpiledHTML[i].type](transpiledHTML[i], parent, this);
            if (compiled) {
                _viewContainer.push(compiled);
            }
        }

        return HtmlParser.toFragment(_viewContainer, parent);
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
HtmlParser.element = function(definition, parent, viewContainer) {
    var elementRef = new ElementRef(parent, copy(definition, true));
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
            var child = HtmlParser[definition.children[i].type](definition.children[i], elementRef, viewContainer, true);
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

HtmlParser.text = function(definition, parent) {
    return new TextNodeRef(copy(definition, true), parent);
};

/**
 * <j-fragment *outlet='testContent:*'></j-fragment>
 * <j-template #test-content data-test></j-template>
 * @param {*} definition
 * @param {*} parent
 * @param {*} viewContainer
 * @param {*} appendToChild
 */
HtmlParser.place = function(definition, parent, viewContainer, appendToChild) {
    var hostRef = parent.hostRef;
    var templates = hostRef.getTemplateRef('place');
    if (definition.selector) {
        templates = templates.selector(definition.selector);
    }

    templates.forEach(function(template) {
        var child = HtmlParser[template.type](template, parent, viewContainer);
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
HtmlParser.outlet = function(definition, parent, viewContainer) {
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

HtmlParser.comment = function(definition, parent) {
    return new CommentRef(definition, parent);
};

HtmlParser.toFragment = function(compiledTemplate, parent) {
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
HtmlParser.parseFromString = function(html) {
    return document.createRange().createContextualFragment(html);
};