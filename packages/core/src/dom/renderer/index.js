import { scheduler } from "../../utils/scheduler";
import { ElementRef } from "./element.ref";
import { TemplateRef } from "./templateref";

export var ViewParser = function () {
    function JSONCompiler(templates) {
        var fragment = document.createDocumentFragment();
        /**
         * 
         * @param {*} elementRef 
         * @param {*} viewChild 
         */
        this.compile = function (transpiledHTML, elementRef) {
            for (var i = 0; i < transpiledHTML.length; i++) {
                var compiled = ViewParser.builder[transpiledHTML[i].type](transpiledHTML[i], elementRef, this);
                if (compiled) {
                    this.pushToView(compiled);
                }
            }

            return fragment;
        };

        /**
         * 
         * @param {*} compiled 
         */
        this.pushToView = function (compiled) {
            compiled.parent && compiled.parent.children.add(compiled);
            fragment.appendChild(compiled.nativeElement || compiled.nativeNode);
            transverse(compiled);
        };

        /**
         * 
         * @param {*} tid 
         * @param {*} mtl 
         * @returns 
         */
        this._GT = function (tid, mtl) {
            // extract the templates
            if (mtl && mtl.type) return mtl;
            var tmpl = templates(tid);
            if (!tmpl) return null;
            if (mtl) return Object.assign(mtl, tmpl);
            return (typeof tmpl === 'object') ? tmpl : tmpl();
        }
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
                var child = ViewParser.builder[childDefinition.type](childDefinition, elementRef, viewContainer, context, true);
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
     * <j-place selector=refId|attr|tag|*></j-template>
     * render light dom in shadow dom
     * @param {*} definition
     * @param {*} parent
     * @param {*} viewContainer
     * @param {*} context
     * @param {*} appendToParent
     */
    function place(definition, parent, viewContainer, context, appendToParent) {
        var hostRef = parent.hostRef;
        var createPlaceElement = !(viewContainer || appendToParent);
        var template = TemplateRef.factory(hostRef, 'place', true);
        var placeElement = (createPlaceElement) ? new AbstractElementRef({
            name: "#",
            type: 11
        }, hostRef) : null;

        /**
         * 
         * @param {*} elementDefinition 
         */
        function createAndAppend(elementDefinition) {
            var child = ViewParser.builder[elementDefinition.type](elementDefinition, definition.$ctx ? parent : hostRef.parent, viewContainer, context);
             // Attach the child element to the origin, used for getting the right componentRef
            // actual hostRefId where content is appended
            // ContentHostRef? should reolve the component instance
            child.contentHostRefId = hostRef.refId;
            if (appendToParent || createPlaceElement) {
                pushToParent(child, placeElement || parent);
            } else {
                viewContainer.pushToView(child);
            }

            /**
             * check if VC property is defined in placeTemplate
             * register the child to the hostRef viewQuery
             */
            if (definition.vc && ([elementDefinition.refId, child.tagName].includes(definition.vc[0].value))) {
                addViewQuery(hostRef, definition.vc, child);
            }
        }

        if (template) {
            template.forEach(definition.refId, createAndAppend);
        }

        return placeElement;
    }

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
        var unsubscribeScheduler = noop();
        var fallbackNode = createElementByType('##', 'outlet')
        var fallbackNodes = Object.defineProperties({}, {
            nativeElement: {
                get: () => fallbackNode
            },
            parent: {
                get: () => parent
            }
        });

        function checkAndCompileTemplate(fromObserver) {
            var templateId = getFilteredTemplateValue(def.$templateId, context || parent.context, parent.componentInstance);
            if (currentValue != templateId) {
                unsubscribeScheduler();
                currentValue = templateId;
                var template = def._GT && def._GT(templateId);
                if (template) {
                    var oldElement = element;
                    element = ViewParser.builder[template.type](template, parent, viewContainer, context);
                    /**
                     * return element if element is null or compilation comes from observer
                     */
                    if (!fromObserver || !element)
                        return element;
                    // process  and replace
                    unsubscribeScheduler = scheduler.schedule(function () {
                        if(element){
                            transverse(element);
                            replaceElement(oldElement || fallbackNodes, element);
                        }
                        oldElement = null;
                    });
                } else {
                    // previously compiled but document is not missing
                    if (element){
                        replaceElement(element, fallbackNodes);
                        // set element to null
                        element = null; 
                    } else if (!fromObserver) {
                        return fallbackNodes;
                    }
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
                    next: function () {
                        checkAndCompileTemplate(true);
                    },
                    done: function () {
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
            1: element,
            3: text,
            11: place,
            13: outlet,
            8: comment
        },
        // holds a set of elements based of their refs
        $elementContextContainer: new Map()
    };
}();

/**
 * transverse Template Compiler
 * @param {*} node
 */
function transverse(node) {
    if (node._lcmp) return;
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
        if (isequal(node.type, 8)) {
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