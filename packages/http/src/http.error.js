export class HttpRequestError {
    constructor(message) {
        this.errorType = null;
        this.message = message;
        this.status = 400;
    }

    setMessage(message) {
        this.message = message;
    }

    setErrorType(type) {
        this.errorType = type;
    }
}
