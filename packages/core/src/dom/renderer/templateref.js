import { isfunction } from '@jeli/helpers';
/**
 * 
 * @param {*} templates 
 */
/**
 *
 * @param {*} templates
 */
export class TemplateRef {
    constructor(templates) {
        /**
         * build the required element based on the template definition
         * @param {*} parentNode
         */
        this.createElement = function (parentNode, viewContainer, context) {
            return jitBuilder.compile(templates, parentNode, viewContainer, context);
        };

        this.getContext = function () {
            return templates.context;
        };

        /**
         *
         * @param {*} selector
         * @param {*} callback
         */
        this.forEach = function (selector, callback) {
            var tmplCallback = tmpl => callback((isfunction(tmpl) ? tmpl() : tmpl));
            if (typeof templates == 'function')
                return templates(selector, tmplCallback);

            if (templates.hasOwnProperty(selector)) {
                // initialize templates as function
                templates[selector].forEach(tmplCallback);
            }
        };
    }

    static factory(node, templateId, silent) {
        var templates = node.internal_getDefinition('templates');
        if (!templates || !templates.hasOwnProperty(templateId)) {
            if (!silent) errorBuilder('No templates Defined #' + templateId);
            return null;
        }

        /**
         * check if templateId is function
         * call the method to assign the value so we don't keep calling the method
         */
        var template = templates[templateId] || templates;
        return new TemplateRef((typeof template === 'function') ? template(templateId) : template);
    }

    static reflect(elementRef, nodeAst, callback) {
        return context => callback(jitBuilder.$1(nodeAst, elementRef, null, context));
    }

    static templatesCompiler(templates, asNative) {
        var childrenNodesLen = asNative ? templates.length : 0;
        var templateTypes = {
            /**
             * custom place handler for native compiler
             * @returns
             */
            place: (placeSelector, callback) => {
                var children = Array.from(selector.children).splice(0, childrenNodesLen);
                if (placeSelector != '@') {
                    children = children.filter(ele => (
                        !ele.classList.has(placeSelector) ||
                        ele.id != placeSelector ||
                        ele.nodeName != placeSelector ||
                        !ele.hasAttribute(placeSelector)));
                }

                // trigger callback
                children.forEach(callback);
                childrenNodesLen -= children.length;
            }
        };

        return type => templateTypes[type];
    }
}

