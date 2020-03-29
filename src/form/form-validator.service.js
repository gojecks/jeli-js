import './form-validator-current-instance';
import './validator.stack';

Service({
    name: 'formValidator',
    static: true
}, FormValidatorService);

/**
 * 
 * @param {*} callback 
 * @param {*} validators 
 */
function FormValidatorService(callback, validators) {
    var currentProcess = new CurrentInstance(trigger, ErrorHandler);
    var validationInstance = null;
    /**
     * 
     * @param {*} key 
     * @param {*} message 
     */
    function ErrorHandler(key, validations) {
        validationInstance.failedValidation[key] = validations;
        validationInstance.validationFailed = true;
    }

    function trigger() {
        callback(validationInstance);
    }

    /**
     * hold the current running process instance
     */
    function setValidationInstance() {
        validationInstance = {
            requiresValidation: false,
            emptyFormFields: false,
            failedValidation: {},
            validationFailed: false
        };
    }

    /**
     * 
     * @param {*} validatorsObj 
     */
    function _throwErrorIfNoValidators(validatorsObj) {
        if (!$isObject(validatorsObj)) {
            throw new Error('Validators are required in other to perform validations');
        }
    }

    /**
     * 
     * @param {*} value 
     * @param {*} criteria 
     * @param {*} field 
     */
    function _validateField(value, criteria, field) {
        //iterate through the criteria
        var _criteria = Object.keys(criteria);
        currentProcess.add(field, _criteria.length);
        for (var i = 0; i < _criteria.length; i++) {
            var validatorName = _criteria[i];
            var passed = false,
                validatorFn = formValidationStack[validatorName];
            if (validatorFn) {
                passed = validatorFn(value, criteria[validatorName]);
            }
            //if is custom function
            else if ($isFunction(criteria[validatorName])) {
                passed = criteria[validatorName](value);
            }

            /**
             * check if passed && passed is a promise
             */
            if ($isObject(passed) && $isEqual('$ajax', validatorName)) {
                return currentProcess.registerAjax(passed, criteria[validatorName], field, validatorName);
            }

            currentProcess.rem(passed, field, validatorName);
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
    function formValidator(formValue, field) {
        if (!validators) {
            return trigger();
        }

        _throwErrorIfNoValidators(validators);
        currentProcess.clean();
        setValidationInstance();
        if ($isObject(formValue)) {
            _validateObjectTypes(formValue);
        } else {
            _validateField(formValue, validators, field);
        }
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

    setValidationInstance();
    return formValidator;
}