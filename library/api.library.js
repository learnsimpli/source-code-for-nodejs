const jwt = require('jsonwebtoken');
const userModel = require('../models/user/user.model');
const config = require('../config/global/global.config');
module.exports = {
    responseSuccess: function(success=null,code=null,message=null,data=null) {
        
        let responseObject={
            success:success,
            responseCode:code,
            message:message,
            data:data
        }
        return responseObject;
    },
    responseFailure: function(success=null,errorCode=null,errorMessage=null,errorData=null) {
        
        let responseObject={
            success:success,
            responseCode:errorCode,
            message:errorMessage,
            errors:errorData
        }
        return responseObject;
    },
    validateJwtToken: function(req, res, next)
    {
        const token = req.headers.authorization;

    if (token) {
        const user = parseToken(token);

        userModel.findById(user.userId, function(err, user) {
            if (err) {
                return res.status(422).send({
                    errors: normalizeErrors(err.errors)
                });
            }

            if (user) {
                res.locals.user = user;
                next();
            } else {
                return notAuthorized(res);
            }
        })
    } else {
        return notAuthorized(res);
    }
    }
}

function parseToken(token) {
    return jwt.verify(token.split(' ')[1], config.jwtSecret);
}

function notAuthorized(res) {
    return res.status(401).send({
        errors: [{
            title: 'Not authorized!',
            detail: 'You need to login to get access!',
            redirectUrl:'/login'
        }]
    });
}