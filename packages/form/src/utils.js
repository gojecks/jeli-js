import { isequal, inarray } from 'js.helpers/helpers';

/**
 * 
 * @param {*} fieldControl 
 * @param {*} dir 
 */
function setUpControl(fieldControl, dir) {
    if (!fieldControl) errorBuilder('No field control found for ' + dir._fieldName);
    if (!dir.eventBinder) errorBuilder('No EventBinder defined');

    // set validators
    fieldControl.setValidators(dir._validators);
    dir.eventBinder.writeValue(fieldControl.value);
    setUpViewChangeEvent(fieldControl, dir);
    setupBlurEvent(fieldControl, dir);

    if (dir.eventBinder.setUpDisableState) {
        fieldControl.registerOnDisabledListener(function(state) {
            dir.eventBinder.setUpDisableState(state);
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

/**
 * 
 * @param {*} binders 
 * @param {*} elementRef 
 */
function getEventBinder(binders, elementRef) {
    return (binders.filter(function(config) {
        if (config.selector) {
            return config.selector.some(function(selector) {
                var isTag = isequal(selector.name, elementRef.tagName.toLowerCase())
                return isTag && selector.type && inarray(elementRef.getAttribute(selector.type), selector.value) || isTag;
            });
        }
    })[0] || {}).factory;
}