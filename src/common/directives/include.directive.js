/**
 * @Directive <j-include>
 * loads the required template and append it to the parent element 
 * (content of the parent element will be overwritten)
 * @Usage 
 * element <j-include source="/ui-template.html">
 *  attr <any j-include="/ui-template.html">
 */
commonModule
    .directive({
        selector: 'j-include',
        transplace: 'element',
        props: [{
            name: 'binding',
            value: 'src'
        }, {
            name: 'content',
            value: 'content'
        }],
        DI: ['ElementRef', '$templateCache', 'Observables', '$sce']
    }, IncludeDirective);

function IncludeDirective(elementRef, $templateCache, Observables, $sce) {
    this.binding;
    this.compiledElem;
    this.didInit = function() {
        if (this.content) {
            this.compileHtml();
        } else {
            if ($inArray('/', this.binding)) {
                this.process(this.binding);
            } else {
                Observables
                    .observeForKey(this.binding, this.process.bind(this));
            }
        }
    };

    this.resetIncludeTemplate = function() {
        if (this.compiledElem) {
            this.compiledElem.remove();
        }
    };

    this.compileHtml = function() {
        var child = HtmlParser(this.content, elementRef);
        elementRef.children.forEach(HtmlParser.transverse);
        elementRef.parent.insertAfter(child, elementRef.nativeNode);
        elementRef.context.tick();
    };

    /**
     * 
     * @param {*} url 
     */
    this.process = function(url) {
        if (!url) {
            return;
        }
        var self = this;
        /**
         * Resolve the URL
         */
        this.resetIncludeTemplate();
        // get the required template
        if ($templateCache.has(url)) {
            self.content = $templateCache.get(url);
            self.compileHtml();
        } else {
            $http({
                url: url,
                headers: {
                    'Content-Type': 'text/html',
                },
                callback: function(response) {
                    if (response.success) {
                        self.content = $sce.trustAsHTML(response.data);
                        $templateCache.set(url, self.content);
                        self.compileHtml();
                    } else {
                        self.resetIncludeTemplate();
                    }
                }
            });
        }
    }
}