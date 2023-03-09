export var sce = (function() {
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
})();