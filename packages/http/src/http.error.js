/**
 * 
 * @param {*} message 
 */
export function HttpRequestError(message) {
    this.errorType = null;
    this.message = message;
    this.status = 400;
}

HttpRequestError.prototype.setMessage = function(message) {
    this.message = message;
}

HttpRequestError.prototype.setErrorType = function(type) {
    this.errorType = type;
};