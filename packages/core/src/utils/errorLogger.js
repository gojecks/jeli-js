/**
 * 
 * @param {*} error 
 * @param {*} logLevel 
 */
export function errorBuilder(error, logLevel, stack) {
    var loggerLevel = void 0 == logLevel ? 0 : logLevel;
    var logLevelMethods = ['error', 'warn', 'info', 'log', 'debug'];

    function userException() {
        this.name = "jEliException";
        this.message = error;
        this.stack = stack
    }

    userException.prototype.toString = function() {
        return this.name + ': "' + this.message + '"';
    };

    if (typeof error == 'string') {
        error = new userException();
    }

    console[logLevelMethods[loggerLevel]](error);
}