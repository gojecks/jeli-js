/**
 * 
 * @param {*} templates 
 * @param {*} templateId 
 */
function getTemplateRef(templates, templateId) {
    if (!templates || !templates.hasOwnProperty(templateId)) {
        errorBuilder('No templates Defined #' + templateId);
    }

    return {
        /**
         * build the required element based on the template definition
         * @param {*} parentNode 
         */
        createElement: function(parentNode) {
            var template = templates[templateId];
            return HtmlParser[template.type](template, parentNode);
        },
        getContext: function() {
            return templates[templateId].context;
        },
        forEach: function(callback) {
            return templates[templateId].forEach(callback);
        },
        querySelector: function(selector) {
            return templates[templateId].filter(_selector);
            /**
             * returns the required template to compile
             */
            function _selector(template) {
                switch (selector[0]) {
                    case ('id'):
                    case ('class'):
                        return (template.attr && $inArray(template.attr[selector[0]], selector[1]));
                    default:
                        return $isEqual(selector[1], template.name);
                }
            }
        }
    };
}