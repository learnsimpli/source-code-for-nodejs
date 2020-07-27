const userModel = require('../../models/user/user.model');
const config = require('../../config/global/global.config');
const
    {
        normalizeErrors
    } = require(`../../library/mongoose.library`);

const jwt = require('jsonwebtoken');

exports.register = async function (userData) {
    return new Promise(function (resolve, reject) {
        let name = userData.name;
        let phoneNumber = userData.phoneNumber;
        let email = userData.email;
        let password = userData.password;

        userModel.findOne(
            {
                email
            }, function (err, existingUser) {
            console.log('' + JSON.stringify(err));
            console.log(JSON.stringify(existingUser));
            if (err) {

                let errors = normalizeErrors(err.errors);
                let response = {
                    responseCode: 201,
                    success: false,
                    data: errors
                };
                // console.log(response);
                reject(response);
            }

            if (existingUser) {
                let response = {
                    responseCode: 202,
                    success: false,
                    data: 'User already exists...'
                };
                // console.log(response);
                reject(response);
            }

            const user = new userModel(
                {
                    name,
                    phoneNumber,
                    email,
                    password
                });

            user.save(function (err) {
                console.log("Trying to create...");
                if (err) {
                    let errors = normalizeErrors(err.errors);
                    let response = {
                        responseCode: 201,
                        success: false,
                        data: errors
                    };
                    // console.log(response);
                    reject(response);
                }
                else {
                    let response = {
                        responseCode: 200,
                        success: true,
                        data: "User has been created"
                    };
                    // console.log(response);
                    resolve(response);
                }

            })
        })
    });
};

exports.login = async function (userData) {
    return new Promise(function (resolve, reject) {
        let email = userData.email;
        let password = userData.password;
        if (!email && !password) {
            let response = {
                responseCode: 201,
                success: false,
                data: "Email and Password is required..."
            };
            // console.log(response);
            reject(response);
        }
        userModel.findOne(
            {
                email
            }, function (err, user) {
            if (err) {
                let errors = normalizeErrors(err.errors);
                let response = {
                    responseCode: 201,
                    success: false,
                    data: errors
                };
                // console.log(response);
                reject(response);

            }

            if (!user) {

                let response = {
                    responseCode: 202,
                    success: false,
                    data: "User does not exist..."
                };
                // console.log(response);
                reject(response);
            }
            if (user != null) {
                if (user.hasSamePassword(password)) {
                    const token = jwt.sign(
                        {
                            userId: user.id,
                            name: user.name
                        }, config.jwtSecret,
                        {
                            expiresIn: '1h'
                        });

                    let response = {
                        responseCode: 200,
                        success: true,
                        data: token
                    };
                    // console.log(response);
                    resolve(response);
                }
                else {
                    let response = {
                        responseCode: 201,
                        success: false,
                        data: "Wrong email or password..."
                    };
                    // console.log(response);
                    reject(response);
                }
            }



        });
    });
};