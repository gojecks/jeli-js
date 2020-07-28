import { EventEmitter } from '@jeli/core';
import { getValueAccessor } from '../utils';
import { VALUE_ACCESSOR } from './abstract.event.accessor';
/*
 * jModel Core Function
 * Directive Name: j-Model
 * @param {*} eventBinder 
 * @param {*} parentControl 
 * @param {*} fieldValidators 
 */
Directive({
    selector: 'model',
    DI: [VALUE_ACCESSOR, 'parentControl?=form', 'VALIDATORS?'],
    props: [
        'model',
        'modelOptions',
        'name'
    ],
    events: [
        "modelChange:emitter"
    ],
    exportAs: "jModel"
})
export function ModelDirective(eventBinder, parentControl, validators) {
    this.eventBinder = getValueAccessor(eventBinder);
    this.fieldControl = new FormFieldControlService();
    this._parentControl = parentControl;
    this._validators = validators;
    this.modelChange = new EventEmitter();
    this._model = null;
}

ModelDirective.prototype.didChange = function(changes) {
    if (this._isViewModelChanged(changes)) {
        this.fieldControl.setValue(changes.model, { emitToView: false });
        this._model = changes.model;
    }
}

ModelDirective.prototype.modelToViewUpdate = function(value) {
    this.modelChange.emit(value);
};

ModelDirective.prototype.didInit = function() {
    /**
     * set the view to the model instance
     * set the viewReferenceIndex
     * used to remove Object from the collector when element is removed from DOM
     **/
    setupControl(this.fieldControl, this);
};

ModelDirective.prototype.viewDidDestroy = function() {
    // perform cleanUp
    // observe the element change
    this._control = null;
};

ModelDirective.prototype._isViewModelChanged = function(changes) {
    return changes.hasOwnProperty('model') && changes.model !== this._model;
}