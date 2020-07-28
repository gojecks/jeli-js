import { isequal, inarray } from 'js-helpers/helpers';
import { errorBuilder, ProviderToken } from '@jeli/core';
import { CheckboxEventBinder } from './directives/checkbox.event.accessor';
import { SelectEventBinder } from './directives/select.event.accessor';
import { DefaultEventBinder } from './directives/default.event.accessor';
import { RadioEventBinder } from './directives/radio.event.accessor';
import { NumberEventBinder } from './directives/number.event.accessor';
import { RangeEventBinder } from './directives/range.event.accessor';

/**
 * 
 * @param {*} fieldControl 
 * @param {*} dir 
 */
function setupControl(fieldControl, dir) {
    if (!fieldControl) errorBuilder('No field control found for ' + dir.name);
    if (!dir.eventBinder) errorBuilder('No EventBinder defined');

    // set validators
    fieldControl.setValidators(dir._validators);
    dir.eventBinder.writeValue(fieldControl.value);
    setUpViewChangeEvent(fieldControl, dir);
    setupBlurEvent(fieldControl, dir);

    if (dir.eventBinder.setUpDisableState) {
        fieldControl.registerOnDisabledListener(function(state) {
            dir.eventBinder.setDisabledState(state);
        });
    }
}

/**
 * 
 * @param {*} fieldControl 
 * @param {*} dir 
 */
function setUpViewChangeEvent(fieldControl, dir) {
    dir.eventBinder.registerOnChange(function(value) {
        fieldControl._pendingValue = value;
        fieldControl._pendingChange = true;
        if (!isequal(fieldControl.eventType, 'blur')) {
            updateControl(fieldControl, dir);
        }
    });

    /**
     * setup fieldControl changes
     */
    fieldControl.registerOnChangeListener(function(value, emitEvent) {
        dir.eventBinder.writeValue(value);
        if (emitEvent) {
            dir.modelToViewUpdate(value);
        }
    });
}

/**
 * 
 * @param {*} fieldControl 
 * @param {*} dir 
 */
function setupBlurEvent(fieldControl, dir) {
    if (dir.eventBinder.registerOnBlur) {
        dir.eventBinder.registerOnBlur(function() {
            if (isequal(fieldControl.eventType, 'blur') && fieldControl._pendingChange) {
                updateControl(fieldControl, dir);
            }
        });
    }
}

/**
 * 
 * @param {*} fieldControl 
 * @param {*} dir 
 */
function updateControl(fieldControl, dir) {
    fieldControl.setValue(fieldControl._pendingValue, { emitToView: false });
    dir.modelToViewUpdate(fieldControl._pendingValue);
    fieldControl._pendingChange = false;
}

var inbuiltAccessor = [
    CheckboxEventBinder,
    DefaultEventBinder,
    RadioEventBinder,
    SelectEventBinder,
    NumberEventBinder,
    RangeEventBinder
];

/**
 * 
 * @param {*} valueAccessors 
 */
export function getValueAccessor(valueAccessors) {
    var inbuilt = null,
        custom = null;
    valueAccessors.forEach(function(accessorInstance) {
        if (inbuiltAccessor.includes(accessorInstance.constructor)) {
            if (inbuilt) {
                errorBuilder('found multiple inbuilt valueAccessor instance.');
            }
            inbuilt = accessorInstance;
        } else {
            if (custom) {
                errorBuilder('found multiple custom valueAccessor instance.');
            }
            custom = accessorInstance;
        }
    });

    if (custom) {
        return custom;
    }

    return inbuilt;
}