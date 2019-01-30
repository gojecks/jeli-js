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
        }],
        DI: ['ElementRef', '$templateCache', 'Observables', '$sce']
    }, IncludeDirective);

function IncludeDirective(elementRef, $templateCache, Observables, $sce) {
    this.binding;
    this.compiledElem;
    this.didInit = function() {
        if ($inArray('/', this.binding)) {
            this.process(this.binding);
        } else {
            Observables
                .observeForKey(this.binding, process);
        }
    };

    this.resetIncludeTemplate = function() {
        if (this.compiledElem) {
            this.compiledElem.remove();
        }
    };

    this.compileHtml = function(url) {
        var html = $templateCache.get(url);
        var child = HtmlParser(html, elementRef);
        elementRef.children.forEach(HtmlParser.transverse);
        elementRef.parent.insertAfter(child, elementRef.nativeElement);
    };

    /**
     * 
     * @param {*} url 
     */
    this.process = function(url) {
        var self = this;
        /**
         * Resolve the URL
         */
        this.resetIncludeTemplate();
        // get the required template
        if ($templateCache.has(url)) {
            self.compileHtml(url);
        } else {
            $http.get(url, null, {
                    'Content-Type': 'text/html'
                })
                .then(function(template) {
                    $templateCache.set(url, $sce.trustAsHTML(template));
                    self.compileHtml(url);
                }, self.resetIncludeTemplate);
        }
    }
}