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
export class IfDirective {
    constructor(viewRef, templateRef) {
        this.viewRef = viewRef;
        this._jIfValue = false;
        this._thenTemplateRef = templateRef;
        this._elseTemplateRef = null;
        this._thenView = null;
        this._elseView = null;
    }

    set if(value) {
        this._jIfValue = value;
        this.createView();
    }

    get if() {
        return this._jIfValue;
    }

    set ifElse(templateRef) {
        this._elseTemplateRef = templateRef;
        this.createView();
    }

    set ifThen(templateRef) {
        if (templateRef) {
            this._thenTemplateRef = templateRef;
            this.createView();
        }
    }

    createView() {
        if (this._jIfValue) {
            if (!this._thenView) {
                this.viewRef.clearView();
                this._elseView = null;
                if (this._thenTemplateRef) {
                    this._thenView = this.viewRef.createEmbededView(this._thenTemplateRef);
                }
            }
        } else {
            if (!this._elseView) {
                this.viewRef.clearView();
                this._thenView = null;
                if (this._elseTemplateRef) {
                    this._elseView = this.viewRef.createEmbededView(this._elseTemplateRef);
                }
            }
        }
    };
}