import './form-validator-current-instance';
import { isobject, isfunction, isequal } from 'js-helpers/helpers';
import { extend } from 'js-helpers/utils';
import { formValidationStack } from './validator.stack';

/**
 * 
 * @param {*} callback 
 * @param {*} validators 
 */
export function FormValidatorService(callback, validators) {
    var currentProcess = new CurrentInstance(callback);
    /**
     * 
     * @param {*} validatorsObj 
     */
    function _throwErrorIfNoValidators(validatorsObj) {
        if (!isobject(validatorsObj)) {
            throw new Error('Validators are required in order to perform validations');
        }
    }

    /**
     * 
     * @param {*} value 
     * @param {*} criteria 
     */
    function _validate(value, criteria) {
        //iterate through the criteria
        var _criteria = Object.keys(criteria);
        currentProcess.add(_criteria.length);
        for (var i = 0; i < _criteria.length; i++) {
            var validatorName = _criteria[i];
            var passed = false;
            var validatorFn = formValidationStack[validatorName.toUpperCase()];
            if (validatorFn) {
                passed = validatorFn(value, criteria[validatorName]);
            }
            //if is custom function
            else if (isfunction(criteria[validatorName])) {
                passed = criteria[validatorName](value);
            }

            /**
             * check if passed && passed is a promise
             */
            if (isequal('async', validatorName)) {
                currentProcess.registerAsyncValidator(passed, validatorName);
            } else {
                currentProcess.rem(passed, validatorName);
                if (!passed) {
                    return currentProcess.stop();
                }
            }
        }
    }

    /**
     * 
     * @param {*} formValues 
     */
    function _validateObjectTypes(formValues) {
        //iterate through the postBody data
        //Make sure it passes validation
        if (!Object.keys(formValues).length) {
            validationInstance.emptyFormFields = true;
            trigger();
        } else {
            //check if validationObj exists in 
            // set the formFields
            var _fieldsToValidate = Object.keys(validators);
            var err = _fieldsToValidate.reduce(function(ret, key) {
                if (!formValues.hasOwnProperty(key)) {
                    ret++;
                    ErrorHandler(key, ['required']);
                }
                return ret;
            }, 0);

            if (!err) {
                currentProcess.pending.count = _fieldsToValidate.length;
                _fieldsToValidate.forEach(function(field) {
                    _validateField(formValues[field], validators[field], field);
                });
            } else {
                trigger();
            }
        }
    }

    /**
     * 
     * @param {*} formValue 
     * @param {*} field 
     */
    function formValidator(formValue) {
        if (!validators) {
            return callback(null);
        }

        _throwErrorIfNoValidators(validators);
        _validate(formValue, validators);
    }

    /**
     * Add validators
     */
    formValidator.addValidators = function(newValidators) {
        _throwErrorIfNoValidators(newValidators);
        if (!validators) {
            validators = newValidators;
        } else {
            validators = extend(true, validators, newValidators);
        }
    };

    return formValidator;
}

/**
 * set a custom validator that can be called with your application
 * @param {*} validatorName 
 * @param {*} validatorFn 
 * @param {*} override 
 * @returns 
 */
export function customFormValidator(validatorName, validatorFn, override) {
    if (formValidationStack.hasOwnProperty(validatorName.toUpperCase()) && !override) {
        return errorBuilder('[' + validatorName + '] already exists, please pass the override parameter to the validator');
    }

    /**
     * register the validator
     */
    formValidationStack[validatorName.toUpperCase()] = validatorFn;
};