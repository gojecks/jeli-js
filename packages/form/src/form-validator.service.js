import './form-validator-current-instance';
import { isobject, isfunction, isequal } from '@jeli/helpers';
import { extend } from '@jeli/helpers/utils';
import { FormValidationStack } from './validator.stack';

/**
 * 
 * @param {*} callback 
 * @param {*} validators 
 * @returns 
 */
export function FormValidatorService(callback, validators, isDeep) {
    var currentProcess = new CurrentInstance(callback, isDeep);
    var validatorPaths =  [];

    function flatten (field, record, paths) {
        if (isobject(record)){
            paths.push(field);
            var _reqStacks = Object.keys(record);
            if(!FormValidationStack[_reqStacks[0].toUpperCase()] && !isfunction(record[_reqStacks[0]])){
                _reqStacks.forEach(field => flatten(field, record[field], paths.slice()))
            } else {
                validatorPaths.push([paths, record]);
            }
        }
    }

    /**
     * 
     * @param {*} vRecords 
     * @returns 
     */
    function flattenValdators(vRecords){
        if (vRecords) {
            var keys = Object.keys(vRecords);
            if (keys.length) {
                if (!!FormValidationStack[keys[0].toUpperCase()] || isfunction(vRecords[keys[0]])) return;
                keys.forEach(field => flatten(field, vRecords[field], []));
                currentProcess.isDeep = true;
            }
        }
    }

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
     */
    function _formFieldValidator(value, criteria, fieldName) {
        //iterate through the criteria
        var criteriaKeys = Object.keys(criteria);
        currentProcess.add(criteriaKeys.length);
        for (var i = 0; i < criteriaKeys.length; i++) {
            var validatorName = criteriaKeys[i];
            var passed = false;
            var validatorFn = FormValidationStack[validatorName.toUpperCase()];
            var isAsync = isequal('async', validatorName);
            if (validatorFn) {
                passed = validatorFn(value, criteria[validatorName]);
            }
            //if is custom function
            else if (isfunction(criteria[validatorName])) {
                try {
                    passed = criteria[validatorName](value);
                } catch (e) {
                    passed = isAsync ? Promise.resolve(false) : false;
                }
            }

            /**
             * check if passed && passed is a promise
             */
            if (isAsync) {
                currentProcess.registerAsyncValidator(passed, validatorName, fieldName);
            } else {
                currentProcess.rec(passed, validatorName, fieldName);
                if (!passed) {
                    currentProcess.stop();
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 
     * @param {*} formValues 
     */
    function _formControlValidator(formValues) {
        for(var path of validatorPaths){
            if(_formFieldValidator(getValueByPath(formValues, path[0]), path[1], path[0].join('.'))){
                break
            }
        }
    }

   /**
    * 
    * @param {*} formValue 
    * @param {*} deep set to true to run formControl validations
    * @returns 
    */
    function formValidator(formValue) {
        if (!validators) {
            return callback(null);
        }

        _throwErrorIfNoValidators(validators);
        if (!currentProcess.isDeep)
            _formFieldValidator(formValue, validators);
        else 
            _formControlValidator(formValue);
    }

    /**
     * 
     * @param {*} newValidators 
     * @param {*} isDeep 
     */
    formValidator.addValidators = function(newValidators) {
        _throwErrorIfNoValidators(newValidators);
        if (!validators) {
            validators = newValidators;
        } else {
            validators = extend(true, validators, newValidators);
        }

        flattenValdators(newValidators);
    };

    flattenValdators(validators);

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
    if (FormValidationStack.hasOwnProperty(validatorName.toUpperCase()) && !override) {
        return errorBuilder('[' + validatorName + '] already exists, please pass the override parameter to the validator');
    }

    /**
     * register the validator
     */
    FormValidationStack[validatorName.toUpperCase()] = validatorFn;
};