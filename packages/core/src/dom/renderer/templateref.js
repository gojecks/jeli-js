import { inarray, isequal } from 'js-helpers/helpers';
import { errorBuilder } from '../../utils/errorLogger';
/**
 * 
 * @param {*} templates 
 * @param {*} templateId 
 */
export function TemplateRef(templates, templateId) {
    if (!templates || !templates.hasOwnProperty(templateId)) {
        errorBuilder('No templates Defined #' + templateId);
    }

    /**
     * build the required element based on the template definition
     * @param {*} parentNode 
     */
    this.createElement = function(parentNode) {
        return ViewParserHelper[templates[templateId].type](templates[templateId], parentNode);
    };

    this.getContext = function() {
        return templates[templateId].context;
    };

    this.forEach = function(callback) {
        return templates[templateId].forEach(callback);
    };

    this.querySelector = function(selector) {
        return templates[templateId].filter(_selector);
        /**
         * returns the required template to compile
         */
        function _selector(template) {
            switch (selector[0]) {
                case ('id'):
                case ('class'):
                    return (template.attr && inarray(template.attr[selector[0]], selector[1]));
                default:
                    return isequal(selector[1], template.name);
            }
        }
    };
}