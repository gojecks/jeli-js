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
        this._validators = validators;
        this._parentControl = parentControl;
        this.modelChange = new EventEmitter();
        this.fieldControl = new FormFieldControlService(null);
    }


    set model(value){
        this.fieldControl?.setValue(value, { emitToView: true });
        this._value = value;
    }

    get model(){
        return this._value;
    }

    modelToViewUpdate(value) {
        this._value = value;
        this.modelChange.emit(value);
    }

    didInit() {
        this.fieldControl._setInitialState(this.modelOptions || {})
        setupControl(this.fieldControl, this);
    }

    viewDidDestroy() {
        this.fieldControl = null;
    }
}