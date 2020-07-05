Directive({
    selector: 'if',
    DI: ['ViewRef?', 'TemplateRef?'],
    props: [
        'if',
        'ifElse:TemplateRef',
        'ifThen:TemplateRef'
    ]
})

/**
 * Compiles the required element based on the logic provided
 * elements are removed from the DOM if condition is not met
 * allowed type Attirbute and Element
 * @param {*} viewRef 
 * @param {*} templateRef 
 */
export function IfDirective(viewRef, templateRef) {
    this._jIfValue = false;
    this._thenTemplateRef = templateRef;
    this._elseTemplateRef = null;
    this._thenView = null;
    this._elseView = null;

    this.createView = function() {
        if (this._jIfValue) {
            if (!this._thenView) {
                viewRef.clearView();
                this._elseView = null;
                if (this._thenTemplateRef) {
                    this._thenView = viewRef.createEmbededView(this._thenTemplateRef);
                }
            }
        } else {
            if (!this._elseView) {
                viewRef.clearView();
                this._thenView = null;
                if (this._elseTemplateRef) {
                    this._elseView = viewRef.createEmbededView(this._elseTemplateRef);
                }
            }
        }
    };

    Object.defineProperties(this, {
        if: {
            set: function(value) {
                this._jIfValue = value;
                this.createView();
            }
        },
        ifElse: {
            set: function(templateRef) {
                this._elseTemplateRef = templateRef;
                this.createView();
            }
        },
        ifThen: {
            set: function(templateRef) {
                if (templateRef) {
                    this._thenTemplateRef = templateRef;
                    this.createView();
                }
            }
        }
    });
}