/**
 * 
 * @param {*} error 
 * @param {*} logLevel 
 */
export function errorBuilder(error, logLevel) {
    var loggerLevel = void 0 == logLevel ? 0 : logLevel;
    var logLevelMethods = ['error', 'warn', 'info', 'log', 'debug'];

    function userException() {
        this.name = "jEliException";
        this.message = error;
    }

    userException.prototype.toString = function() {
        return this.name + ': "' + this.message + '"';
    };

    if (typeof error == 'string') {
        error = new userException(error);
    }

    console[logLevelMethods[loggerLevel]](error);
}