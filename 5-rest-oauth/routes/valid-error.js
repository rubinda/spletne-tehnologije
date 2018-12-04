class ValidationError extends Error {
    constructor(message, description, code) {
        super(message);
        this.description = description;
        this.status = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}
module.exports = ValidationError;
