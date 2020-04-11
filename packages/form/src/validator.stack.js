import { isnumber, isstring, isempty, isobject, isfunction, isundefined, isnull } from 'js.helpers/helpers';

/**
 * Core FormvalidationStack
 */
var formValidationStack = Object.create({
    minlength: function(value, requiredLength) {
        if (!isnumber(value) && !isstring(value)) {
            return false;
        }

        return String(value).length >= requiredLength;
    },
    maxlength: function(value, requiredLength) {
        if (!isnumber(value) && !isstring(value)) {
            return false;
        }

        return String(value).length <= requiredLength;
    },
    emailvalidation: function(val) {
        var regExp = /^\w+([\.-]?\w+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return regExp.test(val);
    },
    isempty: function(val, def) {
        return def === isempty(val);
    },
    boolean: function(bool, val) {
        return bool === val;
    },
    // ^	The password string will start this way
    // (?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
    // (?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
    // (?=.*[0-9])	The string must contain at least 1 numeric character
    // (?=.[!@#\$%\^&])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
    // (?=.{8,})	The string must be eight characters or longer
    domainvalidation: function(domain) {
        return /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test(domain);
    },
    mediumpasswordstrength: function(passwd) {
        return new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})").test(passwd);
    },
    strongpasswordstrength: function(passwd) {
        return new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})").test(passwd)
    },
    pattern: function(value, pattern) {
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
    $ajax: function(val, def) {
        if (!isobject(def) || !isfunction(def.resolve)) {
            return false;
        }

        return def.resolve(val);
    },
    required: function(value, required) {
        if (required) {
            return !isundefined(value) && !isnull(value) && !isempty(value);
        }

        return !required;
    }
});