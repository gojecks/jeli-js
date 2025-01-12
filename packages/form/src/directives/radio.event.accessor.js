import { VALUE_ACCESSOR } from './abstract.event.accessor';
import { closureRef, AttributeAppender, errorBuilder } from '@jeli/core';

function isSameGroup(a, b) {
    return a.name === b.name;
}

export var ResolveRadioBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return RadioEventBinder;
    })
};
/**
 * @internal use only
 */
Service()
export class RadioEventContainer {
    constructor() {
        this._registry = [];
    }

    register(eventBinder) {
        this._registry.push(eventBinder);
    }

    remove(eventBinder) {
        this._registry.splice(this._registry.indexOf(eventBinder), 1);
    }

    selectValue(eventBinder) {
        this._registry.forEach(function (registeredBinder) {
            if (isSameGroup(registeredBinder, eventBinder) && registeredBinder !== eventBinder) {
                registeredBinder.writeValue(eventBinder.value);
            }
        });
    };
}


Directive({
    selector: 'input:type=radio:[model|formField|fieldControl]',
    props: ['name', 'formField', 'value'],
    events: [
        "change:event=onChange($event.target.value)",
        "blur:event=onBlur($event)"
    ],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveRadioBinder],
    DI: ['ElementRef?', RadioEventContainer]
})

/**
 *
 * @param {*} elementRef
 */
export class RadioEventBinder extends AbstractValueAccessor{
    constructor(elementRef, radioEventContainer) {
        super(elementRef);
        this.radioEventContainer = radioEventContainer;
        this.state = false;
    }
    didInit() {
        this._checkFieldName();
        this.radioEventContainer.register(this);
    }
    didDestroy() {
        this.radioEventContainer.remove(this);
    }
    _checkFieldName() {
        if (this.name && this.formField && this.formField != this.name) {
            errorBuilder('if you define a name and formField both values must match. <input type=radio name=' + this.name + ' :formField=' + this.formField);
        }

        if (!this.name && this.formField) this.name = this.formField;
    }
    registerOnChange(onChangeFn) {
        this._onChange = onChangeFn;
        this.onChange = (value) => {
            onChangeFn(this.value);
            this.radioEventContainer.selectValue(this);
        };
    }
    writeValue(value) {
        this.state = value == this.value;
        AttributeAppender.setProp(this.element.nativeElement, 'checked', this.state);
    }
};