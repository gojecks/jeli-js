Directive({
    selector: 'formField',
    DI: ['ElementRef?', 'parentControl?=:formControl'],
    props: ['formField'],
})

/**
 * 
 * @param {*} elementRef 
 * @param {*} parentControl 
 */
export function FormFieldDirective(elementRef, parentControl) {
    Object.defineProperties(this, {
        formField: {
            set: function(formFieldName) {
                this._fieldName = formFieldName;
                if (parentControl) {
                    this._control = parentControl.getField(formFieldName);
                }

                this._setUpControl();
            }
        }
    });
}


FormFieldDirective.prototype._setUpControl = function() {
    this._attachView();
    this._control.registerOnChangeListener(function(value, emitToView) {
        console.log("value changed:", value, emitToView);
    });
};


FormFieldDirective.prototype.viewDidDestroy = function() {
    if (this._parentControl) {
        this._parentControl.removeField(this._fieldName);
        this._parentControl = null;
    }
    this._control = null;
    this._viewInstance = null;
};