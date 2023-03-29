import { isfunction } from '@jeli/helpers';
/**
 * 
 * @param {*} templates 
 * @param {*} isContentChild 
 */
export function TemplateRef(templates, isContentChild) {
    /**
     * build the required element based on the template definition
     * @param {*} parentNode 
     */
    this.createElement = function(parentNode, viewContainer, context) {
        return ViewParser.builder[templates.type](templates, parentNode, viewContainer, context);
    };

    this.getContext = function() {
        return templates.context;
    };

    /**
     * 
     * @param {*} selector 
     * @param {*} callback 
     */
    this.forEach = function(selector, callback) {
        if (templates.hasOwnProperty(selector)) {
            // initialize templates as function
            templates[selector].forEach(tmpl => callback((isfunction(tmpl) ? tmpl() : tmpl)));
        }
    }
}

TemplateRef.factory = function(node, templateId, silent) {
    var templates = node["[[tmpl]]"];
    if (!templates || !templates.hasOwnProperty(templateId)) {
        if (!silent) errorBuilder('No templates Defined #' + templateId);
        return null;
    }

    /**
     * check if templateId is function
     * call the method to assign the value so we don't keep calling the method
     */
    if ((typeof templates[templateId] === 'function')) {
        templates[templateId] = templates[templateId]();
    }

    return new TemplateRef(templates[templateId]);
};