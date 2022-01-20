const csrf = require('csurf');
// const { validationResult } = require('express-validator');

const csrfProtection = csrf({cookie: true});

const asyncHandler = (handler) => (req, res, next) =>
    handler(req, res, next)
        .catch(next);

const getDate = (date) => {
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

module.exports = {
    csrfProtection,
    asyncHandler,
    getDate
}
