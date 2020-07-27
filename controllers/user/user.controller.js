const config = require('../../config/global/global.config');
const userService = require(`../../${config.servicePath}/user/user.service`);
const
{
    normalizeErrors
} = require(`../../${config.libraryPath}/mongoose.library`);
const jwt = require('jsonwebtoken');
const
{
    Validator
} = require('node-input-validator');
const apiLibray = require(`../../${config.libraryPath}/api.library`);


exports.register = async function(req, res)
{
    try
    {
        let inputValidator = new Validator(req.body,
        {
            name: 'required|maxLength:150|minLength:3|regex:[A-Za-z0-9]',
            phoneNumber: 'required|phoneNumber|maxLength:13|minLength:10',
            email: 'required|email',
            password: 'required|same:confirmPassword',
            confirmPassword: 'required',
        });

        inputValidator.check().then((matched) =>
        {
            // res.status(200).send(matched);

            if (!matched)
            {
                let inputErrors = inputValidator.errors;
                let clientResponse = apiLibray.responseFailure(false, 422, 'Validation failed...', inputErrors);
                return res.json(
                    clientResponse
                );
            }
        });
        let requestRegistration = userService.register(req.body);
        requestRegistration.then(function(result)
            {

                console.log('Promise resolve has been received...');
                let clientResponse = apiLibray.responseSuccess(true, 200, 'User has been created...');
                return res.json(
                    clientResponse
                );

            },
            function(err)
            {

                console.log('Promise reject has been received...');
                console.log(JSON.stringify(err));
                if (err.responseCode == 201)
                {
                    let clientResponse = apiLibray.responseFailure(false, 422, 'Validation failed...', err.data);
                    return res.json(
                        clientResponse
                    );
                }
                else if (err.responseCode == 202)
                {
                    let clientResponse = apiLibray.responseFailure(false, 422, `User with ${req.body.email} already exist...`);
                    return res.json(
                        clientResponse
                    );
                }
            });

        //   await userService.register(req.body).then(function(data) {
        //       let clientResponse=apiLibray.responseSuccess(true,200,'User has been created...');
        //         return res.json(
        //             clientResponse
        //         );
        //   });
    }
    catch (e)
    {
        console.log(e);
    }


}
exports.login=async function(req,res)
{
    try
    {
        let loginValidator = new Validator(req.body,
        {
            email: 'required|email',
            password: 'required|minLength:3'
        });

        loginValidator.check().then((matched) =>
        {
            // res.status(200).send(matched);

            if (!matched)
            {
                let inputErrors = loginValidator.errors;
                let clientResponse = apiLibray.responseFailure(false, 422, 'Validation failed...', inputErrors);
                return res.json(
                    clientResponse
                );
            }
        });
        let requestLogin = userService.login(req.body);
        requestLogin.then(function(result)
            {

                console.log('Promise resolve has been received...');
                let clientResponse = apiLibray.responseSuccess(true, 200, 'User has been authenticated...',{"token":result.data});
                return res.json(
                    clientResponse
                );

            },
            function(err)
            {

                console.log('Promise reject has been received...');
                console.log(JSON.stringify(err));
                if (err.responseCode == 201)
                {
                    let clientResponse = apiLibray.responseFailure(false, 422, 'Validation failed...', err.data);
                    return res.json(
                        clientResponse
                    );
                }
                else if (err.responseCode == 202)
                {
                    let clientResponse = apiLibray.responseFailure(false, 422, `Wrong email or password combination...`);
                    return res.json(
                        clientResponse
                    );
                }
            });

        //   await userService.register(req.body).then(function(data) {
        //       let clientResponse=apiLibray.responseSuccess(true,200,'User has been created...');
        //         return res.json(
        //             clientResponse
        //         );
        //   });
    }
    catch (e)
    {
        console.log(e);
    }
}
exports.getUser = function(req, res)
{
    const requestedUserId = req.params.id;
    const user = res.locals.user;

    if (requestedUserId === user.id)
    {
        User.findById(requestedUserId, function(err, foundUser)
        {
            if (err)
            {
                return res.status(422).send(
                {
                    errors: normalizeErrors(err.errors)
                });
            }

            return res.json(foundUser);
        })

    }
    else
    {
        User.findById(requestedUserId)
            .select('-revenue -stripeCustomerId -password')
            .exec(function(err, foundUser)
            {
                if (err)
                {
                    return res.status(422).send(
                    {
                        errors: normalizeErrors(err.errors)
                    });
                }

                return res.json(foundUser);
            })
    }
}


exports.authMiddleware = function(req, res, next)
{
    const token = req.headers.authorization;

    if (token)
    {
        const user = parseToken(token);

        User.findById(user.userId, function(err, user)
        {
            if (err)
            {
                return res.status(422).send(
                {
                    errors: normalizeErrors(err.errors)
                });
            }

            if (user)
            {
                res.locals.user = user;
                next();
            }
            else
            {
                return notAuthorized(res);
            }
        })
    }
    else
    {
        return notAuthorized(res);
    }
}

function parseToken(token)
{
    return jwt.verify(token.split(' ')[1], config.jwtSecret);
}

function notAuthorized(res)
{
    return res.status(401).send(
    {
        errors: [
        {
            title: 'Not authorized!',
            detail: 'You need to login to get access!'
        }]
    });
}