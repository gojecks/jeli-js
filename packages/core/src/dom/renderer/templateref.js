import { inarray, isequal } from 'js-helpers/helpers';
import { errorBuilder } from '../../utils/errorLogger';
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
    this.createElement = function(parentNode) {
        return ViewParserHelper[templates.type](templates, parentNode);
    };

    this.getContext = function() {
        return templates.context;
    };

    this.querySelector = function(selector) {
        return templates.filter(_selector);
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

    this.forEach = function(callback) {
        templates.forEach(callback);
    }
}