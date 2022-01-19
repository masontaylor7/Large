const csrf = require('csurf');
// const { validationResult } = require('express-validator');

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next)
        .catch(next);

const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
        const errors = validationErrors.array().map((err) => err.msg);
        res.render(view, {
            title,
            user,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
    next();
};

module.exports = {
    csrfProtection,
    asyncHandler
}
