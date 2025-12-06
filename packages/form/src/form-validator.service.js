import './form-validator-current-instance';
import { isobject, isfunction, isequal } from '@jeli/helpers';
import { extend } from '@jeli/helpers/utils';
import { FormValidationStack } from './validator.stack';

class ValidatorHelper {
    /**
     * 
     * @param {*} validatorPaths 
     * @param {*} vRecords 
     * @param {*} currentProcess 
     * @returns 
     */
    static flattenValdators(validatorPaths, vRecords, currentProcess){
        const flatten = (field, record, paths) => {
            if (isobject(record)){
                paths.push(field);
                const _reqStacks = Object.keys(record);
                if(!FormValidationStack[_reqStacks[0].toUpperCase()] && !isfunction(record[_reqStacks[0]])){
                    _reqStacks.forEach(field => flatten(field, record[field], paths.slice()))
                } else {
                    validatorPaths.push([paths, record]);
                }
            }
        };

        if (vRecords) {
            const keys = Object.keys(vRecords);
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
    static throwErrorIfNoValidators(validatorsObj) {
        if (!isobject(validatorsObj)) {
            throw new Error('Validators are required in order to perform validations');
        }
    }
}
/**
 * 
 * @param {*} callback 
 * @param {*} validators 
 * @returns 
 */
export function FormValidatorService(callback, validators, isDeep) {
    const currentProcess = new CurrentInstance(callback, isDeep);
    const validatorPaths =  [];

    /**
     * 
     * @param {*} value 
     */
    function _formFieldValidator(value, criteria, fieldName) {
        //iterate through the criteria
        const criteriaKeys = Object.keys(criteria);
        currentProcess.add(criteriaKeys.length);
        for (var i = 0; i < criteriaKeys.length; i++) {
            const validatorName = criteriaKeys[i];
            let passed = false;
            const validatorFn = FormValidationStack[validatorName.toUpperCase()];
            const isAsync = isequal('async', validatorName);
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
    * @param {*} formValue 
    * @param {*} deep set to true to run formControl validations
    * @returns 
    */
    function formValidator(formValue) {
        if (!validators) return callback(null);

        ValidatorHelper.throwErrorIfNoValidators(validators);
        if (!currentProcess.isDeep)
            _formFieldValidator(formValue, validators);
        else {
            for(const path of validatorPaths){
                if(_formFieldValidator(getValueByPath(formValue, path[0]), path[1], path[0].join('.'))){
                    break
                }
            }
        }
    }

    /**
     * 
     * @param {*} newValidators 
     * @param {*} isDeep 
     */
    formValidator.addValidators = (newValidators) => {
        ValidatorHelper.throwErrorIfNoValidators(newValidators);
        if (!validators) {
            validators = newValidators;
        } else {
            validators = extend(true, validators, newValidators);
        }

        ValidatorHelper.flattenValdators(validatorPaths, newValidators, currentProcess);
    };

    ValidatorHelper.flattenValdators(validatorPaths, validators, currentProcess);

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