import { isequal, isarray, inarray } from 'js-helpers/helpers';
import { VALUE_ACCESSOR } from './abstract.event.accessor';
import { closureRef, AttributeAppender } from '@jeli/core';

export var ResolveSelectBinder = {
    name: VALUE_ACCESSOR,
    reference: closureRef(function() {
        return SelectEventBinder;
    })
};

function _buildValueToString(id, value) {
    if (id == null) return '' + value;
    if (typeof value === 'object' && id) value = 'option:object';
    return (id + ':' + value);
}

Directive({
    selector: 'select:[model|formField|fieldControl]',
    events: [
        "input:event=_handleSelection($event.target.value)",
        "blur:event=onBlur($event)"
    ],
    props: ['compareFn'],
    /**
     * register the instance of this directive to the Value Accessor token
     */
    resolve: [ResolveSelectBinder],
    DI: ['ElementRef?']
})

/**
 * 
 * @param {*} elementRef 
 */
export function SelectEventBinder(elementRef) {
    this.idIncrement = 0;
    this.selectedValue;
    this._optionValueMap = new Map();
    this._compare = isequal;
    AbstractValueAccessor.call(this, elementRef);
    Object.defineProperty(this, 'compareFn', {
        set: function(fn) {
            if (typeof fn !== 'function') {
                throw new Error('expected function for comparisonFN but got ' + typeof fn + ' instead.');
            }

            this._compare = fn;
        }
    });
};

SelectEventBinder.prototype = Object.create(AbstractValueAccessor.prototype);
SelectEventBinder.prototype.constructor = AbstractValueAccessor;

SelectEventBinder.prototype._handleSelection = function(value) {
    this.selectedValue = this._getValue(value);
    this.onChange(this.selectedValue);
};

SelectEventBinder.prototype.writeValue = function(value) {
    this.selectedValue = value;
    var _this = this;
    if (!this.element.hasAttribute('multiple')) {
        var optionId = this._getOptionId(value);
        if (optionId === null) {
            this.element.setProp('selectedIndex', -1);
        }
        this.element.setProp('value', _buildValueToString(optionId, value));
    } else {
        var markAsSelected = function(opt) { AttributeAppender.setProp(opt, 'selected', false); };
        if (Array.isArray(value)) {
            var optionIds = value.map(function(v) { return _this._getOptionId(v) || v; });
            markAsSelected = function(opt) {
                AttributeAppender.setProp(opt, 'selected', inarray(opt.value, optionIds));
            };
        }
        this._markAsSelectedMultiple(markAsSelected);
    }
};

SelectEventBinder.prototype._getValue = function(valueString) {
    if (this.element.hasAttribute('multiple')) {
        var optionsValue = [];
        for (var i = 0; i < this.element.nativeElement.selectedOptions.length; i++) {
            var value = this._getOptionValue(this.element.nativeElement.selectedOptions[i].value);
            optionsValue.push(value);
        }

        return optionsValue;
    }

    return this._getOptionValue(valueString);
}

SelectEventBinder.prototype._getOptionValue = function(valueString) {
    var optionId = valueString.split(':')[0];
    return this._optionValueMap.has(optionId) ? this._optionValueMap.get(optionId) : valueString;
}

SelectEventBinder.prototype.genOptionId = function() {
    return (this.idIncrement++).toString();
};

SelectEventBinder.prototype._getOptionId = function(value) {
    var keys = this._optionValueMap.keys();
    for (var i in keys) {
        if (this._compare(this._optionValueMap.get(keys[i]), value)) return keys[i];
    }

    return null;
};

SelectEventBinder.prototype._markAsSelectedMultiple = function(callback) {
    Array.from(this.element.nativeElement.options).forEach(callback);
}


Directive({
    selector: 'option',
    DI: ['ParentRef?:[model|formField|fieldControl]=select', 'ElementRef?'],
    props: ['value', 'jValue']
})
export function OptionDirective(selectInstance, elementRef) {
    if (selectInstance) this.id = selectInstance.genOptionId();
    // getterSetter for value and jValue
    Object.defineProperty(this, 'value', {
        set: function(value) {
            this.setValue(value);
            if (selectInstance) selectInstance.writeValue(selectInstance.selectedValue);
        }
    });

    Object.defineProperty(this, 'jValue', {
        set: function(value) {
            if (!selectInstance) return;
            selectInstance._optionValueMap.set(this.id, value);
            this.setValue(_buildValueToString(this.id, value));
            selectInstance.writeValue(selectInstance.selectedValue);
        }
    });

    this.setValue = function(value) {
        elementRef.setProp('value', value);
    };

    this.viewDidDestroy = function() {
        if (selectInstance) {
            selectInstance._optionValueMap.delete(this.id);
            selectInstance.writeValue(selectInstance.selectedValue);
        }
    }
}