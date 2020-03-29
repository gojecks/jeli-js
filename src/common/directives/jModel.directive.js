/*
 * jModel Core Function
 * Directive Name: j-Model
 */
Directive({
    selector: 'model',
    DI: ['VALUE_ACCESSOR?', 'parentControl?=form', 'VALIDATORS?'],
    props: [
        'model',
        'modelOptions',
        'name'
    ],
    registry: [
        "modelChange:emitter"
    ],
    exportAs: "jModel"
}, ModelDirective);

/**
 * 
 * @param {*} eventBinder 
 * @param {*} parentControl 
 * @param {*} fieldValidators 
 */
function ModelDirective(eventBinder, parentControl, validators) {
    this.eventBinder = eventBinder;
    this.fieldControl = new FormFieldControlService();
    this._parentControl = parentControl;
    this._validators = validators;
    this.unSubscription = null;
    this.modelChange = new SimpleEventEmitter();
}

ModelDirective.prototype.modelToViewUpdate = function(value) {
    this.model = value;
    this.modelChange.emit(value);
};

ModelDirective.prototype.didInit = function() {
    /**
     * set the view to the model instance
     * set the viewReferenceIndex
     * used to remove Object from the collector when element is removed from DOM
     **/
    setUpControl(this.fieldControl, this);
};

ModelDirective.prototype.viewDidDestroy = function() {
    // perform cleanUp
    // observe the element change
    this.unSubscription();
    this._control = null;
};