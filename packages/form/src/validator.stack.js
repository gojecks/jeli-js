import { isnumber, isstring, isempty, isobject, isfunction, isundefined, isnull, isboolean, isequal } from '@jeli/helpers';

/**
 * Core FormvalidationStack
 */
export var formValidationStack = Object.create({
    MINLENGTH: function(value, requiredLength) {
        if (null !== value && undefined !== value)
            return String(value).length >= requiredLength;

        return true;
    },
    MAXLENGTH: function(value, requiredLength) {
        if (value)
            return String(value).length <= requiredLength;

        return true;
    },
    EMAILVALIDATION: function(value) {
        var regExp = "^(([\\w]+(\\.[\\w]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$";
        return formValidationStack.PATTERN(value, regExp);
    },
    ISEMPTY: function(val, def) {
        return def === isempty(val);
    },
    BOOLEAN: function(value, def) {
        return isboolean(value) && isequal(value, def);
    },
    // ^	The password string will start this way
    // (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
    // (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
    // (?=.*[0-9])	The string must contain at least 1 numeric character
    // (?=.[!@#\$%\^&])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
    // (?=.{8,})	The string must be eight characters or longer
    DOMAINVALIDATION: function(domain) {
        return formValidationStack.PATTERN(domain, "[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+");
    },
    MEDIUMPASSWORDSTRENGTH: function(passwd) {
        return formValidationStack.PATTERN(passwd, "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    },
    STRONGPASSWORDSTRENGTH: function(passwd) {
        return formValidationStack.PATTERN(passwd, "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    },
    /**
     * 
     * @param {*} value 
     * @param {*} pattern 
     * @returns 
     */
    PATTERN: function(value, pattern) {
        return new RegExp(pattern).test(value);
    },
    REQUIRED: function(value, required) {
        if (required) {
            return !isundefined(value) && !isnull(value) && ("" !== value);
        }

        return !required;
    },
    /**
     * validator for strict true value
     */
    REQUIREDTRUE: function(value) {
        return isboolean(value) && value === true;
    },
    /**
     * 
     * @param {*} value 
     * @param {*} minNumber 
     * @returns 
     */
    MINNUMBER: function(value, minNumber) {
        if (null !== value && undefined !== value) {
            value = Number(value);
            return !isNaN(value) && minNumber <= value;
        }

        return true;
    },

    /**
     * 
     * @param {*} value 
     * @param {*} maxNumber 
     * @returns 
     */
    MAXNUMBER: function(value, maxNumber) {
        if (value) {
            value = Number(value);
            return !isNaN(value) && value <= maxNumber;
        }
        return true;
    }
});