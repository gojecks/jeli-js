import { isequal, inarray } from '@jeli/helpers';
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
    return (id + '|' + value);
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
export class SelectEventBinder extends AbstractValueAccessor {
    constructor(elementRef) {
        super(elementRef);
        this.idIncrement = 0;
        this.selectedValue;
        this._optionValueMap = new Map();
        this._compare = isequal;
        Object.defineProperty(this, 'compareFn', {
            set: function (fn) {
                if (typeof fn !== 'function') {
                    throw new Error('expected function for comparisonFN but got ' + typeof fn + ' instead.');
                }

                this._compare = fn;
            }
        });
    }
    _handleSelection(value) {
        this.selectedValue = this._getValue(value);
        this.onChange(this.selectedValue);
    }
    writeValue(value) {
        if (!this.element.hasAttribute('multiple')) {
            var currentSelectedValue = this._getOptionValue(this.element.nativeElement.value);
            if (!this._compare(currentSelectedValue, value)) {
                var optionId = this.getOptionIdByValue(value);
                this.element.nativeElement.value = _buildValueToString(optionId, value);
            }
        } else {
            var markAsSelected = function (opt) { AttributeAppender.setProp(opt, 'selected', false); };
            if (Array.isArray(value)) {
                var optionIds = value.map(v => (this.getOptionIdByValue(v) || v));
                markAsSelected = function (opt) {
                    AttributeAppender.setProp(opt, 'selected', inarray(opt.value, optionIds));
                };
            }
            this._markAsSelectedMultiple(markAsSelected);
        }
        // assign the value
        this.selectedValue = value;
    }
    isSelected(optionId) {
        return Object.is(this._optionValueMap.get(optionId), this.selectedValue);
    }
    _getValue(valueString) {
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
    _getOptionValue(valueString) {
        var sptStr = valueString.split('|')[0];
        return this._optionValueMap.has(sptStr) ? this._optionValueMap.get(sptStr) : valueString;
    }
    genOptionId() {
        return (this.idIncrement++).toString();
    }
    getOptionIdByValue(value) {
        var keys = this._optionValueMap.keys();
        for (var key of keys) {
            if (this._compare(this._optionValueMap.get(key), value)) return key;
        }

        return null;
    }
    _markAsSelectedMultiple(callback) {
        if (!this.element.nativeElement) return;
        Array.from(this.element.nativeElement.options).forEach(callback);
    }
    destroyOption(optionId) {
        this._optionValueMap.delete(optionId);
        this.writeValue(this.selectedValue);
    }
};


Directive({
    selector: 'option',
    DI: ['ParentRef?:[model|formField|fieldControl]=select', 'HostElement?'],
    props: ['value', 'jValue']
})
export class OptionDirective {
    constructor(selectInstance, elementRef) {
        this.selectInstance = selectInstance;
        if (selectInstance) this.id = selectInstance.genOptionId();
        // getterSetter for value and jValue
        this._value = null;
        var defineConnector = {
            set: value => this.prepareValue(value),
            get: () => this._value
        };

        Object.defineProperty(this, 'value', Object.assign({}, defineConnector));
        Object.defineProperty(this, 'jValue', Object.assign({}, defineConnector));

        this.setValue = function (value) {
            AttributeAppender.setProp(elementRef.nativeElement, 'value', value),
                AttributeAppender.setProp(elementRef.nativeElement, 'selected', this.selectInstance.isSelected(this.id));
        };
    }
    prepareValue(value) {
        if (!this.selectInstance) return;
        this._value = value;
        this.selectInstance._optionValueMap.set(this.id, value);
        this.setValue(_buildValueToString(this.id, value));
    }
    viewDidDestroy() {
        if (this.selectInstance) {
            this.selectInstance.destroyOption(this.id);
        }
    }
}


