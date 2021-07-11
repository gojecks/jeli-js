import { isnumber, isstring, isempty, isobject, isfunction, isundefined, isnull, isboolean, isequal } from 'js-helpers/helpers';

/**
 * Core FormvalidationStack
 */
export var formValidationStack = Object.create({
    MINLENGTH: function(value, requiredLength) {
        if (isnumber(value) || isstring(value))
            return String(value).length >= requiredLength;

        return false;
    },
    MAXLENGTH: function(value, requiredLength) {
        if (isnumber(value) || isstring(value))
            return String(value).length <= requiredLength;

        return false;
    },
    EMAILVALIDATION: function(val) {
        var regExp = /^\w+([\.-]?\w+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return regExp.test(val);
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
        return /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(domain);
    },
    MEDIUMPASSWORDSTRENGTH: function(passwd) {
        return new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})").test(passwd);
    },
    STRONGPASSWORDSTRENGTH: function(passwd) {
        return new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})").test(passwd)
    },
    PATTERN: function(value, pattern) {
        return new RegExp(pattern).test(value);
    },
    /**
     * $ajax validation
     * accepted pattern 
     * 	{
     * 		resolve : <function > | <string>
     * 		onsuccess : <function>
     * 		onerror : <function>
     * 	}
     */
    ASYNC: function(val, def) {
        if (!isobject(def) || !isfunction(def.resolve)) {
            return false;
        }

        return def.resolve(val);
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
    }
});