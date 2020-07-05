import { isfunction } from 'js-helpers/helpers';

/**
 * @Directive <j-include>
 * loads the required template and append it to the parent element 
 * (content of the parent element will be overwritten)
 * @Usage 
 * element <j-include source="/ui-template.html">
 *  attr <any j-include="/ui-template.html">
 */
Directive({
    selector: 'include',
    props: [
        'include',
        'template:TemplateRef'
    ],
    DI: ['ViewRef?', '$sce?']
})

export function IncludeDirective(viewRef, $sce) {
    this._jInclude = undefined;
    this.compileView = function() {
        if (this._jInclude) {
            if (!this._isCompiled) {
                if (isfunction(this._jInclude)) {
                    template = content(elementRef);
                } else {
                    template = ViewParser.parseFromString(content);
                }

                elementRef.parent.insertAfter(template, elementRef.nativeNode);
            }
        }
    };
    this.resetIncludeTemplate = function() {
        if (this.compiledElem) {
            this.compiledElem.remove();
        }
    };

    /**
     * 
     * @param {*} url 
     */
    this.process = function(value) {
        if (!value) {
            return;
        }
        /**
         * Resolve the URL
         */
        this.resetIncludeTemplate();
        // get the required template
        this.compileHtml(value);
    }

    Object.defineProperties(this, {
        include: {
            set: function() {
                this._jInclude = value;
                this.compileView();
            }
        }
    });
}