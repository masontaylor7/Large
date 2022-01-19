const db = require('./db/models');

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    };
};

const logoutUser = (req, res) => {
    delete req.session.auth;
};

const requireAuth = (req, res, next) => {
    console.log('This is locals.authenticated', res.locals.verified)
    if(!res.locals.verified) {
        return res.redirect('/login');
    }
    return next();
};

const restoreUser = async (req, res, next) => {
    console.log(req.session);

    if(req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await db.User.findByPk(userId);

            if(user) {
                res.locals.verified = true;
                res.locals.user = user;
                next();
            }
        } catch(e){
            res.locals.verified = false;
            next(e);
        }
    } else {
        res.locals.verified = false;
        next();
    }
};

module.exports = {
    loginUser,
    logoutUser,
    requireAuth,
    restoreUser,
};
