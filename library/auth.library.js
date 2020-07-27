const jwt = require('jsonwebtoken'),
config = require('./env.config');
module.exports.isAuthorized  = function(req, res, next) {

    jwt.verify(req.headers['x-access-token'], req.app.get(config.jwtSecret), function(err, decoded) {
        if (err) {
            res.json({
                status: "error",
                message: err.message,
                data: null
            });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}