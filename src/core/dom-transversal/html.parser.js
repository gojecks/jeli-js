/**
 * @param {*} html
 * @param {*} parent
 * @param {*} cb
 */
function HtmlParser(html, parent, cb) {
    if (typeof html === 'string') {
        html = HtmlParser.parseFromString(html);
    }

    if (!cb && $isFunction(parent)) {
        cb = parent;
        parent = null;
    }

    [].forEach.call(html.childNodes, function(ele) {
        var extractedElement;
        if (ele) {
            extractedElement = HtmlParser.__extractor(ele, parent);
            if (extractedElement) {
                if (cb) {
                    cb(extractedElement);
                } else {
                    parent.children.push(extractedElement);
                }
            }
        }
    });

    return html;
};

/**
 * NativeElement Compiler
 * @param {*} ele
 * @param {*} componentRef
 */
HtmlParser.compile = function(ele, componentRef) {
    if ((ele.nodeType === Node.TEXT_NODE)) {
        return new TextNodeRef.compile(ele, componentRef);
    }

    var attr = ele.attributes,
        len = attr.length,
        elementRefInstance = new ElementRef(ele, componentRef);

    while (len--) {
        var node = attr[len].nodeName,
            value = attr[len].nodeValue || attr[len].value;

        /**
         * remove directives
         */
        if ($isEqual(':', node.charAt(0))) {
            elementRefInstance.directives.push({
                name: node,
                checker: value
            });

            ele.removeAttribute(node);
        }
        /**
         * remove DataMatchers
         */
        else if ($inArray('data-', node)) {
            elementRefInstance.data.push({
                propName: camelCase.call(node.replace('data-', '')),
                propValue: value
            });
        }
        /**
         * remove eventMatchers
         */
        else if (/[@]/.test(node)) {
            elementRefInstance.events.push({
                name: node.replace('@', ''),
                value: getFunctionsFromString(value)
            });
            ele.removeAttribute(node);
        }
        /**
         * Remove templateRefId or templateContext
         */
        else if ($isEqual('#', node.charAt(0))) {
            elementRefInstance.setAttribute('[[templateRefId]]', node.substring(1, node.length));
        } else {
            var hasValueBinding = _defaultTemplateExp.exec(value),
                hasNameBinding = /\{(.*?)\}/.exec(node);
            if (hasValueBinding) {
                elementRefInstance.attrObservers.push(TextNodeRef.compile(attr[len]));
            } else if (hasNameBinding) {
                /**
                 * remove and replace the node
                 */
                ele.removeAttribute(node);
                elementRefInstance.props.set(camelCase.call(hasNameBinding[1]), value);
            } else {
                elementRefInstance.setAttribute(camelCase.call(node), simpleArgumentParser(value));
            }
        }
    }
    /**
     * extract component
     */
    elementRefInstance.customElements = HtmlParser.extractCustomElement(elementRefInstance);

    return elementRefInstance;
};

/**
 * @method parseFromString
 * @param {*} html
 * @return Fragment
 */
HtmlParser.parseFromString = function(html) {
    var parser = new DOMParser(),
        fragment = document.createDocumentFragment(),
        doc = parser.parseFromString(html, "text/html");
    html = doc.body.childNodes;
    /**
     * Loop through the HTML nodes
     */
    while (html.length > 0) {
        fragment.appendChild(html[0]);
    }

    return fragment;
};

HtmlParser.tags = {
    block: ['select', 'ul', 'table', 'tr', 'tbody', 'thead', 'tfoot', 'ol', 'optgroup', 'dl', 'colgroup', 'col']
};

/**
 * @param {*} node
 */
HtmlParser.jPlaceCompiler = function(node) {
    // fetch by templateRefId or selector
    var template = node.parent.getTemplate(node.getAttribute('[[templateRefId]]') || node.getAttribute('selector')),
        context;
    if (template) {
        // template contains context
        if (template.context.length) {
            context = Object.create(Object.prototype);
            template.context.forEach(function(item) {
                context[item.propName] = node.parent.context.evaluate(item.propValue);
            });
            context = node.context.new(maskedEval(node.getAttribute('context'), context));
        }

        node.replaceElement = template.content;
    } else {
        node.nativeElement.remove();
        return null;
    }

    /**
     * Parse the child element
     */
    HtmlParser(node.replaceElement, function(child) {
        child.parent = node.parent;
        child.context = context;
        node.children.push(child);
    });
    /**
     * replace current template
     */
    return node;
};

/**
 * @param {*} node
 */
HtmlParser.jFragmentCompiler = function(node) {
    // check if ele has children
    var context = node.context;
    if (node.nativeElement.children.length) {
        /**
         * jPlace requires a isolated context
         */
        if (node.getAttribute('context')) {
            var instance = ControllerInitializer(node.getAttribute('context'), null, {
                ElementRef: node
            });

            context = new ComponentRef(instance);
        }

        node.tagName = 'div';
        node.replaceElement = document.createElement(node.tagName);
        node.replaceElement.innerHTML = node.nativeElement.innerHTML;
    } else {
        node.nativeElement.remove();
        return null;
    }

    /**
     * Parse the child element
     */
    HtmlParser(node.replaceElement, function(child) {
        child.parent = node.parent;
        child.context = context;
        node.children.push(child);
    });
    /**
     * replace current template
     */
    return node;
}

/**
 * extract DIRECTIVES and COMPONENTS FROM ELEMENT
 */
HtmlParser.__extractor = function(ele, parent) {
    var tagName = String.prototype.toLowerCase.call(ele.tagName || ''),
        compileAbleElement = (tagName && ["script", "style", "j-skip"].indexOf(tagName) < 0),
        isTextNode = (ele.nodeType === Node.TEXT_NODE),
        isTemplate = $inArray(tagName, ['j-template', 'template']),
        isCommentNode = (ele.nodeType === Node.COMMENT_NODE),
        canCompile = compileAbleElement || isTextNode,
        node = null;
    if (canCompile && !isCommentNode) {
        node = HtmlParser.compile(ele);
        if (isTemplate) {
            var fragment;
            if (!('content' in ele)) {
                fragment = document.createDocumentFragment();
                while (ele.childNodes.length > 0) {
                    fragment.appendChild(ele.childNodes[0]);
                }
            } else {
                fragment = ele.content;
            }

            ele.parentNode.removeChild(ele);
            /**
             * remove element and childNode from tree
             */
            parent.templates.push({
                ref: node.getAttribute('[[templateRefId]]'),
                context: copy(node.data, true),
                content: fragment
            });

            return null;
        }

        node.parent = parent;
        node.context = parent ? parent.context : null;
        if (compileAbleElement) {
            /**
             * get template from parentNode and attach it to child
             * before compiling
             */
            if ($isEqual(tagName, 'j-place')) {
                return HtmlParser.jPlaceCompiler(node);
            } else if ($isEqual(tagName, 'j-fragment')) {
                return HtmlParser.jFragmentCompiler(node);
            }

            [].forEach.call(ele[$inArray(tagName, HtmlParser.tags.block) ? 'children' : 'childNodes'], function(child) {
                var extractedChildElement = HtmlParser.__extractor(child, node);
                if (extractedChildElement) {
                    node.children.push(extractedChildElement);
                }
            });
        }
    }

    return node
};

/**
 * 
 * @param {*} dir 
 * @param {*} restrictA 
 * @param {*} restrictB 
 */
HtmlParser.checkStructuralDirective = function(dir, restrictA, restrictB) {
    if ($inArray(restrictA, dir) && $inArray(estrictB, dir)) {
        errorBuilder(restrictA + ' directive cannot be used with ' + restrictB + ' directive');
    }
}

/**
 * transverse Template Compiler
 * @param {*} node
 */
HtmlParser.transverse = function(node) {
    if (node.type === 'element') {
        if (node.customElements.length) {
            var strDirective = JSON.stringify(node.customElements);
            HtmlParser.checkStructuralDirective(strDirective, ':for', ':if');
            ElementCompiler.resolve(node, proceedWithCompilation);
        } else {
            proceedWithCompilation(node);
        }
    } else {
        if (node.bindingsCount) {
            node.observe();
        }
    }


    /**
     * 
     * @param {*} node 
     */
    function proceedWithCompilation(node) {
        if (node.replaceElement) {
            node.nativeElement.replaceWith(node.replaceElement);
            node.nativeElement = node.replaceElement;
            node.replaceElement = null;
        }

        /**
         * Bind Listeners to the Element
         **/
        if (node.events.length) {
            node.events.forEach(function(event) {
                node.addEventListener(event);
            });

        }

        //attribute checker for all element
        if (node.attrObservers.length) {
            node.attrObservers.forEach(function(instance) {
                if (instance instanceof TextNodeRef) {
                    instance.context = node.context;
                    instance.observe();
                }
            });
        }

        //proceed with the compilation
        //checking child elements
        node.children.forEach(HtmlParser.transverse);
    }
}

HtmlParser.sce = function() {
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
};

/**
 * 
 * @param {*} element
 */
HtmlParser.extractCustomElement = function(element) {
    var customElement = DependencyInjectorService.getRegisteredElement(element.nativeElement.localName);

    function directiveByPriority(obj) {
        return obj.sort(function(a, b) {
            if (a.annotations.priority < b.annotations.priority) {
                return -1
            } else {
                return 1;
            }
        });
    }

    /**
     * get directives
     */
    if (element.directives.length) {
        element.directives.forEach(function(item) {
            var dir = DependencyInjectorService.getRegisteredElement(item.name);
            customElement = customElement.concat.call(customElement, dir);
        });
    }

    return customElement;
};

/**
 * 
 * @param {*} html 
 * @param {*} attachElementObserver 
 */
HtmlParser.TemplateCompiler = function(html, attachElementObserver) {
    var parsedHTML = HtmlParser(html);
    return function(componentRef) {
        HtmlParser.transverse(parsedHTML.nodes, componentRef);
        if (componentRef) {
            if (attachElementObserver) {
                componentRef.observe();
            }

            componentRef.tick();
        }
        return parsedHTML;
    };
}