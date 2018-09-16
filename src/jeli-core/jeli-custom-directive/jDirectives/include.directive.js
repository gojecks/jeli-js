/**
 * @Directive <j-include>
 * loads the required template and append it to the parent element 
 * (content of the parent element will be overwritten)
 * @Usage 
 * element <j-include source="/ui-template.html">
 *  attr <any j-include="/ui-template.html">
 */
$defaultDirectiveProvider.push({
    selector: "j-include",
    priority: 7,
    transplace: true,
    isDefault: true
});

defaultElementInitializer.prototype['include'] = function() {
    /**
     *Resolve the URL
     */
    var url = (this.checker.indexOf('/') > -1) ? this.checker : maskedEval(this.checker, this.$model),
        templFac = findInProvider('$templateCache'),
        $self = this;

    if (url) {
        //check if content is in templateCache
        //If true render the template
        this.isDetached = !$isEqual(url, this.lastProcessed);
        if (this.isDetached) {
            resetIncludeTemplate();
            // get the required template
            var cache = templFac.get(url);
            if (cache || isPlainHtml(url)) {
                $includeBuilder(cache || url);
            } else {
                $http.get(url).then(function(data) {
                    if ($isString(data.data)) {
                        var parsedHTML = $sce().trustAsHTML(data.data);
                        templFac.put(url, parsedHTML);
                        $includeBuilder(parsedHTML);
                    }
                }, resetIncludeTemplate);
            }
        }
    } else {
        resetIncludeTemplate();
    }

    function resetIncludeTemplate() {
        if ($self.isProcessed) {
            $self.parentNode.removeChild($self.elem);
            $self.elem = $self.$createElement();
            $self.parentNode.insertBefore($self.elem, $self.cENode);
        }
        $self.isProcessed = true;
    }

    function $includeBuilder(html) {
        element($self.elem)
            .html(html)
            .data({ ignoreProcess: [$self.cSelector], reCompileChild: !hasAnyAttribute($self.$attr, [':controller', 'j-controller']) });
        //transverse the new instance of element with the model
        var nModel = $self.$model.$new();
        $templateCompiler($self.elem, true)(nModel, $self.ref);
    }

    function isPlainHtml(html) {
        return (html || '').match(/[<>]/);
    }
    //track  last processed url
    this.lastProcessed = url;
};