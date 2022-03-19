import { inarray, isequal } from 'js-helpers/helpers';
/**
 * 
 * @param {*} templates 
 * @param {*} templateId 
 */
export function TemplateRef(templates) {
    this.hasContext = !!templates.context;
    /**
     * build the required element based on the template definition
     * @param {*} parentNode 
     */
    this.createElement = function(parentNode, viewContainer) {
        return ViewParserHelper[templates.type](templates, parentNode, viewContainer);
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
        /**
         * returns the required template to compile
         */
        function _selectable(template) {
            if (!selector) {
                return true;
            } else if (inarray(selector[0], ['id', 'class'])) {
                return (
                    (template.attr && inarray(template.attr[selector[0]], selector[1])) ||
                    (selector[0] === "id" && template.refId === selector[1])
                );
            } else if (isequal(selector[0], 'attr')) {
                return (template.attr && template.attr.hasOwnProperty(selector[1]));
            } else {
                return isequal(selector[1], template.name);
            }
        }

        for (var i = 0; i < templates.length; i++) {
            var template = templates[i];
            if (_selectable(template)) {
                if (isequal(template.name, '#fragment'))
                    template.children.forEach(callback)
                else
                    callback(template);
            }
        }
    }
}

TemplateRef.factory = function(node, templateId, silent) {
    var templates = node["[[TEMPLATES]]"];
    if (!templates || !templates.hasOwnProperty(templateId)) {
        if (!silent) errorBuilder('No templates Defined #' + templateId);
        return null;
    }
    return new TemplateRef(templates[templateId]);
};