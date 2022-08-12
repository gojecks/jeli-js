import { scheduler } from "../../utils/scheduler";
import { TemplateRef } from "./templateref";

export var ViewParser = function() {

    function JSONCompiler() {
        /**
         * 
         * @param {*} parent 
         * @param {*} viewChild 
         */
        var fragment = document.createDocumentFragment();
        this.compile = function(transpiledHTML, parent) {
            for (var i = 0; i < transpiledHTML.length; i++) {
                var compiled = ViewParser.builder[transpiledHTML[i].type](transpiledHTML[i], parent, this);
                if (compiled) {
                    this.pushToView(compiled);
                }
            }

            return fragment;
        }

        this.pushToView = function(compiled) {
            compiled.parent && compiled.parent.children.add(compiled);
            fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
            transverse(compiled);
        };
    }


    /**
     * 
     * @param {*} definition 
     * @param {*} parent 
     * @param {*} viewContainer 
     * @param {*} context 
     * @returns 
     */
    function element(definition, parent, viewContainer, context) {
        var elementRef = new ElementRef(definition, parent);
        if (definition.attr) {
            AttributeAppender(elementRef.nativeElement, definition.attr);
        }

        if (definition.children) {
            for (var i = 0; i < definition.children.length; i++) {
                var childDefinition = (typeof definition.children[i] === 'function' ? definition.children[i]() : definition.children[i]);
                if (!childDefinition) continue;
                // conditional template checker
                childDefinition.appendToParent = true;
                var child = ViewParser.builder[childDefinition.type](childDefinition, elementRef, viewContainer, context);
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
     * @param {*} context
     */
    function place(definition, parent, viewContainer, context) {
        var hostRef = parent.hostRef;
        var appendToParent = definition.appendToParent;
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
            var child = ViewParser.builder[elementDefinition.type](elementDefinition, hostRef.parent, viewContainer, context);
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
     * <j-fragment {template}="binding" />
     * parse binding and get the required template to be rendered
     * observe for changes to template binding and render template if needed
     * @internal
     * @param {*} def 
     * @param {*} parent 
     * @param {*} viewContainer 
     * @param {*} context 
     * @returns ElementRef | null
     */
    function outlet(def, parent, viewContainer, context) {
        var currentValue = null;
        var element = null;

        function checkAndCompileTemplate(fromObserver) {
            var templateId = getFilteredTemplateValue(def.$templateId, context, parent.componentInstance);
            if (currentValue != templateId) {
                currentValue = templateId;
                var template = def._GT && def._GT(templateId);
                if (template) {
                    var oldElement = element;
                    element = ViewParser.builder[template.type](template, parent, viewContainer, context);
                    if (!fromObserver)
                        return element;

                    // process  and replace
                    scheduler.schedule(function() {
                        transverse(element);
                        replaceElement(oldElement, element);
                        oldElement = null;
                    });
                }
            }
        }

        if (def.$templateId) {
            /**
             * definitions with context will be managed and destroyed by parent Observer
             * *jForOf directive
             */
            if (!def.context) {
                ObserveUntilDestroyed(parent, {
                    next: function() {
                        checkAndCompileTemplate(true);
                    },
                    done: function() {
                        element = null;
                    }
                });
            }

            return checkAndCompileTemplate();
        }

        return null;
    }

    return {
        JSONCompiler: JSONCompiler,
        builder: {
            element: element,
            text: text,
            place: place,
            outlet: outlet,
            comment: comment
        }
    };
}();

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