import { VALUE_ACCESSOR } from './abstract.event.accessor';
import { errorBuilder } from '@jeli/core';
import { closureRef } from '@jeli/core';

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
export function RadioEventContainer() {
    var _registry = [];
    this.register = function(eventBinder) {
        _registry.push(eventBinder);
    };

    this.remove = function(eventBinder) {
        _registry.splice(_registry.indexOf(eventBinder), 1);
    };

    this.selectValue = function(eventBinder) {
        _registry.forEach(function(registeredBinder) {
            if (isSameGroup(registeredBinder, eventBinder) && registeredBinder !== eventBinder) {
                registeredBinder.writeValue(eventBinder.value);
            }
        });
    }

    function isSameGroup(a, b) {
        return a.name === b.name;
    }
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
export function RadioEventBinder(elementRef, radioEventContainer) {
    AbstractValueAccessor.call(this, elementRef);
    this.radioEventContainer = radioEventContainer;
    this.state = false;
};

RadioEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
RadioEventBinder.prototype.constructor = AbstractValueAccessor;

RadioEventBinder.prototype.didInit = function() {
    this._checkFieldName();
    this.radioEventContainer.register(this);
};

RadioEventBinder.prototype.didDestroy = function() {
    this.radioEventContainer.remove(this);
};

RadioEventBinder.prototype._checkFieldName = function() {
    if (this.name && this.formField && this.formField !== this.name) {
        errorBuilder('if you define a name and formField both values must match. <input type=radio name=radio :form-field=radio');
    }

    if (!this.name && this.formField) this.name = this.formField;
}

RadioEventBinder.prototype.registerOnChange = function(onChangeFn) {
    var _this = this;
    this._onChange = onChangeFn;
    this.onChange = function(value) {
        onChangeFn(_this.value);
        _this.radioEventContainer.selectValue(_this);
    };
};

RadioEventBinder.prototype.writeValue = function(value) {
    this.state = value == this.value;
    this.element.setProp('checked', this.state, true);
};