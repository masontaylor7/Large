const csrf = require('csurf');
const { validationResult } = require('express-validator');

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next)
        .catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((err) => err.msg);

        const error = Error("Invalid input.");
        error.errors = errors;
        error.status = 400;
        error.title = "Invalid input.";
        return next(error);
    }
    next();
};

module.exports = {
    handleValidationErrors,
    csrfProtection,
    asyncHandler
}
