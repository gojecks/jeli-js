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
export class ModelDirective {
    constructor(eventBinder, parentControl, validators) {
        this.eventBinder = getValueAccessor(eventBinder);
        this._parentControl = parentControl;
        this._validators = validators;
        this.modelChange = new EventEmitter();
        this._model = null;
    }
    didChange(changes) {
        if (this._isViewModelChanged(changes)) {
            this._model = changes.model;
            if (!this.fieldControl) return;
            this.fieldControl.setValue(this._model, { emitToView: true });
        }
    }
    modelToViewUpdate(value) {
        this.modelChange.emit(value);
    }
    didInit() {
        /**
         * set the view to the model instance
         * set the viewReferenceIndex
         * used to remove Object from the collector when element is removed from DOM
         **/
        this.fieldControl = new FormFieldControlService(Object.assign({ value: this._model }, this.modelOptions));
        setupControl(this.fieldControl, this);
    }
    viewDidDestroy() {
        // perform cleanUp
        // observe the element change
        this._control = null;
    }
    _isViewModelChanged(changes) {
        return changes.hasOwnProperty('model') && changes.model !== this._model;
    }
    _setValueToModel(value) {
        if (!this.fieldControl) return;
        this.fieldControl.setValue(value, { emitToView: true });
        this._model = changes.model;
    }
}